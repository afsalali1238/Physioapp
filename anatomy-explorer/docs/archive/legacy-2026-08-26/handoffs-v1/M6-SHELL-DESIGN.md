# M6 — Shell, design system, legal

**Build tool:** GPT-5.6-SOL · **Wave:** 1 · **Branch:** `m6-shell-design` · **Depends on:** M0 (contracts, toolchain) · **Blocks:** M4 and M5, which both own a stylesheet that cannot exist until you have split `global.css`

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

M6 sits in Wave 1 rather than Wave 2 on purpose (MODULE-MAP §2): it splits `src/styles/global.css` into the token, base and print files that M4's `locator.css` and M5's `library.css` sit on top of. Until you land, nobody in Wave 2 can write a line of CSS without colliding.

## 1. Why this module exists

Three visual systems currently exist in this repository and no two of them agree.

**One** is `patient-library/docs/DESIGN-SYSTEM.md` — the written system. Cool grey with a slight green bias, deep pine brand, Archivo / Source Sans 3 / IBM Plex Mono, 17px base, three semantic exercise-type colours, almost no motion.

**Two** is `patient-library/src/styles/tokens.css` — the live tokens, which are a vibrant sky blue `#0ea5e9` on a neutral grey. That is D-026, "Modern Color Palette", 2026-08-24: *"replacing the muted clinical tones with brighter blues and distinct pill colors for better user experience."* An uninstructed reversal of a documented decision, still live.

**Three** is `anatomy-explorer/src/styles/global.css` — 232 lines of navy, teal, coral and ivory, Arial for every role including display, `h1` at `clamp(2.35rem, 8vw, 4.3rem)`. It matches neither of the other two.

M6's job is to make there be **one**, and to make it the written one. Judge this module on that: after M6, `DESIGN-SYSTEM.md` describes the code, one token file is the only place a colour is defined, and `global.css` no longer exists.

Everything else in this module hangs off the same shell: the layout, the persistent disclaimer, the top bar, the footer, the three legal pages, the clinic identity block, and the home page that A-014 defines as three equal entry points.

## 2. Do not redesign

**This section is not boilerplate. Read it before you write CSS.**

The last visual agent on this project shipped three uninstructed changes, all recorded, all reversals of written decisions:

- **D-025 · "Added UX Polish"** — added Astro's `ClientRouter` for page transitions, which `DESIGN-SYSTEM.md` explicitly forbids (*"No page transitions… A patient in pain does not need delight"*), and made the regulatory disclaimer dismissible with a `localStorage` flag.
- **D-026 · "Modern Color Palette"** — replaced the deliberately chosen palette with "brighter blues" for "better user experience".
- **D-027 · PWA support** — added a service worker and manifest, unasked.

Two of the three were repaired in `patient-library`: `Base.astro`'s header comment records removing `ClientRouter`, and `Disclaimer.astro`'s records removing the dismissal and the misapplied `role="alert"`. **The palette was not repaired.** It is still live in `tokens.css` today. Which means: *copying `patient-library/src/styles/tokens.css` verbatim is the single most likely way for this module to fail*, because it carries the one surviving reversal straight into the new app while looking like faithful porting.

The design system is **data**, not a starting point. Specifically, do not change without a decision entry in `memory.md` naming a reason:

| Locked | Why |
|---|---|
| The palette — cool grey with a green bias, deep pine brand | chosen rather than inherited; D-026 already reversed it once |
| The three semantic type colours (`mobility` · `stretch` · `strengthen`) | they are information, not decoration — the one classification the clinician wanted visible. **Do not add a fourth.** |
| 17px base font | the reader is older and often magnifying |
| 44×44px minimum tap target | the reader may be in pain and one-handed |
| No page transitions, no scroll reveals, no ambient animation | 120ms border and 1px lift on hover is the entire motion budget |
| The disclaimer is always present and never dismissible | it is a regulatory element, not a notification |
| Areas sort head to toe, never alphabetically | D-014 |
| The item card's field order and the dosage-block treatment | M5's, and locked for the same reasons |

"Better user experience" is not a reason. If you believe one of these is wrong, say so in your report and leave it alone.

## 3. Files you own

Exactly the M6 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/layouts/**` | **absent** — create `Base.astro` |
| `src/components/shell/**` | **absent** — create; top bar, disclaimer, footer, back link |
| `src/pages/index.astro` | exists, 33 lines — rewrite |
| `src/pages/legal/**` | **absent** — create `[slug].astro` |
| `src/content/legal/**` | **absent** — port three markdown files |
| `src/config/clinic.ts` | **absent** — port |
| `src/styles/tokens.css` | **absent** — create from `DESIGN-SYSTEM.md` |
| `src/styles/base.css` | **absent** — create |
| `src/styles/print.css` | **absent** — create |
| `src/styles/global.css` | exists, 232 lines — **split, then delete** |

**Two files you will want and do not own.** `src/pages/find-my-area.astro` and `src/pages/stretching/index.astro` / `exercises/index.astro` currently each import `global.css` directly. When you delete it they break. That is expected and it is **not yours to fix**: write the import change into `CROSS-MODULE-REQUESTS.md` addressed to M4 and M5, whose rows own those files. Land your split first so they have something to import.

## 4. Files you read, never write

- `patient-library/docs/DESIGN-SYSTEM.md` — **the authority.** Every value you need is in it, written out. It says so itself: *"copy them into `src/styles/tokens.css` rather than re-deriving."*
- `patient-library/src/**` — the working implementations you port from. Read the header comments; they explain the repairs.
- `anatomy-explorer/DESIGN-SYSTEM.md` — the unified restatement. Shorter, consistent with the above, adds the locator and print sections.
- `src/lib/contracts/**` — M0's, frozen.
- `memory.md` A-014 (three entry points), D-025, D-026, D-027; `PRD.md`; `UX-FLOWS.md`; `PORT-CHECKLIST.md`.
- `src/components/AnatomyLocator.astro` — M4's. Read it to know which class names your base layer must keep supporting; do not edit it.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 5. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `anatomy-explorer` has **no layout, no shell components, no legal pages, no clinic config**. Three page files each open their own `<html>` and duplicate the `<head>` | `src/pages/*.astro` |
| `global.css` is 232 lines defining `--navy`, `--teal`, `--coral`, `--ivory`, `--focus: #f2a33a` — a fourth palette, matching nothing | `src/styles/global.css:1-40` |
| It sets `font-family: Arial, Helvetica, sans-serif` for body **and** for `h1, h2, .brand, .button, .eyebrow` — so the three-role type system does not exist here at all | `global.css:16,49` |
| `h1 { font-size: clamp(2.35rem, 8vw, 4.3rem) }` — up to ~69px, against a documented display size of 40px | `global.css:51` |
| `.button { min-height: 48px }` — above the 44px floor, and the one value worth keeping | `global.css:56` |
| `.button` carries a 180ms `transform` transition; the motion budget is 120ms border and a 1px lift | `global.css:56` |
| `patient-library/src/styles/tokens.css` is the **D-026 palette** — `--brand: #0ea5e9` "Vibrant Sky Blue", `--ground: #F3F4F6` — not the documented `#12433A` / `#EEF1EE` | `tokens.css:34-49` |
| Its dark blocks are correctly structured, though: `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, **plus** `:root[data-theme="dark"]` | `tokens.css:53-95` |
| The type and layout tokens above the colour block are theme-independent and correct — `--fs-body: 17px`, `--measure: 780px`, `--r: 14px`, and raw px so `calc(var(--fs-x) * var(--scale))` works | `tokens.css:12-30` |
| `Base.astro` puts the skip link **first in the body**, before the disclaimer and top bar, and its header explains why | `patient-library/src/layouts/Base.astro:52-56` |
| `Disclaimer.astro` is not dismissible and does not carry `role="alert"`; the header records both repairs | `Disclaimer.astro:1-17` |
| The disclaimer's wording comes from `src/content/legal/disclaimer.md` frontmatter (`shortLine`), so the clinic can change it without a code change | `Disclaimer.astro:18-22` |
| `TopBar.astro`'s text-size preference is applied by a **blocking inline script in `Base.astro`'s `<head>`**, not from the deferred component script, to avoid a paint-then-jump | `TopBar.astro:17-22` |
| `clinic.ts` has ten fields, seven of them `PLACEHOLDER_MARKER`, plus `missingClinicFields()` | `patient-library/src/config/clinic.ts:49-67` |
| `emergencyNumbers: '998 (ambulance) or 999'` is hardcoded there — **and is H3, unapproved, and M3's field, not yours** | `clinic.ts:60` |
| The current `index.astro` has a `.landing-orbit` decoration with `.orbit-dot-one` / `.orbit-dot-two` and a `.mini-figure`, and an `<em>` in the `h1` | `src/pages/index.astro:16-30` |
| `patient-library/public/` holds `sw.js` and `manifest.json` — the D-027 service worker | `patient-library/public/` |

**The `public/` trap.** `public/**` is **M8's** row, not yours. `Base.astro` in `patient-library` links `/manifest.json` and a favicon. Porting the layout will tempt you to port those references. Do not add a manifest link, a service worker registration or a `theme-color` meta whose value is the D-026 blue. If a favicon is wanted, that is a `CROSS-MODULE-REQUESTS.md` entry to M8.

## 6. Deliverables

**1. `src/styles/tokens.css` — from the document, not from the live file.** Type and layout tokens ported from `patient-library/src/styles/tokens.css:12-30` (those are correct). Colour tokens taken from `DESIGN-SYSTEM.md`'s Light and Dark blocks — `--ground:#EEF1EE`, `--surface:#FFFFFF`, `--ink:#17211D`, `--brand:#12433A`, and the documented dark set. Keep the three-block dark structure from the live file. Add the three type-face custom properties with real fallback stacks.
**Acceptance:** `grep -c "0ea5e9\|38bdf8" src/styles/` returns 0; every colour in `DESIGN-SYSTEM.md`'s two code blocks appears; `--fs-body` is `17px`; a colour is defined in this file and nowhere else.

**2. The three semantic colours, and only three.** `mobility` · `stretch` · `strengthen`, with their `-bg` pairs, in both themes. If M5 reports an exercise `type` that maps to none of them, that is a mapping decision recorded in `memory.md` — **not a fourth colour**.
**Acceptance:** exactly three semantic pairs exist; the eleven `type` enum values in M1's schema all map onto them; the mapping is written down.

**3. `src/styles/base.css`.** Reset, element defaults, typography scale wired through `calc(var(--fs-x) * var(--scale))`, focus ring (3px, offset 2px, brand), skip-link, `.sr-only`, the 44px control floor, and the reduced-motion block. **The whole motion budget is 120ms on border and a 1px lift.** Delete the 180ms transform transition carried in from `global.css`.
**Acceptance:** no `transition` longer than 120ms; no `transform` transition on a control; `@media (prefers-reduced-motion: reduce)` disables everything animated; `h1` is at most the documented display size, not 4.3rem.

**4. `src/styles/print.css`.** Hide top bar, back link, completion controls, tools and interactive map chrome. Force black on white. `break-inside: avoid` on cards. Print the disclaimer, the clinic identification block and the page URL. Print is a first-class output here — her current handover *is* paper.
**Acceptance:** a printed area page shows no interactive chrome, no split card, and does show the disclaimer and a resolvable URL.

**5. `global.css` split, then deleted.** Nothing of it survives as a file. Anything in it that is genuinely locator-specific goes to M4 through `CROSS-MODULE-REQUESTS.md` as a listed block, **not** copied into your three files — `locator.css` is M4's row.
**Acceptance:** `src/styles/global.css` does not exist; `grep -rn "global.css" src/` returns nothing; M4 and M5 have received their import-change requests in writing.

**6. `src/layouts/Base.astro`.** One `<html>`, one `<head>`, `lang` and `dir` props, title and description props, the blocking inline text-size script in `<head>`, then in body order: **skip link, disclaimer, top bar, `<main id="main-content">`, footer.** The skip link is first. That ordering is a repair someone already made once and explained; do not undo it.
**Acceptance:** every page in the app renders through this layout and none opens its own `<html>`; the skip link is the first focusable element; no `ClientRouter`; no manifest link; no service-worker registration; `astro check` clean.

**7. `src/components/shell/**` — four components.** `Disclaimer.astro` (not dismissible, no `role="alert"`, wording read from the `legal` collection), `TopBar.astro` (text-size control, ≥44px, current level in the accessible name, changes announced), `SiteFooter.astro` (the three safety lines from disclaimer frontmatter, the clinic block, legal links), `BackLink.astro`. Port the header comments — they are the record of what was already fixed and why.
**Acceptance:** no `localStorage` key exists for a disclaimer dismissal; **exactly two** `localStorage` keys exist in the whole app — last chosen area and text size (D-007); every `localStorage` access is in `try/catch`; the text-size control announces its level.

**8. `src/pages/index.astro` — three equal entry points.** A-014: *Find a body area*, *Stretching*, *Exercise Protocols*, as three equal workflows. The locator is not a gate for a patient who already knows their area. Whole-card targets, 150px choice cards, one column below 600px. **Remove the orbit decoration and the `<em>`** — ambient animation is outside the motion budget and the italic display fragment is not in the type system.
**Acceptance:** three entry points with equal visual weight; no `.landing-orbit`, `.orbit-dot`, `.mini-figure`; whole card is the tap target; renders correctly at 360px and at 200% zoom.

**9. `src/config/clinic.ts` and `src/content/legal/**`.** Port the clinic identity file with **every placeholder still a placeholder**, plus `missingClinicFields()`. Port `disclaimer.md`, `privacy.md`, `credits.md` with their frontmatter intact — `shortLine`, `educationalLine`, `stopContactLine`, `emergencyLine`, `approvedBy: null`, `approvedDate: null`. **The schema for this collection is M1's**; you supply the content files, M1 supplies `src/content.config.ts`.
**Acceptance:** `missingClinicFields()` returns the seven unfilled keys; no `approvedBy` or `approvedDate` is non-null; **no clinician name, no licence number, no review date appears anywhere**; M1's `check:compliance` reports the placeholders as launch blockers.

**10. `src/pages/legal/[slug].astro`.** Generated from the `legal` collection, so adding a page means adding a markdown file. Shows "Last reviewed" only when `CLINIC.lastContentReview` is not a placeholder.
**Acceptance:** three legal routes build; the reviewed line is absent while the placeholder stands; no legal route is reachable only from the footer — the disclaimer links to the full notice too.

**11. `DESIGN-SYSTEM.md` and the code agree.** This app's `DESIGN-SYSTEM.md` is in the read-only list, so you do not edit it — you make the code match it, and you report any point where you could not.
**Acceptance:** a reader can open `DESIGN-SYSTEM.md` and `tokens.css` side by side and find no contradiction; every difference you could not resolve is listed in your report.

## 7. What to copy from patient-library/, and what to change on the way

| Source | Take | Change on the way |
|---|---|---|
| `docs/DESIGN-SYSTEM.md` | **the colour values, verbatim** | nothing. This is the authority. |
| `src/styles/tokens.css:12-30` | the type and layout tokens, raw px, the `--scale` contract | keep exactly; they are why the text-size control works |
| `src/styles/tokens.css:34-95` | the **three-block dark structure** | **not the values.** Replace with the documented palette — this block is D-026. |
| `src/layouts/Base.astro` | body order, skip-link-first, the head script, the props shape, the header comment | drop the manifest link, `theme-color`, and the `/preview` robots logic (no preview route here yet); `public/**` is M8's |
| `src/components/Disclaimer.astro` | all of it, including the header explaining the two repairs | wording still comes from the collection; keep it non-dismissible |
| `src/components/TopBar.astro` | the control, the 44px fix, the accessible-name fix, the `--fs-*` fix | brand wording is the clinic's; use `CLINIC.displayName` |
| `src/components/SiteFooter.astro`, `BackLink.astro` | as-is | tokens only, no hardcoded colours |
| `src/config/clinic.ts` | the file, the placeholders, `missingClinicFields()` | **leave `emergencyNumbers` out — that is M3's `src/config/emergency.ts` and it is H3-blocked.** Two homes for one number is how it drifts. |
| `src/content/legal/*.md` | all three, frontmatter intact | `approvedBy`/`approvedDate` stay `null` |

**Do not copy** `public/sw.js` or `public/manifest.json` (D-027, and `public/**` is M8's), `src/i18n/en.json` (Arabic is deliberately not a module — MODULE-MAP §11), or `src/pages/preview/**` (unowned; claim it in `CROSS-MODULE-REQUESTS.md` if it is wanted).

## 8. Contracts

**What M6 consumes:** `contracts/content.ts` for the `legal` frontmatter shape; M1's `src/content.config.ts` for the collection. M1 is a peer in Wave 1 — if the collection is not there yet, write the markdown files and guard the `getEntry` call, exactly as M1 guards its `clinic.ts` import against you.

**What M6 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `tokens.css` + `base.css` | M4, M5, M8 | no module can write a styled component |
| `global.css` deleted | M4, M5 | `locator.css` and `library.css` have no clean base to sit on |
| `Base.astro` | M4, M5 | every page keeps duplicating its own `<head>` |
| `src/config/clinic.ts` | M1, M9 | `check:compliance` cannot report unfilled clinic fields |
| `src/content/legal/**` | M1, M5 | the disclaimer has no wording source |
| the semantic-colour mapping | M5 | the type chip has no colour rule |

**The boundary with M4 and M5.** You own the base layer; they own their feature stylesheets. **They may not add to your three files, and you may not write feature CSS in them.** A shared need arrives as a `CROSS-MODULE-REQUESTS.md` entry and you add the token.

## 9. Hard rules for this module

1. **Do not redesign.** §2 is the list. A change to a locked item needs a `memory.md` entry naming a reason, and "better user experience" is not one.
2. **The disclaimer is never dismissible** and never carries `role="alert"`. Both were already fixed once.
3. **No page transitions, no `ClientRouter`, no scroll reveals, no ambient animation.** 120ms border and a 1px lift is the whole budget.
4. **Never invent clinical content** and **never write a clinician's name, a licence number or a review date** — not in `clinic.ts`, not in legal frontmatter, not as a plausible-looking example.
5. **Never guess the emergency number.** It is not your file. H3 is open.
6. **No analytics, accounts, tracking or backend** (D-007). Exactly two `localStorage` keys, both in `try/catch`.
7. **No booking CTA, no outcome claim, no superlative, no before/after imagery, no condition name** — anywhere, including alt text and comments. Those are the specific elements that reclassify the site from patient education to medical advertisement under MOHAP rules (D-001, MODULE-MAP §11).
8. **Contrast ≥4.5:1 body and ≥3:1 large text and UI borders, in both themes.** Never communicate meaning by colour alone.
9. **`patient-library/` is read-only.** Copy out of it; leave it byte-identical. It is live and it is the rollback target.
10. **Builds cannot run over the Claude device bridge.** `node_modules` holds Windows native bindings and the bridge shell is Linux. **Say which checks you could not run.** And for a visual module, say more than that: **look at what you rendered and describe what you saw** (A-009). A visual task is not finished until you have.

## 10. Definition of done

- One palette. `tokens.css` matches `DESIGN-SYSTEM.md`, carries no sky blue, and is the only place a colour is defined.
- Exactly three semantic type colours, with the eleven-value `type` enum mapped onto them and the mapping recorded.
- `global.css` is deleted; nothing imports it; M4 and M5 have their import-change requests.
- `Base.astro` is the only `<html>` in the app; skip link first; blocking text-size script in `<head>`; no router, no manifest, no service worker.
- Four shell components ported with their header comments; disclaimer non-dismissible; exactly two `localStorage` keys, both guarded.
- Home page shows three equal entry points, no orbit, no `<em>`, whole-card targets.
- `clinic.ts` and the three legal markdown files ported with every placeholder intact and no clinician identity anywhere.
- `print.css` produces a clean printed area page with the disclaimer and a URL.
- Contrast verified in both themes; keyboard-complete; legible at 200% zoom on a 360px viewport.
- **Screenshots taken and described** — home, a legal page, and the shell in both themes at 360px and desktop. Say what you saw, not that you built it.
- `git status --short`, from a real terminal, shows changes only in M6's rows of MODULE-MAP.md §5.
- `memory.md` carries a decision entry for restoring the documented palette over D-026, and for anything else you changed in a locked item.
- `CROSS-MODULE-REQUESTS.md` carries: the `global.css` import changes for M4 and M5, the locator-specific CSS block handed to M4, the semantic-colour mapping for M5, and any favicon/manifest question for M8.

## 11. When you are blocked

**H4 — the disclaimer wording and who signs it off — is open and blocks launch, not you.** Ship the slot with `PLACEHOLDER_MARKER`; M9's build gate stops it reaching a patient route. Do not write a plausible disclaimer to fill the space. A wrong regulatory statement on patient-facing material is worse than a visibly missing one.

**H6 — the domain — is M0's placeholder and affects your footer's printed URL.** Print the placeholder; do not invent a domain.

**If a documented value and a live file disagree, the document wins in this module and only in this module.** That is the inversion of MODULE-MAP §8's general rule, and it is deliberate: everywhere else the code is the fact because the docs describe an intended product. Here the code *is* the thing that drifted, the drift is recorded as D-026, and your job is to close it. If you find a third case where the two disagree and the document does not look like the intent, report it rather than guessing.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue. This project has been damaged twice by agents editing outside their lane, and both incidents were visual modules.
