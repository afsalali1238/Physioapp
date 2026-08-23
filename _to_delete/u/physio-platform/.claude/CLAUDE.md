# Patient Exercise & Stretching Platform

A static web library of physiotherapy stretches and exercises, organised by body area. One link, sent by a physiotherapist to any patient. No login, no patient data, no diagnosis.

**Read `memory.md` at the repo root before doing anything.** It holds the decision log and current state.

## Stack

- Astro 5 + TypeScript, deployed to Vercel
- Content lives in a Google Sheet, synced to committed JSON via `npm run sync:content`
- Astro Content Collections + Zod validate everything at build time
- `astro:assets` handles all image optimisation
- No client-side framework. No state management. If you are reaching for one, stop and ask.

## Commands

```bash
npm run dev             # local dev server
npm run build           # production build — must pass before push
npm run preview         # serve the built site
npm run sync:content    # pull Google Sheet -> src/data/*.json
npm run check:images    # report missing images and orphan files
npm run lint            # eslint
npm run format          # prettier
```

Run the real command. Do not invent script names.

## Where things live

| Path | What |
|---|---|
| `PRD.md` | Product requirements. The why. |
| `memory.md` | Decision log + current state. Update it when a decision is made. |
| `docs/CONTENT-SCHEMA.md` | The spreadsheet contract. Authoritative. |
| `docs/IMAGE-PIPELINE.md` | Where images come from. IMAGE-BRIEF.md is superseded. |
| `docs/MODULES.md` | Module-by-module implementation spec |
| `docs/DESIGN-SYSTEM.md` | Tokens, type, card anatomy |
| `BUILD-PLAN.md` | Stage order and the approval gates |
| `docs/ARCHITECTURE.md` | Stack reasoning, data flow, routes |
| `src/data/*.json` | Generated from the sheet. **Never hand-edit.** |
| `src/content/config.ts` | Zod schemas. Change here = change `CONTENT-SCHEMA.md` too. |
| `src/assets/images/` | Demonstration images, one per `image_id` |
| `src/styles/tokens.css` | Design tokens, light and dark |

## NON-NEGOTIABLE

1. **This is patient-facing clinical content.** Never invent, alter, or "improve" an exercise, a dosage, a target muscle, or a safety line. All clinical content comes from the physiotherapist via the sheet. If content looks wrong, flag it — do not fix it.

2. **Never hand-edit `src/data/*.json`.** It is generated. Edits are destroyed on the next sync and silently diverge from the clinician's source of truth. Change the sheet, then sync.

3. **No diagnosis language anywhere.** No condition names, no "this will fix your...", no claims of outcome. The clinician deliberately removed condition-based navigation. Body area only.

4. **Schema changes are two-file changes.** `src/content/config.ts` and `docs/CONTENT-SCHEMA.md` move together, always. A drift between them means the clinician's sheet silently breaks.

5. **Every image needs alt text that describes the position.** Not decorative. A patient using a screen reader must still be able to do the exercise.

6. **No analytics, no third-party scripts, no fonts or assets from hosts we don't control.** Health context. Keep the request list to our own origin plus, at most, one font host.

7. **Ids are permanent.** Never renumber or reuse an `id`. Retire with `status: retired`.

## Conventions

- TypeScript strict. No `any`.
- Components are `.astro` unless there is a real interactive reason.
- Design tokens only — no hardcoded colours in components. Both themes must be defined at token level.
- Touch targets 44px minimum. Patients may be in pain, one-handed, or elderly.
- Copy is second person, present tense, short sentences. Write for someone alone at home, not for a colleague.
- British English in UI copy, to match the clinician's register.

## What Claude repeatedly gets wrong here

- Adding a framework or client-side state for something a static page already does.
- "Tidying" clinical wording. Don't.
- Writing dosage into the instruction text instead of the dosage fields, which breaks the consistent card layout.
- Adding a third navigation level. Area pages list items in full on purpose (PRD §5).
- Optimising images by hand. `astro:assets` does it; committing derivatives makes the repo heavy and the pipeline confusing.

## Safety gates

`npm run build` must pass before any push — enforced by `.claude/hooks/pre-push-check.sh`.
Reads of `.env*` are blocked by hook.
