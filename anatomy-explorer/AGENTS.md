# AGENTS.md — `anatomy-explorer/`

This is the unified build target. The canonical rules in [`../AGENTS.md`](../AGENTS.md) win.
`../patient-library/` is live, reference-only, and must never be edited or deleted.

## Non-negotiables

- Clinical content comes from the physiotherapist's Google Sheet; generated JSON is not hand-edited.
- Never invent clinical wording, reviewer names, dates, diagnoses, or outcome claims.
- Never weaken compliance or safety checks.
- Navigation is by body area. No accounts, analytics, tracking, backend, or health storage.
- Use the 17px base scale and head-to-toe ordering.
- Copy code/data locally; never import across the folder boundary.

## Current baseline — 2026-08-27

The app has local content, schemas, cross-row validation, compliance and anatomy checks, legal
pages, shared UI, preview routes, section/area/item routes, public assets, and QR tooling. The
A-014 home has three equal entrances. Exercise URLs deliberately use singular `/exercise/`,
centralized in `src/lib/section.ts`. The one-region Three.js neck slice, its draft GLB, `tsx`, and
`@astrojs/check` are present. Decisions are current through A-021 in `memory.md`.

Status words are not interchangeable:

- **Implemented:** code or an asset exists in the working tree.
- **Source-reviewed:** a supervisor inspected the implementation.
- **Command-verified:** the named command completed successfully in the stated environment.
- **Visually verified:** successful rendered desktop/mobile evidence was inspected.
- **Human-approved:** the relevant clinician, regulatory owner, or visual reviewer explicitly approved it.

## Release blockers

- The Three.js neck vertical slice is implemented and source-reviewed, but not visually verified or human-approved.
- `tsx` and `@astrojs/check` are installed after `npm ci`; `npm run typecheck` passed with 41 files and 0 errors.
- Every `tsx`-based gate currently crashes before project execution under Node 24.13.0 with `uv_os_get_passwd ENOMEM`.
- Five published items have empty review metadata.
- Draft safety wording remains an open clinician gate and must not be represented as approved.
- H1 and V1 lack complete current 360px, desktop, keyboard, and accessibility evidence packets.
- Clinical, regulatory, asset-boundary, and visual approval remain open human gates.

The latest typecheck may be reported exactly as command-verified. Do not report the aggregate check
suite, build, visual QA, human approval, or launch readiness as passed until each one completes.

## Read order

1. `HANDOFF.md`
2. `memory.md`
3. `PRD.md`
4. `CLINICAL-SAFETY.md`
5. `ARCHITECTURE.md`
6. `ANATOMY-DATA-SCHEMA.md`
7. `3D-TECHNICAL-ARCHITECTURE.md`
8. `ASSET-PIPELINE.md`
9. `MEDIA-PLAN.md`
10. `BUILD-PLAN.md`

`docs/archive/legacy-2026-08-26/` is historical only. Append real decisions to `memory.md`.

## Repository safety

Both app folders are untracked in the current worktree. Never run `git clean -fd`,
`git clean -fdx`, or `git checkout -- .`. Run `git status --short` before finishing. Git writes
and builds may fail over the device bridge; report the exact limitation honestly.
