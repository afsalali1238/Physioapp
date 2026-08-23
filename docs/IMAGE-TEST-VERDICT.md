# Image Test Verdict — Gemini / Antigravity, neck sample

**Date:** 2026-08-23 · **Batch:** 9 images, 1200×896 JPG · **Result: 5 of 9 fail. Licence the illustrations.**

The checklist in `docs/IMAGE-PROMPTS-NECK-SAMPLE.md` said: *if more than two of the nine fail, that is your answer.* Five failed.

---

## Scorecard

| Image | Verdict | Why |
|---|---|---|
| `str-neck-01` Side Neck Stretch | **FAIL** | Direction is correct — head tilts to the viewer's left, matching "right ear to right shoulder". But the tilt is about 10°, not 25°, and it is mixed with a head *rotation* the prompt explicitly excluded. No shoulder depression, no visible lengthening. A patient copying this does a small head bob and gets no stretch. |
| `str-neck-02` Levator Scapulae | **PASS\*** | Head is turned and looking down — the movement is legible. But both hands grip the seat; the prompt specified one, to anchor the opposite shoulder. Usable with a note. |
| `str-neck-03` Chin to Chest | **PASS** | Correct. Chin lowered, back of the neck lengthened, upper back stays upright. |
| `str-neck-04` Neck Rotation | **FAIL** | The head faces straight ahead. There is no rotation whatsoever. The image is indistinguishable from the neutral starting position. |
| `ex-neck-01` Neck ROM (neutral) | **PASS** | Correct neutral seated posture. |
| `ex-neck-02` Chin Tuck | **FAIL — worst of the set** | No retraction, no double chin, no lengthening. The head actually sits slightly *forward* of the shoulders — which is the forward-head posture this exercise exists to correct. **The image depicts the opposite of the instruction.** |
| `ex-neck-03` Isometric Neck Hold | **FAIL** | The palm rests on the top of the head near the hairline, not flat against the forehead. Fingers are splayed rather than together. Pressing down on the crown is axial compression — a different exercise, working different muscles from the deep neck flexors named on the card. |
| `ex-neck-04` Scapular Squeeze | **FAIL** | Requested "viewed from BEHIND". The rendered figure shows a nose, lips and chin. A back view cannot show a face. The two curved marks meant to read as shoulder blades sit too high and too central. Anatomically incoherent, and the squeeze itself is not depicted. |
| `ex-neck-05` Wall Angel | **PASS\*** | Arm position is roughly the W shape. Background is cool grey-blue while the other eight are warm off-white, so it does not belong to the set. Contact between back and wall is not readable from the front. |

---

## The finding that matters

**The images look professional and are clinically wrong.** That combination is more dangerous than obviously bad output, because it survives casual review. Anyone glancing at the contact sheet sees nine clean, consistent, well-drawn instructional illustrations. Only checking each pose against its instruction text reveals that five of them show something other than the prescribed movement — and one shows its opposite.

If these had been dropped into the app and shipped, `ex-neck-02` would have taught patients to hold a forward-head posture while the card beside it said "draw your chin straight back".

This is exactly what `docs/IMAGE-PIPELINE.md` predicted, and for the predicted reason: **Gemini has no structural pose conditioning.** Since `imagen-3.0-capability-001` was retired on 30 June 2026 there is no control-image input, no mask, no seed. The prompt is an instruction the model weighs, not a constraint it obeys. So it renders a plausible person on a plausible chair in a plausible posture and quietly discards the specific joint angles — which are the entire clinical payload.

**Style transferred. Geometry did not.**

## Secondary finding: consistency

The run skipped the style-anchor and reference steps and fired nine independent prompts. The result is at least three different people:

- **Hair:** headband with dark hair (`str-neck-01`, `ex-neck-01`, `ex-neck-05`), bald (`str-neck-02/03/04`, `ex-neck-03/04`), brown hair (`ex-neck-02`)
- **Footwear:** bare feet in five, blue shoes in two
- **Background:** warm off-white in eight, cool grey-blue in one
- **Gender presentation** and body rendering drift across the set

**This part is fixable** — running the reference workflow properly would largely solve it. It is worth being clear that fixing it would *not* touch the pose failures, because pose is the unconstrained dimension. A second run would produce nine consistent images that are still five-ninths wrong.

## What was actually proved

The test cost nine images instead of a hundred, and it settled the question. Credit where due: the *aesthetic* brief worked perfectly — flat vector, cel shading, full-coverage clothing, plain background, calm palette. That is the look to hand a licensor or an illustrator.

## Decision

Proceed with `docs/IMAGE-PIPELINE.md` as written:

1. Draft the full ~100-item name list
2. Check coverage against **WorkoutLabs** (Rehab & Physical Therapy collection, SVG, ~$3,500 full library perpetual) and **GymVisual** (~$0.75/illustration, ~$75 for 100)
3. Buy; commission the gaps from one vector illustrator, using this batch's style as the reference
4. Fallback if budget is zero: render posed 3D figures (PoseMy.Art / Blender + MPFB2), where the pose is set by hand and cannot drift

**Keep these nine files** in `src/assets/images/` for now so the prototype has real images while the layout is reviewed — but mark them `image_status: rejected` in the sheet. **None of them ships.**

## What this changes about the review gate

The gate held, and it should be enforced for licensed art too. A licensed illustration of a chin tuck can be wrong for *this* card's instruction text just as easily — the difference is only that a human drew it. Step 2 of the gate in `IMAGE-PIPELINE.md` stands: **every image checked against its instruction text, by the physiotherapist, before it ships.**
