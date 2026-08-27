# Anatomy Product Documentation

Documentation index for the unified interactive anatomy and physiotherapy education application.

The unified app combines the anatomy locator and the exercise library. During migration, the live
library in `../patient-library/` remains the source and rollback target. The 3D human is the
signature capable-device experience; the simple map and semantic controls are a complete equivalent.

## Start here

1. `HANDOFF.md` — the implementation entry point.
2. `memory.md` — decision log, including A-011 unification.
3. `ARCHITECTURE.md` — unified build boundaries and performance.
4. `BUILD-PLAN.md` — implementation and migration gates.

## Product and clinical

- `PRD.md` — scope, users, what ships in v1 and what deliberately does not
- `PRODUCT-BLUEPRINT.md` — unified product direction and principles
- `UX-FLOWS.md` — screens, states, interaction rules
- `CLINICAL-SAFETY.md` — red flags, banned language, review workflow. **Authoritative.**
- `CLINICIAN-QUESTIONS.md` — what only the physiotherapist can answer, and what it costs to wait

## Technical

- `ANATOMY-DATA-SCHEMA.md` — data structures and content contracts
- `3D-TECHNICAL-ARCHITECTURE.md` — rendering, interaction, fallback strategy
- `ASSET-PIPELINE.md` — model production, optimisation, licensing, review
- `MEDIA-PLAN.md` — still-first imagery, optional motion, poster/reduced-motion rules
- `README.md` — how to run the app and what is currently implemented
- `reference/body-geometry/` — verified joint table and hotspot geometry, with the render it was
  checked against

## Build

- `.claude/` — control layer: CLAUDE.md, permissions, hooks, commands, subagents
- `../RESTRUCTURE.md` — moving the live app into `patient-library/`
- `docs/BUILD-READINESS-REVIEW.md` — pre-build audit, scores, blockers, and go decision
- `docs/SUPERVISOR-PROTOCOL.md` — acceptance and integration protocol
- `docs/LAUNCH-DECISION-PACK.md` — proposed defaults, exact draft copy, and human approval gates
- `handoffs/AGENT-PROMPTS.md` — copy-ready prompts for each build/review agent
- `../MODULE-MAP.md` — current multi-agent ownership and wave plan

## Current delivery handoffs

The current execution plan is `../MODULE-MAP.md` plus `handoffs/AGENT-PROMPTS.md`. The older
M0–M9 packets are detailed historical inputs and must be revalidated against the current tree
before reuse. The archive is historical only.

## Archived material

`docs/archive/legacy-2026-08-26/` preserves the earlier anatomy-only 2D-first prompts, backlog,
module briefs, and agent assignments. They remain recoverable historical material but are not
authoritative for implementation.

## Inherited, still governing

- `../patient-library/memory.md` — D-001..D-028, including **D-015**, the image test that found
  five of nine generated illustrations clinically wrong while all nine looked professional
- `../patient-library/docs/CONTENT-SCHEMA.md` — the exercise content contract
- `../patient-library/docs/DESIGN-SYSTEM.md` — tokens, type scale, card anatomy

## Product rule

The anatomy locator must never become an unreviewed diagnostic engine. It is a navigation and
education layer that helps a person identify an area of concern and reach safe, approved
information.
