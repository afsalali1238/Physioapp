# Anatomy Explorer

Unified Astro application combining an interactive anatomy locator with the clinician-reviewed
stretching and exercise library.

## Run it

From this folder:

```text
npm run dev
```

The current product direction provides:

- a full-body 3D locator on capable devices, with front/back views, highlight, zoom, and regional detail;
- exact-zone confirmation only where reviewed content makes precision useful;
- synchronized simple-map and semantic-list paths for accessibility and fallback;
- a data-driven, non-diagnostic safety gate with urgent interruption;
- clinician-reviewed area education and direct stretching/exercise routes;
- build-time schema, anatomy, image, and banned-language validation;
- keyboard activation, visible focus, live announcements, reset, reduced motion, and 200% zoom;
- an always-available simple-view fallback with no WebGL dependency.

There are no analytics, accounts, remote calls, free-text health histories, or server-side selection persistence. Selections remain in memory for the current page session. Safety rules and urgent copy require clinician review before publication. No exercise handoff occurs after an interruption.

## Dependency note

The app uses Astro, TypeScript, and a focused Three.js island for the 3D locator. Renderer and loader dependencies must remain scoped to the anatomy route; no analytics package or medical-data service is permitted.

## Documentation

Start with `HANDOFF.md`, then `PRD.md`, `PRODUCT-BLUEPRINT.md`, `UX-FLOWS.md`, `ARCHITECTURE.md`,
`ANATOMY-DATA-SCHEMA.md`, `CLINICAL-SAFETY.md`, `3D-TECHNICAL-ARCHITECTURE.md`,
`ASSET-PIPELINE.md`, and `BUILD-PLAN.md`. Superseded plans and prompts are preserved in
`docs/archive/legacy-2026-08-26/` and are not implementation instructions.
