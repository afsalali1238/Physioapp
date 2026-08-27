# GEMINI.md — `anatomy-explorer/`

**Read [`AGENTS.md`](./AGENTS.md) in this folder, then [`../AGENTS.md`](../AGENTS.md) for the
repository-wide rules.** This file is a pointer, not a rules file. Do not add rules here.

**You are in the build target.** `../patient-library/` is live and reference-only: read it, copy
out of it, never write to it, never delete it. Do not `import` across the folder boundary —
`src/lib/library.ts` currently does, and it needs replacing, not extending.

Never invent clinical content; anything clinical ships as `status: draft` with empty `reviewed_by`,
and never carries a clinician's name or a review date. Never relax the compliance rules — fix the
content instead. Never run `git clean -fd` here: this folder is untracked and has no reflog.
