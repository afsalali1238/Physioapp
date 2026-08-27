# M0 · Contract and scaffold

**Agent:** Claude · **Effort:** high · **Wave:** 0, solo and blocking
**Nothing else starts until this lands.**

## Context you need

Anatomy Explorer is a mobile-first body-area locator that sits in front of an existing, live
physiotherapy exercise site. A patient taps where it hurts, confirms the spot, passes a safety
check, and is routed to clinician-reviewed exercises for that area.

The exercise site is in `patient-library/`: Astro, live, already handed to a
physiotherapist who is entering content into a Google Sheet right now. It is REFERENCE ONLY —
read it, never modify it.

Anatomy Explorer lives entirely in `anatomy-explorer/`: separate Astro app, own `package.json`,
own build. Live library state: 8 areas (ankle, elbow, hip, knee, lower-back, neck, shoulder,
wrist), 26 exercises, only neck and shoulder published.

**This is not a symptom checker and never becomes one.** Read `MODULE-HANDOFF.md` for the full
constitution before editing anything.

## What this module is

A refactor plus a frozen contract. **It changes NO user-visible behaviour.** When you finish, the
app must look and behave exactly as it does now — same screens, same order, same copy. If you
find yourself improving something, stop: that belongs to a later module.

Several agents are about to work in parallel. Everything here exists to make that safe.

## Read first

`ANATOMY-DATA-SCHEMA.md`, `CLINICAL-SAFETY.md`, `UX-FLOWS.md`, `MODULE-HANDOFF.md`, and the
whole current `src/` tree.

## 1 · Version control, before anything else

`anatomy-explorer/` is currently untracked — no baseline, nothing to recover to. From the
repository root:

    git add anatomy-explorer
    git commit -m "anatomy-explorer: baseline before modularisation"

If git refuses for any reason, STOP and report. Do not proceed without a baseline.

## 2 · Library snapshot

Add `scripts/sync-library.mjs`. It reads `../patient-library/src/data/areas.json` and `../patient-library/src/data/items.json`
— read-only, never write to them — and emits:

    src/data/library/areas.json   [{ areaId, section, nameEn, order, status }]
    src/data/library/items.json   [{ id, areaId, section, status, nameEn, targetMusclesEn }]
    src/data/library/SNAPSHOT.md  source paths, date, row counts

Add `"sync:library"` to package.json scripts. Run it and commit the output. Expect 8 distinct
areaIds and 26 items. If you get different numbers, report them rather than adjusting anything.

## 3 · The frozen contract — `src/lib/anatomy/types.ts`

Types only, no logic. The current `BodyRegion` carries none of the review metadata that
`ANATOMY-DATA-SCHEMA.md` requires. `safety-rules.ts` already gets this right — match its shape.

    export type BodyView = 'front' | 'back';
    export type Side = 'left' | 'right' | 'central';
    export type Surface = 'front'|'back'|'inner'|'outer'|'top'|'bottom';
    export type PublishStatus = 'draft' | 'published' | 'retired';

    export type ReviewMeta = {
      status: PublishStatus; reviewedBy: string; reviewedDate: string; version: string;
    };

    export type Capsule = { d: string; w: number };

    export type BodyRegion = ReviewMeta & {
      id: string; areaId: string; views: BodyView[]; side: Side;
      nameEn: string; nameAr?: string; order: number;
      shapes: Capsule[]; focusViewBox: string; zoneIds: string[];
    };

    export type PainZone = ReviewMeta & {
      id: string; regionId: string; side: Side; surface: Surface;
      labelEn: string; labelAr?: string; confirmationTextEn: string;
    };

Migrate existing regions to this shape with `status: 'draft'` and empty review fields.
**Do not invent review data or write a clinician's name.**

## 4 · One state machine — `src/lib/anatomy/machine.ts`

There are currently two. `locator-state.ts` is dead — nothing imports it. The component's inline
`<script>` reimplements the same thing with local `let` bindings. Collapse both into one pure
reducer:

    export type Phase = 'locate' | 'confirm' | 'safety' | 'stop' | 'exercises';

    export type LocatorState = {
      phase: Phase; view: BodyView; regionId?: string; zoneId?: string;
      safety: 'unasked' | 'clear' | 'stopped';
    };

    export type LocatorEvent =
      | { type: 'setView'; view: BodyView }
      | { type: 'pickRegion'; regionId: string }
      | { type: 'pickZone'; zoneId: string }
      | { type: 'confirm' }
      | { type: 'back' }
      | { type: 'reset' }
      | { type: 'safetyAnswer'; ruleId: string | 'none' };

    export function next(state: LocatorState, event: LocatorEvent): LocatorState;

Pure — no DOM, no side effects, exhaustive switch, no `default` that swallows unknown events.

The phase list is FIVE, not the current nine. The flow collapses properly in M5. For THIS module,
map the existing nine onto these five and keep behaviour identical — if a phase renders two
screens in sequence for now, fine. **Do not redesign the flow here.**

Delete `locator-state.ts` and `question-flow.ts` once their behaviour is represented.

## 5 · Split the monolith

`AnatomyLocator.astro` is 416 lines and every module needs to touch it. That is the single reason
parallel work is currently impossible. Split into:

    components/anatomy/AnatomyLocator.astro   shell only — header, map slot, screen slots,
                                              aria-live region, the one client script that
                                              owns state and dispatches events
    components/anatomy/BodyMap.astro          the SVG
    components/anatomy/screens/Locate.astro
    components/anatomy/screens/Confirm.astro
    components/anatomy/screens/SafetyGate.astro
    components/anatomy/screens/SafetyStop.astro
    components/anatomy/screens/Exercises.astro

**BodyMap must sit OUTSIDE the screen sections**, above them in the shell. Today the map lives
inside `[data-screen="region"]`, hidden on every phase except that one — so `focusViewBox` is
applied to an invisible element and the zoom has never once rendered. Hoisting it is the fix.
Do not otherwise change zoom behaviour in this module.

## 6 · The visual harness — `scripts/shoot.mjs`

Three later modules are visual and will be built by an agent that can see. Give them a repeatable
render loop instead of clicking around.

    npm run shoot                     all states × all viewports × both themes → .shots/
    npm run shoot -- --only=confirm   one state
    npm run shoot -- --viewport=360   one width

States: `locate-front`, `locate-back`, `confirm`, `safety`, `stop`, `exercises`.
Viewports: 360×780, 768×1024, 1280×900. Themes: light, dark.

Use Playwright. Drive the app to each state through real interaction, not by injecting state —
a screenshot of a state the user cannot reach is worthless. Add `.shots/` to `.gitignore`.
If Playwright cannot be installed here, report the exact blocker rather than skipping this;
without it the visual modules cannot verify their own work.

## 7 · Ownership file

`MODULE-HANDOFF.md` already exists with the ownership table. Confirm it matches the tree you
produced and correct any path that drifted during the split.

## Acceptance

- `git log` shows the baseline commit; `git status` shows nothing changed outside `anatomy-explorer/`.
- `npm run typecheck` and `npm run build` pass.
- Behaviour unchanged — walk the whole flow and confirm screen by screen.
- `locator-state.ts` and `question-flow.ts` are gone; exactly one state machine exists.
- The map element is in the DOM on every phase, not nested inside a hidden section.
- Every region row carries `ReviewMeta` with `status: 'draft'`.
- `npm run shoot` produces the full set of PNGs.

## Report

Exact paths changed · the real output of typecheck and build · the row counts from
`sync:library` · confirmation that behaviour is unchanged, screen by screen · anything you could
not do · any file outside your ownership you believe needs changing.
