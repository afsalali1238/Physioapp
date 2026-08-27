# CLAUDE.md — `anatomy-explorer/`

**Read [`AGENTS.md`](./AGENTS.md) in this folder, then [`../AGENTS.md`](../AGENTS.md) for the
repository-wide rules.** This file is a pointer, not a rules file. Do not add rules here.

Folder-specific Claude settings live in `.claude/` — including the `Write(../patient-library/**)`
deny, which is correct and must stay.

**You are in the build target.** `../patient-library/` is live and reference-only: read it, copy
out of it, never write to it, never delete it. Do not `import` across the folder boundary —
`src/lib/library.ts` currently does, and it needs replacing, not extending.
