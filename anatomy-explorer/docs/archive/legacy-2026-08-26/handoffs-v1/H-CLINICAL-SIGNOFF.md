# H — Clinical & regulatory sign-off

**Owner:** Afsal, the physiotherapist, and the clinic's Medical Director · **Wave:** 0, and continuously after · **Depends on:** nothing · **Blocks:** launch, M7 entirely, and publishing M2

Read `../../MODULE-MAP.md` before this file. §9 is the summary; this handoff is the working detail.

**This is the only handoff with no build tool, and it is the one that has been stalled longest.**

## 1. Why this track is Wave 0

Eight decisions are open. Three of them block launch and **no agent can build around any of them**. They have been open since 2026-08-23.

Meanwhile every *build* blocker in this repository is fixable by an agent in about a week.

That asymmetry is the whole point of separating this track. MODULE-MAP §9 states it plainly: two independent tracks, and the second one has been stalled for days while the first raced ahead. A repository where all nine modules report green and three launch blockers are still open is not closer to launch than it was — it has just moved the bottleneck somewhere less visible.

**Start H before M0.** Not alongside it. Before it.

## 2. The eight open decisions

| ID | Decision | Decider | Blocks | Build workaround |
|---|---|---|---|---|
| **H1 / D8** | Does DHA/MOHAP class this as patient education or medical advertisement? | Medical Director | **Launch** | None |
| **H2 / D-010** | Licensed illustrations, 3D render, or constrained AI, for ~100 demonstration images? | Clinician + Afsal (budget) | **M7 entirely** | None |
| **H3 / A5** | The emergency number for the clinic's jurisdiction, and sign-off on the exact stop-screen wording | Clinician + Medical Director | **Launch** | M3 ships one flagged constant |
| **H4 / D4** | Disclaimer wording, and who signs it off | Clinician + Medical Director | **Launch** | M6 ships the slot with `PLACEHOLDER_MARKER` |
| **H5** | Visual sign-off that each body region highlights the anatomically correct place | Clinician | **M8, and publishing M2** | M2 regenerates from verified geometry — better, not sufficient |
| **H6 / D5** | Domain name | Afsal | Deploy | M0 ships an annotated placeholder |
| **H7 / D7** | Which two items per area are the "start here" pair | Clinician | Content display | M5 ships without a start-here flag |
| **H8 / D1, D6** | Flat area pages vs per-exercise pages; is "Other body areas" real | Clinician | Page templates | M5 builds flat pages per D-005's default |

**And one that is not in that table and should be.** Open decision **D2** — illustration style, and whether the demonstrator's gender or clothing matters — is owned by the clinician, appears never to have been answered, and blocks all ~100 images independently of H2. Answering H2 without D2 leaves M7 still blocked. **Ask them together.**

## 3. The thing that must be established before H2 is asked

**Nine images were generated in the August test. Five failed. Only the four that passed are in the app.**

The five failures were moved to `patient-library/docs/image-tests/rejected/`. So anyone shown the app sees four images, all of which look right — a **4-of-4** success rate. The true rate was **4 of 9**.

The physiotherapist has asked for AI-generated demonstration images repeatedly in her written spec. **It is not established that she has ever seen the five failures.** Her endorsement may rest on a filtered sample nobody told her was filtered.

The one to show her is `ex-neck-02`, the chin tuck. `IMAGE-TEST-VERDICT.md` scores it *"FAIL — worst of the set"*: the head sits slightly **forward** of the shoulders, which is the forward-head posture the exercise exists to correct. **The image depicts the opposite of the instruction printed beside it.** A patient who reads the picture instead of the words — which is most patients, and is why the picture is there — would practise the wrong thing.

The finding that generalises, in the verdict's own words: *"The images look professional and are clinically wrong. That combination is more dangerous than obviously bad output, because it survives casual review."*

**So the first action on H2 is not a question. It is showing her the five rejects.** Then the question becomes answerable, and whichever way she answers it will be an informed answer rather than an artefact of what she happened to be shown.

## 4. How to ask — the process lesson this project has already paid for

A brief form was built for her at `patient-library/prototype/physiotherapist-brief-form.html`. **There is no record of a completed response anywhere in the repository.** `CLINICIAN-QUESTIONS.md:62` says it directly:

> "Twelve questions in a form is how the last one went unanswered."

She is a working clinician in a private clinic. She is currently entering the first content corpus into a Google Sheet by hand. The failure mode is not that she is unwilling — it is that a twelve-question form is a task, and a task competes with her patient list.

What to do instead:

- **One decision at a time.** Not a batch, not a form, not a document to review.
- **Two visible options, not an open question.** "Which of these two?" is a ten-second answer. "What illustration style would you like?" is homework.
- **Show, do not describe.** For H2 that means the five rejected images side by side with their instruction text. For H5 it means the rendered region highlights, not a description of them.
- **Ask in the room or on the phone, and write the answer down yourself.** Every decision here ends as an entry in `memory.md` with a date and a name.
- **Separate the questions that are hers from the ones that are the Medical Director's.** H1, and the sign-off halves of H3 and H4, are not clinical-content questions — they are regulatory accountability, and asking her to answer them puts her in someone else's role.

## 5. Suggested order, and why

**First — H1, because it is cheap and it can change the product.** A direct query to DHA Health Regulation settles whether this is patient education or medical advertisement. No regulator document draws a clean line, and if the clinic sits in Dubai Healthcare City, DHCR's policy explicitly covers "education". This is one email and it determines how much of the compliance apparatus is a legal requirement versus a prudent default. It blocks launch and nothing else, so it can run in the background from day one.

**Second — H3 and H4 together, with the Medical Director.** The emergency number, the stop-screen wording, and the disclaimer wording are one conversation with one accountable person. All three are already built as flagged placeholders, so the build does not wait — but every one of them is a hard launch stop, and they are the three most likely to be discovered late.

**Third — H2 with D2, after showing her the five rejects.** This unblocks an entire module. M7's pilot (`IMAGE-PILOT-SOL.md`) produces the evidence her third option depends on: five images, structurally constrained, scored the same way. Wait for that scorecard if it is close; do not wait for it if she is ready to choose licensing, which D-010 already recommends with numbers — WorkoutLabs ~$3,500 perpetual, GymVisual ~$75 for a hundred.

**Fourth — H7 and H8, which are content-shape questions and cheap.** Both have working defaults already built. Ask them when you are with her for something else.

**Fifth — H5, which cannot be asked until M2 and M8 have something to show.** It needs rendered highlights on a screen in front of her.

**H6 is Afsal's alone** and blocks only deploy. It costs a decision, not a conversation.

## 6. The two things to raise that are not on the list

**She did not mention the body map at all.** Her written spec of 2026-08-26 restates the existing patient library almost feature for feature — one link, two top-level sections, navigation by body area, four to five items per area, and a per-item format the current `docs/CONTENT-SCHEMA.md` already implements column for column. The anatomy locator, which is the entire premise of `anatomy-explorer/` and of A-012's "signature experience", is absent from it.

`PRD.md` names *"she never opens it"* as the product's failure signal. That is worth putting in front of Afsal before Wave 2 spends its budget on a 3D island. It may mean nothing — she was writing about content, not features. It may mean the locator is solving a problem she does not have. **The cheap version of this question is to show her the locator and watch whether she uses it**, which costs one visit and settles it.

**Her area lists are longer than the app's.** She wrote roughly fifteen muscle-group stretching areas and eleven joint-based exercise areas; the live app has eight per section. That is content work in the sheet, not a schema change — the composite key already allows different lists per section. It is not a blocker, but it is the most concrete thing she asked for and the fastest visible win available.

## 7. What "answered" looks like

A decision is not closed because it was discussed. It is closed when:

1. It is written into `memory.md` as a dated entry naming the person who decided and the reason.
2. The placeholder it was blocking is filled by the module that owns that file — **not by whoever heard the answer**. `emergency.ts` is M3's; the disclaimer wording is M6's; `site` is M0's.
3. `check:compliance` stops reporting it. Every unfilled field is already reported by `missingClinicFields()` and by M9's `PLACEHOLDER_MARKER` gate, so "did it actually land" is a build question, not a memory question.
4. For anything clinical, `reviewed_by` and `reviewed_date` are filled **by her**, in the sheet. **No agent, and no builder, writes a clinician's name or a review date into any file, ever.** That rule holds even when you have her answer in writing — the signature is hers to give.

## 8. Hard rules for this track

1. **Nothing clinical is authored, edited or "improved" on the build side.** The division is absolute: Afsal builds the container, she fills it.
2. **Never write her name or a review date into a file** — not as a placeholder, not as an example, not in a fixture, not because she said yes on the phone.
3. **Never guess an emergency number or a regulatory statement.** A wrong emergency number on patient-facing material is worse than a visibly missing one.
4. **Never present the four surviving images as the test result.** The rate was 4 of 9.
5. **A launch blocker that is open is a stop, not a warning.** No green build overrides H1, H3 or H4.
6. **Do not batch these into a form.** That is how the last one went unanswered.
7. **`patient-library/` stays live and in her hands** throughout. She is entering content into it, patients have the link, and it is the rollback target until M9 signs off.

## 9. Definition of done

- H1 answered by the Medical Director, in writing, and recorded in `memory.md`.
- H3 and H4 answered by the Medical Director; `src/config/emergency.ts` and the legal frontmatter filled by their owning modules; `missingClinicFields()` returns empty; `COMPLIANCE_STRICT=1` passes in the production environment.
- H2 answered **after** she has seen the five rejected images, with D2 answered in the same conversation; the answer recorded with its reason; M7 unblocked.
- H5 signed off against rendered highlights she looked at, region by region.
- H6 decided; `astro.config.mjs`'s `site` no longer a placeholder.
- H7 and H8 answered, or their built defaults explicitly confirmed as acceptable.
- The body-map question raised with her, and the answer — including "it does not interest her" — recorded.
- Every one of the above is a dated `memory.md` entry naming a decider. Nothing closed by inference.

## 10. When you are blocked

**If she does not respond, the problem is almost certainly the format, not the person.** Reduce to one question with two visible options and ask it in the room. The twelve-question form is the recorded precedent.

**If the Medical Director is unreachable, H1 still has a cheap path** — a direct query to DHA Health Regulation. It does not replace the Medical Director's sign-off on accountability, but it converts an open-ended question into a documented answer that makes the sign-off a five-minute confirmation.

**If a decision keeps sliding, build the workaround and say what it costs.** Every one of these already has a workaround in the table in §2, and every workaround is a flagged placeholder that cannot silently ship. That is the design. What it does not do is make the product launchable — so the honest report is "built, not launchable, waiting on three answers", and that sentence belongs at the top of M9's release checklist, not in a footnote.

**If you are tempted to fill a placeholder because the answer seems obvious** — the UAE emergency number, a standard disclaimer, a plausible review date — stop. That is the exact failure this whole apparatus exists to prevent, and it is the one that would survive every automated check in the repository.
