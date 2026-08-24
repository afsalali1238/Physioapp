/**
 * Build-time compliance gate — MODULES.md M12.
 *
 * "A build-time check that fails if any published item's text matches a banned-
 * term list" — and it must be *build*-time, not sync-time. A sync-time check
 * alone can be bypassed three ways: a hand-edited JSON file, a JSON file
 * committed before the rule existed, or a sheet that was synced from a machine
 * running older code. Only a gate wired into `npm run build` can promise that
 * what ships was checked.
 *
 * Runs standalone under tsx, deliberately reading `src/data/*.json` directly
 * rather than going through `astro:content`, so it works even when the Astro
 * build itself is broken — which is exactly when you most want it to run.
 *
 * Exit codes: 0 clean (warnings allowed), 1 violation.
 *
 * Environment:
 *   COMPLIANCE_STRICT=1  Promote launch-blocking warnings to errors. Set this in
 *                        the production environment so unfilled licence numbers,
 *                        unapproved legal wording, or unapproved images can
 *                        never reach a patient.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  COMPLIANCE_RULES,
  PROMOTIONAL_RULES,
  NON_PROSE_FIELDS,
  scanRecord,
  scanText,
  formatViolation,
  type Violation,
} from '../src/lib/compliance';
import { CLINIC, missingClinicFields } from '../src/config/clinic';

const STRICT = process.env.COMPLIANCE_STRICT === '1';
const DATA_DIR = join(process.cwd(), 'src', 'data');
const LEGAL_DIR = join(process.cwd(), 'src', 'content', 'legal');

const errors: string[] = [];
const warnings: string[] = [];

/** Raise as an error in strict mode, a warning otherwise. */
function gate(message: string): void {
  if (STRICT) errors.push(message);
  else warnings.push(message);
}

interface ItemRow {
  readonly id?: string;
  readonly status?: string;
  readonly image_id?: string;
  readonly image_status?: string;
  readonly [key: string]: unknown;
}

function readJson<T>(name: string): T[] {
  const path = join(DATA_DIR, name);
  if (!existsSync(path)) {
    errors.push(`✗ Missing data file: src/data/${name}. Run \`npm run sync:content\`.`);
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
    if (!Array.isArray(parsed)) {
      errors.push(`✗ src/data/${name} is not a JSON array.`);
      return [];
    }
    return parsed as T[];
  } catch (err) {
    errors.push(`✗ Could not parse src/data/${name}: ${(err as Error).message}`);
    return [];
  }
}

// ── 1. Banned terms in published clinical content ───────────────────────────
// Only published rows. A draft row is the clinician's workspace; blocking a
// build because a half-written draft says "arthritis" would make the gate
// something people route around.

const items = readJson<ItemRow>('items.json');
const areas = readJson<ItemRow>('areas.json');
const publishedItems = items.filter((i) => i.status === 'published');
const publishedAreas = areas.filter((a) => a.status === 'published');

let termViolations = 0;

for (const item of publishedItems) {
  const found: Violation[] = scanRecord(item, NON_PROSE_FIELDS, COMPLIANCE_RULES);
  for (const v of found) {
    termViolations += 1;
    errors.push(formatViolation(`item "${item.id ?? '(no id)'}"`, v));
  }
}

for (const area of publishedAreas) {
  const found: Violation[] = scanRecord(area, NON_PROSE_FIELDS, COMPLIANCE_RULES);
  for (const v of found) {
    termViolations += 1;
    errors.push(formatViolation(`area "${area.id ?? '(no id)'}"`, v));
  }
}

// ── 2. Promotional language in legal and chrome copy ────────────────────────
// Scanned for booking CTAs only — see the note on PROMOTIONAL_RULES for why a
// disclaimer is allowed to use the words an exercise description may not.

interface LegalDoc {
  readonly file: string;
  readonly frontmatter: Record<string, string>;
  readonly body: string;
}

function readLegalDocs(): LegalDoc[] {
  if (!existsSync(LEGAL_DIR)) {
    errors.push('✗ src/content/legal/ does not exist. MODULES.md M12 requires it.');
    return [];
  }
  const files = readdirSync(LEGAL_DIR).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    errors.push('✗ src/content/legal/ is empty. MODULES.md M12 requires disclaimer, privacy and credits.');
    return [];
  }
  return files.map((f) => {
    const raw = readFileSync(join(LEGAL_DIR, f), 'utf8');
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    const frontmatter: Record<string, string> = {};
    let body = raw;
    if (match) {
      body = match[2];
      for (const line of match[1].split(/\r?\n/)) {
        if (line.trimStart().startsWith('#')) continue;
        const kv = line.match(/^([A-Za-z_][\w]*):\s*(.*)$/);
        if (kv) frontmatter[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '');
      }
    }
    return { file: f, frontmatter, body };
  });
}

const legalDocs = readLegalDocs();

for (const doc of legalDocs) {
  for (const v of scanText(doc.body, 'body', PROMOTIONAL_RULES)) {
    termViolations += 1;
    errors.push(formatViolation(`legal/${doc.file}`, v));
  }
}

// Required legal pages must all be present, or the disclaimer is incomplete.
for (const required of ['disclaimer.md', 'privacy.md', 'credits.md']) {
  if (!legalDocs.some((d) => d.file === required)) {
    errors.push(`✗ Missing src/content/legal/${required} (MODULES.md M12).`);
  }
}

// ── 3. Clinic identifiers still unfilled ───────────────────────────────────
// RESEARCH-FINDINGS §4 requires the clinic legal name, DHA facility licence,
// the supervising physiotherapist's licence, and a last-review date on the
// disclaimer. They are unknown to the build and must not be guessed.

const missing = missingClinicFields();
if (missing.length > 0) {
  gate(
    `${STRICT ? '✗' : '!'} src/config/clinic.ts has ${missing.length} unfilled value(s): ${missing.join(', ')}.\n` +
      '      The disclaimer cannot satisfy RESEARCH-FINDINGS §4 until the clinic supplies these.',
  );
}

if (CLINIC.lastContentReview && /^\d{4}-\d{2}-\d{2}$/.test(CLINIC.lastContentReview)) {
  const ageDays = (Date.now() - Date.parse(CLINIC.lastContentReview)) / 86_400_000;
  if (ageDays > 365) {
    gate(
      `${STRICT ? '✗' : '!'} Content was last reviewed ${Math.floor(ageDays)} days ago (${CLINIC.lastContentReview}).\n` +
        '      The disclaimer states a review date to patients; a stale one misrepresents it.',
    );
  }
}

// ── 4. Legal wording not yet signed off ────────────────────────────────────
// RESEARCH-FINDINGS §4: "The Medical Director is accountable and must approve
// content."

for (const doc of legalDocs) {
  const approved = doc.frontmatter.approvedBy;
  if (!approved || approved === 'null') {
    gate(
      `${STRICT ? '✗' : '!'} legal/${doc.file} has approvedBy: null — wording is still an unapproved draft.\n` +
        "      RESEARCH-FINDINGS §4 makes the clinic's Medical Director accountable for content approval.",
    );
  }
}

// ── 5. Published items pointing at unapproved images ───────────────────────
// IMAGE-PIPELINE.md's delivery contract: "Only `approved` ships."
//
// This is not a hypothetical. IMAGE-TEST-VERDICT.md records ex-neck-02 as
// "FAIL — worst of the set": the render shows the head *forward* of the
// shoulders, the exact posture the chin tuck exists to correct, so the image
// depicts the opposite of the instruction printed beside it.
//
// ExerciseImage.astro refuses to render an unapproved image, so nothing unsafe
// can reach a patient even if this gate is ignored. The gate exists to make the
// gap visible rather than silently showing placeholders forever.

for (const item of publishedItems) {
  if (!item.image_id) continue;
  if (item.image_status !== 'approved') {
    gate(
      `${STRICT ? '✗' : '!'} Published item "${item.id}" references image "${item.image_id}" with image_status=${
        item.image_status ? `"${item.image_status}"` : '(unset)'
      }.\n` +
        '      IMAGE-PIPELINE.md: only `approved` ships. The card will render a placeholder until the\n' +
        '      physiotherapist signs the image off against its instruction text.',
    );
  }
}

// ── Report ─────────────────────────────────────────────────────────────────

console.log('Compliance check — MODULES.md M12');
console.log(
  `  scanned ${publishedItems.length} published item(s), ${publishedAreas.length} published area(s), ${legalDocs.length} legal document(s)`,
);
console.log(`  ${COMPLIANCE_RULES.length} rules active${STRICT ? ' · STRICT mode' : ''}`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s) — launch blockers, not build blockers:`);
  for (const w of warnings) console.log(w);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(e);
  console.error(
    `\nBuild refused. ${termViolations > 0 ? 'Banned wording must be changed in the Google Sheet, not in src/data/.' : 'Fix the errors above and re-run.'}`,
  );
  process.exit(1);
}

console.log(
  warnings.length > 0
    ? '\nNo banned wording found. Warnings above must be cleared before go-live.'
    : '\nClean.',
);
if (!STRICT) console.log('Set COMPLIANCE_STRICT=1 in production to enforce the warnings above.');
