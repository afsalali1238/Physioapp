# memory.md — decision log and current state

The durable memory of this project. Read before making decisions. Append when a decision is made; never silently rewrite history.

---

## Current state — 2026-08-23

**Phase 0, pre-build.** Specification and control layer written. No code yet, no content yet, no images yet.

Done: PRD, architecture, content schema, image brief, `.claude/` control layer, background research.
Next: clinician sign-off on the open decisions below, then Google Sheet creation, then the neck vertical slice.

---

## The people

- **Afsal** — builds it. Not a clinician. Owns the repo, the deploy, and the image generation.
- **The physiotherapist** — private clinic, UAE. Owns every word of clinical content. Requested the platform. Wrote the concept spec on 2026-08-23 that this PRD is built from.

The division is absolute: Afsal builds the container, she fills it. Nothing clinical is authored, edited, or "improved" on the build side.

---

## Decisions made

### D-001 · Navigation is by body area, not condition
**2026-08-23 · clinician**
Original concept was condition-based (low back pain, frozen shoulder). She replaced it with body area. Consequence: no diagnosis is ever implied, which is both what she wanted clinically and the safer regulatory position under DHA advertisement content rules. Locked.

### D-002 · Two top-level sections
**2026-08-23 · clinician**
Stretching and Exercise Protocols, each with its own list of body areas. The lists differ — stretching has muscle-group areas like hamstrings and calf; protocols have joint areas like elbow and hand. Locked.

### D-003 · Astro 5 + TypeScript on Vercel
**2026-08-23 · Afsal**
Chosen for build-time image optimisation, near-zero shipped JS, and Zod validation of clinician-authored content at build time. Reasoning in `docs/ARCHITECTURE.md`. Revisit only if per-patient assignment becomes real.

### D-004 · Google Sheet is the source of truth, synced at build time
**2026-08-23 · Afsal + clinician**
She edits a sheet; a script pulls, validates, and commits JSON. Production never calls Google. Phase 2 adds a live preview route for draft rows. Rationale: she gets fast feedback, patients get a site that cannot break mid-session.

### D-005 · Flat area pages, not a third navigation level
**2026-08-23 · Afsal · NEEDS CLINICIAN SIGN-OFF**
Her spec implied area → individual exercise. We list all items in full on the area page instead, with stable anchors for direct linking. Three taps per exercise is worse for a patient doing four exercises. Open decision D1.

### D-006 · English at launch, Arabic fields reserved
**2026-08-23 · Afsal**
Every text column has an `_ar` twin, empty. Arabic requires native-speaker clinical review before patients see it — machine translation of clinical instruction is not acceptable. Research note: MOHAP advertisement fees are charged per language, implying language-specific approval if the material is ever classed as advertisement.

### D-007 · No login, no patient data, no tracking
**2026-08-23 · Afsal**
Keeps the project outside UAE Federal Law 2/2019 health-data localisation and outside DHA telehealth scope. Also defensible on the evidence: the Frontiers 2023 meta-analysis found insufficient evidence that reminders and supervision improve home-exercise adherence, while perceived behavioural control — the patient believing they can do it right — was the only high-quality predictor. That is a content-clarity problem, not a telemetry problem. Revisit only on explicit clinical request.

### D-008 · Simple, uncluttered illustration over photoreal imagery
**2026-08-23 · Afsal, on research**
Patient Education and Counseling 2019 (n=204, randomised): illustrated leaflets improved comprehension, but **only the simplified illustration significantly beat text alone**; anatomical drawings gave no comprehension advantage despite patients *rating* them more helpful. Simplification beats realism. This also happens to resolve the modesty question cleanly — a stylised figure sidesteps demonstrator gender and clothing entirely. Still needs clinician confirmation (D2).

### D-009 · Cap total exercise load, not just per-area count
**2026-08-23 · Afsal, on research**
Henry et al. 1999 found patients given 8 exercises performed worse than those given 2; Physiopedia's synthesis reports compliance drops above ~4 exercises. Her 4–5 per area is defensible, but a patient told to use three areas sees 15 exercises. Mitigation: the area page opens with a "start with these two" marker, and the home page never suggests doing multiple areas at once. Needs clinician input on which items are the starting two per area.

---

### D-010 · Licence the demonstration images. Do not AI-generate them.
**2026-08-23 · Afsal, on research · SUPERSEDES the AI-generation plan in D-008**
Two independent research passes converged. Three reasons: (1) Gemini has no structural pose conditioning — `imagen-3.0-capability-001`, Google's controlled-customisation model, was retired 30 June 2026, and Gemini image models have no seed; an Autodesk test found Gemini "altered geometry and reinterpreted spatial proportions" where depth-ControlNet models did not. (2) An approximated joint angle in a patient-facing clinical instruction is a safety problem, not an aesthetic one. (3) GymVisual at ~$75 or WorkoutLabs full library at ~$3,500 perpetual undercut every custom route by orders of magnitude, with consistency guaranteed by construction.
Preference order: WorkoutLabs (has a rehab/PT collection, SVG, male/female) > GymVisual > MoveKit. Fallback if budget is zero: render from a posed 3D figure (PoseMy.Art or Blender + MPFB2, both cleanly licensed for 2D renders), not AI. Details in `docs/IMAGE-PIPELINE.md`.
D-008's style reasoning still stands — simplified illustration over photoreal. Only the production method changed.

### D-011 · Free open datasets rejected
**2026-08-23 · Afsal, on research**
`yuhonas/free-exercise-db` contains branded commercial studio photography with visible third-party trademarks; its upstream source sells a separate "for commercial use" dataset, which is an admission. wger is per-image licensed and visually inconsistent. Everkinetic is CC BY-SA, so ShareAlike infects adaptations. Beyond licensing, coverage fails anyway: every rehab-specific movement tested — chin tucks, clamshells, heel slides, nerve glides, bird dog, quad sets — returns **zero** matches in the 873-exercise corpus. No open physiotherapy image library exists.
Two free sources we WILL use: **Servier Medical Art** (CC BY 4.0, commercial use in apps explicitly permitted) for anatomy diagrams, and **Health Icons** (CC0) for UI. One attribution line covers Servier.
Worth one email: PhysiotherapyExercises.com — 5,000+ physio drawings built with NSW Health, free for clinicians, no reuse licence published. Assume no, but ask.

### D-012 · Print is a first-class output
**2026-08-23 · Afsal, on research**
Only 42% of adults 65+ own a smartphone, and MedBridge data shows adults 85+ use HEP apps at OR 0.33 versus 18–45. Her current handover is paper. A print stylesheet producing a clean A4 handout is module M11, not a nice-to-have.

### D-013 · Local-only "mark as done" and a text-size control
**2026-08-23 · Afsal · NEEDS CLINICIAN VIEW**
A daily tick per exercise, keyed by date, `localStorage` only — nothing leaves the device, nothing reaches the clinic. This is place-keeping for someone working through five exercises, not adherence tracking, and D-007 still holds. Plus a text-size control cycling 100/115/130%: Arab patients surveyed chose 16pt as optimal, and base size is set at 17px for the same reason.
Ask her whether the tick is useful or clutter.

### D-014 · Base font 17px, head-to-toe area ordering
**2026-08-23 · Afsal**
17px not 16, because the reader is older and often magnifying. Body areas sort head-to-toe, never alphabetically — people scan a body top-down, and alphabetical order is an information-design failure in this context.

---

## Open decisions

| # | Decision | Owner | Blocks |
|---|---|---|---|
| D1 | Flat area pages vs per-exercise pages (D-005) | Clinician | Page templates |
| D2 | Illustration style + whether demonstrator gender/clothing matters (D-008) | Clinician | All ~100 images |
| D3 | Clinic branding — name, logo, colours, or unbranded | Clinician | Design tokens |
| D4 | Disclaimer wording and who signs it off | Clinician + Medical Director | Launch |
| D5 | Domain name | Afsal | Deploy |
| D6 | Is "Other body areas" a real catch-all or just future rows | Clinician | Areas tab |
| D7 | Which two items per area are the "start here" pair (D-009) | Clinician | Content |
| D8 | Does DHA/MOHAP class this as advertisement or education | Clinic Medical Director | Launch |

---

## Things we deliberately are not doing

Per-patient assignment · patient accounts · adherence tracking · therapist dashboard · condition pages · video · native app · analytics.

Each was considered and rejected with a reason in the PRD. If one comes back, write a new decision entry rather than quietly reversing.

---

## Risks being carried

- **D8 is the real launch risk.** Nothing in the DHA or MOHAP published material draws a clean line between patient education and medical advertisement, and DHCR's definition explicitly includes "education". The clinic's Medical Director has to make that call, not us. Keeping outcome claims, before/after imagery, and booking CTAs off the site keeps it on the education side of any reasonable reading.
- **The spreadsheet loop is unproven.** If she stops updating it, the platform decays into another stale handout. The Phase 2 acceptance test — she adds one item unaided — is the thing that proves or kills the model.
- **Image consistency across ~100 generated images** is harder than any single image. Locked style block in `docs/IMAGE-BRIEF.md` is the mitigation; batch review is the check.
