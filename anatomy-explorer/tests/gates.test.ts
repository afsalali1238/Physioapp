import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  COMPLIANCE_RULES,
  NON_PROSE_FIELDS,
  scanRecord,
  scanText,
} from '../src/lib/compliance';
import { validateItems, validateAreas } from '../src/lib/validate';
import { auditAssets } from '../scripts/check-assets';
import { auditDist } from '../scripts/crawl-routes';
import { BAD_ASSETS_FIXTURE } from './fixtures/bad-assets';
import { auditMediaLedger, MEDIA_LEDGER } from '../src/lib/anatomy/media-ledger';
import { BODY_REGION_VISUALS } from '../src/lib/anatomy/model-registry';
import { validateModelRegionVisuals } from '../src/lib/anatomy/model-registry-validation';
import { CAMERA_PRESETS } from '../src/lib/anatomy/model-registry';
import { getApprovedMotion, MOTION_ASSETS } from '../src/lib/motion/motion-registry';
import { validateMotionAssets } from '../src/lib/motion/motion-validation';
import { NECK_MOTION_FRAME, validateMotionFrame } from '../src/lib/motion/motion-framing';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Module S0 — Executable Gates & Release Evidence', () => {
  describe('1. Compliance Gate (Banned terms, conditions, superlatives, CTAs)', () => {
    it('catches banned diagnosis names, superlatives, and booking CTAs in published items', () => {
      const fixturePath = path.join(__dirname, 'fixtures', 'bad-compliance.json');
      const items = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

      const violations = items.flatMap((item: Record<string, unknown>) =>
        scanRecord(item, NON_PROSE_FIELDS, COMPLIANCE_RULES),
      );

      const matchedRules = violations.map((v) => v.ruleId);
      const matchedTerms = violations.map((v) => v.match);

      // Superlative check
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase() === 'best'),
        'Must catch superlative "best"',
      );

      // Booking CTA check
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase().includes('book')),
        'Must catch booking CTA "book an appointment"',
      );

      // Condition name checks (sciatica, spondylosis, arthritis)
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase().includes('sciatica')),
        'Must catch condition name "sciatica"',
      );
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase().includes('spondylosis')),
        'Must catch condition name "cervical spondylosis"',
      );
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase().includes('arthritis')),
        'Must catch condition name "arthritis"',
      );

      // Outcome claim check (cure, guaranteed)
      assert.ok(
        matchedTerms.some((t) => t.toLowerCase().includes('cure') || t.toLowerCase().includes('guaranteed')),
        'Must catch outcome claim "cure" / "guaranteed"',
      );
    });

    it('scans prose strings and catches condition words in safety and education rules', () => {
      const badSafetyText = 'Stop if your sciatica flares up or you feel acute herniated disc pain.';
      const violations = scanText(badSafetyText, 'safety_en', COMPLIANCE_RULES);

      assert.ok(violations.length >= 2, 'Must catch condition names in safety prose');
      assert.ok(violations.some((v) => v.match.toLowerCase() === 'sciatica'));
      assert.ok(violations.some((v) => v.match.toLowerCase().includes('herniated disc')));
    });
  });

  describe('2. Cross-Row & Governance Validation Gate (validate.ts)', () => {
    it('catches thin alt-text (< 45 chars), image-area mismatch, unreviewed items, and duplicate IDs', () => {
      const itemsPath = path.join(__dirname, 'fixtures', 'bad-items.json');
      const areasPath = path.join(__dirname, 'fixtures', 'bad-areas.json');
      const items = JSON.parse(fs.readFileSync(itemsPath, 'utf8'));
      const areas = JSON.parse(fs.readFileSync(areasPath, 'utf8'));

      const findings = validateItems(items, areas);
      const ruleNames = findings.map((f) => f.rule);

      // 1. Thin alt text
      assert.ok(ruleNames.includes('alt-text-too-thin'), 'Must catch alt text < 45 characters');
      const thinFinding = findings.find((f) => f.rule === 'alt-text-too-thin');
      assert.equal(thinFinding?.level, 'error');

      // 2. Image / area mismatch
      assert.ok(ruleNames.includes('image-area-mismatch'), 'Must catch image_id belonging to wrong area');
      const mismatchFinding = findings.find((f) => f.rule === 'image-area-mismatch');
      assert.equal(mismatchFinding?.level, 'error');

      // 3. Unreviewed & undated published items
      assert.ok(ruleNames.includes('unreviewed-published-item'), 'Must catch published item with no reviewed_by');
      assert.ok(ruleNames.includes('undated-published-item'), 'Must catch published item with no reviewed_date');
      assert.ok(ruleNames.includes('invalid-review-date'), 'Must catch invalid review date format');

      // 4. Duplicate item ID
      assert.ok(ruleNames.includes('duplicate-id'), 'Must catch duplicate item IDs');
      const duplicateFinding = findings.find((f) => f.rule === 'duplicate-id');
      assert.equal(duplicateFinding?.level, 'error');
    });

    it('catches duplicate area composite keys and area over-capacity (> 8 published items)', () => {
      const areasPath = path.join(__dirname, 'fixtures', 'bad-areas.json');
      const areas = JSON.parse(fs.readFileSync(areasPath, 'utf8'));

      const areaFindings = validateAreas(areas);
      assert.ok(
        areaFindings.some((f) => f.rule === 'duplicate-area' && f.level === 'error'),
        'Must catch duplicate area composite keys',
      );

      // Test 9 published items in one area (capacity limit is 8)
      const overcapacityItems = Array.from({ length: 9 }, (_, i) => ({
        id: `ex-overcapacity-0${i + 1}`,
        section: 'exercise',
        area_id: 'overcapacity',
        order: i + 1,
        status: 'published',
        name_en: `Exercise ${i + 1}`,
        type: 'mobility',
        start_position_en: 'Sit upright.',
        movement_en: 'Move arm.',
        return_en: 'Return to start.',
        safety_en: 'Stop if painful.',
        target_muscles_en: 'Muscles',
        reps: 10,
        image_id: `ex-overcapacity-0${i + 1}`,
        image_alt_en: 'A person demonstrating the exercise seated on a stable chair.',
        reviewed_by: 'Physiotherapist',
        reviewed_date: '2026-08-26',
      }));

      const itemFindings = validateItems(overcapacityItems, areas);
      assert.ok(
        itemFindings.some((f) => f.rule === 'area-over-capacity' && f.level === 'error'),
        'Must fail when an area has > 8 published items',
      );
    });
  });

  describe('3. Visual Asset Registry & Media Gate (check-assets.ts)', () => {
    it('keeps prototype motion out of patient publication lookup', () => {
      assert.deepEqual(validateMotionAssets(MOTION_ASSETS), []);
      assert.deepEqual(validateMotionFrame(NECK_MOTION_FRAME), []);
      assert.equal(getApprovedMotion('ex-neck-02'), undefined);
      assert.ok(MOTION_ASSETS.every((asset) => asset.status === 'prototype' && asset.replacementRequired));
    });

    it('verifies the prototype ledger files, hashes, and replacement boundary', () => {
      assert.deepEqual(auditMediaLedger(MEDIA_LEDGER, process.cwd()), []);
      assert.ok(MEDIA_LEDGER.every((asset) => asset.status === 'prototype' && asset.replacementRequired));
      assert.ok(MEDIA_LEDGER.every((asset) => asset.reviewedBy === '' && asset.reviewedDate === ''));
    });
    it('catches unreviewed approved assets, duplicate asset IDs, and missing metadata', () => {
      const mockItems = [
        {
          id: 'ex-neck-01',
          status: 'published',
          image_id: 'ex-neck-01',
        },
      ];

      const result = auditAssets(BAD_ASSETS_FIXTURE, mockItems, process.cwd());

      assert.ok(result.errors.length > 0, 'Must produce errors on bad asset fixture');

      // Unreviewed approved asset
      assert.ok(
        result.errors.some((e) => e.includes('bad-approved-unreviewed') && e.includes('lacks genuine review metadata')),
        'Must reject approved asset without reviewed_by / reviewed_date',
      );

      // Duplicate asset ID
      assert.ok(
        result.errors.some((e) => e.includes('Duplicate asset_id "bad-duplicate-id"')),
        'Must reject duplicate asset IDs',
      );

      // Missing metadata
      assert.ok(
        result.errors.some((e) => e.includes('bad-missing-metadata') && e.includes('missing required licensing')),
        'Must reject asset with missing license or attribution',
      );
    });
  });

  describe('4. Post-Build Route Crawler Gate (crawl-routes.ts)', () => {
    it('catches missing routes, un-isolated preview pages, missing anchors, and plural route traps', () => {
      const tempDist = path.join(__dirname, 'fixtures', 'mock-dist');
      fs.mkdirSync(tempDist, { recursive: true });
      fs.mkdirSync(path.join(tempDist, 'exercise', 'neck'), { recursive: true });
      fs.mkdirSync(path.join(tempDist, 'exercises', 'neck'), { recursive: true });
      fs.mkdirSync(path.join(tempDist, 'preview', 'exercise', 'neck'), { recursive: true });

      try {
        // Patient area page missing published item anchor and containing plural link
        fs.writeFileSync(
          path.join(tempDist, 'exercise', 'neck', 'index.html'),
          `<!DOCTYPE html><html><body><h1>Neck Exercises</h1><a href="/exercises/neck/">Plural link</a><a href="/preview/exercise/neck/">Leaked preview link</a></body></html>`,
        );

        // Preview page missing noindex meta
        fs.writeFileSync(
          path.join(tempDist, 'preview', 'exercise', 'neck', 'index.html'),
          `<!DOCTYPE html><html><head><title>Preview Neck</title></head><body>Preview without noindex</body></html>`,
        );

        // Plural route file
        fs.writeFileSync(
          path.join(tempDist, 'exercises', 'neck', 'index.html'),
          `<!DOCTYPE html><html><body>Plural route</body></html>`,
        );

        const mockAreas = [
          { area_id: 'neck', section: 'exercise' as const, status: 'published' as const, name_en: 'Neck' },
        ];
        const mockItems = [
          {
            id: 'ex-neck-01',
            area_id: 'neck',
            section: 'exercise' as const,
            status: 'published' as const,
            name_en: 'Neck Exercise',
          },
        ];

        const result = auditDist(tempDist, mockAreas, mockItems, ['disclaimer']);

        assert.ok(result.errors.length > 0, 'Must report crawl errors');

        // Missing published item anchor
        assert.ok(
          result.errors.some((e) => e.includes('missing required anchor for published item id="ex-neck-01"')),
          'Must detect missing item anchor on area page',
        );

        // Preview route missing noindex
        assert.ok(
          result.errors.some((e) => e.includes('Preview route') && e.includes('missing required <meta name="robots"')),
          'Must detect preview route without noindex meta tag',
        );

        // Patient route linking to preview
        assert.ok(
          result.errors.some((e) => e.includes('contains a link to preview route')),
          'Must detect patient route leaking links to preview',
        );

        // Plural /exercises/ route
        assert.ok(
          result.errors.some((e) => e.includes('uses plural /exercises/')),
          'Must detect plural /exercises/ route',
        );

        // Plural /exercises/ link
        assert.ok(
          result.errors.some((e) => e.includes('contains plural link "/exercises/neck/"')),
          'Must detect plural /exercises/ link',
        );
      } finally {
        fs.rmSync(tempDist, { recursive: true, force: true });
      }
    });
  });

  describe('5. Anatomy & Education Validation Gate (check-anatomy.ts)', () => {
    it('keeps the prototype GLB mapping on stable region IDs', () => {
      const errors = validateModelRegionVisuals(
        BODY_REGION_VISUALS,
        ['region-neck', 'region-shoulder-l', 'region-shoulder-r'],
        ['neck', 'shoulder-l', 'shoulder-r'],
      );
      assert.deepEqual(errors, []);
      assert.ok(BODY_REGION_VISUALS.every((visual) => !visual.regionId.includes('mesh')));
      assert.ok(CAMERA_PRESETS.neck.position[2] >= 4, 'Neck focus must leave enough distance to frame the head and shoulders.');
      assert.ok(CAMERA_PRESETS['shoulder-left'].position[2] >= 4, 'Shoulder focus must preserve body context.');
    });

    it('validates education entries and catches compliance violations in map labels', () => {
      const badRegion = {
        id: 'bad-region',
        areaId: 'nonexistent-area',
        label: 'Best Sciatica Relief Zone',
        zones: ['Cervical spondylosis zone', 'Normal zone'],
      };

      const labelViolations = scanText(badRegion.label, 'region.label', COMPLIANCE_RULES);
      assert.ok(
        labelViolations.some((v) => v.match.toLowerCase() === 'best'),
        'Must catch superlative in region label',
      );
      assert.ok(
        labelViolations.some((v) => v.match.toLowerCase() === 'sciatica'),
        'Must catch condition name in region label',
      );

      const zoneViolations = scanText(badRegion.zones[0], 'region.zones[0]', COMPLIANCE_RULES);
      assert.ok(
        zoneViolations.some((v) => v.match.toLowerCase().includes('spondylosis')),
        'Must catch condition name in zone copy',
      );
    });
  });
});
