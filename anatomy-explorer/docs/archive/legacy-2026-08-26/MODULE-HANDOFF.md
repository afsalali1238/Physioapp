# Module Handoff — parallel build

Nine modules. M0 is solo and blocking; after it lands, Wave 1 runs three agents at once.
Full briefs with copy-ready prompts: see the "Anatomy Explorer Build Modules" artifact.

## Why this exists

`AnatomyLocator.astro` was 416 lines and every task needed to touch it. That is the only
reason parallel work was impossible. M0 splits it and freezes the data contract.

## Sequence

| Wave | Modules | Agents |
|---|---|---|
| 0 · blocking | M0 Contract & scaffold | 1 |
| 1 · parallel | M1 Body map · M2 Library + validation · M3 Safety gate | 3 |
| 2 · parallel | M4 Muscle figure · M5 Integration | 2 |
| 3 · solo | M6 A11y · theme · performance | 1 |
| 4 · optional | M7 Clinician mode · M8 Search · M9 3D layer | 3 |

## File ownership — exclusive write access

An agent that needs a file it does not own must STOP and report. Never edit it, never
duplicate it, never shadow it with a new file. Another agent is probably in it right now.

| Module | Owns | Reads only |
|---|---|---|
| M0 | everything (solo) | — |
| M1 | `data/anatomy/body-regions.ts`, `data/anatomy/pain-zones.ts`, `lib/anatomy/geometry.ts`, `scripts/build-body.mjs`, `components/anatomy/BodyMap.astro` | types, library/ |
| M2 | `scripts/sync-library.mjs`, `scripts/check-anatomy.mjs`, `lib/anatomy/library.ts`, `package.json` | all |
| M3 | `data/anatomy/safety-rules.ts`, `components/anatomy/screens/SafetyGate.astro`, `components/anatomy/screens/SafetyStop.astro` | types, machine |
| M4 | `data/anatomy/muscle-map.ts`, `components/anatomy/MuscleFigure.astro` | geometry, library/ |
| M5 | `components/anatomy/AnatomyLocator.astro`, `screens/Locate.astro`, `screens/Confirm.astro`, `screens/Exercises.astro`, `lib/anatomy/machine.ts`, `pages/` | all |
| M6 | `styles/` + surgical edits anywhere, each one reported | all |

## Standing constitution — applies to every module

1. Work ONLY inside `anatomy-explorer/`. `patient-library/` is the live site and is reference material: read it,
   never modify it. Verify with `git status` before finishing.
2. Write ONLY to files your module owns (table above).
3. Not a diagnostic tool. Never name a condition or injury — tendinopathy, sciatica,
   impingement, strain, sprain, frozen shoulder, tennis elbow, plantar fasciitis, slipped disc,
   trapped nerve, arthritis, bursitis — anywhere, including comments, identifiers and fixtures.
   Never "this could be", "you may have", "the cause is", or any claim about results or recovery.
4. Never invent clinical content. No dosage, contraindications, red-flag thresholds, or anatomy
   claims not traceable to a reviewed row or to CLINICAL-SAFETY.md. Anything clinical ships as
   `status: 'draft'` with empty `reviewedBy`/`reviewedDate`. Never write a clinician's name.
5. No accounts, analytics, error reporting, cookies, backend, or request leaving the browser.
   localStorage is permitted for exactly two keys: last chosen area, text-size preference.
6. The map is never the only way through. Every flow completable by keyboard alone.
7. No dependency without stating bundle cost, licence, and why nothing present will do.

Working method: inspect before editing · one cohesive patch · run `npm run typecheck` and
`npm run build` (and `check:anatomy` if present) · report exact paths changed, real check output,
what you could not do, and any file outside your ownership that needs changing · report failures
honestly · stop at your acceptance criteria.

## Known defects these modules fix

- **Front/back is cosmetic.** `backPath` declared, set on zero regions. Lower back and upper back
  are currently tappable on the chest and abdomen. → M1
- **The zoom never renders.** `focusViewBox` is applied to the map, but the map lives inside
  `[data-screen="region"]`, hidden on every other phase. → M0 hoists it, M5 uses it.
- **Two state machines.** `locator-state.ts` is dead; the component reimplements it inline. → M0
- **Regions vs library.** `upper-back` and `foot` have zero exercises; `elbow` has two and is
  unreachable. → M1 derives the list from the snapshot; M2 fails the build on drift.
- **Schema drift.** `BodyRegion` carries none of the review metadata ANATOMY-DATA-SCHEMA.md
  requires. `safety-rules.ts` gets it right — match it. → M0
- **Red flags collected and ignored.** The three symptom questions record `after-injury` and
  `burning-tingling` then route to exercises anyway. → M3

## Review packet — run after every module

```
echo "### CHANGED";       git -C .. status --short -- anatomy-explorer
echo "### DIFFSTAT";      git -C .. diff --stat HEAD -- anatomy-explorer
echo "### TYPECHECK";     npm run typecheck 2>&1 | tail -25
echo "### BUILD";         npm run build     2>&1 | tail -25
echo "### VALIDATION";    npm run check:anatomy 2>&1 | tail -40
echo "### FIXTURES";      npm run check:fixtures 2>&1 | tail -20
echo "### ROOT TOUCHED?"; git -C .. status --short -- ':!anatomy-explorer'
echo "### TREE";          find src -type f | sort
```

Any output at all on `ROOT TOUCHED?` is a stop-and-revert, not a note for later.
