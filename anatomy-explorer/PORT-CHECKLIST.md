# Port Checklist — Current Migration Status

**Verified:** 2026-08-27. `patient-library/` remains live, reference-only, and preserved
indefinitely. This is a parity checklist, not a deletion plan.

## Completed locally

- Cross-folder runtime imports removed.
- Areas/items snapshot copied locally and consumed through Astro collections.
- Zod 4 schemas, cross-row validation, shared compliance, and anatomy checks present.
- Sheet sync/preview plumbing, legal collection, disclosures, layout, tokens, and i18n scaffold present.
- Section, area, item, preview, legal, locator, and compatibility routes present.
- Exercise route naming resolved as singular `/exercise/` in `src/lib/section.ts`.
- `public/`, `scripts/`, QR generation, image approval gate, Vercel adapter, and sitemap configuration present.
- Historical M0–M9 handoffs are preserved under `handoffs/`; the active execution plan is
  `../MODULE-MAP.md` and `handoffs/AGENT-PROMPTS.md`.
- Three.js, `@types/three`, `tsx`, and `@astrojs/check` are declared and installed by `npm ci`.
- A draft one-region Three.js neck slice and draft full-body GLB are implemented locally.

## Present but unverified

- `npm run typecheck` completed successfully with 41 files and 0 errors.
- Compliance, anatomy, image, asset, route, and full-build verification have not completed successfully.
  Under Node 24.13.0, the `tsx` launcher fails before project execution with `uv_os_get_passwd ENOMEM`.
- Live-sheet reproduction requires secure local `SHEET_ID` configuration. Never place secrets in docs
  or commits and never casually copy API keys.
- Preview behavior and all generated routes still need browser-level verification.
- Deployment domain, Vercel root directory, and rollback behavior need an explicit release test.

## Remaining stabilization work

- [x] Fail publication when review metadata is absent; five published items currently fail that policy.
- [x] Prevent draft safety wording from reaching patient routes until clinician approval.
- [x] Make `check-images.ts` fail on missing published media or missing required directories.
- [x] Hide unpublished areas rather than rendering patient-facing “Coming soon” cards.
- [x] Remove inferred first-two-item priority; add an explicit sheet/schema field only after clinician approval.
- [x] Resolve whether direct handbook routes require the same blocking safety gate as locator routes.
- [x] Implement and source-review compliance coverage for anatomy regions, zones, education labels, alt text, and patient-visible fields.
- [x] Implement a rendered-route crawler for canonical routes, compatibility routes, legal pages, print views, QR targets, and preview isolation.
- [x] Command-verify compliance coverage and complete a successful post-build rendered-route crawl.
- [x] Implement a draft one-region Three.js neck vertical slice with semantic fallback.
- Complete rendered desktop/mobile/canvas/accessibility QA and clinician visual approval for the slice.

## Never port

- Hand-authored clinical-content scripts such as `add-lowerback.js`.
- The stale service worker, unused `openai` dependency, boilerplate agent files, or stale handoff.
- Any analytics configuration.
- Rejected media as patient-approved content.

## Port-complete definition

- No `anatomy-explorer/src` import references `patient-library`.
- Sheet sync reproduces validated local data without manual edits.
- Compliance/anatomy/image gates fail deliberately bad fixtures and pass reviewed content.
- Published rows always contain genuine clinician review metadata.
- Legal disclosures and clinician preview render correctly.
- All patient links, QR targets, print views, and fallback routes resolve.
- The surviving app builds/deploys independently, while `patient-library/` remains untouched.
- Both folders are committed and pushed from a real terminal.

## Repository safety

Both folders are currently untracked. Never run `git clean -fd`, `git clean -fdx`, or
`git checkout -- .`. Before finishing any task, run `git status --short` and confirm no config,
lockfile, root workflow, or `patient-library/` file changed unintentionally.
