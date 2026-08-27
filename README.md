# pshyapp

Patient-facing physiotherapy education for a clinic in the UAE: an interactive body-area locator
in front of a clinician-reviewed stretching and exercise library. Astro, deployed on Vercel,
content synced from the physiotherapist's Google Sheet.

Two folders, and they have opposite rules.

| Folder | What it is | Status |
|---|---|---|
| `anatomy-explorer/` | **The product.** The unified app — locator plus library, one build. | **Build here.** All new work. |
| `patient-library/` | The live exercise and stretching site the unified app is being built from. | **Live, and reference-only.** Read it, copy out of it, never edit it. |

## Where the work is

`anatomy-explorer/` is the merged product (decisions A-011, A-012, A-014). It is where every
change goes.

`patient-library/` is **deployed right now** — the physiotherapist is entering clinical content
into it and patients have been sent the link. It is not deprecated and it is not being deleted. It
stays as the working reference and the rollback target. Treat it as a library you happen to have
source access to: read it, learn the contract, copy code into `anatomy-explorer/`, leave the
original alone.

`anatomy-explorer/PORT-CHECKLIST.md` lists everything still to bring across, in order, with the
known defect to fix on each. Start there.

## Working here

`cd` into the folder you are working on. **Never run a build or install from the repository root**
— there is no `package.json` here.

**Read `AGENTS.md` before touching either folder.** It is the canonical rules file; `CLAUDE.md` and
`GEMINI.md` beside it are pointers to it, and each folder has its own `AGENTS.md` with local
detail. Cursor rules are in `.cursor/rules/`. The short version:

- Content lives in the Google Sheet, not the repo — `src/data/*.json` is generated.
- Never invent clinical content. Anything clinical ships as `draft` with no reviewer named.
- Never relax the compliance check. Fix the content instead.
- Navigation is by body area, never by condition. No analytics, accounts or backend.
- Neither folder is committed yet, so **never run `git clean -fd` at this root.**

## Known state, 2026-08-26

Neither folder is tracked in git — the split was done with plain `mv` and never committed, so
committing both trees is the first thing worth doing. `anatomy-explorer/` currently imports JSON
directly out of `patient-library/`, which cannot deploy and needs replacing with a real port. CI
still runs at the repository root, where there is no `package.json`, so it is red. `AGENTS.md` has
the full picture and is kept current.
