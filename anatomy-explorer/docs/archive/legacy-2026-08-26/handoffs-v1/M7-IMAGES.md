# M7 — Demonstration images

**Build tool:** GPT-5.6-SOL · **Wave:** 2 · **Branch:** `m7-images` · **Depends on:** **H2** — and H2 is a human decision that has been open since 2026-08-23

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists, and why most of it is blocked

Roughly one hundred demonstration images are needed — one per library item, showing the position the instruction text describes. They do not exist. Four images exist in total.

**The corpus is blocked on H2 and you may not start it.** H2 is the clinician-and-budget decision between licensing illustrations, rendering from posed 3D figures, and constrained AI generation. D-010 chose licensing; D-015 confirmed it after a test; the clinician has since asked for AI-generated images repeatedly. Until she has answered with the evidence in front of her, producing one hundred images by any route is work that will be thrown away.

**What is open now is the pilot**, and it is worth more than the corpus: it is the controlled experiment that produces the evidence her third option depends on. Five images, a known baseline, a published scorecard. `patient-library/docs/IMAGE-PILOT-SOL.md` is your brief and it is already addressed to you.

**And one thing precedes even that.** See §2. It is not a build task and it is the most important paragraph in this handoff.

Judge this module on one sentence: **no image reaches a patient that has not been checked against its own instruction text by the physiotherapist** — whatever produced it, licensed art included.

## 2. Read this before you generate anything

**Nine images were generated in the August test. Five failed. Only the four that passed are in `src/assets/images/`.** The five failures were moved to `docs/image-tests/rejected/`.

So anyone shown the app sees a **4-of-4 success rate**. The true rate was **4-of-9**.

The clinician has asked for AI-generated demonstration images, repeatedly, in her written spec. **It is not established that she has ever seen the five failures** — in particular `ex-neck-02`, the chin tuck rendered in the exact forward-head posture the exercise exists to correct. Her endorsement of AI imagery may rest on a filtered sample nobody told her was filtered.

**Before any work is done on her AI-image request, that has to be established.** It is not your call to make and not your conversation to have — it is Afsal's, and it belongs in the H track. Your obligation is narrower and absolute: **never present the four survivors as representative of what generation produced.** If you build a contact sheet, a comparison, or a pilot scorecard, the five failures appear in it. If you are asked for "the images we have", the answer names both directories.

The generalisable finding from `IMAGE-TEST-VERDICT.md`, in its own words: *"The images look professional and are clinically wrong. That combination is more dangerous than obviously bad output, because it survives casual review."*

## 3. Do not redesign

The previous visual agent on this project shipped three uninstructed reversals of written decisions (D-025, D-026). Specific to images:

| Locked | Source |
|---|---|
| Simplified flat vector illustration, cel shading, full-coverage clothing, plain background, calm palette. **Not photoreal.** | D-008 style reasoning, which D-010 preserved |
| One consistent demonstrator across the whole corpus — hair, clothing, footwear, background, body rendering | `IMAGE-TEST-VERDICT.md` · Secondary finding |
| 4:3 aspect, sized for a card on a 360px phone | `DESIGN-SYSTEM.md` · The item card |
| **No before/after imagery, ever** | MODULE-MAP §11 — it is one of the elements that reclassifies the site as medical advertisement |
| Alt text describes the **body position**, not "a person exercising" | `DESIGN-SYSTEM.md` · Accessibility floor |
| Every image checked against its instruction text by the physiotherapist before it ships | `IMAGE-PIPELINE.md` step 2, reaffirmed by `IMAGE-TEST-VERDICT.md` |

The aesthetic brief is the one part of the August test that worked perfectly. Do not improve it.

## 4. Files you own

Exactly the M7 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/assets/images/**` | **absent** in this app. Four images exist in `patient-library/src/assets/images/` |
| `docs/IMAGE-PIPELINE.md` | **absent** — port |
| `docs/IMAGE-BRIEF.md` | **absent** — port |
| `docs/image-tests/**` | **absent** — port, **including the five rejects** |

**`scripts/check-images.ts` is in no row.** `patient-library` has one and the build needs it. **Claim it in `CROSS-MODULE-REQUESTS.md` before you create it.**

**`src/components/library/ExerciseImage.astro` is M5's**, and `src/lib/images.ts` is M5's to claim. You define what `approved` means and which files exist; M5 renders them. If the gate needs to change, that is a request to M5, not an edit.

## 5. Files you read, never write

- `patient-library/docs/IMAGE-TEST-VERDICT.md` — the scorecard, image by image. **Read it in full before anything else.**
- `patient-library/docs/IMAGE-PILOT-SOL.md` — your brief for the open work, already written to you.
- `patient-library/docs/IMAGE-PIPELINE.md`, `IMAGE-BRIEF.md`, `IMAGE-PROMPTS-NECK-SAMPLE.md`.
- `patient-library/docs/image-tests/rejected/` — the five failures, as images. Look at them.
- `patient-library/src/assets/images/` — the four survivors, for style reference only.
- `memory.md` D-008, D-010, D-015; `ASSET-PIPELINE.md`; `docs/CONTENT-SCHEMA.md` for the image columns.
- `src/lib/contracts/assets.ts` — M0's, frozen.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 6. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `anatomy-explorer/src/assets/` **does not exist**. No image in this app | file tree |
| `patient-library/src/assets/images/` holds **four** files: `ex-neck-01.jpg`, `ex-neck-05.jpg`, `str-neck-02.jpg`, `str-neck-03.jpg` | directory |
| Those four are exactly the four that passed the review gate. Two of them passed with a caveat (`PASS*`) | `IMAGE-TEST-VERDICT.md` scorecard |
| `patient-library/docs/image-tests/rejected/` holds **five**: `ex-neck-02.jpg`, `ex-neck-03.jpg`, `ex-neck-04.jpg`, `str-neck-01.jpg`, `str-neck-04.jpg` | directory |
| The test batch was nine images; the failure threshold was two; five failed | `IMAGE-TEST-VERDICT.md` |
| `ex-neck-02` (chin tuck) shows the head **forward of the shoulders** — the posture the exercise corrects. The image depicts the opposite of its own instruction | `IMAGE-TEST-VERDICT.md` |
| `IMAGE-TEST-VERDICT.md` instructs keeping the nine and marking them `image_status: rejected` — but the schema's enum is `'pending' \| 'generated' \| 'approved'` with **no `rejected` value**, and five were moved out rather than kept | `IMAGE-TEST-VERDICT.md` vs `patient-library/src/lib/schemas.ts:47` |
| The root cause is structural, not stylistic: `imagen-3.0-capability-001` was retired 30 June 2026, so Gemini has no control-image input, no mask, no seed. **The prompt is weighed, not obeyed** | `IMAGE-TEST-VERDICT.md`; D-010 |
| Style transferred perfectly; geometry did not. Consistency drift (three demonstrators, two backgrounds, mixed footwear) is fixable; pose failure is not, by that route | `IMAGE-TEST-VERDICT.md` |
| D-010's preference order: WorkoutLabs (rehab/PT collection, SVG, ~$3,500 perpetual) > GymVisual (~$75 for 100) > MoveKit. Zero-budget fallback: posed 3D render (PoseMy.Art, or Blender + MPFB2) | `memory.md` D-010 |
| **Open decision D2 — illustration style, and whether demonstrator gender or clothing matters — is owned by the clinician and appears never to have been answered.** It blocks all ~100 images | `patient-library/memory.md`; project memory |
| The corpus is 26 items today; the ~100 figure is the full planned library across ~15 stretching and ~11 exercise areas | `items.json`; the clinician's spec |
| A brief form exists at `patient-library/prototype/physiotherapist-brief-form.html` with **no record of a completed response anywhere in the repository** | file; `CLINICIAN-QUESTIONS.md:62` |

## 7. Deliverables

### Open now

**1. Port the evidence, all of it.** `docs/IMAGE-PIPELINE.md`, `docs/IMAGE-BRIEF.md`, and `docs/image-tests/` **including `rejected/` and its README**. The five failures travel with the four survivors. Porting only the survivors into the new app would recreate, inside `anatomy-explorer/`, exactly the filtered picture described in §2.
**Acceptance:** `docs/image-tests/rejected/` holds five images in this app; the count of rejects is stated in `docs/IMAGE-PIPELINE.md`; nothing in this app presents four-of-four.

**2. The pilot — five images, structurally constrained.** Re-generate `str-neck-01`, `str-neck-04`, `ex-neck-02`, `ex-neck-03`, `ex-neck-04` with the pose constrained by structure rather than by prose: a control image, a depth or pose map, a posed 3D figure used as the conditioning input — whatever route actually constrains geometry. The point of the experiment is that **prompt wording is the variable already known to fail**. Repeating the August run with better adjectives answers nothing.
**Acceptance:** each of the five has a stated conditioning method and the artefact used; none of the five was produced by prose alone.

**3. Score the pilot the same way the August batch was scored.** Image by image, each checked against **its own instruction text**, with the same pass/fail threshold. Publish it as `docs/image-tests/PILOT-VERDICT.md` in the format of `IMAGE-TEST-VERDICT.md` — a scorecard table, a "what was actually proved" section, and a decision.
**Acceptance:** five rows; each names the specific joint angle or contact point that succeeded or failed; the verdict states plainly whether constrained AI cleared the bar, including if it did not.

**4. Look at them and say what you saw.** A-009: a visual task is not finished until the agent has looked at its own output and described it. **Your description is not a clinical judgement** — it is the input to one. Describe geometry: where the head sits relative to the shoulders, which hand is where, whether the view is front or back. Do not write "correct chin tuck".
**Acceptance:** each of the five has a written description of what is visible; no description asserts clinical correctness; every description is specific enough that the physiotherapist can disagree with it.

**5. `scripts/check-images.ts` — claim it, then build it.** Fails the build on: an item with `status: 'published'` and `image_status: 'approved'` whose file is missing; an image file on disk that no row references; an `image_id` whose prefix does not match its own section and area; alt text under the 45-character floor. This is the automated half of the gate; the physiotherapist is the other half and the automated half never substitutes for it.
**Acceptance:** the claim is filed before the file exists; each rule has a fixture; the check runs standalone under `tsx`; it is wired into `npm run check`.

**6. `image_status: 'rejected'` — file the gap.** The verdict document instructs a value the schema does not have, which is why five images were moved out of the tree instead of being marked in place. Moving files is a worse record than a status: the row still says `generated`, and the reason the image is gone lives only in a document. **This is M0's contract and M1's schema, not yours.** File it in `CROSS-MODULE-REQUESTS.md` with both citations.
**Acceptance:** the request exists and names `IMAGE-TEST-VERDICT.md` and `schemas.ts:47`; you do not add the value yourself.

**7. A coverage list, not a corpus.** Draft the full item-name list the ~100 figure comes from, and check it against WorkoutLabs' and GymVisual's catalogues for coverage. This is step 1–2 of `IMAGE-PIPELINE.md` and it is **research, not production** — it costs nothing to have ready and it is what makes H2 answerable with numbers instead of adjectives.
**Acceptance:** a list of required images by id; a coverage percentage per licensor; a cost figure per option; **no image produced for any item on it**.

### Blocked on H2 — do not start

**8. The ~100-image corpus.** Whichever route H2 chooses. Blocked until she answers, and separately blocked on **D2** — illustration style, and whether demonstrator gender or clothing matters — which is hers and unanswered. Two open questions, either one sufficient to make the corpus premature.

**9. The per-image review pass.** Every image checked against its instruction text, by the physiotherapist, before it ships — **including licensed art**. `IMAGE-TEST-VERDICT.md` is explicit that the gate stands whatever the source: *"A licensed illustration of a chin tuck can be wrong for this card's instruction text just as easily — the difference is only that a human drew it."* You prepare the review artefact; you do not perform the review.

## 8. Contracts

**What M7 consumes:** `contracts/assets.ts` from M0 — `AnatomyAsset`, `ImageRef`, and the thirteen asset metadata fields from `ASSET-PIPELINE.md`. `image_status` semantics come from M1's schema. Both frozen; file a request rather than widening.

**What M7 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `src/assets/images/**` | M5 | every card renders the labelled empty slot |
| the `approved` set | M5, M9 | the image gate has nothing to gate |
| `check-images.ts` | M0, M9 | `npm run check` has no image gate |
| `PILOT-VERDICT.md` | **H2** | the clinician has no evidence for her third option |
| the coverage list and costings | **H2**, Afsal | the licensing decision has no numbers |

**The pilot is the deliverable that unblocks a human decision, not a build step.** That is unusual and it is why M7 sits in Wave 2 with a human dependency rather than a module one. Treat `PILOT-VERDICT.md` as the module's primary output until H2 lands.

## 9. Hard rules for this module

1. **Never ship an unapproved image.** `approved` means the physiotherapist checked that image against that instruction text. It does not mean it looks good, it does not mean you checked it, and it does not mean it passed a script.
2. **Never present the four survivors as the test result.** The rate was 4 of 9. Any contact sheet, comparison or summary includes the five failures.
3. **Never make a clinical judgement about a pose.** Describe what is visible; let the clinician judge. "The palm rests on the crown, not the forehead" is your sentence. "This is a correct isometric hold" is not.
4. **Never write a clinician's name or a review date** into a file, a metadata field, or an asset record — including to mark something you believe she approved.
5. **Never invent clinical content.** Alt text describes the body position and is derived from her instruction text; it is not new prose about the exercise.
6. **No before/after imagery, no photoreal rendering, no fourth semantic colour, no decorative clinical imagery.** MODULE-MAP §11 and `DESIGN-SYSTEM.md`.
7. **Do not delete or overwrite a rejected image.** The rejects are evidence. `docs/image-tests/rejected/` is an archive, not a staging area.
8. **Record licence terms per asset before it enters the tree.** Source, licence, author, hashes, software, reviewer, status — the thirteen fields. **Do not assume a generation service grants redistribution rights for its output** (`ASSET-PIPELINE.md` §6).
9. **Do not edit `ExerciseImage.astro`, `src/lib/images.ts`, the schema, or anything under `../patient-library/`.** File requests instead.
10. **Builds cannot run over the Claude device bridge** — Windows native bindings, Linux shell. **Say which checks you could not run.** And as a visual module: **look at what you produced and say what you saw.**

## 10. Definition of done

**For this wave, with H2 still open:**

- All evidence ported, five rejects included, and nothing in this app presents a four-of-four picture.
- Five pilot images produced with a stated structural conditioning method, none by prose alone.
- `docs/image-tests/PILOT-VERDICT.md` published, scored image by image against instruction text, with an honest verdict including a negative one.
- Each pilot image described in geometric terms, with no clinical assertion.
- `scripts/check-images.ts` claimed, built, fixtured and wired.
- The `image_status: 'rejected'` gap filed with both citations.
- Coverage list and per-option costings ready, with **zero corpus images produced**.
- `git status --short`, from a real terminal, shows changes only in M7's rows plus the claimed `check-images.ts`.
- `memory.md` carries a decision entry for the pilot's outcome, whichever way it went.
- `CROSS-MODULE-REQUESTS.md` carries: the `check-images.ts` claim, the `rejected` status gap, and anything M5 needs about slot behaviour.

**Not done, and not startable:** the ~100-image corpus, and the per-image clinical review. Both wait for H2, and the corpus additionally waits for D2.

## 11. When you are blocked

**H2 is the block and it is a conversation, not a task.** The most useful thing you can do about it is finish the pilot and the costings, because those are what turn "she asked for AI images" into a decision she can actually make. MODULE-MAP §9 puts it plainly: every build blocker here is fixable this week, and every launch blocker needs one conversation with two people.

**D2 has been open since 2026-08-23 with no recorded answer, and a twelve-question form is how the last one went unanswered** (`CLINICIAN-QUESTIONS.md:62`). If you are asked to prepare something for her, prepare **one** question with two visible options, not a form.

**If the pilot fails, say so and stop.** A negative result is the deliverable — it cost five images instead of a hundred last time, and that is the whole value of running it. Do not re-run with better prompts to get a nicer number; prompt wording is the variable already known to fail.

**If you are asked to produce corpus images before H2 lands,** say what is blocked and why, and offer the pilot and the costings instead. That request will most likely arrive as "just do the neck ones to show her" — which is exactly how the filtered sample in §2 came to exist.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue.
