# GEMINI.md

**Read [`AGENTS.md`](./AGENTS.md) in this folder. It is the canonical rules file for this
repository.** This file exists only so that Gemini CLI and Antigravity find their way there.

Do not add rules to this file. If a rule needs to change, change `AGENTS.md`.

---

## Hard stops, in case you read nothing else

- **`anatomy-explorer/` is the whole product — this is now a single-app repo.** The merge is
  done: `patient-library/` has been **deleted**. If any document tells you to read from, copy out
  of, or "never delete" `patient-library/`, that document is stale — the live pipeline lives under
  `anatomy-explorer/src/`.
- **Never invent clinical content.** Anything clinical ships as `status: draft` with empty
  `reviewed_by`. Never write a clinician's name or a review date. Flag problems; do not fix them.
- **Never relax the compliance check** in `anatomy-explorer/src/lib/compliance.ts`. Fix the
  content, never the check.
- **Never hand-edit `src/data/areas.json` or `items.json`** — they are generated from the
  clinician's Google Sheet. A content change is a sheet change.
- **Never run `git clean -fd`, `git clean -fdx`, or `git checkout -- .` at this repo root.**
  `anatomy-explorer/` is committed, but loose docs at the repo root are untracked and have no
  reflog.
- **Do not touch `astro.config.mjs`, `package.json`, lockfiles or `.github/` as a side effect.**
  If your task needs a config change, say so and stop.

Everything else — the single-app structure, the read order, the verified state of the tree, the
known stale references, and the environment's git and build limitations — is in `AGENTS.md`.
