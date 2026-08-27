Start work on a module. Argument: the module id, e.g. `/module M3`.

1. Read, in this order and in full: `HANDOFF.md`, `memory.md`, `MODULE-HANDOFF.md`, and
   `handoffs/<ID>-*.md`.
2. State back: which files you own, which defect you are fixing, and what you will NOT touch.
3. Inspect every file in your scope and report what you actually found — not what you expected.
4. State the change you intend to make, then make it as one cohesive patch.
5. Run `npm run typecheck` and `npm run build`. Run `npm run check:anatomy` if it exists.
6. Report: exact paths changed, real check output, anything you could not do, and any file
   outside your ownership you believe needs changing.

Do not continue into another module's work. Stop when your acceptance criteria are met.
