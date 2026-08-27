# Anatomy Explorer

A unified anatomy and exercise application. On capable devices, a patient uses a full-body 3D
locator, highlights and zooms into a body region, optionally selects a meaningful exact zone,
confirms the place, passes a safety gate, reads reviewed education, and reaches general
clinician-approved exercise information. Direct library browsing remains available.

**Read `memory.md` and `HANDOFF.md` before doing anything.** Then read the active product documents
listed in `HANDOFF.md`. Superseded plans in `docs/archive/` are historical only.

## The one thing to understand first

`../patient-library/` is a **live** patient-facing site, deployed, with a clinician entering
content into it right now. It is reference material. Never write to it. A hook blocks it — the
hook is the backstop, not the reason.

An agent already deleted `astro.config.mjs` from that app while working on something else and it
sat missing for days.

## Stack

- Astro 7 + TypeScript strict. **No React, no client framework, no state library.**
- Content: a build-time snapshot of the library's `areas.json` / `items.json`. Never fetched at runtime.
- No backend, no database, no auth, no analytics. localStorage holds exactly two keys.
- Three.js is scoped to the anatomy route. WebGL is never required because the simple map and
  semantic controls are a complete equivalent.

## Commands

```bash
npm run dev             # dev server (backgrounded; use dev:foreground to watch)
npm run build           # must pass before push
npm run typecheck       # tsc --noEmit
npm run lint            # currently an alias for typecheck
```

Run the real command. Do not invent script names.

## Where things live

| Path | What |
|---|---|
| `HANDOFF.md` | Entry point. Read first. |
| `memory.md` | Decision log. Append when you decide something. |
| `PRD.md` | What we're building and deliberately not |
| `BUILD-PLAN.md` | Authoritative implementation and migration sequence |
| `docs/archive/` | Superseded material; historical reference only |
| `CLINICAL-SAFETY.md` | Red flags, banned language, review workflow. Authoritative |
| `ANATOMY-DATA-SCHEMA.md` | Data contract. Change here = change `types.ts` too |
| `reference/body-geometry/` | Verified joint table and hotspot geometry |
| `src/data/library/` | Generated snapshot. **Never hand-edit** |
| `src/lib/anatomy/machine.ts` | The only state machine. Do not add a second |

## NON-NEGOTIABLE

1. **Never write outside `anatomy-explorer/`.** Verify with `git status -- ':!anatomy-explorer'`
   before finishing. Any output is a stop-and-revert.

2. **This is not a symptom checker.** No condition or injury names anywhere — including comments,
   type names, variable names and fixtures. No "this could be", "you may have", "the cause is".
   No claim about results, recovery or timescales.

3. **Never invent clinical content.** Exercises, dosages, target muscles, safety lines and
   red-flag wording come from the physiotherapist. Anything clinical you add is `status: 'draft'`
   with empty `reviewedBy`/`reviewedDate`. **Never write a clinician's name or a review date.**

4. **Write only the files your module owns.** Needing another file is a stop-and-report, never a
   workaround. Do not duplicate, re-export or shadow a file you do not own.

5. **The map is never the only way through.** Every flow completable by keyboard alone, with a
   visible focus ring, without touching the SVG.

6. **No analytics, no third-party scripts, no backend, no request leaving the browser.**
   localStorage: last chosen area, text-size preference. Nothing else, ever.

7. **A wrong hotspot looks right.** Nine generated images were reviewed for the library; five were
   clinically wrong and all nine looked professional. Visual work must be rendered and looked at,
   not reasoned about. `npm run shoot`, then say what you see.

## Conventions

- TypeScript strict, no `any`. Components are `.astro` unless there is a real interactive reason.
- Design tokens only, no hardcoded colours. Both themes defined at token level, on bare `:root`
  plus a `prefers-color-scheme` block plus a `[data-theme]` block.
- Base font **17px**, not 16. Touch targets 44px minimum. Body areas sort **head to toe**.
- Copy is second person, present tense, short sentences, British English. Write for someone alone
  at home and possibly frightened, not for a colleague.
- Ids are permanent. Retire with `status: 'retired'`; never reuse.

## What agents repeatedly get wrong here

- Reaching for React or client state for something a static page already does.
- "Tidying" clinical wording. Don't.
- Hand-authoring hotspot coordinates instead of deriving them from the joint table.
- Adding a second state machine alongside the authoritative locator state — keep one state machine.
- Editing files owned by another module because it seemed easier than reporting.
- Relaxing `check:anatomy` to get a build green. Fix the content, never the check.
- Wandering into `../patient-library/` to fix something they noticed in passing.

## Safety gates

`npm run build` must pass before any push — enforced by `.claude/hooks/pre-push-check.sh`.
Writes outside this folder are blocked by `.claude/hooks/block-live-app.sh`.
Reads of `.env*` are denied in `settings.json`.
