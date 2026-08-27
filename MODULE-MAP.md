# Anatomy Explorer — Multi-Agent Build Map

**Version:** 2.0 · **Verified:** 2026-08-27  
This replaces the stale M0–M9 ownership plan. Historical handoffs remain reference material only.

## Operating model

One supervisor accepts work. Each builder owns a narrow module and returns an evidence packet.
No builder edits `patient-library/`. No builder changes config, dependencies, contracts, or another
module's files without stopping and requesting approval.

## Modules

| ID | Module | Agent | Depends on | Outcome |
|---|---|---|---|---|
| **S0** | Stabilization and executable gates | Hermes / GLM 5.3 | — | Real check suite, publication guards, route crawl baseline |
| **S1** | Content, safety, and clinical workflow | Hermes / GLM 5.3 | S0 | Draft/published isolation, consistent safety behavior, clinician-review workflow |
| **H1** | Handbook, share, QR, and print | Antigravity / Gemini | S0, S1 contracts | Fast clinic handoff and direct patient use |
| **V1** | Visual system and 2D locator | Codex supervisor | S0 | Polished responsive UI and complete accessible locator |
| **V2** | 3D locator and visual media | Codex supervisor | V1, H5 clinical visual review | Full-body 3D highlight/zoom and approved media pipeline |
| **Q1** | Independent review | Claude | each module | Findings-only clinical/product/code review |
| **R1** | Integration and release evidence | Supervisor + Hermes | all | Cross-module integration, browser QA, go/no-go report |

## Wave order

1. **Wave A:** S0 only. Freeze the toolchain and make automated evidence trustworthy.
2. **Wave B:** S1 and V1 may proceed in parallel after S0 acceptance.
3. **Wave C:** H1 proceeds after S1 contracts settle. V2 begins with a one-region prototype.
4. **Wave D:** Q1 reviews each output; owners fix findings; R1 performs integration and release QA.

## Ownership

- **S0:** check scripts, test configuration, dependency/config changes explicitly approved for this module,
  route crawler, release-gate wiring.
- **S1:** schemas, library filtering, safety state/routing, preview publication boundaries, clinical-review UI.
- **H1:** clinic handoff UI, search, copy-link, QR presentation, print templates, deep-link behavior.
- **V1:** page composition, shell styling, responsive layout, 2D/semantic locator, visual states.
- **V2:** Three.js island, model registry/loaders, camera/highlight interaction, media presentation and visual assets.
- **Q1:** read-only review output. Claude does not edit implementation files.
- **R1:** integration fixes only after assigning each finding to the owning module.

Existing files keep their current owner when obvious. If two modules need one file, the supervisor
chooses one owner before either edits it. Shared files are never edited concurrently.

## Acceptance packet required from every builder

1. Files changed and why.
2. Acceptance criteria completed.
3. Commands actually run, with result.
4. Screenshots for every patient-facing change at 360px and desktop.
5. Accessibility/keyboard result for interactive work.
6. Known limitations and unverified claims.
7. `git status --short` scope check.
8. No edits to `patient-library/`.

## Supervisor acceptance gate

The supervisor rejects a module when it changes files outside scope, weakens compliance/safety,
invents clinical content, exposes draft data, lacks visual evidence, or reports a check as passed
when it did not run. “Looks good” is not acceptance evidence.

## Human gates

Before production, obtain explicit answers for regulatory classification, emergency/stop wording,
disclaimer approval, media source/style, region-highlight accuracy, domain, start-here selection,
and final page structure. Build placeholders may exist; patient publication may not bypass these gates.

## Repository safety

The two app folders are untracked. Never use destructive clean/checkout commands. Commit both trees
from a real terminal before parallel branches are created.
