# Supervisor Protocol

## Role

The supervisor owns scope, sequencing, interface contracts, visual coherence, and final acceptance.
Builders implement modules; reviewers report findings; the supervisor decides whether evidence is sufficient.

## Before dispatch

- Confirm the module's exact outcome, owned files, forbidden files, dependencies, and acceptance criteria.
- Give the agent the root `AGENTS.md`, local `AGENTS.md`, `MODULE-MAP.md`, and its prompt.
- Record the starting `git status --short` and current revision when available.
- Never dispatch two agents that own the same file.

## Review sequence for every output

1. Scope audit: compare changed files with assigned ownership.
2. Product audit: verify the result serves clinician handoff and patient comprehension.
3. Clinical audit: no invented content, draft leakage, diagnosis language, or weakened safety.
4. Technical audit: inspect implementation, error states, fallback, performance, and maintainability.
5. Visual audit: inspect desktop/mobile screenshots and interaction states.
6. Accessibility audit: keyboard, semantic path, focus, zoom, reduced motion, and non-WebGL completion.
7. Verification audit: reproduce the claimed checks or mark them unverified.
8. Integration audit: confirm routes/contracts consumed by other modules remain stable.

## Finding format

Use severity `P0` launch/safety, `P1` major workflow, `P2` quality/maintainability, `P3` polish.
Each finding names file/line, observed behavior, expected behavior, evidence, and owning module.

## Acceptance states

- **Accepted:** criteria and evidence complete.
- **Accepted with follow-up:** no safety/launch issue; bounded backlog recorded.
- **Changes required:** owner must revise before integration.
- **Blocked:** human decision or external dependency prevents completion.

## Visual ownership

The supervisor personally owns V1 and V2: design-system application, responsive composition,
2D locator presentation, Three.js scenes, camera/highlight behavior, animation, visual assets, and
rendered screenshot/canvas verification. Other agents may build supporting contracts but may not
redesign these surfaces.

## Final release decision

Release requires executable automated checks, clinician approvals, route crawl, visual QA,
keyboard/non-WebGL completion, performance evidence, content parity, preview isolation, and tested
rollback. Open clinical/regulatory blockers always produce a no-go.
