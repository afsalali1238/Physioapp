/**
 * Route Crawler Fixtures — S0 Verification
 *
 * Proves each defect class the crawler must catch, using temporary
 * filesystem fixtures created per-test and cleaned up afterward.
 *
 * Does not weaken compliance, publication, or safety checks.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { auditDist, type AreaRow, type ItemRow } from '../scripts/crawl-routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared fixtures
const PUBLISHED_AREAS: readonly AreaRow[] = [
  { area_id: 'neck', section: 'exercise', status: 'published', name_en: 'Neck' },
  { area_id: 'neck', section: 'stretching', status: 'published', name_en: 'Neck Stretches' },
];

const PUBLISHED_ITEMS: readonly ItemRow[] = [
  { id: 'ex-neck-01', area_id: 'neck', section: 'exercise', status: 'published', name_en: 'Neck Exercise 1' },
];

const LEGAL_SLUGS = ['disclaimer', 'privacy', 'credits'] as const;

/**
 * Helper: create a minimal valid dist directory with all expected routes
 * so that tests can selectively omit specific routes to trigger errors.
 */
function createMinimalDist(distDir: string, areas: readonly AreaRow[], items: readonly ItemRow[], legalSlugs: readonly string[]) {
  // Static routes
  const staticRoutes = [
    '', // index
    'find-my-area',
    'clinic',
    'stretching',
    'exercise',
    'preview',
    'find-my-pain',
  ];

  for (const r of staticRoutes) {
    const dir = r ? path.join(distDir, r) : distDir;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>${r || 'Home'}</h1></body></html>`,
    );
  }

  // Legal routes
  for (const slug of legalSlugs) {
    const dir = path.join(distDir, 'legal', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>${slug}</h1></body></html>`,
    );
  }

  // Published area routes (only populated ones — those with published items)
  const populatedKeys = new Set(items.filter(i => i.status === 'published').map(i => `${i.section}/${i.area_id}`));
  for (const area of areas.filter(a => a.status === 'published')) {
    const key = `${area.section}/${area.area_id}`;
    if (populatedKeys.has(key)) {
      const dir = path.join(distDir, area.section, area.area_id);
      fs.mkdirSync(dir, { recursive: true });

      // Include anchors for all published items in this area
      const areaItems = items.filter(i => i.area_id === area.area_id && i.section === area.section && i.status === 'published');
      const anchors = areaItems.map(i => `<div id="${i.id}">${i.name_en}</div>`).join('\n');

      fs.writeFileSync(
        path.join(dir, 'index.html'),
        `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${anchors}</body></html>`,
      );

      // Body area landing
      const areaDir = path.join(distDir, 'area', area.area_id);
      fs.mkdirSync(areaDir, { recursive: true });
      fs.writeFileSync(
        path.join(areaDir, 'index.html'),
        `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>${area.name_en}</h1></body></html>`,
      );
    }
  }

  // Preview routes (one per area, all with noindex)
  for (const area of areas) {
    const dir = path.join(distDir, 'preview', area.section, area.area_id);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'index.html'),
      `<!DOCTYPE html><html><head><meta name="robots" content="noindex, nofollow"><meta charset="utf-8"></head><body>Preview ${area.name_en}</body></html>`,
    );
  }
}

describe('Route Crawler Fixtures — S0 Verification', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = path.join(__dirname, 'fixtures', `_tmp-routes-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  // ── Fixture 1: dist/client/ is selected for Vercel build ──────────────

  it('selects dist/client/ for Vercel adapter builds', () => {
    // Simulate Vercel adapter output: HTML lives in dist/client/, not dist/
    const vercelClientDir = path.join(tempDir, 'dist', 'client');
    createMinimalDist(vercelClientDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Also create the parent dist/ with no HTML (just the client/ subdir)
    // This mimics real Vercel output where dist/ exists but routes are in dist/client/

    // auditDist should work correctly when pointed at dist/client/
    const result = auditDist(vercelClientDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Should find routes — not zero
    assert.ok(result.routesCrawled > 0, `Expected crawled routes > 0, got ${result.routesCrawled}`);

    // The vanilla dist/ (parent) should NOT work — it has no index.html directly
    const parentDistDir = path.join(tempDir, 'dist');
    const parentResult = auditDist(parentDistDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // The parent dir exists but doesn't have the expected route structure at root
    // (all HTML is under client/), so it should report missing routes
    assert.ok(
      parentResult.errors.some(e => e.includes('Missing expected rendered route')),
      'Auditing dist/ instead of dist/client/ must report missing routes when Vercel adapter is used',
    );
  });

  // ── Fixture 2: missing output fails ───────────────────────────────────

  it('fails with error when build output directory does not exist', () => {
    const nonexistentDir = path.join(tempDir, 'does-not-exist');

    const result = auditDist(nonexistentDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    assert.ok(result.errors.length > 0, 'Missing build directory must produce errors, not warnings');
    assert.equal(result.warnings.length, 0, 'Missing build directory must not produce warnings');
    assert.ok(
      result.errors.some(e => e.includes('Build output directory not found')),
      'Error message must indicate missing build output',
    );
    assert.equal(result.routesCrawled, 0);
    assert.equal(result.anchorsVerified, 0);
  });

  // ── Fixture 3: missing routes fail ────────────────────────────────────

  it('fails when expected routes are missing from build output', () => {
    const distDir = path.join(tempDir, 'dist');
    // Create only the root index — everything else is missing
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(
      path.join(distDir, 'index.html'),
      '<!DOCTYPE html><html><body>Home</body></html>',
    );

    const result = auditDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    assert.ok(result.errors.length > 0, 'Missing routes must produce errors');
    assert.ok(
      result.errors.some(e => e.includes('Missing expected rendered route')),
      'Must report specific missing route errors',
    );

    // Should specifically flag the missing section index, legal, and area routes
    assert.ok(
      result.errors.some(e => e.includes('/exercise/') && e.includes('Missing')),
      'Must flag missing /exercise/ section index',
    );
    assert.ok(
      result.errors.some(e => e.includes('/legal/disclaimer/') && e.includes('Missing')),
      'Must flag missing legal route',
    );
  });

  // ── Fixture 4: missing anchors fail ───────────────────────────────────

  it('fails when published item anchors are missing from area pages', () => {
    const distDir = path.join(tempDir, 'dist');
    createMinimalDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Overwrite the exercise/neck page to remove the anchor
    const areaPagePath = path.join(distDir, 'exercise', 'neck', 'index.html');
    fs.writeFileSync(
      areaPagePath,
      '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><h1>Neck Exercises</h1><p>No anchors here</p></body></html>',
    );

    const result = auditDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    assert.ok(
      result.errors.some(e => e.includes('missing required anchor') && e.includes('ex-neck-01')),
      'Must detect missing published item anchor id="ex-neck-01"',
    );
  });

  // ── Fixture 5: preview links and noindex violations fail ──────────────

  it('fails when preview pages lack noindex or patient pages link to preview', () => {
    const distDir = path.join(tempDir, 'dist');
    createMinimalDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Overwrite preview page to remove noindex
    const previewPath = path.join(distDir, 'preview', 'exercise', 'neck', 'index.html');
    fs.writeFileSync(
      previewPath,
      '<!DOCTYPE html><html><head><title>Preview</title></head><body>Draft preview without noindex</body></html>',
    );

    // Overwrite a patient page to include a link to preview
    const patientPath = path.join(distDir, 'exercise', 'neck', 'index.html');
    fs.writeFileSync(
      patientPath,
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="ex-neck-01">Item</div><a href="/preview/exercise/neck/">See draft</a></body></html>`,
    );

    const result = auditDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Preview missing noindex
    assert.ok(
      result.errors.some(e => e.includes('Preview route') && e.includes('missing required <meta name="robots"')),
      'Must detect preview route without noindex meta tag',
    );

    // Patient page leaking preview link
    assert.ok(
      result.errors.some(e => e.includes('contains a link to preview route')),
      'Must detect patient page linking to preview route',
    );
  });

  // ── Fixture 6: plural /exercises/ routes fail ─────────────────────────

  it('fails when plural /exercises/ routes or links exist', () => {
    const distDir = path.join(tempDir, 'dist');
    createMinimalDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Create a plural /exercises/neck/ route (Decision A-015 violation)
    const pluralDir = path.join(distDir, 'exercises', 'neck');
    fs.mkdirSync(pluralDir, { recursive: true });
    fs.writeFileSync(
      path.join(pluralDir, 'index.html'),
      '<!DOCTYPE html><html><body>Plural route</body></html>',
    );

    // Also add a plural link inside a patient page
    const patientPath = path.join(distDir, 'exercise', 'neck', 'index.html');
    fs.writeFileSync(
      patientPath,
      `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div id="ex-neck-01">Item</div><a href="/exercises/neck/">Wrong plural</a></body></html>`,
    );

    const result = auditDist(distDir, PUBLISHED_AREAS, PUBLISHED_ITEMS, [...LEGAL_SLUGS]);

    // Plural route
    assert.ok(
      result.errors.some(e => e.includes('uses plural /exercises/')),
      'Must detect plural /exercises/ generated route',
    );

    // Plural link
    assert.ok(
      result.errors.some(e => e.includes('contains plural link') && e.includes('/exercises/neck/')),
      'Must detect plural /exercises/ link in page content',
    );
  });
});
