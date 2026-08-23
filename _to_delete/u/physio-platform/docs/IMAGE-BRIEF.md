> **SUPERSEDED — read `docs/IMAGE-PIPELINE.md` instead.**
> The AI-generation plan below was overturned by research on 2026-08-23. Gemini cannot constrain pose (Imagen's controlled-customisation model was retired June 2026), and licensing a commercial illustration library costs a fraction of generating one. Decision D-010.
> **What survives from this document:** the style reasoning — simplified illustration beats photoreal for patient comprehension — and the review gate. Everything about prompts and generation is obsolete.

# Image Brief *(superseded)*

~100 demonstration images. **Consistency across the set matters more than any single image.** A library where every figure looks different reads as untrustworthy, and patients notice it before they notice anything else.

---

## Style decision, and why

**Simplified, clean illustration of a stylised human figure. Not photoreal. Not anatomical rendering.**

Three reasons, in order of weight:

1. **Comprehension.** *Patient Education and Counseling* 2019 (n=204, randomised): only the simplified illustration significantly beat text alone for correct comprehension. Anatomical drawings gave no advantage over plain text — while patients *rated* them more helpful. Preference and comprehension diverge. We optimise for comprehension.
2. **Consistency is achievable.** Photoreal generation across 100 images produces 100 different people, lighting setups, and rooms. A stylised figure holds together.
3. **It resolves the modesty question.** A stylised figure sidesteps demonstrator gender, clothing, and setting entirely — a real consideration for a UAE patient population, and one with no published guidance to fall back on.

**Counter-evidence held honestly:** Arab patients surveyed preferred photographs over clipart (100%, n=17, Karger). Small sample, not UAE-specific, and measuring preference rather than comprehension. If the clinician disagrees on her patients' behalf, she wins — but the prompt pack would need rebuilding around a fixed model, wardrobe, and set.

**Open decision D2 — needs clinician sign-off before any generation begins.**

---

## The locked style block

Prepend this to **every** prompt, unchanged. Changing it mid-library is what breaks consistency.

```
Clean instructional medical illustration for a physiotherapy patient handout.
Single stylised human figure, gender-neutral, simplified facial features with no
detailed expression. Flat vector illustration style with soft cel shading and
clean confident linework. Figure wears full-coverage athletic clothing: long
fitted sleeves, full-length leggings, bare feet or plain trainers. Plain warm
off-white background, no room, no furniture beyond what the exercise requires.
Even soft lighting, no cast shadows beyond a light contact shadow. Muted,
calm palette: slate blue clothing, warm neutral skin, deep teal linework.
Full body in frame with generous margins. Side or three-quarter view chosen to
make the joint angle unambiguous. Anatomically correct proportions and joint
positions. Composition is uncluttered and reads clearly at 400px wide on a phone.
```

## The locked negative block

Append to every prompt.

```
Negative: text, words, letters, numbers, watermarks, logos, arrows, labels,
multiple figures, cropped limbs, extra limbs, extra fingers, malformed hands,
malformed feet, twisted joints, impossible spine angles, gym equipment unless
specified, mirrors, other people, busy background, patterned floor, heavy
shadows, dramatic lighting, photorealism, 3D render, stock-photo look, smiling
model, revealing or tight-fitting clothing, exposed midriff, bare shoulders,
jewellery, visible brand marks, flimsy or unstable furniture used as support.
```

That last item is deliberate. A published review of Physitrack criticised its imagery for showing patients bracing on flimsy chairs — clinicians judge whether the depicted setup is *safe and replicable*, not just whether it looks nice.

---

## Per-image prompt template

```
[LOCKED STYLE BLOCK]

The figure is performing: {exercise name}.
Starting position: {start_position_en}.
The image shows the {START | END | MID} position of the movement.
Body detail: {precise joint angles, which limb, what is supported, where the
hands are, where the gaze is}.
Camera: {side view from the left | three-quarter front | directly front |
overhead}, at {standing eye level | seated eye level | floor level}.
Support/props: {none | one sturdy upright chair with a solid back | a firm
mat on the floor | a resistance band held in both hands | a wall}.

[LOCKED NEGATIVE BLOCK]
```

Fill every field. A vague prompt is where AI artifacts get in.

### Worked example — `ex-neck-02`, Chin Tuck

```
[LOCKED STYLE BLOCK]

The figure is performing: Chin Tuck.
Starting position: Sitting upright on a sturdy chair, both feet flat on the
floor, shoulders relaxed and level.
The image shows the END position of the movement.
Body detail: The chin is drawn straight back toward the throat, creating a
gentle double chin. The head stays level with no tilt up or down. Eyes look
straight ahead at the horizon. The neck lengthens at the back. Shoulders stay
down and still. Hands rest loosely on the thighs.
Camera: side view from the left, at seated eye level.
Support/props: one sturdy upright chair with a solid back and four stable legs.

[LOCKED NEGATIVE BLOCK]
```

---

## Rules

- **One image per item.** Start/end pairs are not a verified field standard and double the production cost. If the clinician wants pairs for a specific movement, that is a per-item exception, not the default.
- **Show the position that is hardest to get right.** For a hold, that's the held position. For a movement, that's the end range. For anything where the *start* is what patients get wrong, show the start and say so in the alt text.
- **No arrows or text in the image.** Direction is carried by the `direction_en` field, which is translatable. Text baked into an image is not.
- **Filename is the `image_id`.** `src/assets/images/ex-neck-02.png`. No spaces, no versions in the name.
- **Minimum 1200px on the long edge, 4:3.** Astro handles everything downstream. Never commit resized derivatives.

---

## Review gate before an image is `approved`

Every image passes all seven, or it goes back:

1. Is the joint angle unambiguous? Could a patient reproduce it from this picture alone?
2. Hands and feet — count the fingers and toes. This is where generators fail most.
3. Is the spine physically possible?
4. Is any prop stable and safe to lean on?
5. Does it match the locked style — same figure treatment, same palette, same background?
6. Is clothing full-coverage?
7. Does it still read at 400px wide? Shrink it and check.

Batch-review 10 at a time against each other, not one at a time. Drift only shows up in comparison.

---

## Production order

Generate by body area, in the order content is written. Complete one area fully and review it as a batch before starting the next — catching a style drift at image 8 is cheap, at image 80 it is not.

Track state in the sheet's `image_status` column: `pending` → `generated` → `approved`. `npm run check:images` reports items with no file; only `approved` should ship.
