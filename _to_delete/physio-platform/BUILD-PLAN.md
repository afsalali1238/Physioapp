# Build Plan

Sequenced so the expensive, irreversible work — 100 images and 100 written items — happens only after the cheap, reversible work has been approved.

**The governing rule: nothing gets produced at scale until the clinician has approved the format at a scale of one.**

---

## Stage 0 · Approval — before any code *(now)*

Nothing below can safely start until these come back.

| # | Question for the clinician | Blocks |
|---|---|---|
| D1 | Does the flat area page work, or does she want a page per exercise? | All page templates |
| D2 | Is the item card layout right? Field order, dosage block, safety line? | Card component, and every written item |
| D7 | Which two items per area are the "start here" pair? | Content |
| D3 | Clinic branding — name, logo, colours, or unbranded? | Design tokens |
| D4 | Disclaimer wording, and who signs it off | Launch |
| D8 | Does the Medical Director class this as education or advertisement? | Launch |
| D6 | Is "Other body areas" real, or just future rows? | Areas tab |
| NEW | Does she want the daily "mark as done" tick, or is it clutter? | Card component |
| NEW | Is "Keep in mind" the right label for the direction field? | Card component, schema |

**Send her the prototype link.** Ask her to open it on her phone, not a laptop — that is where patients will see it.

**In parallel, Afsal:** run the WorkoutLabs and GymVisual coverage check (Stage 2). It takes an hour and it decides a $75-versus-two-weeks question.

---

## Stage 1 · The sheet, before the code

**Why first:** the sheet is the interface contract. Writing a sync script against a sheet that doesn't exist is how the columns end up wrong.

1. Create the Google Sheet. Two tabs, `areas` and `items`, headers copied **exactly** from `docs/CONTENT-SCHEMA.md`.
2. Fill the `areas` tab completely — every body area for both sections, head-to-toe `order`.
3. Fill **one** item row by hand: the `ex-neck-02` Chin Tuck worked example in the schema doc.
4. Publish the sheet to the web as CSV. Note the ID.
5. Add data validation in the sheet itself for `section`, `status`, `type` and `area_id` — catching a typo in the sheet is far better than catching it in a failed build.

**Done when** one valid row exists and the CSV export URL works.

---

## Stage 2 · Decide the image source

**Do this before writing any content**, because the licensed library's exercise names should influence which exercises get written — matching a licensed illustration is free, commissioning one is not.

1. Draft the full ~100-item list, names only. No instructions yet.
2. Check it against WorkoutLabs' **Rehab & Physical Therapy** collection and GymVisual's catalogue.
3. **If coverage ≥85%:** buy. WorkoutLabs full library perpetual (~$3,500) or GymVisual à la carte (~$75). Commission the gaps from one vector illustrator matched to that style. **Stop here.**
4. **If coverage is poor, or the budget is zero:** the render fallback — PoseMy.Art or Blender + MPFB2. ~1.5–2 weeks.
5. Email PhysiotherapyExercises.com regardless. 5,000+ physio drawings built with NSW Health, free for clinicians, no reuse licence published. Worst case they say no; it costs one email.

**Do not AI-generate the demonstrations.** Reasoning in `docs/IMAGE-PIPELINE.md` — Gemini has no pose constraint since Imagen's controlled-customisation model was retired in June 2026, and an approximated joint angle in a clinical instruction is a safety problem, not an aesthetic one.

**Done when** the source is chosen, licensed, and one image exists for `ex-neck-02`.

---

## Stage 3 · Vertical slice — M01 to M09

Build the modules in `docs/MODULES.md` order, but load **only the neck content**.

Target: `/exercises/neck/` live on a Vercel URL, rendering five real items from the real sheet, with real images.

**Done when** she can open the real thing on her phone and it is indistinguishable from the finished product except that only one area exists.

**Gate: she approves before Stage 4.** If the card layout changes here, one area gets rewritten. If it changes after Stage 5, twenty-five do.

---

## Stage 4 · Harden — M10 to M13, M16

Accessibility, print, compliance surface, i18n scaffolding, CI gates. All still on one area of content.

Cheaper to fix an accessibility problem across 5 items than 100, and the print stylesheet inherits directly from the approved card layout.

**Done when** axe-core is clean on both themes, an area prints to clean A4, the banned-term check fails a seeded bad row, and CI is green.

---

## Stage 5 · Content production — the long pass

Only now, and area by area, never all at once.

Per area:
1. Run **Prompt A** from `docs/GEMINI-CONTENT-RESEARCH.md` — one Deep Research session per area, never batched
2. Paste output into the sheet as `status: draft`
3. Run **Prompt C**, the adversarial check, in a fresh session
4. Clinician reviews, edits, sets `status: published`
5. Source or render the images for that area
6. **Review images in a contact sheet of 10, against each other.** Style drift and anatomical error only show up in comparison.
7. Sync, review the git diff, ship

**Rules that matter more than they look:**
- Nothing reaches `published` except by the clinician's hand
- Any dosage returned without a citation makes the whole research run suspect — throw it away and re-run. Fabricated dosage reads exactly like real dosage; it is the failure mode that gets past everyone.
- Run **Prompt B**, the safety and disclaimer layer, once after all areas are drafted

Then M14: QR codes and the printable contact sheet for the clinic wall.

---

## Stage 6 · Handover

1. Give her the sheet with `docs/SHEET-GUIDE.md` — one page, screenshots, no jargon
2. **Acceptance test: she adds one new stretch, unaided, end to end.** If she cannot, the maintenance model has failed and needs rethinking now, not in six months.
3. Print the QR sheet for the clinic wall
4. Agree a review cadence — every item carries `reviewed_date`, and clinical content that nobody has looked at in a year is a liability

---

## Stage 7 · Later, only if asked

M15 live preview · Arabic (native-speaker clinical review required) · per-area QR posters · whatever her first three months of use actually reveals.

---

## Two ways this fails

**She stops updating the sheet.** Then the platform becomes another stale handout, exactly like the printed sheets it replaced. Stage 6's acceptance test is the early warning. If she struggles, fix the loop before producing more content.

**We produce 100 items before she's really looked at one.** The whole plan above exists to prevent this. Every gate is there because rework at scale is what kills projects like this.

---

## Rough shape of the effort

| Stage | Who | Rough size |
|---|---|---|
| 0 Approval | Clinician | Days of waiting, hours of her time |
| 1 Sheet | Afsal | Half a day |
| 2 Image source | Afsal | 1 hour to decide, then hours or 2 weeks |
| 3 Vertical slice | Afsal | 2–4 days |
| 4 Harden | Afsal | 2–3 days |
| 5 Content, per area | Both | ~half a day per area × 25 |
| 6 Handover | Both | 1 day |

Stage 5 dominates and is the one that stalls. Budget for it honestly, and do not start it until Stage 3 has been approved.
