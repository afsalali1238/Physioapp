# M4 — Locator UI (2D, canonical)

**Build tool:** GPT-5.6-SOL · **Wave:** 2 · **Branch:** `m4-locator-ui` · **Depends on:** M2 (regions), M3 (gate), M6 (shell and base CSS)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

`src/components/AnatomyLocator.astro` is 464 lines. It is the entire application: markup for eleven screens, an inline SVG body map, a 228-line client script holding all the state, the symptom questions, the safety gate, and the education panel. A-008 records what that costs — *"every task touched one file, so parallel work was impossible."*

M4 breaks it up. That is the mechanical half. The other half is that the monolith has drifted from three written decisions and nobody noticed, because the file is too long to audit:

- **A-002 says the intro screen and the three symptom questions are cut.** Both still ship. "Three screens, not seven" is currently eleven phases.
- **A-007 says the safety gate has no skip.** It has one, labelled "I'm not sure", wired to advance the flow.
- **A-014 makes `/find-my-area/` canonical.** `/find-my-pain.astro` still exists as a second full page rendering the same component.

And two real type errors have never been seen by a compiler, because `tsc` does not read `.astro` files and this app had no `astro check` until M0.

Judge this module on two things: **the locator flow matches A-002 and A-003 rather than the file's history**, and **`AnatomyLocator.astro` no longer exists**.

## 2. Do not redesign

**Read this before you write a component.**

The previous visual agent on this project shipped three uninstructed reversals of written decisions — page transitions that `DESIGN-SYSTEM.md` explicitly forbids, a dismissible regulatory disclaimer, and a replacement palette described as "better user experience" (D-025, D-026). M6 is repairing the palette now. Do not open a second front.

Specific to the locator:

| Locked | Source |
|---|---|
| **The map is an orientation tool, not a game.** No hover reveals, no ambient motion, no zoom-on-hover, no game-like feedback | `DESIGN-SYSTEM.md` · Locator |
| Selected regions get **outline, tint, label and a text announcement** — never colour alone | `DESIGN-SYSTEM.md` · Accessibility |
| The semantic region list stays visible beside or below the map at mobile widths. It is not a fallback you hide behind a toggle | `DESIGN-SYSTEM.md` · Locator |
| **A click selects; a second explicit action confirms.** Never confirm on first tap | `3D-TECHNICAL-ARCHITECTURE.md` §5 |
| Front/back state is explicit and labelled | `DESIGN-SYSTEM.md` · Locator |
| 17px base, 44px minimum target, no motion beyond 120ms border and a 1px lift | `DESIGN-SYSTEM.md` |
| Colours, type and spacing come from M6's tokens. **You define none.** | MODULE-MAP §5 |

**And the one that is not a style rule:** the result screen must always state that the selected point is a general location guide, that the information does not identify the cause of the patient's discomfort, and that exercise links are general clinician-approved library content rather than a new prescription (`CLINICAL-SAFETY.md` · Interpretation guardrails). Never personalise scenario order, confidence or exercise ranking from what the patient selected. A precise tap plus a tailored list reads as a diagnosis even when no diagnosis is written.

## 3. Files you own

Exactly the M4 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/components/anatomy/**` *except* `SafetyGate.astro` and `three/**` | **absent** — create |
| `src/lib/anatomy/locator-state.ts` | exists, 49 lines — extend |
| `src/lib/anatomy/question-flow.ts` | exists, 67 lines — resolve, then probably delete |
| `src/pages/find-my-area.astro` | exists, 15 lines — rewrite onto M6's layout |
| `src/pages/find-my-pain.astro` | exists — **delete** |
| `src/styles/locator.css` | **absent** — create |

**`src/components/AnatomyLocator.astro` is not in any row.** It is the monolith you are replacing. Claim its deletion in `CROSS-MODULE-REQUESTS.md` in your first commit, then delete it. Do not leave it as a thin wrapper.

**`src/data/anatomy/questions.ts` is not in any row either.** It holds `SYMPTOM_QUESTIONS` — the three questions A-002 says are cut. **Claim it before you touch it.** If the questions are genuinely cut, the file is deleted and that is a decision entry in `memory.md`; if they stay, the file needs an owner and the clinician needs to see the wording. Do not quietly keep it working because the code compiles.

## 4. Files you read, never write

- `src/components/anatomy/SafetyGate.astro` and `src/lib/anatomy/safety-gate.ts` — **M3's.** You mount them. You do not edit them, restyle their behaviour, or reimplement any part of the decision logic.
- `src/data/anatomy/body-regions.ts`, `pain-zones.ts`, `education.ts`, `region-area-map.ts`, `src/lib/anatomy/content-validation.ts` — **M2's.**
- `src/data/anatomy/safety-rules.ts` — **M3's.**
- `src/styles/tokens.css`, `base.css`, `print.css`, `src/layouts/Base.astro`, `src/components/shell/**` — **M6's.** Consume; never add to.
- `src/lib/content.ts` — **M1's.** The only route to published content.
- `src/lib/contracts/locator.ts`, `anatomy.ts`, `safety.ts` — M0's, frozen.
- `memory.md` A-002, A-003, A-005, A-006, A-007, A-014; `UX-FLOWS.md`; `PRD.md`; `CLINICAL-SAFETY.md`; `PORT-CHECKLIST.md`.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 5. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `AnatomyLocator.astro` is **464 lines**: template to ~235, then a 228-line `<script>` | file |
| `LocatorPhase` is a **union of eleven** — `intro`, `region`, `region-confirmation`, `zones`, `zone-confirmation`, `complete`, `unsure`, `questions`, `safety-check`, `education`, `urgent-care` | `src/lib/anatomy/locator-state.ts:1-12` |
| The same union is **redeclared** inside the component script as a local `Phase` type | `AnatomyLocator.astro:242` |
| `AppRegion` is a **third** local shape, reconstructed from a JSON string on a `data-` attribute rather than imported | `AnatomyLocator.astro:241,247` |
| State lives in eight module-scope `let`s in the script, not in `locator-state.ts` — which exports pure reducers that the component does not use | `AnatomyLocator.astro:250-257` vs `locator-state.ts:31-49` |
| **Type error 1:** `findSafetyRule(safetyRuleId)` passes `string \| undefined` into a `string` parameter (TS2345) | `AnatomyLocator.astro:329` |
| **Type error 2:** `event.key` read off an untyped `Event`, tracing back to an un-generic `document.querySelector` (TS2339) | `AnatomyLocator.astro:440`, `:244` |
| Neither error has ever been reported, because `tsc` loads 11 files and **none is an `.astro` file** | M0 handoff §4 |
| `BODY_REGIONS` has **nine** regions: neck, shoulder, upper-back, lower-back, hip, knee, ankle, wrist, foot | `body-regions.ts:20-117` |
| `upper-back` and `foot` have **zero** published exercises — dead ends. **`elbow` has two and is missing from the map** — unreachable. This is exactly what A-005 describes | cross-reference with `patient-library/src/data/items.json` |
| `SYMPTOM_QUESTIONS` holds three questions — feeling / onset / travel — each with an `unsure` option | `src/data/anatomy/questions.ts:13-45` |
| The intro screen ships, with "Explore the body" and "I know my body area" | `AnatomyLocator.astro:24-36` |
| `find-my-pain.astro` and `find-my-area.astro` are **near-identical files** differing only in `<title>` and `<meta description>` | both files |
| All three page files open their own `<html>` and import `global.css` directly | `src/pages/*.astro` |
| `popstate` restores any phase and guards only on `regionId`/`zoneId` presence — not on whether the gate was answered | `AnatomyLocator.astro:441-462` |
| The SVG body map is inline, `viewBox="0 0 240 620"`, with `region.focusViewBox` swapped in on selection | `AnatomyLocator.astro:60,320` |
| Keyboard support exists for map regions (Enter/Space) and there is a `[data-live-status]` announcement channel | `AnatomyLocator.astro:435-441`, `:265` |

**The good parts, and they are worth keeping.** The live-region announcer, the Enter/Space handling on map regions, the always-present semantic region list beside the map, the skip link, and `[data-focus-heading]` focus management on phase change are all correct and all easy to lose in a rewrite. Port the *behaviour*, not the file.

## 6. Deliverables

**1. Resolve the flow against A-002 and A-003 before you build anything.** A-002 says the intro screen and the three symptom questions are cut; both ship. That is a genuine contradiction between a written decision and the code, and MODULE-MAP §8's rule — *the code is the fact, the document is the intent* — tells you which is which, not which should win. **Your handoff's job is to close it, not to pick silently.** Write the resolution into `memory.md` as a decision entry with a reason, and put the symptom-questions half in `CROSS-MODULE-REQUESTS.md` for the H track, because the three questions are patient-facing clinical wording that no agent may keep, cut or reword on its own judgement.
**Acceptance:** `memory.md` carries a dated entry naming which phases survive and why; the phase union in `locator-state.ts` matches that entry exactly; no phase exists in code that the entry does not list.

**2. Decompose into `src/components/anatomy/`.** One component per screen plus the map and the region list — roughly `BodyMap.astro`, `RegionList.astro`, `RegionConfirmation.astro`, `ZonePicker.astro`, `ZoneConfirmation.astro`, `EducationPanel.astro`, and a `LocatorShell.astro` that composes them and mounts M3's `SafetyGate.astro`. Exact names are yours; the constraint is that no file exceeds a length you can audit in one read, and that each screen's markup lives with its own behaviour.
**Acceptance:** `AnatomyLocator.astro` is deleted; no file under `src/components/anatomy/` exceeds ~150 lines; `astro check` clean; every component imports its types from `contracts/`.

**3. One state module, one phase type.** `locator-state.ts` becomes the only definition of `LocatorPhase` and `LocatorState`, and the only place transitions happen. Delete the redeclared `Phase` union and the local `AppRegion` shape from the component. Regions come from M2's `BODY_REGIONS` through an import, not through `JSON.parse` of a `data-` attribute.
**Acceptance:** `grep -rn "type Phase\|AppRegion" src/` returns nothing; `grep -rn "JSON.parse(app.getAttribute" src/` returns nothing; every transition in the app calls a reducer from `locator-state.ts`.

**4. Fix both type errors — they are now yours.** M0 reported them to you deliberately rather than fixing them in your file. TS2345 at old line 329 is a real nullability hole in the safety path; TS2339 at old line 440 is a missing generic on `querySelector`. **Fix them by narrowing, not by casting.** An `as` or a `!` here re-hides exactly what M0's new check just surfaced.
**Acceptance:** `npm run check` passes with no `@ts-expect-error`, no `any`, and no non-null assertion introduced in the locator; `astro check` reports zero errors.

**5. Mount M3's gate. Do not reimplement it.** `SafetyGate.astro` and `safety-gate.ts` are M3's. You may style the gate to sit in your layout — spacing, type scale, token usage, responsive behaviour. **You may not change which options exist, what they say, what any answer does, or when the gate runs.** Every downstream phase calls M3's `canProceed()` on entry, including on `popstate` restore.
**Acceptance:** no safety logic exists outside M3's files; `grep -rn "skip-safety\|answerSafetyCheck" src/` returns nothing; M3's four bypass cases still fail to bypass after your decomposition.

**6. `question-flow.ts` — resolve it.** It currently holds both the symptom-question flow and `answerSafetyCheck`, which M3 supersedes. M3 has already filed the removal request. Once #1 settles the questions, this file is either reduced to the question flow or deleted entirely. **Two live implementations of the gate at the end of Wave 2 is an M9 failure**, so close it.
**Acceptance:** `answerSafetyCheck` does not exist in the codebase; `question-flow.ts` either matches the decision from #1 or is gone.

**7. `/find-my-area/` canonical; `find-my-pain.astro` deleted.** M0 has already landed `redirects: { '/find-my-pain': '/find-my-area' }` in `astro.config.mjs`, and its handoff notes the coordination: the redirect and your deletion must both exist or neither. Confirm the redirect is in place before you delete — a deleted page with no redirect is a 404 on a URL patients may already hold.
**Acceptance:** `src/pages/find-my-pain.astro` does not exist; `/find-my-pain` returns a redirect to `/find-my-area/` in a built preview; exactly one indexable locator URL.

**8. Both pages render through M6's `Base.astro`.** No page opens its own `<html>`. No page imports `global.css` — it will not exist. `find-my-area.astro` becomes a thin page passing title and description into the layout and rendering `LocatorShell`.
**Acceptance:** `grep -rn "<html" src/pages/` returns nothing; `grep -rn "global.css" src/` returns nothing; the page is under 20 lines.

**9. `src/styles/locator.css`.** Locator-only styles, on top of M6's tokens and base. **You define no colour, no font size, no spacing scale of your own** — every value is a token. M6 will hand you a list of locator-specific blocks extracted from `global.css` through `CROSS-MODULE-REQUESTS.md`; that list is your starting point, not a copy target.
**Acceptance:** `grep -nE "#[0-9a-fA-F]{3,6}" src/styles/locator.css` returns nothing; no `font-size` in raw px that is not `calc(var(--fs-*) * var(--scale))`; no `@media (prefers-color-scheme)` block — theming is M6's layer.

**10. Regions come from data, never from a hardcoded list.** A-005: the map offers `upper-back` and `foot` with zero exercises, and omits `elbow` which has two. M2 regenerates `BODY_REGIONS` and publishes the published-content check. **Your job is to never bypass it**: a region is renderable in a view if and only if M2's `views` says so, and selectable only if M1's published-content accessor says it leads somewhere.
**Acceptance:** no region id is written as a literal in a component; a region with no published content is not selectable; `check:anatomy` passes with your components in the tree.

**11. Accessibility, at the level the old file already reached — and no lower.** Keyboard-complete flow with no mouse; Enter/Space on map regions; `[data-live-status]` announcements on every selection and phase change; focus moved to the screen heading on phase change; visible focus ring; selection shown by outline **and** tint **and** label; semantic region list always present; operable at 200% zoom on a 360px viewport.
**Acceptance:** the entire flow is completable using only the region list, with the SVG ignored; every selection produces a live-region announcement; nothing is communicated by colour alone; `npm run check` includes no a11y regression M9 can find.

## 7. Contracts

**What M4 consumes:**

| From | What | Rule |
|---|---|---|
| M0 | `contracts/locator.ts`, `anatomy.ts`, `safety.ts` | frozen. Do not widen a type to compile — file it. |
| M2 | `BODY_REGIONS`, `PAIN_ZONES`, `EDUCATION`, `region-area-map` | filter on `views`; never infer a view from a shape |
| M3 | `SafetyGate.astro`, `canProceed()` | mount and call. Never modify. |
| M6 | `Base.astro`, `tokens.css`, `base.css`, shell components | consume only; never add to M6's stylesheets |
| M1 | `src/lib/content.ts` | the only route to published content. **Never import above `anatomy-explorer/`.** |

**What M4 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `src/components/anatomy/**` | M8 | the 3D island has no 2D tier to progressively enhance |
| `locator-state.ts` reducers | M8 | the canvas has no state to synchronise with |
| the decomposed screen boundaries | M8, M9 | M8 cannot mount a canvas inside a 464-line file; M9 cannot test a screen in isolation |
| `/find-my-area/` as the single locator URL | M9 | the release checklist has two indexable locators |

**The rule with M8, stated now so it is not negotiated later.** M4's 2D locator is the **canonical, complete, mandatory** experience — not a fallback (`3D-TECHNICAL-ARCHITECTURE.md` §2, §9). M8 adds a canvas on top of it. If a 3D need would change your semantics, that is a `CROSS-MODULE-REQUESTS.md` entry to you, not an edit by M8.

## 8. Hard rules for this module

1. **Do not redesign.** §2 is the list. A change to a locked item needs a `memory.md` entry naming a reason; "better user experience" is not one.
2. **Never rewrite the safety gate.** Mount M3's component, call M3's logic. Styling the gate is permitted; changing what it does is not.
3. **Never reword a red-flag trigger, a safety line, an education line or a symptom question.** Those are clinical wording. If one breaks your layout, fix the layout or flag it — never the words.
4. **Never invent clinical content**, and **never write a clinician's name or a review date**, including in a fixture or a comment.
5. **Never personalise from a selection.** No ranking, no ordering, no confidence, no "based on your answers". `CLINICAL-SAFETY.md` · Interpretation guardrails.
6. **The result screen always carries the three guardrail statements** — general location guide, does not identify the cause, links are general library content not a new prescription.
7. **No diagnosis language anywhere** — including comments, identifiers, filenames, class names and commit messages (D-001).
8. **No analytics, accounts, tracking or backend** (D-007). One `localStorage` key is permitted to you — last chosen area — and it must be in `try/catch`. **Locator selections are ephemeral** (`CLINICAL-SAFETY.md` · Privacy): what a patient tapped does not persist.
9. **Do not touch config.** `astro.config.mjs`, `package.json`, lockfiles and `.github/` are M0's, always, including "just to add the redirect".
10. **`patient-library/` is read-only**, and no import in this app reaches above `anatomy-explorer/`.
11. **Builds cannot run over the Claude device bridge** — Windows native bindings, Linux shell. **Say which checks you could not run.** And as a visual module: **look at what you rendered and say what you saw** (A-009). A visual task is not finished until you have.

## 9. Definition of done

- `AnatomyLocator.astro` is deleted. `find-my-pain.astro` is deleted and `/find-my-pain` redirects.
- The flow matches a dated decision entry in `memory.md`; the phase union matches it exactly; the symptom-questions question has reached the H track.
- One `LocatorPhase`, one `LocatorState`, one set of reducers, all in `locator-state.ts`. No local `Phase`, no local `AppRegion`, no `JSON.parse` of a data attribute.
- Both type errors fixed by narrowing. No `any`, no `!`, no `@ts-expect-error` introduced.
- `answerSafetyCheck` is gone; no safety logic exists outside M3's files; M3's four bypass cases still fail.
- No region id is a literal; regions with no published content are not selectable; `check:anatomy` passes.
- Both pages render through `Base.astro`; nothing imports `global.css`; `locator.css` contains no hex colour and no raw font size.
- Keyboard-complete without the SVG; announcements on every selection and phase change; selection shown three ways; 200% zoom at 360px.
- **Screenshots taken and described** — region select, confirmation, gate, stop screen, education, in both themes at 360px and desktop. Say what you saw.
- `git status --short`, from a real terminal, shows changes only in M4's rows of MODULE-MAP.md §5, plus the two claimed deletions.
- `CROSS-MODULE-REQUESTS.md` carries: the `AnatomyLocator.astro` deletion claim, the `questions.ts` ownership claim, the symptom-questions item for the H track, and any token M6 needs to add for you.

## 10. When you are blocked

**If M2 or M3 has not landed, do not stub around them.** Build against `contracts/` and `contracts/__placeholders__/`, where every string is `PLACEHOLDER_MARKER`. **Never write realistic clinical prose into a fixture** — M9 adds a build gate that fails if `PLACEHOLDER_MARKER` reaches a patient route, and that gate is the mechanism that stops a placeholder shipping. A fixture that reads like a real exercise defeats it.

**If a region highlights the wrong place on the body,** that is H5 and it is not yours to correct by nudging a path. Report it to M2 with the region id. A technically valid shape pointing at the wrong body location is the failure mode this project treats as non-negotiable.

**If A-002 and the code conflict in a way you cannot resolve,** stop at the decision, write both readings into your report, and ask Afsal. Cutting a patient-facing screen and keeping one are both defensible; doing either silently is not.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue. Both of this project's recorded damage incidents were visual modules editing outside their lane.
