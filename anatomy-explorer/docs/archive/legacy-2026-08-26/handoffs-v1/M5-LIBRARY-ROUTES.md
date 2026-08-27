# M5 — Library routes & exercise card

**Build tool:** Hermes · **Wave:** 2 · **Branch:** `m5-library-routes` · **Depends on:** M1 (content API), M6 (shell and base CSS)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

**Every area card on both index pages is a 404 today.**

`src/pages/stretching/index.astro` and `src/pages/exercises/index.astro` exist and render area cards linking to `/stretching/${area_id}/` and `/exercises/${area_id}/`. Neither route exists. `ARCHITECTURE.md` describes them; the file tree does not contain them. So the two entry points A-014 made first-class both lead to a dead end after one tap.

M5 builds the missing half of the product: the area page, and the exercise card that is the thing a patient actually reads while doing the exercise. `patient-library` already has a working version of both — 296 lines of route plus a reviewed image component — and this module is largely a careful port with three specific things fixed on the way (§5).

Judge this module on one sentence: **every area card on every published surface resolves to a page that renders the clinician's content, and no unapproved image or draft row reaches a patient.**

## 2. Files you own

Exactly the M5 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/pages/stretching/index.astro` | exists, 6 lines, one long line — rewrite |
| `src/pages/stretching/[area_id].astro` | **absent** — create |
| `src/pages/exercises/index.astro` | exists — rewrite |
| `src/pages/exercises/[area_id].astro` | **absent** — create |
| `src/components/library/**` | **absent** — create; the card, the image, the dosage block, the back link usage |
| `src/styles/library.css` | **absent** — create |

**`src/lib/images.ts` is in no row.** `patient-library` has a 9-line version doing `import.meta.glob` over `src/assets/images/`. You need it; M7 owns the images themselves but not the resolver. **Claim it in `CROSS-MODULE-REQUESTS.md` before you create it.**

**`src/pages/preview/**` is in no row either.** `patient-library` has a preview surface where the clinician reviews unapproved work — the one place `ExerciseImage`'s approval gate deliberately inverts. It is genuinely useful and it is genuinely not assigned. Claim it or leave it; do not build it silently.

## 3. Files you read, never write

- `patient-library/src/pages/[section].astro`, `[section]/[area_id].astro`, `src/components/ExerciseImage.astro`, `src/lib/images.ts` — the working implementations. Copy out; leave byte-identical.
- `patient-library/docs/DESIGN-SYSTEM.md` — "The item card" section is the spec, including the reasons.
- `src/lib/content.ts` — **M1's**, and the only route to content.
- `src/lib/contracts/content.ts`, `assets.ts` — M0's, frozen.
- `src/layouts/Base.astro`, `src/components/shell/**`, `src/styles/tokens.css`, `base.css`, `print.css` — **M6's.** Consume; never add to.
- `src/assets/images/**` — **M7's.** Reference by id; never add, rename or delete a file.
- `PRD.md`, `PRODUCT-BLUEPRINT.md`, `ARCHITECTURE.md`, `CLINICAL-SAFETY.md`, `PORT-CHECKLIST.md`.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 4. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `/stretching/[area_id]/` and `/exercises/[area_id]/` **do not exist**. Every area card is a 404 | file tree vs `stretching/index.astro` |
| Both index pages import `getPublishedAreas` from `src/lib/library.ts`, which **M1 is deleting** | `stretching/index.astro:2` |
| Both index pages import `global.css`, which **M6 is deleting**, and open their own `<html>` | same file |
| `stretching/index.astro` is 6 lines with the entire body on one unformatted line | file |
| The live corpus has **4 published areas** (neck + shoulder in each section) and **5 published items**. Twelve areas and twenty-one items are `draft` | `patient-library/src/data/*.json` |
| **The naming trap:** section value is `exercise` (singular), route is `/exercises/` (plural). `stretching` is identical in both, so half of any test set passes by coincidence | `areas.json`; M2's `check-anatomy.ts` asserts this |
| `patient-library/src/pages/[section]/[area_id].astro` is 296 lines: card, dosage block, labelled steps, target muscles, safety line, completion control | file |
| `ExerciseImage.astro` gates on `imageStatus === 'approved'`; anything less renders a **labelled empty slot** with a reason string, and `preview` inverts the gate | `ExerciseImage.astro:38-60` |
| Its header explains why: `ex-neck-02.jpg` depicts the opposite of its own instruction, and the rejected renders were still on disk | `ExerciseImage.astro:1-24` |
| `image_status` is `'pending' \| 'generated' \| 'approved'` — **there is no `'rejected'` value**, though `IMAGE-TEST-VERDICT.md` instructs marking the nine test images `image_status: rejected` | `patient-library/src/lib/schemas.ts:47` vs `IMAGE-TEST-VERDICT.md` |
| `validate.ts` caps an area at **8 published items** and requires `image_id` to start with `{str\|ex}-{area_id}-` | `patient-library/src/lib/validate.ts:57,138-150` |
| The completion control writes `localStorage` under a **date-derived key**, `physio-done-YYYY-M-D` — a **new key every day, never cleaned up** | `[area_id].astro:261-291` |
| MODULE-MAP §7 permits **exactly two** `localStorage` keys: last chosen area and text size. `CLINICAL-SAFETY.md` · Privacy separately says "disclosed UI preferences **and completion marks**" | both documents |
| The area page prints "Start slowly — perform only the first two items until comfortable" as **static copy**, not as data | `[area_id].astro:35-37` |
| `PRODUCT-BLUEPRINT.md` specifies a real "start here" pair; the sheet has no column for it. That is **H7**, open | `PRODUCT-BLUEPRINT.md`; `schemas.ts` |
| Cards use stable ids and `scroll-margin-top` for deep links | `[area_id].astro:41`; `DESIGN-SYSTEM.md` |

**The `localStorage` conflict is a real contradiction and it is yours to surface, not to settle quietly.** MODULE-MAP §7 says two keys and names them; `CLINICAL-SAFETY.md` allows completion marks; the live implementation creates an unbounded set of dated keys, which satisfies neither. **Do not port the completion control as-is.** Write the conflict into `CROSS-MODULE-REQUESTS.md`, ship without the control (the card is complete and safe without it), and let the decision come back. If it is approved, it lands as **one** key with a bounded shape.

## 5. Deliverables

**1. Four routes, and every card resolves.** `stretching/index.astro`, `stretching/[area_id].astro`, `exercises/index.astro`, `exercises/[area_id].astro`. `getStaticPaths` generates only from **published** areas. An area with published status but zero published items renders as a non-linked "Coming soon" tile rather than a link to an empty page — the pattern `patient-library/src/pages/[section].astro:38-49` already uses.
**Acceptance:** zero 404s from any published surface; every area card either links to a page that renders items or is visibly not a link; with the current corpus, 2 linked areas and 6 "Coming soon" tiles per section.

**2. The pluralisation boundary, in exactly one place.** The route segment is `/exercises/`; the data value is `exercise`. Convert at the route boundary, in one named helper, with a one-line comment. **Do not normalise inside `content.ts`** — that is M1's file and its accessors take the data value.
**Acceptance:** one function converts section ↔ route segment; `grep -rn "'exercises'" src/` shows it only in route construction and page paths; M2's `check:anatomy` passes.

**3. Published-only, everywhere, by default.** Every list and every `getStaticPaths` goes through M1's accessors with no explicit draft opt-in. A draft row must not be reachable by URL guess on a patient route.
**Acceptance:** with the current corpus, exactly 5 items render across the whole site; requesting a draft area's URL produces a 404, not a page; no accessor call in your files passes a draft flag.

**4. The exercise card, field order locked.** Image (4:3) → number + type chip → name → bordered dosage cells → labelled instruction steps (START / MOVEMENT / DIRECTION or RETURN / KEEP IN MIND) → target-muscle line → persistent safety line. **Do not rearrange it** — `DESIGN-SYSTEM.md` states the order is the information hierarchy and lists the reasons. Dosage cells render only when they have a value. Numbers use the mono face with tabular figures so they align between cards.
**Acceptance:** the rendered order matches the ASCII diagram in `DESIGN-SYSTEM.md` · The item card exactly; a stretch with no `sets` shows no empty Sets cell; dosage figures align vertically across two stacked cards.

**5. The safety line is always present and always visually separate.** Its own colour, its own icon, never skimmable as body text. `DESIGN-SYSTEM.md` gives the reason: pain guidance is a documented top-three barrier to home-exercise adherence.
**Acceptance:** every card shows `safety_en`; it is distinguishable without colour (icon plus weight, not colour alone); it is never inside a collapsed or truncated region.

**6. `ExerciseImage` ported with its gate intact.** Only `image_status === 'approved'` renders. Anything else — pending, generated, undefined, missing file, missing or thin alt text — renders the labelled empty slot with its reason. **Port the header comment.** It is the record of why the gate exists and it names the image that depicts the opposite of its own instruction.
**Acceptance:** an item with `image_status: 'generated'` renders a slot, not a picture; an item with `approved` but no `image_alt_en` renders a slot, not `alt=""`; the four surviving images in `patient-library/src/assets/images/` render only if their rows say `approved`.

**7. Alt text is never empty and never decorative.** A demonstration image is clinical content. If `image_alt_en` is missing or under the 45-character floor M1's `validate.ts` enforces, fall back to the slot. Never emit `alt=""` on a card image.
**Acceptance:** `grep -n 'alt=""' src/components/library/` returns nothing; a screen-reader pass through one area page conveys every exercise position from text alone.

**8. `src/styles/library.css`.** Card, dosage block, chips, area grid, "Coming soon" tile. **Every value is one of M6's tokens** — no hex colour, no raw font size, no new spacing scale. The three semantic type colours come from M6; if an exercise `type` maps to none of them, that is a mapping request to M6, **not a fourth colour**.
**Acceptance:** `grep -nE "#[0-9a-fA-F]{3,6}" src/styles/library.css` returns nothing; every `font-size` is `calc(var(--fs-*) * var(--scale))`; all eleven `type` enum values resolve to one of three colours.

**9. Print works.** M6 owns `print.css`; you make the card printable — `break-inside: avoid`, no split cards, image alt and context retained, controls hidden. Her current handover *is* paper.
**Acceptance:** a printed area page shows every card whole, with the disclaimer and a resolvable URL, and no interactive chrome.

**10. Deep links.** Every card carries its stable item id as its element id and a `scroll-margin-top` that clears M6's sticky top bar. `/stretching/neck/#str-neck-02` lands on that card, not under the bar.
**Acceptance:** each card's `id` equals its item id; a deep link to the last card on a page scrolls it fully into view below the top bar at 360px.

**11. No completion control this wave.** See §4. Ship without it, file the conflict, and say so in your report.
**Acceptance:** `grep -rn "localStorage" src/pages/ src/components/library/` returns nothing; the conflict entry exists in `CROSS-MODULE-REQUESTS.md` naming MODULE-MAP §7, `CLINICAL-SAFETY.md` · Privacy, and the dated-key defect.

**12. The "Start slowly" line, resolved.** It is currently static copy asserting a clinical instruction about the first two items — which is H7's decision, and H7 is open with no data column to support it. **Either** render it as the generic non-item-specific line it already is, clearly not tied to any two particular exercises, **or** drop it. Do not invent a "start here" flag. Report which you chose.
**Acceptance:** no code identifies specific items as a starting pair; if the line ships, it makes no claim about which items come first.

## 6. What to copy from patient-library/, and what to change on the way

| Source | Take | Change on the way |
|---|---|---|
| `src/pages/[section].astro` | the area-grid layout, the "Coming soon" tile, the count logic | split into two explicit routes; source from M1's `content.ts`, not `astro:content` directly, so the published filter is single-sourced |
| `src/pages/[section]/[area_id].astro` | the card structure, the dosage `<dl>`, the labelled steps, the ids and `scroll-margin-top` | **drop the completion control and its `localStorage`**; render through M6's `Base.astro`; decompose the 296 lines into `src/components/library/` |
| `src/components/ExerciseImage.astro` | all of it, header comment included | tokens from M6; the `preview` prop stays but only wire it if you claim the preview route |
| `src/lib/images.ts` | the `import.meta.glob` resolver | claim it first; point it at this app's `src/assets/images/` |
| `docs/DESIGN-SYSTEM.md` · The item card | the field order, the dosage-block treatment, the safety-line rule | nothing. This is the spec. |
| `src/components/BackLink.astro` | nothing — it is **M6's** now | import M6's version |

**Do not copy** the `physio-done-*` script, `src/i18n/en.json` (Arabic is deliberately not a module), anything under `public/` (M8's), or the `[section]` dynamic-param shape — MODULE-MAP §5 gives you two explicit route directories, and the singular/plural mismatch is exactly why a single dynamic `[section]` param is a trap here.

## 7. Contracts

**What M5 consumes:**

| From | What | Rule |
|---|---|---|
| M1 | `src/lib/content.ts`, `contracts/content.ts` | the only route to content. **Never import above `anatomy-explorer/`.** M1 stubs `content.ts` on day one so you are not blocked. |
| M6 | `Base.astro`, `tokens.css`, `base.css`, `print.css`, shell components, the semantic-colour mapping | consume only; never add to M6's stylesheets |
| M7 | `src/assets/images/**`, `image_status` semantics | reference by id; never add or rename a file |
| M0 | `contracts/**`, `__placeholders__/` | frozen |

**What M5 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| the four routes | M4, M8, M9 | the locator's exercise handoff has nowhere to go; the release checklist cannot test zero-404 |
| `src/components/library/**` | M9 | no card to snapshot or print-test |
| the section ↔ route-segment helper | M2 | `check:anatomy` has no single place to assert pluralisation against |

**If a contract field is missing, do not widen it.** File it in `CROSS-MODULE-REQUESTS.md` and let M0 edit. Specifically: `image_status` has no `'rejected'` value even though `IMAGE-TEST-VERDICT.md` instructs using one. That is a real gap — file it, and until it is resolved treat any non-`approved` status identically.

## 8. Hard rules for this module

1. **Never invent clinical content.** Exercise names, instructions, dosages, hold times, reps, target muscles and safety lines are all hers. Not in a fixture, not in a comment, not as example copy in a component's props documentation.
2. **Never write a clinician's name or a review date** into any file.
3. **If content looks clinically wrong, flag it and stop.** Do not fix it, reword it, or reorder it.
4. **Only `approved` images ship.** Never widen the gate to make a page look finished.
5. **Never relax the compliance check.** Fix the content, never the check. Import M1's module; **no second blocklist**.
6. **Navigation is by body area, never by condition** (D-001). No diagnosis language anywhere, including comments, class names, filenames and commit messages.
7. **Published-only by default.** A draft row must never be reachable on a patient route by URL guess.
8. **No booking CTA, no outcome claim, no superlative, no before/after imagery.** Those four are the specific elements that reclassify the site from patient education to medical advertisement under MOHAP rules. That is not a style preference.
9. **No analytics, accounts, tracking or backend** (D-007). No `localStorage` from this module this wave.
10. **Areas sort head to toe, never alphabetically** (D-014). 17px base, 44px minimum target, whole tile is the target.
11. **`patient-library/` is read-only** and no import reaches above `anatomy-explorer/`.
12. **Builds cannot run over the Claude device bridge** — Windows native bindings, Linux shell. **Say which checks you could not run. Never report a check as passed when the environment prevented it from running.**

## 9. Definition of done

- Four routes exist. **Zero 404s** from any published surface. Every area card either resolves or is visibly not a link.
- One pluralisation boundary, one helper, `check:anatomy` green.
- Exactly 5 items render across the site with the current corpus; no draft row is reachable.
- Card field order matches `DESIGN-SYSTEM.md` exactly; dosage cells conditional; figures aligned; safety line always present and visually separate.
- `ExerciseImage` gate intact, header comment ported, no `alt=""` anywhere, slot reasons render.
- `library.css` contains no hex colour and no raw font size; all eleven `type` values map to three semantic colours.
- Print produces whole cards, disclaimer and URL, no chrome. Deep links land clear of the top bar.
- No `localStorage` in this module; the completion-control conflict is filed with all three sources named.
- The "Start slowly" line resolved without inventing a start-here flag.
- `git status --short`, from a real terminal, shows changes only in M5's rows of MODULE-MAP.md §5.
- `CROSS-MODULE-REQUESTS.md` carries: the `src/lib/images.ts` claim, the preview-route claim or an explicit decline, the `image_status: 'rejected'` gap for M0/M1, the `localStorage` conflict, and any semantic-colour mapping needed from M6.

## 10. When you are blocked

**If M1's `content.ts` is not ready, build against `contracts/content.ts` and `contracts/__placeholders__/`.** Every placeholder string is `PLACEHOLDER_MARKER`. **Never write realistic clinical prose into a fixture** — M9's build gate fails if `PLACEHOLDER_MARKER` reaches a patient route, and that gate is the only thing standing between a placeholder and a patient. A fixture that reads like a real exercise defeats it silently.

**If M6 has not landed, do not write your own tokens.** Wait, or build the markup and leave the stylesheet thin. A second palette in `library.css` is precisely the failure M6 exists to end.

**H7 and H8 are open and neither blocks you.** H8's default is flat area pages (D-005) — build that. H7's start-here pair has no data; do not simulate it.

**If the live corpus fails a check you ported** — for example all five published items carrying no `reviewed_by` — that is a finding, not a bug in the check. Report it with row ids and leave the threshold alone.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue.
