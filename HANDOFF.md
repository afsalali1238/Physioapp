# HANDOFF — start here

For whoever picks this up next: Antigravity, Claude Code, Cursor, or a human. This is the single entry point. Read this, then `memory.md`, then start at Ticket 1.

**Last updated:** 2026-08-23 · **Phase:** 0 → 3 (specification complete, no application code yet)

---

## What this is

A static web library of physiotherapy stretches and exercises, organised **by body area**. A physiotherapist sends one link to any patient. No login, no accounts, no patient data, no diagnosis.

Two sections — **Stretching** and **Exercise Protocols** — each with its own list of body areas. Tap an area, get 4–6 items in full: image, name, dosage block, instructions, target muscles, safety line.

---

## Read in this order

| # | File | Why |
|---|---|---|
| 1 | `memory.md` | 15 decisions with reasoning. **Do not relitigate these.** |
| 2 | `PRD.md` | What we're building and what we're deliberately not |
| 3 | `docs/ARCHITECTURE.md` | Stack reasoning, data flow, routes |
| 4 | `docs/MODULES.md` | Module specs M01–M16 with acceptance criteria |
| 5 | `docs/CONTENT-SCHEMA.md` | The spreadsheet contract. Authoritative. |
| 6 | `docs/DESIGN-SYSTEM.md` | Exact tokens, type scale, card anatomy |
| 7 | `.claude/CLAUDE.md` | Working rules, 7 non-negotiables |

Reference when needed: `docs/IMAGE-PIPELINE.md`, `docs/IMAGE-TEST-VERDICT.md`, `docs/RESEARCH-FINDINGS.md`, `docs/GEMINI-CONTENT-RESEARCH.md`, `BUILD-PLAN.md`.

---

## State of play

**Exists:** every specification document · the `.claude/` control layer · a working single-file UI prototype at `prototype/patient-library-prototype.html` · nine rejected test images in `src/assets/images/`.

**Does not exist:** the Astro application · the Google Sheet · production images · any content beyond the neck sample.

**The prototype is the design reference.** It is not the app. Everything in it — layout, tokens, card anatomy, print stylesheet, text-size control — gets rebuilt properly in Astro. When the prototype and `docs/DESIGN-SYSTEM.md` disagree, the design system wins.

---

## Settled. Do not reopen.

| | Decision |
|---|---|
| D-001 | Navigation is by **body area**, never by condition or diagnosis |
| D-002 | Two top-level sections, each with its own area list |
| D-003 | **Astro 5 + TypeScript on Vercel.** No React, no client framework |
| D-004 | **Google Sheet is the source of truth**, synced to committed JSON at build time |
| D-005 | **Flat area pages.** All items in full on one page. No third navigation level |
| D-006 | English now; every text field has an empty `_ar` twin |
| D-007 | No login, no analytics, no adherence tracking |
| D-010 / D-015 | **Licence the images. Generation was tested and failed 5 of 9** |
| D-012 | Print is a first-class output, not an afterthought |
| D-014 | Base font 17px. Body areas sort **head to toe**, never alphabetically |

---

## Blocked on a human — but not blocking the build

None of these stop Tickets 1–10. Build the default, note the cost of changing later.

| # | Question | Who | Default we build | Cost if she disagrees |
|---|---|---|---|---|
| D1 | Flat pages vs page-per-exercise | Clinician | Flat (D-005) | Rewrite of one route |
| D2 | Illustration style sign-off | Clinician | Style from the test batch | None to code |
| D3 | Clinic branding | Clinician | Tokens from `DESIGN-SYSTEM.md` | Swap ~8 token values |
| D4 | Disclaimer wording + sign-off | Clinician + Medical Director | Placeholder in `src/content/legal/` | Text swap |
| D7 | Which two items are "start here" per area | Clinician | First two by `order` | Data only |
| D8 | Education or advertisement (MOHAP) | Medical Director | Build with no booking CTA, no outcome claims | Could block launch |
| NEW | Is the daily "mark as done" tick useful or clutter | Clinician | Build it, local-only | Delete one component |

**D8 is the only one that can stop a launch.** Everything else is cheap to change.

---

## Build queue

Full specs in `docs/MODULES.md`. Do them in order. **Stop at Ticket 10.**

### Ticket 1 · Repo and scaffold `[M01]`
`git init`. Astro 5, TypeScript strict, `@astrojs/vercel` in **static** mode, `@astrojs/sitemap`, prettier, eslint. Scripts: `dev build preview lint format sync:content check:images`. Connect to Vercel, deploy from `main`.
**Done:** placeholder page live on a Vercel URL; `npm run build` and `npm run lint` pass; a branch push makes a preview deploy.

### Ticket 2 · Design tokens `[M02]`
`src/styles/tokens.css` with the exact values from `docs/DESIGN-SYSTEM.md`. Three blocks: bare `:root` (light), `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`. Fonts: Archivo, Source Sans 3, IBM Plex Mono, each with a real fallback stack. A `--scale` property multiplying every font size.
**Done:** a test page is correct in light, dark **and system-default (unstamped)**; `grep -r '#' src/components` returns nothing.

### Ticket 3 · The Google Sheet `[human — Afsal]`
Not code. Two tabs, `areas` and `items`, headers copied **exactly** from `docs/CONTENT-SCHEMA.md`. Fill `areas` completely, head-to-toe order. Fill **one** item row: the `ex-neck-02` worked example. Publish to web as CSV. Add sheet-side data validation on `section`, `status`, `type`, `area_id`.
**Do this before Ticket 5.** The sheet is the interface contract; writing the sync script against a sheet that doesn't exist is how the columns end up wrong.

### Ticket 4 · Schema and validation `[M03]`
`src/content/config.ts` — Zod schemas mirroring `docs/CONTENT-SCHEMA.md` exactly, via the `file()` loader. Hard failures: missing required field on a `published` row · unknown `area_id`+`section` · duplicate `id` · bad `type` · neither `hold_seconds` nor `reps` · empty `image_alt_en` · non-numeric in a numeric column. Warnings: missing image · orphan image · empty area · instruction over 200 chars.
**Done:** a deliberately broken fixture fails `npm run build` with an error naming the row id and column.

### Ticket 5 · Sheet sync `[M04]`
`scripts/sync-content.ts`. Fetch each tab as CSV, parse with papaparse, trim, coerce, validate against Ticket 4's schemas **before writing anything**. On failure: print row · column · problem, exit non-zero, **write nothing**. On success: write `src/data/*.json` with stable key ordering and 2-space indent. Print added/removed/changed.
**Done:** live sheet produces reviewable JSON; a bad row produces a clear error and no file changes.

### Ticket 6 · Images `[M05]`
`src/lib/images.ts` resolving `image_id` → asset. `ExerciseImage.astro`: SVG inline or `<img>`; raster through `astro:assets` at widths 400/800/1200, webp, lazy below the fold, eager for the first item, explicit dimensions. Missing image → labelled placeholder, never a broken image. `scripts/check-images.ts` reports both directions.
**Done:** a 5-item page ships correctly sized images with no layout shift.

### Ticket 7 · Layout shell `[M06]`
`Base.astro`, `TopBar.astro` (with the text-size control), `BackLink.astro`, `Disclaimer.astro`. Skip link, `<main>` landmark, `lang` attribute.
**Done:** all three page types render inside it; tab order is sane; skip link works.

### Ticket 8 · Home `[M07]`
`/` — two large cards, minimum 150px, whole card is the target. "How to use this", four rules. Disclaimer.
**Done:** operable at 200% zoom; both cards keyboard-reachable. **No booking CTA — ever.**

### Ticket 9 · Section pages `[M08]`
`/stretching/`, `/exercises/`. Published areas only, sorted by `order`, **head to toe**. Tile shows name and item count, minimum 62px. An area with zero published items gets no tile and no route.
**Done:** both render from data; emptying an area removes its tile and its page.

### Ticket 10 · Area page and item card `[M09]` ← **the milestone**
`/[section]/[area]/` via `getStaticPaths`. All published items in full, in `order`, each with `id="<item_id>"` and `scroll-margin-top`. "Start here" banner naming the first two.

`ItemCard.astro`, in this exact order: image 4:3 · number + type chip · name · **dosage block** (bordered cells, mono, tabular figures, only cells with values) · labelled steps Start / Movement / Keep in mind / Return · "Works on <muscles>" · safety line, warning-toned, always present · "Mark as done".

**Done:** every field renders for every item; anchors work; readable end to end on a 360px viewport at 200% zoom.

### 🛑 STOP HERE

Deploy it. Send her the URL. **Do not build Tickets 11+ until she has approved the card layout.** If it changes now, one area gets rewritten. If it changes after content production, twenty-five do.

---

### After her approval

**11** Accessibility and controls `[M10]` — text-size cycle, daily tick, 44px targets, axe-core clean, `localStorage` in try/catch
**12** Print `[M11]` — hide chrome, force black-on-white, `break-inside: avoid`, print the URL
**13** Compliance `[M12]` — `src/content/legal/`, disclaimer everywhere, **build-time banned-term check** (condition names, "best", "guaranteed", "safest", "cure", any booking CTA)
**14** i18n scaffolding `[M13]` — `t()` for all chrome, logical CSS properties only, `/ar/` route scaffolded but disabled
**15** Quality gates `[M16]` — vitest on sync, Playwright smoke at 360px, axe-core both themes, Lighthouse budget in CI
**16** QR codes `[M14]` — one per area route plus a printable A4 contact sheet, matching the sheet already on her clinic wall

Then **Stage 5** in `BUILD-PLAN.md`: content production, one body area at a time.

---

## Hard rules

1. **Never invent or edit clinical content.** Exercises, dosages, target muscles, safety lines all come from the physiotherapist via the sheet. If something looks wrong, flag it — do not fix it.
2. **Never hand-edit `src/data/*.json`.** Generated. A hook blocks it. Change the sheet, then sync.
3. **No diagnosis or condition language anywhere.** Body area only.
4. **No booking CTA, no outcome claims, no superlatives.** This is the line between patient education and regulated medical advertisement under MOHAP rules.
5. **No analytics, no third-party scripts.** Own origin plus one font host.
6. **Schema changes are two-file changes** — `src/content/config.ts` and `docs/CONTENT-SCHEMA.md`, always together.
7. **Ids are permanent.** Retire with `status: retired`; never reuse.
8. **Every image needs alt text describing the body position.**
9. **Append a decision to `memory.md` whenever you make one.** That file is why the next session doesn't repeat this work.

---

## Two environment notes

**The hooks are bash.** `.claude/hooks/*.sh` referenced from `.claude/settings.json`. Fine under WSL or Git Bash; native Windows needs them ported to `.ps1`. The two that matter: `block-secrets.sh` (stops edits to generated data) and `pre-push-check.sh` (blocks a push when the build fails).

**Not a git repo yet.** `git init` in Ticket 1. The whole content-review model depends on reading the diff of `src/data/*.json` before anything reaches a patient.

---

## First prompt to paste into your build tool

```
Read HANDOFF.md, then memory.md, then docs/MODULES.md.

Do Ticket 1 only: git init, then scaffold Astro 5 with TypeScript strict,
the Vercel adapter in static mode, sitemap, prettier and eslint. Add the
npm scripts listed in the ticket. Do not create any pages, components or
content yet.

Then show me the file tree and the output of npm run build, and stop.

Rules: no React or any client framework. Never hand-edit src/data/*.json.
Never write or alter clinical content. Append any decision you make to
memory.md.
```

Work one ticket per session. Show the acceptance criteria met, then stop and let it be reviewed. Tickets 4, 5 and 10 are the ones where mistakes are expensive — go slower there.
