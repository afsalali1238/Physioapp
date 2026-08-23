# Architecture

## Stack decision

**Astro 5 + TypeScript, deployed to Vercel.**

### Why Astro over Next.js

The requirements that decided it:

1. **~100 content items with an image each.** The payload is images, not logic. Astro's `astro:assets` gives responsive `srcset`, AVIF/WebP conversion, and correct lazy-loading at build time with no runtime cost. Getting this wrong is the difference between a 400KB page and a 4MB page on a patient's phone.

2. **Near-zero JavaScript.** Astro ships no JS unless you ask for it. Every content page here is static text and images — there is nothing to hydrate. Next.js App Router ships a runtime whether you need it or not. On a cheap Android on clinic wifi, that gap is real.

3. **Content Collections with Zod validation.** The spreadsheet is written by a clinician, not a developer. Rows *will* have a missing dosage, a typo'd area slug, an image_id pointing at nothing. Astro validates the whole collection at build time and fails the build with a readable error naming the row. That validation layer is the single most valuable thing in this stack, because it turns "the site silently renders a broken card" into "the deploy stops and tells you row 47 is missing target_muscles".

4. **i18n routing is built in.** Arabic later means adding a locale and RTL styles, not restructuring routes.

5. **Hybrid rendering for Phase 2.** The Vercel adapter lets the preview route render on demand from the live sheet while every production page stays static. Exactly the split the PRD asks for.

### When to revisit

Move to Next.js if — and only if — per-patient assignment becomes real. That brings auth, a database, and per-request rendering, which is Next.js's home turf. Until then it is weight with no payoff. Do not pre-emptively migrate.

### Rejected

- **Plain HTML + build script.** Would work, but hand-rolling image optimisation and content validation is rebuilding the two things Astro is best at.
- **Next.js.** See above.
- **A CMS (Sanity, Contentful).** She asked for a spreadsheet. A spreadsheet is a CMS she already knows and cannot be locked out of.

---

## Data flow

```
Google Sheet  (clinician edits, marks rows published)
      │
      │  npm run sync:content
      ▼
scripts/sync-content.ts
      │  · fetch each tab as CSV
      │  · parse, trim, coerce numbers
      │  · validate against Zod schema
      │  · report missing images
      │  · fail loudly on bad rows
      ▼
src/data/areas.json
src/data/items.json          ← committed to git, reviewable diff
      │
      │  astro build
      ▼
Content Collections (Zod re-validates)
      │
      ▼
Static pages on Vercel
```

The commit step is deliberate. Content changes show up as a git diff you can read before they reach a patient, and any bad deploy is one `git revert` away.

### Phase 2 — live preview

`/preview` renders on demand via the Vercel adapter, fetching the sheet directly and including `draft` rows. Marked visually as a preview. Never linked from the patient-facing site, never indexed.

---

## Routes

| Route | Renders |
|---|---|
| `/` | Two cards: Stretching, Exercise Protocols |
| `/stretching/` | Grid of stretching body areas |
| `/stretching/[area]/` | Every published stretch for that area, in full, ordered |
| `/exercises/` | Grid of protocol body areas |
| `/exercises/[area]/` | The 4–5 exercise protocol for that area, in full, ordered |
| `/preview` | Phase 2. On-demand, includes drafts, noindex |

Item anchors: `/stretching/neck#str-neck-02`. Stable, shareable, survives reordering because the anchor is the `id` and not the position.

Area slugs come from the sheet. An area with no published items does not get a page and does not appear in the grid — no empty states in front of a patient.

---

## Project layout

```
physio-platform/
├── .claude/                 control layer (see .claude/CLAUDE.md)
├── docs/
│   ├── ARCHITECTURE.md      this file
│   ├── CONTENT-SCHEMA.md    the spreadsheet contract
│   ├── IMAGE-BRIEF.md       image style lock + prompt template
│   └── SHEET-GUIDE.md       one-pager for the clinician (Phase 2)
├── scripts/
│   ├── sync-content.ts      sheet → JSON
│   └── check-images.ts      report image_ids with no file, and orphan files
├── src/
│   ├── assets/images/       AI-generated demonstration images, named by image_id
│   ├── components/          ItemCard, AreaGrid, SafetyNote, ...
│   ├── content/             collection config + Zod schemas
│   ├── data/                items.json, areas.json  (generated, committed)
│   ├── layouts/
│   ├── pages/
│   └── styles/tokens.css    design tokens, light + dark
├── PRD.md
├── memory.md                decision log — read this first
└── astro.config.mjs
```

---

## Images

- One file per `image_id`, e.g. `src/assets/images/str-neck-02.png`.
- Source images: PNG or WebP, at least 1200px on the long edge, 4:3.
- Astro handles resizing and format conversion. Never commit pre-optimised derivatives.
- `npm run check:images` reports both directions: items with no image file, and image files no item references. Both are bugs.
- Every item carries `image_alt_en`. An image with no alt text fails validation — a blind or low-vision patient must still get the instruction.

---

## Deployment

- Vercel, connected to `main`. Push to deploy.
- Preview deployments per branch for reviewing content batches before they go live.
- `npm run build` must pass locally before push (enforced by a hook — see `.claude/hooks/pre-push-check.sh`).
- No environment secrets in v1. The sheet is published read-only; its URL is not a credential but is kept in `.env` anyway so it is easy to rotate.

---

## What could go wrong

| Risk | Mitigation |
|---|---|
| Clinician edits a row and breaks the schema | Build fails with the row number. Nothing reaches production. |
| Sheet published-URL revoked or Google down | Build-time only. Production is unaffected. |
| Image missing for a published item | `check:images` runs in the sync step and warns; item renders a placeholder rather than a broken image. |
| 100 images make the site heavy | Per-page payload is capped by area (max ~6 items). Astro lazy-loads below the fold. |
| Content grows past what a spreadsheet handles | Not before several hundred items. Revisit then, not now. |
| Patient assumes this replaces seeing the physiotherapist | Persistent disclaimer on every area page, wording signed off by the clinician (D4). |
