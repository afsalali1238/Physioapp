# Unified Build and Migration Plan

## Principle

Build one vertical slice, obtain clinical review, then expand. Do not migrate the live deployment until the unified app has a rollback path and content parity.

## Phase 0 — Contract and baseline

Confirm routes, preserve `patient-library/` as the live reference, reconcile stale anatomy documentation, and implement the unified data contract.

**Status:** Contract, local snapshot, routes, schemas, legal content, and baseline checks are
present. Before 3D work, close the stabilization gate: install/verify executable checks; block
published rows without review metadata; resolve draft safety rendering; make missing published
images fail; hide unpublished areas; remove inferred first-two priority; align locator/direct-route
safety; and crawl every generated route.

## Phase 1 — Shared content pipeline

Normalize areas/items, import only published rows into a build-time snapshot, validate anatomy mappings, enforce unified compliance, and check images and orphan references.

## Phase 2 — Vertical slice and observed validation

Use neck or shoulder: unified home; simple map first; compressed full-body 3D upgrade; broad-region highlight and camera zoom; exact-zone confirmation; safety gate and stop screen; result page; one stretching area; one exercise area; real cards with images, dosage, safety, print, and local controls. Stop for clinician phone review.

Produce one approved-design still workflow and one draft motion demonstration. Validate poster
fallback, explicit playback, reduced motion, off-screen pause, mobile performance, and movement-review
tooling before generating motion for the wider corpus.

The vertical slice must also prove the handbook workflow: stable exercise deep link, area chapter,
exercise anchor highlighting, clinician copy-link action, QR generation, printable handout, and a
scan that opens directly at the intended content.

Before expanding, require phone/tablet review by the physiotherapist, five representative patient
tests, one semantic-list completion, one low-power fallback completion, and a debrief showing users
did not interpret the result as diagnosis or personalized prescription. Keep exact zones only if
users understand their purpose and they change reviewed content.

## Phase 3 — Core hardening

Complete published mappings. Add themes, text scale, reduced motion, keyboard/screen-reader QA, print, QR generation, PWA shell, selective caching, and CI for typecheck, lint, schema, compliance, image, anatomy, unit, and browser smoke tests.

Add a noindex draft-review surface with provenance, side-by-side text/media comparison, approve/reject
state display, contact-sheet review, and no route from the patient application.

## Phase 4 — Clinician workflow and migration

Add the unlisted clinic handoff mode with search, Copy link, Show QR, Print, and Open patient view.
Prove one sheet update without code. Compare unified output against the live library route-by-route.
Deploy preview, obtain approval, test rollback, then switch production.

## Phase 5 — Enhancements after the core 3D flow

Additional regional 3D layers, approved everyday-language search, Arabic after native review, and live draft preview isolated from production.

## Definition of done

No patient route depends on a runtime API; every map region resolves to published content; the safety stop cannot be bypassed; direct browsing remains available; compliance is enforced; the clinician can update content without code; and git status contains only intentional migration changes.
