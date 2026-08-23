# Deep research prompts — content production

For running in Gemini Deep Research to produce **draft** content for the physiotherapist to review, edit, and approve.

**Read this first.** Nothing these prompts produce is clinical content until the physiotherapist has reviewed and published it. The output is a research-backed starting point that saves her writing from a blank page. It is not authority, and it must never be pasted into the sheet with `status: published`. Every row lands as `draft`.

Run **Prompt A once per body area** — one area per Deep Research session. Deep Research degrades badly when asked to cover fifteen areas at once; you get shallow, generic output and hallucinated dosages. Twenty-six focused runs beat one giant run every time.

---

## Prompt A — per body area

Replace `{{SECTION}}` with `Stretching` or `Exercise Protocol`, and `{{AREA}}` with the body area. Paste the whole thing.

---

You are assisting a qualified physiotherapist in a private clinic in the UAE who is building a patient-facing home exercise library. She will review, edit and approve everything you produce. Your job is to give her a well-sourced draft, not to practise physiotherapy.

**What I need**

A draft {{SECTION}} set for the **{{AREA}}**, containing **4 to 6 items**, suitable for a patient to perform unsupervised at home with no equipment beyond a sturdy chair, a wall, a towel, a firm mat, or a basic resistance band.

**Selection criteria — apply in this order**

1. Appears consistently across reputable physiotherapy sources for this body area
2. Safe to perform unsupervised, with a low ceiling for harm if performed imperfectly
3. Requires no specialist equipment and no partner
4. Genuinely distinct from the other items in the set — no near-duplicates
5. Together the set covers the area sensibly. For an Exercise Protocol, order it as a progression: mobility or activation first, then strengthening, then functional. State the intended order.

Explicitly **exclude**: high-load or ballistic movements, anything requiring hands-on guidance, anything requiring a diagnosis to prescribe safely, anything where poor form carries meaningful injury risk, and end-range or provocative techniques.

**Source hierarchy — use in this order and say which tier each claim came from**

- Tier 1: systematic reviews, clinical practice guidelines, Cochrane reviews
- Tier 2: national professional bodies (APTA, CSP, Physiopedia with citations), major hospital patient-education libraries (NHS, Mayo Clinic, Johns Hopkins, Cleveland Clinic, Sydney/Melbourne health services)
- Tier 3: peer-reviewed primary studies
- Do **not** use: blogs, personal trainer sites, YouTube descriptions, AI-generated content farms, Pinterest, commercial supplement or equipment sites

**For each item, give me exactly these fields**

| Field | Requirement |
|---|---|
| `name_en` | Plain-language name a patient would recognise. Give the clinical name separately in notes if it differs. |
| `type` | For exercises only, pick one: range-of-motion, mobility, isometric, concentric, eccentric, isokinetic, stabilisation, activation, offloading, strengthening, functional |
| `start_position_en` | Where the body begins. One or two sentences. |
| `movement_en` | What the patient does. One or two sentences. |
| `direction_en` | Which way the movement goes. Stretches especially. |
| `return_en` | How they come back to the start. Exercises especially. |
| `hold_seconds` | A number, or blank |
| `reps` | A number, or blank |
| `sets` | A number, or blank |
| `rest_seconds` | A number, or blank |
| `each_side` | TRUE or FALSE |
| `frequency_en` | e.g. "Once a day". Keep it short. |
| `target_muscles_en` | Plain muscle names. Give the primary target first. |
| `safety_en` | ONE sentence naming the specific stop condition for this exercise. |
| `image_alt_en` | A description of the body position for a patient who cannot see the image. |
| `evidence_note` | Where the dosage came from, source tier, and how confident you are. |

**Writing rules — these are not stylistic preferences, they are requirements**

- Target a 6th-grade reading level (AMA/NIH guidance for patient web material)
- Sentences of 20 words or fewer
- Second person, active voice, present tense: "Sit upright", not "The patient should be seated"
- One action per sentence
- Whole numbers. Never make the patient calculate anything.
- Any anatomical term gets a plain-English gloss in brackets the first time
- No condition names, no diagnoses, no outcome claims, no guarantees, no superlatives. This library is organised by body area precisely so that no diagnosis is implied.
- Never put dosage inside the instruction text. It belongs in the dosage fields.

**On dosage — read this carefully**

Do not invent numbers. Where sources give a dosage, report it and cite it. Where sources disagree, give the range and say who says what. Where you cannot find a sourced dosage, write `UNSOURCED — clinician to set` rather than guessing. A plausible-looking fabricated dosage is the single most damaging thing you could hand back, because it looks exactly like a real one.

**Also return, separately from the item table**

1. **Confidence table** — each item rated high / medium / low, with the reason
2. **Contested points** — anything where reputable sources genuinely disagree, presented as the disagreement rather than resolved by you
3. **Items I considered and rejected** — with the reason. This is often more useful to the clinician than the ones you kept.
4. **What a physiotherapist should double-check** — the three things in this set most likely to need her correction
5. **Full source list** with URLs and tier for each

**Output format**

Give me the item table as a markdown table first, so it is readable. Then repeat the same data as tab-separated rows so it pastes into a spreadsheet. Leave any field you could not source as an empty cell, never as a guess or a placeholder like "N/A".

---

## Prompt B — the safety layer

Run once, after all areas are drafted.

---

You are assisting a physiotherapist preparing a patient-facing home exercise library, organised by body area, delivered as a web page with no clinician present. She will review and approve everything.

I am pasting the full list of drafted exercises and stretches below.

For each body area, tell me:

1. **General precautions** that should appear once at the top of that area's page — not per exercise. Keep to a maximum of three lines, written in plain language at 6th-grade reading level.
2. **Red flags** — the specific symptoms that mean a patient should stop and contact the clinic rather than push through. Distinguish clearly between normal training discomfort and a genuine warning sign, because patients confuse the two and it is a documented barrier to adherence.
3. **Who should not do this area's exercises without speaking to their physiotherapist first.** Be specific and short. Do not produce an exhaustive contraindication list — a long scary list on a patient page reduces the chance they do anything at all, and this material is only ever given to patients who have already been assessed.
4. **Any individual exercise in the list that you think is unsafe for unsupervised home use**, with your reasoning.

Then draft a **site-wide disclaimer** of 120 words or fewer, for a UAE private physiotherapy clinic, covering: educational purpose only, not a substitute for assessment, this is a reminder of exercises already prescribed rather than a starting point, the stop-and-contact condition, an emergency instruction, and a limitation of liability. Plain language. No legal boilerplate the patient will skip.

Flag clearly anything you are uncertain about. Note that a UAE clinic's Medical Director must approve the final wording.

---

## Prompt C — adversarial check

Run last, in a fresh session, pasting the finished draft set. This catches what the generating pass could not see.

---

You are reviewing draft patient-facing physiotherapy exercise content before a clinician sees it. Be sceptical. Your job is to find problems, not to praise it.

Below is a draft library of stretches and exercises organised by body area, each with instructions, dosage, and target muscles.

Check for and report:

1. **Fabricated or implausible dosage.** Any hold time, rep count or set count that does not match what reputable sources actually recommend for that movement. State what the sources say instead.
2. **Wrong target muscles.** Any exercise whose named target muscle is not what that movement primarily works.
3. **Instructions that cannot be followed from text alone.** Where would a patient alone at home genuinely not know what to do?
4. **Ambiguous body positions** — anywhere a patient could reasonably do the opposite of what is intended.
5. **Reading level failures.** Flag every sentence over 20 words, every passive construction, and every unexplained anatomical term.
6. **Duplicates and near-duplicates** across the whole library, including across body areas.
7. **Safety gaps.** Any exercise whose stop condition is missing, vague, or wrong for that movement.
8. **Diagnosis or outcome language** that has crept in — any condition name, any claim about what the exercise will fix, any superlative.
9. **Internal inconsistency** — the same exercise appearing in two areas with different dosage or different named muscles.

Report as a table: item · problem type · the exact offending text · what it should be instead · your confidence.

End with the three systemic problems that appear most often across the whole set, since those point at a template fix rather than a hundred individual edits.

---

## Working notes

**Order of runs.** Do Stretching → Neck first as the pilot. Take its output to the physiotherapist before running the other twenty-five. If the format needs changing, you want to find that out after one run, not after twenty-six.

**What to do with the output.** Paste into the sheet as `draft`. Never `published`. She publishes.

**The dosage rule is the one that matters.** If Gemini returns confident-looking numbers with no citation, treat the whole run as suspect and re-run with the dosage instruction emphasised. Fabricated dosage is the failure mode that gets past everyone, because it reads exactly like real dosage.

**Keep the runs.** Save each Deep Research report alongside the drafted rows. When the clinician asks "where did 30 seconds come from", you need to be able to answer.
