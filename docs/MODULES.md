# Implementation Modules

Each module is independently implementable. Build in the order given — dependencies point backwards only. Every module states what "done" means so a different tool, or a different session, can pick it up without re-deriving decisions.

**Conventions:** Astro 5 + TypeScript strict · no client framework · design tokens only, never hardcoded colour · every text string routed through the i18n helper from M02 onward.

---

## M01 · Project scaffold

**Purpose** A running Astro project deployed to Vercel.

**Do**
- `npm create astro@latest` — minimal template, TypeScript strict
- Add `@astrojs/vercel` adapter in `static` output mode (switch to `hybrid` at M15, not before)
- Add `@astrojs/sitemap`, `prettier`, `eslint` with `eslint-plugin-astro`
- Scripts: `dev`, `build`, `preview`, `lint`, `format`, `sync:content`, `check:images`
- `.gitignore`: `node_modules`, `dist`, `.astro`, `.vercel`, `.env*`
- Connect the repo to Vercel, deploy from `main`, previews on branches

**Done when** a placeholder page is live on a Vercel URL, `npm run build` and `npm run lint` both pass, and a branch push produces a preview deployment.

---

## M02 · Design system

**Purpose** One token layer everything else consumes. Nothing downstream picks a colour.

**Depends on** M01

**Do**
- `src/styles/tokens.css` — the full token set from `docs/DESIGN-SYSTEM.md`, defined three ways: bare `:root` (light), `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and `:root[data-theme="dark"]`
- `src/styles/base.css` — reset, body background from a token, typography scale, focus-visible ring, `prefers-reduced-motion` block
- Google Fonts: Archivo (display), Source Sans 3 (body), IBM Plex Mono (dosage). Real fallback stacks on each.
- A `--scale` custom property on `:root` multiplying every font size, driven by M10

**Rules**
- No colour literal appears outside `tokens.css`
- No colour is defined *only* inside a media or `[data-theme]` block — that is the classic unreadable-artifact bug
- `body` sets an explicit background from a token

**Done when** a test page renders correctly in light, dark, and system-default (unstamped) states, and grepping `src/components` for `#` returns nothing.

---

## M03 · Content schema

**Purpose** Turn the clinician's spreadsheet into a typed, validated contract that fails the build rather than rendering something broken.

**Depends on** M01

**Do**
- `src/content/config.ts` — Zod schemas for `areas` and `items`, mirroring `docs/CONTENT-SCHEMA.md` exactly, loaded via the `file()` loader from `src/data/*.json`
- Enforce as hard failures: required fields on `published` rows · `area_id`+`section` exists · unique `id` · `type` in enum · at least one of `hold_seconds`/`reps` · non-empty `image_alt_en` · numeric columns numeric
- Enforce as warnings: image file missing · orphan image file · area with 0 published items · instruction field over 200 chars
- `src/lib/types.ts` — exported `Item`, `Area`, `Section` types derived from the Zod schemas, never hand-written

**Critical** `src/content/config.ts` and `docs/CONTENT-SCHEMA.md` change together, always. Drift between them silently breaks the clinician's sheet.

**Done when** a deliberately broken fixture row fails `npm run build` with an error naming the row id and the offending column.

---

## M04 · Sheet sync

**Purpose** Google Sheet → validated, committed JSON.

**Depends on** M03

**Do**
- `scripts/sync-content.ts` (tsx or Node with a TS loader)
- Read `SHEET_ID` from `.env`; fetch each tab as CSV via the published-CSV export URL
- Parse with `papaparse`, header row as keys
- Trim every cell; coerce numeric columns; `TRUE`/`FALSE` → boolean; empty string → `undefined`, never `null` or `"N/A"`
- Validate against the M03 Zod schemas **before writing anything**
- On failure: print a table of row · column · problem, exit non-zero, **write nothing**
- On success: write `src/data/areas.json` and `src/data/items.json` with stable key ordering and 2-space indent, so git diffs are readable
- Call `check:images` and print its report
- Print a summary: items added, removed, changed

**Rules**
- Never write partial output. All rows valid or nothing written.
- Stable ordering is not cosmetic — an unstable sort makes every sync look like a 100-line diff and nobody reviews it.

**Done when** running it against a live sheet produces reviewable JSON, and a bad row produces a clear error with nothing written.

---

## M05 · Image handling

**Purpose** Images in, optimised images out, gaps reported.

**Depends on** M01, M04

**Do**
- `src/assets/images/<image_id>.(svg|png)` — one file per item
- `src/lib/images.ts` — `import.meta.glob` the asset directory, resolve by `image_id`, return the asset or `null`
- `src/components/ExerciseImage.astro` — SVG passed through inline or as `<img>`; raster through `astro:assets` `<Image>` with `widths=[400,800,1200]`, `format="webp"`, `loading="lazy"` (eager for the first item on a page), explicit `width`/`height` to reserve space and stop layout shift
- Missing image renders a labelled placeholder, never a broken image
- `scripts/check-images.ts` — reports both directions: published items with no file, files nothing references

**Done when** an area page with 5 items ships correctly sized responsive images, no layout shift, and `check:images` reports accurately in both directions.

---

## M06 · Layout shell

**Purpose** The frame every page sits in.

**Depends on** M02

**Do**
- `src/layouts/Base.astro` — html/head/body, meta, tokens, fonts, `<slot />`
- `src/components/TopBar.astro` — clinic mark, text-size control (M10), sticky
- `src/components/BackLink.astro` — one level up, 44px minimum target, arrow mirrors under RTL
- `src/components/Disclaimer.astro` — the approved wording, on **every** page
- Skip-to-content link, `<main>` landmark, `lang` attribute from the active locale

**Done when** all three page types render inside the shell, keyboard tab order is sane, and the skip link works.

---

## M07 · Home page

**Purpose** Two choices, and how to use the page.

**Depends on** M06

**Route** `/`

**Do**
- Two large cards: Stretching → `/stretching/`, Exercise Protocols → `/exercises/`. Minimum 150px tall, whole card is the target.
- "How to use this" — four rules, from the clinician's approved wording
- Disclaimer

**Rules** No exercise content, no condition names, no booking CTA. The booking CTA is what would reclassify this page as advertisement under MOHAP rules — see `docs/RESEARCH-FINDINGS.md` §4.

**Done when** it renders both cards, is fully operable at 200% zoom, and both cards are reachable and activatable by keyboard.

---

## M08 · Section page

**Purpose** Choose a body area.

**Depends on** M07, M03

**Routes** `/stretching/`, `/exercises/`

**Do**
- Read areas for the section, filter `status: published`, sort by `order`
- **Order head to toe, not alphabetically.** People scan a body top-down; alphabetical ordering is an information-design failure here.
- Each tile shows the area name and its item count
- An area with zero published items does not render a tile and has no page — no empty states in front of a patient
- Tiles: minimum 62px tall, whole tile is the target

**Done when** both section pages render from data, and deleting all of an area's items removes its tile and its route.

---

## M09 · Area page and item card

**Purpose** The screen that does the actual work.

**Depends on** M08, M05

**Route** `/[section]/[area]/` — generated with `getStaticPaths`

**Do**
- All published items for that area, in `order`, **rendered in full on one page.** No third navigation level (PRD §5, decision D-005).
- Each item gets `id="<item_id>"` and `scroll-margin-top` so `/stretching/neck#str-neck-02` lands correctly
- "Start here" banner naming the first two items (decision D-009)
- `src/components/ItemCard.astro` in this exact vertical order:
  1. Image — 4:3
  2. Item number + type chip (colour-coded: mobility / stretch / strengthen)
  3. Name — largest text on the card
  4. **Dosage block** — a bordered strip of cells: Hold · Repeat · Sets · Sides · How often. Only cells with values render. Monospace, tabular numerals. This is the near-universal field standard and the thing patients scan for.
  5. Steps — labelled `Start` / `Movement` / `Keep in mind` / `Return`
  6. "Works on <muscles>"
  7. Safety line — visually distinct, warning-toned, always present
  8. "Mark as done" — local only (M10)
- Print button (M11)

**Rules** Dosage never appears in instruction prose — it breaks the scannable block and duplicates the data.

**Done when** an area page renders every field for every item, anchors work, and the page is readable end to end on a 360px viewport at 200% zoom.

---

## M10 · Accessibility and patient controls

**Purpose** Usable by someone older, in pain, one-handed, or reading a second language.

**Depends on** M06

**Do**
- **Text-size control** in the top bar, cycling 100% → 115% → 130%, driving `--scale`, persisted to `localStorage` in try/catch. *(Arab patients surveyed chose 16pt as optimal; only 42% of adults 65+ own a smartphone at all — larger text is not a nice-to-have here.)*
- **"Mark as done"** per item, keyed by date so it resets daily, `localStorage` only. This is a place-keeping aid for someone working through five exercises, **not tracking.** Nothing leaves the device, nothing reaches the clinic. Say so on the page.
- Every interactive target ≥44×44px
- Visible focus ring on everything focusable
- `prefers-reduced-motion` respected
- Colour contrast ≥4.5:1 for body text, ≥3:1 for large text and UI borders, in **both** themes
- Every `localStorage` read and write wrapped in try/catch — private browsing throws

**Done when** an axe-core pass is clean, the page is fully keyboard-operable, and it works with `localStorage` disabled.

---

## M11 · Print

**Purpose** The paper fallback. Not optional — a large share of older patients will want paper, and the clinician's current workflow *is* paper.

**Depends on** M09

**Do**
- `@media print` in `tokens.css`: hide top bar, back link, tick buttons, tools, guidance strip
- Force light colours, black text, white ground
- `break-inside: avoid` on every item card
- Print the disclaimer and the clinic identification block
- Print the page URL in the footer so the patient can get back to it
- "Print this page" button on area pages

**Done when** an area page prints to 2–3 clean A4 pages with no card split across a page break.

---

## M12 · Compliance surface

**Purpose** Everything the regulatory position depends on, in one place so it cannot drift.

**Depends on** M06

**Do**
- `src/content/legal/` — disclaimer, privacy note, credits, all as content files so wording changes do not need a code change
- Disclaimer on every page, containing all eight elements from `docs/RESEARCH-FINDINGS.md` §4: educational only · not a substitute for assessment · a reminder of what was already prescribed · stop-and-contact condition · emergency instruction · limitation of applicability · limitation of liability · clinic legal name, DHA facility licence number, physiotherapist licence, date of last content review
- Credits page carrying the Servier Medical Art CC BY 4.0 attribution and any image-library attribution
- Privacy note: no accounts, no analytics, nothing sent anywhere, text-size and daily ticks stored on the device only
- **A build-time check that fails if any published item's text matches a banned-term list**: condition names, "guaranteed", "best", "safest", "cure", "fix", "miraculous", plus any booking CTA string

**Rules** No analytics. No third-party scripts. No booking CTA — that single element is what would reclassify the site from education to medical advertisement under MOHAP rules.

**Done when** the disclaimer renders on every route, the banned-term check fails a deliberately seeded bad row, and the network tab shows requests to our origin and the font host only.

---

## M13 · i18n scaffolding

**Purpose** Arabic later is filling in cells, not rebuilding.

**Depends on** M02, M03

**Do**
- `src/i18n/en.json` for all UI chrome; every literal string in components routed through `t()`
- `src/lib/locale.ts` — resolve locale, expose `t()` and `dir`
- Content helper `field(item, 'name')` returning `name_ar` when locale is `ar` and it is non-empty, else `name_en`
- All directional CSS uses logical properties: `padding-inline-start`, `border-inline-end`, `margin-block`. **No `left`/`right`.**
- Arabic route (`/ar/...`) and font (IBM Plex Sans Arabic) scaffolded but **not enabled**

**Rules** Arabic does not ship until a native-speaking clinician reviews it. Machine-translated clinical instruction is not acceptable.

**Done when** flipping a config flag to `ar` renders the whole shell RTL with no layout breakage, even with English content still in place.

---

## M14 · QR codes for the clinic

**Purpose** Her existing workflow is a printed QR sheet on the wall. Match it.

**Depends on** M08

**Do**
- `scripts/generate-qr.ts` — a QR PNG/SVG per area route into `build-artifacts/qr/`
- A printable A4 contact sheet: every area, its QR, its label — the same shape as the sheet already on her wall
- Not part of the site build; run on demand

**Done when** scanning a generated code opens the right area page on a phone.

---

## M15 · Live preview *(Phase 2 — not now)*

**Purpose** She sees her draft edits immediately without waiting for a deploy.

**Depends on** M04, M09

**Do**
- Switch the Vercel adapter to `hybrid`
- `/preview` — `export const prerender = false`, fetches the sheet at request time, includes `draft` rows
- Visually marked as preview on every card. `noindex`. Never linked from the patient site.
- Production routes stay static and untouched

**Rules** A preview failure must never affect a production route.

---

## M16 · Quality gates

**Purpose** Stop bad content and bad builds before a patient sees them.

**Depends on** all

**Do**
- Vitest on the sync script: valid rows in → correct JSON; invalid rows in → non-zero exit, nothing written
- Playwright smoke test: home → section → area, on a 360px viewport
- axe-core on all three page types, both themes
- Lighthouse budget in CI: performance ≥95, accessibility 100, total page weight under 500KB on an area page
- GitHub Action on PR: lint, build, test, Lighthouse
- The `pre-push-check.sh` hook already blocks a push when `npm run build` fails

**Done when** a PR that breaks any of the above goes red automatically.

---

## Build order

```
M01 → M02 → M03 → M04 → M05 → M06 → M07 → M08 → M09
                                                   ↓
                              M10 → M11 → M12 → M13 → M16
                                                   ↓
                                          M14      M15 (phase 2)
```

**The first milestone that matters is M09 with the neck content loaded.** That is the vertical slice she reviews. Do not build M10–M16 before she has seen it — her feedback may change the card layout, and M11's print stylesheet inherits directly from it.
