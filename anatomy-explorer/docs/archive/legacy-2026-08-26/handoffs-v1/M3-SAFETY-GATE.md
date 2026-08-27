# M3 — Safety gate

**Build tool:** Hermes · **Wave:** 1 · **Branch:** `m3-safety-gate` · **Depends on:** M0 (contracts) · **Blocks:** M4 (which cannot delete the monolith until your components exist)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

This is the one module in the project where a defect can hurt a patient.

The safety gate is the screen that asks, before any exercise handoff, whether the patient has one of eight red-flag symptoms — chest pain, sudden neurological change, loss of bladder or bowel control, saddle numbness, major trauma, severe and rapidly worsening pain, fever with severe pain, progressive neurological symptoms. If they do, the app stops and tells them to seek urgent medical assessment instead of exercising.

**Today it is not a gate.** It is a screen inside a 464-line component, and the flow around it leaks in three separate ways (§4). A-007 states the requirement in one sentence: *"One screen, the eight approved triggers verbatim, before any exercise handoff. No skip, no 'I'm not sure' that routes onward, no route to an exercise from the stop screen — including by browser back."* The current implementation violates all three clauses.

M3 exists as a separate module, landing **before** M4, for one reason recorded in MODULE-MAP.md §5: if the gate were extracted as part of the general locator decomposition, its logic would be rewritten by an agent optimising a component tree. It is not layout. It ships standalone, M4 mounts it, and M4 may never rewrite it.

Judge this module on one test: **from the stop screen, there is no sequence of taps, Back presses, typed URLs or restored history states that reaches an exercise page.**

## 2. Files you own

Exactly the M3 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/data/anatomy/safety-rules.ts` | exists, 115 lines — the eight rules, already correct data |
| `src/lib/anatomy/safety-gate.ts` | **absent** — create. The gate's decision logic, pure and testable. |
| `src/components/anatomy/SafetyGate.astro` | **absent** — create. The question screen and the stop screen. |
| `src/config/emergency.ts` | **absent** — create. One flagged constant for H3. |

**You do not own `src/components/AnatomyLocator.astro`.** It contains today's gate markup at lines 178–202 and today's gate wiring in its client script. Read it, port the behaviour out of it, **do not edit it**. M4 deletes it.

**You do not own `src/lib/anatomy/question-flow.ts`.** It is M4's, and it currently holds `answerSafetyCheck`. Your `safety-gate.ts` supersedes that function; write the request to M4 in `CROSS-MODULE-REQUESTS.md` and let M4 remove it when it decomposes the monolith. Two implementations must not both be live at the end of Wave 2 — that is M9's check.

## 3. Files you read, never write

- `CLINICAL-SAFETY.md` — the governance contract. Note §8 of MODULE-MAP: four documents cite "CLINICAL-SAFETY.md §3" for the triggers and **that file has no numbered sections and contains no trigger list**. The triggers live in `safety-rules.ts`. Do not go looking for a document that does not exist; and do not fix the citations, they are in files you do not own.
- `src/components/AnatomyLocator.astro` — the behaviour you are porting out.
- `src/lib/contracts/safety.ts` — M0's, frozen.
- `patient-library/src/config/clinic.ts` — the `PLACEHOLDER_MARKER` discipline you copy for `emergency.ts`.
- `memory.md` A-007, `PRD.md`, `UX-FLOWS.md`, `PORT-CHECKLIST.md`.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 4. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| Eight rules exist, all `severity: 'urgent'`, all sharing one title and one message constant | `src/data/anatomy/safety-rules.ts:24-105` |
| All eight carry `status: 'draft'`, `reviewedBy: ''`, `reviewedDate: ''`, `version: '0.1-draft'` via the `DRAFT_REVIEW` spread — **correct, and it must stay that way** | `safety-rules.ts:17-22` |
| `SAFETY_CHECK_OPTIONS` prepends `none` and **appends `unsure`** as selectable options | `safety-rules.ts:107-111` |
| `findSafetyRule(optionId: string)` takes a required `string` | `safety-rules.ts:113-115` |
| The gate markup is a `data-screen="safety-check"` section inside the monolith, with a help line reading "This safety check is draft content and must be reviewed by a physiotherapist" | `AnatomyLocator.astro:178-190` |
| **Leak 1 — the skip.** The gate screen carries `data-action="skip-safety"` labelled "I'm not sure", which calls `answerSafetyCheck(state, 'unsure')` and advances the flow | `AnatomyLocator.astro:189`; script `if (action === 'skip-safety')` |
| **Leak 2 — the back button.** `back-safety` returns to `questions`, and `popstate` restores any phase including `education` directly, so the browser Back/Forward pair walks around the gate | script: `if (action === 'back-safety') return go('questions')`; `popstate` handler |
| **Leak 3 — the type hole.** `findSafetyRule(safetyRuleId)` is called with `string \| undefined` against a `string` parameter (TS2345). It has never been typechecked because `tsc` does not read `.astro` files | `AnatomyLocator.astro:329`; M0 handoff §4 |
| The stop screen's only control is `data-action="reset"` → "Start over" — which is correct — but it sits in the same history stack as every other phase | `AnatomyLocator.astro:193-202` |
| The urgent copy exists in **two** places: `URGENT_TITLE`/`URGENT_MESSAGE` in the data file, and hardcoded as the `<h2>` default text in the markup | `safety-rules.ts:24-27`; `AnatomyLocator.astro:197` |
| There is **no** emergency number anywhere in this app. `patient-library/src/config/clinic.ts:60` has `emergencyNumbers: '998 (ambulance) or 999'` | file search |
| No test file exists anywhere in `anatomy-explorer/` | file tree |

**The `popstate` handler is the subtle one, and it is worth reading closely.** It already contains a guard: if the restored phase is `questions`, `safety-check`, `education` or `urgent-care` and there is no `regionId`/`zoneId`, it resets to `intro`. Somebody thought about this. But the guard checks whether a *region was chosen*, not whether the *gate was passed* — so a history entry for `education` with a region and zone set restores straight to the education screen with the gate never answered. The fix is not to patch that condition; it is to make gate state a precondition that every downstream phase checks, which is what `safety-gate.ts` is for.

## 5. Deliverables

**1. `src/lib/anatomy/safety-gate.ts` — the decision logic, pure.** No DOM, no Astro, no imports from a component. It implements the `SafetyState` / `SafetyDecision` API declared in `contracts/safety.ts`. The core is one function that takes the current safety state and returns whether exercise handoff is permitted. **The default is `blocked`.** An unanswered gate, an unrecognised option id, a malformed restored state and an explicit `unsure` all return the same thing: not permitted.
**Acceptance:** `canProceed(emptyState())` is false; `canProceed({answered:'unsure'})` is false; `canProceed({answered:'<garbage>'})` is false; `canProceed({answered:'none'})` is true; every one of the eight rule ids returns a `stop` decision naming that rule.

**2. `'unsure'` stops. It does not skip.** This is A-007's second clause and it is the single highest-value line in this handoff. Today "I'm not sure" advances the flow. It must instead land on a screen that says the app cannot make this judgement and directs the patient to their physiotherapist or urgent care — the same stop, worded for uncertainty rather than for a confirmed red flag. **Do not write that wording yourself.** Ship it as a `PLACEHOLDER_MARKER` slot with the H3 flag, exactly like the emergency number, and note it in `CROSS-MODULE-REQUESTS.md` for the H track.
**Acceptance:** no code path takes `unsure` toward exercise content; `grep -n "skip-safety" src/components/anatomy/SafetyGate.astro` returns nothing; the unsure copy contains `PLACEHOLDER_MARKER`.

**3. Remove the skip control entirely.** Not disabled, not hidden — absent. A control that exists in the DOM and is styled away is one CSS regression from being tappable, and one screen-reader from being announced.
**Acceptance:** the rendered gate has exactly the ten options from `SAFETY_CHECK_OPTIONS` (`none`, eight rules, `unsure`) and no eleventh control except an explicit Back that returns to the *previous* step, never forward.

**4. `src/components/anatomy/SafetyGate.astro` — the question screen and the stop screen.** Standalone, with **no import from `AnatomyLocator.astro`** (MODULE-MAP §5 sequencing: you land first, M4 mounts you afterwards). The eight `optionLabel` strings render **verbatim** from the data file. The stop screen uses `role="alert"`, is focusable, and takes focus on entry.
**Acceptance:** the component renders and typechecks with the monolith deleted from the tree; every option label is `===` to its `safety-rules.ts` value with no reformatting, no sentence-casing, no truncation; `astro check` is clean.

**5. One definition of the urgent copy.** The title and message come from `safety-rules.ts` and are rendered from it. Delete the duplicate literal from your markup — do not carry the monolith's hardcoded `<h2>` text across.
**Acceptance:** `grep -rn "needs urgent medical assessment" src/` returns exactly one hit, in `src/data/anatomy/safety-rules.ts`.

**6. The gate is unbypassable by history.** Gate state is a precondition, not a phase. Any downstream phase — education, exercise handoff, result — checks `canProceed()` on entry, including on `popstate` restore, and sends the patient back to the gate if it returns false. **The stop screen offers exactly one forward action: start over.** Reaching the stop screen and pressing Back must not land on a screen from which exercise content is reachable.
**Acceptance:** all four of these end at the gate or the stop screen, never at content — (a) answer a red flag, press Back; (b) answer a red flag, press Back then Forward; (c) deep-link a URL for a downstream phase with no gate answer; (d) restore a fabricated history state with `phase: 'education'`, a `regionId` and a `zoneId` but no safety answer.

**7. `src/config/emergency.ts` — one flagged constant.** The emergency number for the clinic's jurisdiction is **H3, open, and not yours to guess**. Ship the shape with `PLACEHOLDER_MARKER`, a comment naming H3, and an exported `missingEmergencyFields()` in the pattern of `patient-library/src/config/clinic.ts:63-67` so M1's compliance gate can report it. **`patient-library` has `'998 (ambulance) or 999'` — do not copy it.** It is right for the UAE and it is still unapproved for this app; the clinic's Medical Director signs the number *and the stop-screen wording* together, as one decision.
**Acceptance:** the file contains no digit sequence that could read as a phone number; a comment names H3; `missingEmergencyFields()` returns the unfilled keys; M1's `check:compliance` reports it as a launch blocker.

**8. Tests, written but not owned.** `tests/**` is M9's row. Write your unit cases as a fixture file inside your own module (or hand M9 the exact case list through `CROSS-MODULE-REQUESTS.md`) covering: the four `canProceed` defaults, all eight rule ids, and the four bypass attempts in deliverable #6. **Do not create `tests/`.**
**Acceptance:** the case list reaches M9 in writing; M9's suite can implement it without asking you a question.

## 6. What to copy from patient-library/, and what to change on the way

| Source | Take | Change on the way |
|---|---|---|
| `src/config/clinic.ts:20,49-67` | the placeholder discipline — one marker constant, a `missing*Fields()` reporter, a header block stating ACTION REQUIRED BEFORE LAUNCH | it is an emergency config, not a clinic config. `src/config/clinic.ts` is **M6's** file — do not create it. |
| `src/config/clinic.ts:60` | the *idea* that the emergency number is a named, single-sourced constant | **not the value.** `'998 (ambulance) or 999'` is unapproved for this app. |
| `src/components/Disclaimer.astro` | the pattern of a regulatory element that is not dismissible | it is M6's file; read it for the pattern, do not import or copy it |

**Do not copy** anything from `patient-library`'s content pipeline — the gate has no sheet dependency and must not acquire one.

## 7. Contracts

**What M3 consumes:** `contracts/safety.ts` from M0 — `SafetyRule`, `SafetySeverity`, `SafetyDecision`, `SafetyState`, and the gate API signatures. If the contract lacks something you need, **do not widen it**; file it in `CROSS-MODULE-REQUESTS.md`.

**What M3 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `SafetyGate.astro` | M4 | cannot delete the monolith — there is nothing to mount in its place |
| `canProceed()` / the gate API | M4, M5, M8 | no downstream phase can check its own precondition |
| `src/config/emergency.ts` | M1, M6, M9 | the compliance gate has no emergency field to report; M9 has no launch blocker to track |
| the bypass case list | M9 | the release checklist has no gate tests |

**The one-way rule with M4.** M4 mounts your component and may style it — spacing, type scale, token usage, responsive layout. **M4 may not change which options exist, what they say, what any answer does, or when the gate runs.** If M4 believes the gate needs to change, that is a `CROSS-MODULE-REQUESTS.md` entry addressed to you. This is written into M4's handoff as well, in both directions, deliberately.

## 8. Hard rules for this module

1. **Never reword a red-flag trigger.** The eight `optionLabel` strings ship verbatim. Not shortened for the layout, not sentence-cased, not "clarified". If one reads badly on a phone, that is a layout problem for M4 or a clinical question for the H track — never an edit.
2. **Never add a ninth trigger, and never remove one.** The list is clinical content and it is hers.
3. **Never write a clinician's name or a review date.** The `DRAFT_REVIEW` spread with empty `reviewedBy`/`reviewedDate` is correct and stays. An unreviewed rule is honest; a signed-off-looking one is a lie in a file.
4. **Never guess the emergency number or the stop-screen wording.** H3 is open. `PLACEHOLDER_MARKER` is the only acceptable value. A wrong emergency number on patient-facing material is worse than a visibly missing one.
5. **Default deny.** Every ambiguous state — unanswered, unrecognised, malformed, restored, `unsure` — blocks. If you find yourself writing a condition that lets an unknown case through, the condition is inverted.
6. **The gate is not a question.** No skip. No "I'm not sure" that routes onward. No exercise link on the stop screen. A-007.
7. **Do not edit `AnatomyLocator.astro`, `question-flow.ts`, `locator-state.ts`, `global.css`, or anything under `../patient-library/`.** Port behaviour out by reading; leave the source files alone.
8. **No diagnosis language anywhere** — including comments, identifiers, filenames and commit messages (D-001). The gate detects red flags; it does not name conditions.
9. **No analytics, no logging of an answer, no `localStorage` for gate state** (D-007). Only two `localStorage` keys are permitted in this app and neither is this. A record of which red flag a patient selected is health data; it does not leave the page.
10. **Builds cannot run over the Claude device bridge.** `node_modules` holds Windows native bindings and the bridge shell is Linux. **Say which checks you could not run. Never report a check as passed when the environment prevented it from running.**

## 9. Definition of done

- `safety-gate.ts` exists, is pure, is typed against `contracts/safety.ts`, and defaults to blocked in all four ambiguous cases.
- `SafetyGate.astro` renders the eight triggers verbatim plus `none` and `unsure`, with **no skip control in the DOM**, and typechecks standalone with the monolith absent.
- `unsure` stops. No code path takes it toward exercise content.
- The urgent title and message have exactly one definition, in `safety-rules.ts`.
- All four bypass attempts in deliverable #6 end at the gate or the stop screen.
- `src/config/emergency.ts` ships as a flagged placeholder naming H3, with no guessed number and no copied UAE value.
- The eight rules still carry `status: 'draft'` and empty review metadata.
- The bypass case list has reached M9 in writing.
- `git status --short`, from a real terminal, shows changes only in M3's four rows of MODULE-MAP.md §5.
- `memory.md` carries a decision entry for the `unsure`-stops change and for the emergency placeholder.
- `CROSS-MODULE-REQUESTS.md` carries: the `answerSafetyCheck` removal request to M4, the mount-don't-rewrite note to M4, and the unsure-wording item for the H track.

## 10. When you are blocked

**H3 is open and blocks launch, not you.** Ship the placeholder and move on. The whole point of the flagged-constant pattern is that the build proceeds while the approval is outstanding and cannot silently ship without it.

**The `unsure` wording is a clinical question you must not answer.** You know what the screen has to *do* — stop, and route to a human. What it *says* is the Medical Director's. Placeholder, flag, request, continue.

**If the monolith's gate behaviour is ambiguous, prefer the stricter reading.** Where the existing code and A-007 disagree, A-007 wins; where A-007 is silent, block. You will not be criticised for a gate that stops too often; report the case and let the clinician loosen it.

**If you cannot run a check,** say which one and why, in one sentence. Builds fail over the bridge for environment reasons that have nothing to do with the code.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue.
