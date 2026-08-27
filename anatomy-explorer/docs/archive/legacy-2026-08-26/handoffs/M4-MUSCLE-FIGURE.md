# M4 · Muscle figure

**Agent: GPT-5.6 Sol** · **Effort:** medium · **Wave:** 2, parallel with M5

Visual module. You must render the figure and look at it — a highlight on the wrong limb is
invisible in code and obvious in a picture.

## Context you need

Anatomy Explorer is a body-area locator in front of an existing physiotherapy exercise site.
The live site is in `patient-library/` — REFERENCE ONLY, never modify it. Anatomy Explorer lives
in `anatomy-explorer/`. Read `MODULE-HANDOFF.md` for the constitution first.

**Not a symptom checker.** Never name a condition anywhere, including comments and identifiers.

## You own

    src/data/anatomy/muscle-map.ts
    src/components/anatomy/MuscleFigure.astro

Nothing else. If you need another file, STOP and report.

## The idea

Stop using the body only as input. Use it as **output**: beside every exercise, a small body
diagram showing where that exercise works.

`targetMusclesEn` is populated on all 26 items in the library snapshot and is already
clinician-written. You are **visualising reviewed data, not authoring it** — this module adds
zero new clinical content, which is exactly why it can ship before the clinician writes anything.

## 1 · The normalisation table — `src/data/anatomy/muscle-map.ts`

The source strings are free text written by a clinician: `"Calves, Shin muscles"`,
`"Gluteus medius"`, `"External rotators, Glutes"`, `"Biceps"`. Build an explicit lookup from a
normalised muscle key to one or more region ids, reusing the ids from M1's `body-regions.ts`.

Rules that matter:

- Split on commas, trim, lowercase, match against an **explicit** table. Never fuzzy-match,
  never infer from substrings, never fall back to "closest".
- An unmapped muscle string is **not** a silent failure. Export the unmapped list so
  `check:anatomy` can report it. Tell M2's agent the export name in your report — do not edit
  their file.
- **Never invent an anatomical relationship to fill a gap.** If you cannot map
  "external rotators" confidently, leave it unmapped and say so.
- The map is data, not logic. A clinician should be able to correct a row without reading code.

## 2 · The component — `MuscleFigure.astro`

A small figure, roughly 90×230, reusing M1's geometry via `lib/anatomy/geometry.ts`.
**Import it. Do not copy the paths** — two figures with duplicated coordinates drift apart the
first time anyone edits one.

- Highlights the mapped regions for a given muscle list.
- Front or back chosen by which view the highlighted regions live in. If they span both, render
  both, small, side by side.
- The SVG is decorative: `aria-hidden="true"`, with the muscle names present as real text beside
  it. The figure supplements the words; it never replaces them.
- Renders **nothing at all** when nothing maps — no empty box, no placeholder, no "unknown".
- Works in light and dark. Check the highlight against both grounds.

## Your verification loop

    npm run shoot -- --only=exercises

Attach the PNGs and say what you see. Walk several exercises across different areas — a knee
exercise, a neck exercise, a hip exercise — and confirm the highlight lands on the right part
each time. State the ones you checked.

## Do not

Touch the body map, the flow, the screens, or styles beyond this component. Add clinical copy.
Invent a muscle-to-region mapping you are not sure of. Modify anything inside `patient-library/`.

## Acceptance

- Every one of the 26 items renders either a correct figure or nothing.
- **Report the coverage number:** how many distinct muscle strings mapped, and list every one that
  did not.
- The figure imports geometry from M1 rather than redefining it.
- Screenshots attached, with your own assessment.
- `npm run typecheck` and `npm run build` pass.
