# Anatomy Explorer — Parallel Handoff Tasks

Use these prompts in separate GPT-5.6 Sol coding chats. Set the working directory to `anatomy-explorer` for every task.

## Coordination rules

- The existing application at the repository root is reference-only. Do not modify it.
- Read `README.md`, `HANDOFF-BUILD-PROMPT.md`, `IMPLEMENTATION-BACKLOG.md`, `CLINICAL-SAFETY.md`, and `ANATOMY-DATA-SCHEMA.md` before editing.
- Inspect the current working tree first; preserve existing changes.
- Run `npm run typecheck` and `npm run build` before finishing.
- Keep all clinical content explicitly marked `draft` until a physiotherapist approves it.
- Do not add analytics, accounts, remote symptom storage, or free-text medical history.
- If another task has already changed a file in your scope, adapt to it instead of replacing it.
- Report changed files, checks run, blockers, and the next recommended task.

## Task 1 — Safety-aware symptom flow

```text
Build the next vertical slice for Anatomy Explorer: a controlled symptom-question and red-flag interruption flow after the existing pain-location confirmation.

Scope:
- Add a data-driven question model under `src/data/anatomy/`.
- Add a pure state-machine/helper module under `src/lib/anatomy/` for question answers, red-flag evaluation, reset, and browser-history-safe transitions.
- Extend the existing locator UI only as needed to render one question per screen/card after location confirmation.
- Add an urgent-care interruption screen that stops the exercise handoff whenever a configured red flag is selected.
- Support “Skip”, “Back”, “I’m not sure”, and “Start over”.
- Use controlled answers only: no free-text fields.
- Keep all answers local to the current browser session; do not send or persist health data remotely.
- Include accessible focus management, live announcements, keyboard operation, reduced-motion support, and 44px targets.

Required red flags from `CLINICAL-SAFETY.md`:
- chest pain or difficulty breathing
- sudden weakness or facial drooping
- loss of bladder or bowel control
- major injury or suspected fracture
- new numbness or progressive weakness
- severe, rapidly worsening pain
- fever with severe pain or swelling

Clinical wording must be cautious and educational. Never diagnose, triage beyond the approved urgent-care copy, or recommend exercises after a red flag.

Do not implement education content, exercise mapping, Three.js, authentication, analytics, or changes outside `anatomy-explorer`.

Acceptance criteria:
- A normal answer path reaches a placeholder education step.
- Any configured red flag reaches urgent-care interruption and cannot reach exercises.
- Refresh/back/reset do not produce impossible states.
- `npm run typecheck` and `npm run build` pass.
```

## Task 2 — Clinical education content and validation

```text
Create the draft, data-driven educational content layer for Anatomy Explorer.

Scope:
- Add schemas and typed data under `src/data/anatomy/` for region education, pain patterns, review metadata, and red-flag copy.
- Start with neck, shoulder, and lower-back entries only.
- Use sections: plain-language overview, structures, normal function, common non-diagnostic patterns, aggravators, what to watch for, when to seek care, and clinician review status.
- Add build-time validation that rejects missing required fields, invalid region/zone IDs, invalid review status, future/invalid review dates, and banned diagnostic phrases.
- Keep all entries `draft` unless a real reviewer/date is supplied; do not invent clinician names or approval.
- Add a small education screen that is reachable from the completed safety flow, but do not add exercise links yet.

Use the exact clinical boundaries in `CLINICAL-SAFETY.md`. Prefer wording such as “can sometimes be related to” and “this information cannot identify the cause”.

Do not modify the existing exercise library, implement red-flag logic, add Three.js, or alter root application files. Keep UI changes limited to the new education screen and its styles.

Acceptance criteria:
- Neck, shoulder, and lower-back draft entries render from data.
- A validation command or build step fails for banned diagnosis language and broken references.
- Content clearly shows draft/review status.
- `npm run typecheck` and `npm run build` pass.
```

## Task 3 — Exercise-library handoff and mapping

```text
Connect Anatomy Explorer to the existing validated exercise content without creating a second exercise database.

First inspect the root reference files (`src/data/areas.json`, `src/data/items.json`, schemas, and exercise routes) but do not modify them.

Scope inside `anatomy-explorer`:
- Add a local adapter/import contract that references existing exercise IDs, titles, and approved fields.
- Add `pain_pattern_exercises`-style mapping data for the initial neck, shoulder, and lower-back patterns.
- Validate that every referenced exercise ID exists in the imported/reference snapshot and that retired or missing IDs fail the build.
- Render a “general exercises for this area” handoff after education, with cautious copy and a clear instruction to follow the physiotherapist’s programme.
- Include empty-state and “I’m not sure” paths.
- Keep dosage/cautions sourced from the authoritative exercise content; do not invent or rewrite clinical instructions.

Do not modify root files, add accounts or tracking, implement new diagnosis logic, or build Three.js.

Acceptance criteria:
- Valid mappings render exercise cards/links.
- Broken IDs fail validation.
- No exercise recommendation is reachable from the red-flag interruption state.
- `npm run typecheck` and `npm run build` pass.
```

## Task 4 — Accessibility, responsive, and performance hardening

```text
Audit and harden the current Anatomy Explorer first vertical slice and any completed safety/education flow.

Scope:
- Test at 360px, 390px, tablet, desktop, keyboard-only, 200% zoom, reduced motion, and no-WebGL/simple-view conditions.
- Fix semantic HTML, focus order, focus visibility, heading hierarchy, SVG labels, button names, aria-pressed state, live-region announcements, and escape/back behavior.
- Ensure all interactive targets are at least 44px and no horizontal scrolling occurs at 360px.
- Add lightweight automated checks where practical (build-time or test script), without introducing a large dependency set.
- Review CSS for layout shifts and unnecessary animation.
- Verify no health data leaves the browser and no analytics are introduced.

Prefer editing `src/styles/global.css`, existing Astro components, and small test/config files only. Do not redesign the product, alter clinical copy, add exercise mappings, or implement Three.js.

Acceptance criteria:
- Document exact checks and viewport results.
- Keyboard users can complete every available path.
- Reduced-motion users get equivalent functionality.
- `npm run typecheck` and `npm run build` pass.
```

## Task 5 — 3D progressive enhancement foundation (after Tasks 1–4)

```text
Add a progressive-enhancement 3D foundation without making WebGL required.

Read `3D-TECHNICAL-ARCHITECTURE.md` and `ASSET-PIPELINE.md` first.

Scope:
- Add capability detection for WebGL, reduced motion, and low-power/slow-device fallback.
- Create a lazy-loaded anatomy viewer island with a simple-view fallback that remains fully functional.
- Add placeholder asset manifest/types and loading/error states; do not check in large binary models yet.
- Keep region IDs and selection semantics identical to `src/data/anatomy/body-regions.ts`.
- Add reset, front/back, zoom, and dispose/unmount behavior behind the existing semantic control bridge.
- If WebGL or an asset is unavailable, return cleanly to the SVG/simple view.

Use the smallest justified dependency set and explain each dependency. Do not add organ/nerve systems, diagnosis, analytics, remote health-data storage, or alter the root app.

Acceptance criteria:
- Simple view works with JavaScript disabled or WebGL unavailable.
- Viewer loading failure is recoverable.
- Keyboard and screen-reader users never depend on canvas interaction.
- `npm run typecheck` and `npm run build` pass.
```

## Recommended order

Run Task 1 first. Task 2 can follow once its education entry point exists. Run Task 3 after the root exercise contract is understood. Run Task 4 after each UI wave. Run Task 5 only after the 2D, safety, education, and mapping flows are stable.
