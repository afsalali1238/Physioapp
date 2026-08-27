# Handoff Prompt — Start Building Anatomy Explorer

Copy the prompt below into a new GPT-5.6 Sol coding task with this folder as the working directory.

```text
You are taking over a new, separate product build called Anatomy Explorer.

WORKING DIRECTORY
Build only inside the `anatomy-explorer` folder. The existing application at the repository root is reference material only. Do not modify, delete, move, or merge the existing root application files.

PRODUCT
Build a mobile-first interactive anatomy and pain-location education experience.

The user journey is:

1. User chooses “Find where it hurts”.
2. User sees a full-body human locator.
3. User taps a broad region.
4. The selected region highlights and zooms.
5. User selects an approximate exact zone.
6. The app asks: “Is this the exact place you feel discomfort?”
7. User can confirm, change the selection, or choose “I’m not sure”.
8. The app performs a short, controlled safety-aware symptom flow.
9. The app shows cautious educational information about the area.
10. The app links to clinician-reviewed stretches and exercises.

CLINICAL BOUNDARIES

- This is not a diagnostic tool.
- Never tell the user what condition they have.
- Never generate patient-specific medical advice.
- Never invent exercise dosage, contraindications, red flags, or clinical claims.
- Never recommend an exercise after a configured red flag is triggered.
- All clinical copy must remain draft content until reviewed by a physiotherapist.
- Do not collect names, accounts, free-text medical histories, or server-side symptom data.

READ THESE FILES FIRST

- `ANATOMY-PRODUCT-INDEX.md`
- `PRODUCT-BLUEPRINT.md`
- `UX-FLOWS.md`
- `CLINICAL-SAFETY.md`
- `ANATOMY-DATA-SCHEMA.md`
- `3D-TECHNICAL-ARCHITECTURE.md`
- `ASSET-PIPELINE.md`
- `IMPLEMENTATION-BACKLOG.md`
- `../PRD.md`
- `../memory.md`
- `../docs/CONTENT-SCHEMA.md`
- `../docs/DESIGN-SYSTEM.md`

REFERENCE REPOSITORY

Review `https://github.com/afsalali1238/body-path-finder.git` for product ideas and draft data structures.

Useful concepts to study there:

- body-region taxonomy and search keywords
- front/back views and approximate region focus points
- the guided progress flow: locate pain → confirm location → understand it → move safely
- anatomy education sections such as structures, normal function, common scenarios, aggravators, and when to seek care
- exercise metadata such as goal, difficulty, steps, breathing, mistakes, modifications, and cautions
- the calm navy, ivory, teal, and coral visual direction

Do not copy that repository wholesale. It is a reference and appears to be primarily a product scaffold/specification rather than a completed 3D implementation. Do not copy its unreviewed clinical content directly into published content. Do not copy its large dependency set unless a dependency is justified for this separate build. Use the existing root exercise-library content as the authoritative exercise reference.

FIRST BUILD TARGET

Implement only the first vertical slice:

- Create an independent app scaffold inside `anatomy-explorer`.
- Use a simple, accessible 2D SVG or illustrated body map first.
- Support front and back views.
- Implement body-region selection for neck, shoulder, upper back, lower back, hip, knee, ankle, wrist, and foot.
- Implement region highlighting.
- Implement region confirmation.
- Implement “choose another area” and “I’m not sure”.
- Add a semantic region list so the canvas/map is never the only interaction method.
- Add responsive behavior for 360px width, tablet, and desktop.
- Do not implement Three.js yet.
- Do not add clinical diagnosis content yet.
- Use placeholder education entries marked as draft if the UI needs them.

TECHNICAL EXPECTATIONS

- Prefer a clean, maintainable TypeScript architecture.
- Keep the new app independent from the root app.
- Use data-driven region definitions rather than hardcoding page behavior.
- Keep the simple view as a permanent fallback for WebGL and low-power devices.
- Maintain keyboard navigation, visible focus, screen-reader labels, reduced-motion support, and 44px minimum targets.
- Do not add analytics, tracking, or remote health-data persistence.
- Keep dependencies minimal and explain every new dependency.

WORKING METHOD

1. Inspect the current `anatomy-explorer` folder and the listed reference files.
2. State the proposed file structure before editing.
3. Implement only the first vertical slice.
4. Use small, reviewable patches.
5. Run the relevant typecheck, lint, build, and accessibility checks.
6. If a check cannot run, report the exact environmental blocker.
7. Do not silently change clinical wording or existing root files.
8. End with a concise report containing changed files, verification results, and the next backlog item.

DEFINITION OF DONE FOR THIS TASK

- The new app runs independently from `anatomy-explorer`.
- The body map is usable on a 360px phone viewport.
- Front/back selection works.
- All listed regions can be selected by map and semantic controls.
- Selected regions have visible and textual state.
- Confirmation and escape paths work.
- Keyboard users can complete the same flow.
- Reduced motion does not break the flow.
- The root application has no modified, deleted, or newly generated files because of this task.
```

## First task to send after the scaffold

```text
Begin the first vertical slice described in HANDOFF-BUILD-PROMPT.md. Do not implement 3D yet. Build the independent 2D locator, run the checks, and stop when the definition of done is met.
```
