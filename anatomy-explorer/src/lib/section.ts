/**
 * The section vocabulary, settled in exactly one place.
 *
 * ── The naming trap, and the decision that closes it ────────────────────────
 * `section` in `areas.json` and `items.json` is `exercise`, **singular**. The
 * A-014 shell hardcoded `/exercises/`, plural, so `[section]/[area_id].astro`
 * emitted `/exercise/neck/` from the data while the index cards pointed at
 * `/exercises/neck/` — every exercise link 404'd, and it read as a routing bug
 * rather than a pluralisation one. `stretching` is unaffected, which is exactly
 * why it kept getting missed (PORT-CHECKLIST, Tier 3).
 *
 * **Resolved singular.** `exercise` matches the data, matches the live app's own
 * `index.astro`, and matches the URLs patients have already been sent. Renaming
 * to the plural would break links that are out in the world on a QR code.
 *
 * Every route, link and label goes through this module. If you find yourself
 * writing `/exercise` or `/exercises` as a string literal anywhere else, that is
 * the bug coming back.
 */

export type Section = 'stretching' | 'exercise';

/** Both sections, in the order they appear on the home page. */
export const SECTIONS: readonly Section[] = ['stretching', 'exercise'];

export function isSection(value: unknown): value is Section {
  return value === 'stretching' || value === 'exercise';
}

interface SectionCopy {
  /** Page H1 and card title. */
  readonly title: string;
  /** Sentence under the H1. */
  readonly lede: string;
  /** Used inside "Back to …" and "View …". */
  readonly shortLabel: string;
  /** Noun for a single item in this section. */
  readonly itemNoun: string;
}

export const SECTION_COPY: Readonly<Record<Section, SectionCopy>> = {
  stretching: {
    title: 'Stretching',
    lede: 'Choose the part of your body you want to stretch.',
    shortLabel: 'Stretching',
    itemNoun: 'stretch',
  },
  exercise: {
    title: 'Exercise Protocols',
    lede: 'Choose the part of your body you want to work on.',
    shortLabel: 'Exercises',
    itemNoun: 'exercise',
  },
};

/** `/stretching/` · `/exercise/` */
export function sectionPath(section: Section): string {
  return `/${section}/`;
}

/** `/stretching/neck/` · `/exercise/shoulder/` */
export function areaPath(section: Section, areaId: string): string {
  return `/${section}/${areaId}/`;
}
