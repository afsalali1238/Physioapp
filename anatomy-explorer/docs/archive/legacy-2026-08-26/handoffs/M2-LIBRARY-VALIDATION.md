# M2 · Library bridge and build-time validation

**Agent: Antigravity** (or Codex) · **Effort:** medium · **Wave:** 1, parallel with M1 and M3

You are chosen for this because it is deterministic Node scripting with no UI, and because the
`patient-library/` already ships `scripts/check-compliance.ts` written to the same conventions.
Read that file first — you are building its sibling.

## Context you need

Anatomy Explorer is a body-area locator in front of an existing live physiotherapy exercise site.
The live site is in `patient-library/` — REFERENCE ONLY, never modify it. Anatomy Explorer
lives entirely in `anatomy-explorer/`. Read `MODULE-HANDOFF.md` for the constitution first.

Live library: 8 areas, 26 exercises, only neck and shoulder published.

## You own

    scripts/sync-library.mjs
    scripts/check-anatomy.mjs
    src/lib/anatomy/library.ts
    package.json

Nothing else. If you need another file, STOP and report.

## The gap

`"lint": "npm run typecheck"` is the entire quality gate. No banned-term check, no review-metadata
check, no referential integrity — while `patient-library/` already runs `check:compliance` on
`prebuild`. `CLINICAL-SAFETY.md` §7 and `ANATOMY-DATA-SCHEMA.md` §6 describe controls that nothing
enforces. Rules nothing checks are conventions, not controls.

## 1 · `src/lib/anatomy/library.ts`

A typed read layer over `src/data/library/`. Exports:

    getAreas()            all snapshot areas
    getPublishedAreas()   status === 'published' only
    getItemsForArea(id)   exercises for one area
    areaExists(id)        boolean
    getTargetMuscles(id)  distinct targetMusclesEn strings for that area

No DOM, no fetch, no framework. It reads the committed snapshot at build time.

## 2 · `scripts/check-anatomy.mjs`

Exits non-zero with a precise message naming the file and the row on any of:

- A **banned diagnostic term** anywhere in `src/`. Take the list from `CLINICAL-SAFETY.md` §5 and
  add: tendinopathy, sciatica, impingement, strain, sprain, frozen shoulder, tennis elbow,
  plantar fasciitis, slipped disc, trapped nerve, arthritis, bursitis. **Check comments and
  identifiers too, not only string literals** — an agent naming a variable `sciaticaZone` is
  exactly what this catches.
- An **outcome-claim term**: cure, fix, guaranteed, permanent, safest, best, proven, miraculous,
  unique, exclusive.
- Any row with `status: 'published'` and an empty `reviewedBy` or `reviewedDate`.
- A `reviewedDate` in the future, or not ISO `yyyy-mm-dd`.
- A region or zone whose `areaId` is absent from the library snapshot.
- A duplicate id anywhere across regions, zones and safety rules.
- A region with no zones, or a zone whose `regionId` does not resolve.
- A safety rule missing `title`, `message` or `actionLabel`.

Report **every** violation in one run, not just the first. An agent fixing one at a time and
re-running is a slow way to find eight problems.

## 3 · Wire it so it cannot be skipped

Add `"check:anatomy"` and a `"prebuild"` that runs it. `npm run build` must fail when the checker
fails. Do not add a flag that bypasses it.

## 4 · Prove it fails

Add `scripts/fixtures/` with three deliberately bad rows — a banned term, a published row with no
reviewer, a broken `areaId` — and `"check:fixtures"` which runs the checker against each and
asserts a non-zero exit. **A validation nobody has watched fail is a validation you do not know
works.** Paste the actual output of all three in your report.

## 5 · Drift

`sync:library` reports when the snapshot differs from the root source. `check:anatomy` fails if
the snapshot is missing entirely. Never write to the root files — verify with `git status`.

## Do not

Touch any component, style, or data file outside `src/data/library/`. Add a runtime dependency —
these are build-time scripts. Modify anything inside `patient-library/`.

## Acceptance

- `npm run build` fails on each of the three seeded fixtures, with the three failure messages pasted.
- `npm run build` passes on the real tree.
- `git status` shows nothing changed outside `anatomy-explorer/`.

## Report

Files changed · the three fixture failure messages verbatim · the full list of violations the
checker finds on the real tree today (there may be several — report, do not fix outside your
ownership) · typecheck and build output.
