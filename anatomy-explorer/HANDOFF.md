# Handoff — Unified Anatomy Explorer

**Updated:** 2026-08-27  
**State:** Strong unified product contract; substantial 2D/library foundation; not launch-ready.

## Product

Anatomy Explorer is a clinic-guided physiotherapy handbook. A clinician can share a stable area or
exercise link, QR code, or printout. Patients can also browse head-to-toe or use the body locator.
The full-body 3D human is the signature exploration experience, with a complete semantic/2D path.

`../patient-library/` remains live, reference-only, and the rollback reference. Never edit it.

## Implemented foundation

- Local areas/items snapshot with schemas and cross-row validation.
- Shared compliance, image validation, and anatomy checks.
- Legal content, footer, disclaimer, text-size controls, and design tokens.
- Home, locator, area, section, item, legal, clinician preview, and clinic mode (`/clinic`) routes.
- Central singular `/exercise/` route mapping.
- Clinic handoff panel with instant search, copy link, dynamic QR codes, patient view, and print handouts (Module H1).
- Handbook search dialog with keyboard navigation and grouped results (Module H1).
- Deep-link anchor auto-scroll, card highlighting, and focus management (Module H1).
- Enforcing image check failure on missing published assets (`check-images.ts`).
- Unpublished "Coming soon" cards hidden from patient section indexes (Module S1).
- Inferred item priority removed from exercise views (Module S1).
- Draft safety wording isolated from patient routes (`RedFlags.astro`).
- Locator-to-area server-rendered handoff and accessible non-3D interaction.
- One-region Three.js neck slice with a draft registry-backed GLB, progressive capability check,
  error state, orientation controls, and semantic fallback.

These bullets describe implementation, not acceptance. H1, V1, and V2 are source-reviewed but do
not yet have complete visual evidence or human approval.

## Immediate blockers

1. Verify all `tsx` gates in a supported target runtime. Dependencies are installed, but Node 24.13.0
   crashes before checker execution with `uv_os_get_passwd ENOMEM`.
2. Obtain clinician input / sign-off for review metadata (`reviewed_by` and `reviewed_date`).
3. Obtain clinician review for the draft safety rules in `RedFlags.astro`.
4. Render and verify the implemented Three.js neck slice at 360px and desktop, including canvas,
   loading, error, reduced-motion, keyboard, and non-WebGL fallback states.
5. Obtain clinician/visual approval for region boundaries and orientation; keep all assets draft until then.
6. Complete a successful build and rendered route crawl, including legal/preview isolation.

The proposed implementation defaults and exact review copy for the eight human decisions are in
`docs/LAUNCH-DECISION-PACK.md`. They enable preview work but do not constitute human approval.

## Next product slice

After stabilization, take the implemented neck slice through verification and human review end-to-end: full-body 3D load,
highlight/zoom, optional meaningful precision, location confirmation, safety, area education, and
handoff to published stretches/exercises. Prove the same content through deep link, QR, print, and
semantic fallback. Then conduct clinician review and five observed patient tests.

## Verification truth

Do not claim typecheck, build, compliance, anatomy, image, accessibility, browser, or visual checks
passed unless they actually ran. The app folders are untracked; preserve them and avoid destructive
git commands.

Latest command truth: `npm ci` succeeded; `npm run typecheck` passed with 41 files and 0 errors;
`npm run build` failed in `prebuild`; compliance, anatomy, image, asset, and route gates have not
completed successfully in the current Node 24.13.0 environment.
