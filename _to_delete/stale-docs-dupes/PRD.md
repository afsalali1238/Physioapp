# Patient Exercise & Stretching Platform — PRD

**Status:** Draft v1 · Approved by physiotherapist pending
**Owner (build):** Afsal
**Owner (clinical):** Physiotherapist, private clinic (UAE)
**Last updated:** 2026-08-23

---

## 1. Problem

A physiotherapist in a private clinic teaches a patient exercises in the room, then the patient goes home and forgets: the position, the direction of movement, how long to hold, how many times. The current handover is printed sheets, WhatsApp photos, or nothing. Generic printed sheets do not match what was taught, get lost, and carry no explanation of *what the exercise is doing*.

## 2. What we are building

One web link the physiotherapist sends to any patient. The patient opens it and finds exercises organised **by body area**, not by diagnosis.

Two top-level sections:

- **Stretching** — area-specific stretches
- **Exercise Protocols** — a small, curated protocol per area (4–5 exercises)

The patient thinks *"I want to stretch my neck"* or *"I want to exercise my shoulder"*, taps that area, and gets what they need with a demonstration image, plain instructions, and dosage.

## 3. What we are explicitly NOT building (v1)

| Not building | Why |
|---|---|
| Per-patient assigned programmes | She gives one link to everyone. Assignment needs accounts and a backend. Revisit only if she asks. |
| Login / patient accounts | No patient identity means no health-data obligations. Keep it that way as long as possible. |
| Adherence tracking or a therapist dashboard | Not requested. A dashboard nobody opens is worse than none. |
| Condition or diagnosis pages | Deliberately removed by the clinician. Body-area navigation implies no diagnosis, which is also the safer position. |
| Video | Images first. Video is a content-production problem, not a build problem. |
| Native app | A link is the whole point. |

## 4. Users

**Primary — the patient.** On a phone, possibly in pain, possibly older, possibly not a confident phone user, possibly reading a second language. Opens the link once, maybe returns daily for two weeks. Never logs in. Never types anything.

**Secondary — the physiotherapist.** Sends the link. Maintains the content in a spreadsheet. Never touches code. Needs to add a new stretch in under two minutes without asking anyone.

## 5. Information architecture

```
HOME
├── STRETCHING
│   └── [body area]  →  list of stretches, each shown in full
└── EXERCISE PROTOCOLS
    └── [body area]  →  protocol of 4–5 exercises, each shown in full
```

**Stretching areas:** neck · shoulder · chest · upper back · lower back · hip · gluteal · thigh · hamstrings · quadriceps · knee · calf · ankle · wrist · forearm

**Exercise Protocol areas:** neck · shoulder · elbow · wrist · hand · upper back · lower back · hip · knee · ankle · foot

Areas are data, not code. Adding an area is a spreadsheet row.

### Navigation depth — a deliberate deviation

The clinician's spec described a third tap: *area → individual stretch*. **We are not doing that.** The area page lists every stretch in full, stacked, and the patient scrolls.

Reasoning: three taps to reach one exercise means a patient doing four exercises taps twelve times and loses their place between each. Scrolling one page is how people actually use their phones. Every item still gets a stable anchor (`/stretching/neck#str-neck-02`) so a single stretch can be linked directly when she wants to.

**This needs her sign-off before content production begins.**

## 6. Content model — what every item shows

### Stretches
- Image demonstrating the stretch
- Name
- Starting position
- How to perform it
- Direction of movement
- Hold duration
- Repetitions (where applicable)
- Muscle / muscle group being stretched
- Basic safety instruction

### Exercises
- Image demonstrating correct technique
- Name
- Exercise type (range-of-motion, isometric, eccentric, stabilisation, activation, etc.)
- Starting position
- Movement
- Return
- Dosage: reps × sets, hold duration, rest period
- Target muscles
- Basic safety instruction

All instructions are short, plain, and written for a patient working alone. Full field definitions and validation rules live in `docs/CONTENT-SCHEMA.md`.

## 7. Content ownership and the update loop

**The spreadsheet is the source of truth.** The physiotherapist owns a Google Sheet. She adds a row, fills the columns, marks it `published`.

**Phase 1 — build-time sync (now).** A script pulls the sheet, validates every row, and writes JSON into the repo. That JSON is committed and deployed. The live site never calls Google, so it cannot break in front of a patient. She tells Afsal she's made changes; he runs `npm run sync:content` and ships.

**Phase 2 — live preview (later).** A preview URL renders directly from the sheet, including `draft` rows, so she can see her edits immediately without waiting. Production stays on the committed JSON.

This split is the point: she gets fast feedback, patients get a site that always works.

## 8. Images

Every item references an `image_id`. Images are AI-generated by Afsal from a locked prompt style and committed to the repo. Consistency across ~100 images matters more than any single image being beautiful — a library where every figure looks different reads as untrustworthy.

Style, negative prompts, demonstrator conventions, and the per-item prompt template live in `docs/IMAGE-BRIEF.md`. **Blocked on:** clinician confirming demonstrator gender/clothing conventions for her patient population.

## 9. Language

English at launch. Every text field in the schema has a matching `_ar` column, left empty for now. Adding Arabic later is filling in cells and enabling a route — not a rebuild. Arabic must be reviewed by a native-speaking clinician before it reaches patients; machine translation of clinical instructions is not acceptable.

## 10. Non-functional requirements

| | Target | Why |
|---|---|---|
| First load | < 2s on 4G | Patient is standing in a corridor |
| JS shipped | Near zero on content pages | Cheap phones, weak signal |
| Images | Responsive, modern formats, lazy below the fold | ~100 images is the whole payload |
| Offline | Page works once loaded; no hard dependency on a live API | Clinic wifi is unreliable |
| Accessibility | WCAG 2.1 AA. Real contrast, 44px targets, works at 200% zoom | Older patients, pain, one-handed use |
| Themes | Light and dark both designed | Phone default varies |
| No tracking | No analytics that identify a patient | Health context |

## 11. Success criteria

**Launch:** she sends one link instead of a printed sheet, and stops re-explaining exercises over WhatsApp.

**Three months:** she has added content herself without asking Afsal. That is the real test — if the spreadsheet loop doesn't hold, the platform becomes another thing that decays.

**Failure signals:** patients call asking what an exercise means (instructions unclear); she stops updating (loop too slow); she keeps printing sheets anyway (the link isn't easier than paper).

## 12. Open decisions

| # | Decision | Needs |
|---|---|---|
| D1 | Flat area pages vs per-exercise pages (§5) | Clinician sign-off |
| D2 | Demonstrator gender/clothing conventions | Clinician |
| D3 | Clinic branding — name, logo, colours, or unbranded | Clinician |
| D4 | Safety/disclaimer wording — who signs it off | Clinician |
| D5 | Domain name | Afsal |
| D6 | Whether "Other body areas" is a real catch-all area or just future rows | Clinician |

## 13. Phases

**Phase 0 — Foundations.** Repo, Astro scaffold, schema, sync script, one area (neck) end-to-end in both sections. Purpose: get the format approved before producing 100 items.

**Phase 1 — Content production.** All areas, all items, all images. The long pass.

**Phase 2 — Handover.** Sheet handed to the clinician with a one-page guide. She adds one item unaided as the acceptance test.

**Phase 3 — Live preview.** Draft-row preview URL.

**Phase 4 — Optional.** Arabic. Print stylesheet for a paper fallback. Per-area QR codes for the clinic wall.
