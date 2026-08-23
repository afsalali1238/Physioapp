# Image Prompts — Neck Sample Set

Nine prompts covering the sample content in the prototype. Enough to test whether generated images are good enough to use, before committing to a route for all ~100.

**This is a test batch, not production.** `docs/IMAGE-PIPELINE.md` still recommends licensing over generating, for reasons that have not changed. Run these, look at the results honestly against the review gate at the bottom, and let the output settle the argument.

---

## Before you generate anything

**Step 1 — make the style anchor.** Generate this one image first, iterate until you like it, then freeze it as a PNG. Everything else references it.

```
A clean instructional illustration for a physiotherapy patient handout.
A single person standing upright, facing the viewer, arms relaxed at their sides,
feet hip-width apart. Gender-neutral appearance, simplified facial features,
calm neutral expression. Flat vector illustration with soft cel shading and
clean confident linework of even weight. The figure wears full-coverage athletic
clothing: a long-sleeved fitted top and full-length leggings, plain, no pattern,
in muted slate blue. Bare feet or plain unbranded trainers. Warm neutral skin
tone. Deep teal linework. Plain warm off-white background with no room, no
furniture, no floor line. Even soft lighting, no cast shadows apart from a light
contact shadow under the feet. Full body in frame with generous margins on all
sides. Anatomically correct proportions. Composition uncluttered and legible at
400 pixels wide. Aspect ratio 4:3, 2K resolution.
```

**Step 2 — build a small reference set.** From the anchor, generate three more: the same figure from the side, from behind, and seated on a plain chair. Four references total. **Do not exceed six** — quality degrades past that as the model averages conflicting details, and the character-reference budget is 4.

**Step 3 — for every prompt below**, attach the anchor plus the relevant angle reference, and say in prose: *"Use the attached images as the reference for the figure, the clothing, the linework and the background. Keep them identical. Change only the pose."* Keep the figure description out of the per-image prompt and let the reference carry it — that is what stops drift.

**Step 4 — append this to every prompt:**

```
Negative: text, words, letters, numbers, watermarks, logos, arrows, labels,
diagrams, multiple figures, cropped limbs, extra limbs, extra fingers, malformed
hands, malformed feet, twisted joints, impossible neck or spine angles, gym
equipment unless specified, mirrors, other people, busy background, patterned
floor, heavy shadows, dramatic lighting, photorealism, 3D render, stock-photo
look, exaggerated smile, revealing or tight-fitting clothing, exposed midriff,
bare shoulders, jewellery, visible brand marks, flimsy or unstable furniture
used as support.
```

The last item is deliberate. A published review criticised a major HEP platform's imagery for showing patients bracing on flimsy chairs — clinicians judge whether the depicted setup is safe and replicable, not whether it looks nice.

---

## ⚠ The left/right rule — read before generating

**On a figure facing the viewer, the patient's right is the viewer's left.**

Four of these nine involve a side. Getting it backwards means a patient stretches the wrong side — the opposite of what was prescribed. My first hand-drawn pass got this wrong, and it is invisible unless you deliberately check.

Every prompt below states the direction **from the viewer's perspective**, because that is what the model renders. The matching instruction text is quoted underneath so you can check the pair.

---

# STRETCHING

## `str-neck-01` — Side Neck Stretch

> Instruction: *"Let your right ear drop slowly towards your right shoulder."* → patient's right = **viewer's left**

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
front. Both feet flat on the floor, knees at 90 degrees, hands resting loosely
on the thighs.

The head is tilted sideways so the LEFT ear as the viewer sees it moves down
toward the LEFT shoulder as the viewer sees it. The tilt is about 25 degrees.
The face stays pointing forward — this is a sideways tilt, not a turn. The chin
stays level. The opposite shoulder, on the viewer's right, is relaxed and
pressed down, clearly lower than the tilted side, so the neck on that side
appears lengthened.

Camera: straight on, at the seated figure's eye level, full body in frame.
Props: one plain sturdy wooden chair with a solid back and four stable legs.
```

## `str-neck-02` — Levator Scapulae Stretch

> Instruction: *"Turn your head about 45 degrees to the right… look down towards your right armpit."* → patient's right = **viewer's left**

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
front. Both feet flat on the floor.

The head is turned about 45 degrees toward the viewer's LEFT, and then tilted
down so the gaze travels toward the armpit on that same side. The chin is
lowered toward the collarbone on the viewer's left. The back of the neck on the
viewer's right side is clearly lengthened and exposed.

The opposite hand, on the viewer's right, holds the side edge of the chair seat
to anchor that shoulder down. That shoulder is visibly lower than the other.

Camera: straight on, slightly above the seated figure's eye level so the angle
of the head is easy to read.
Props: one plain sturdy wooden chair with a solid back.
```

## `str-neck-03` — Chin to Chest Stretch

> Instruction: *"Lower your chin slowly towards your chest."* No sides involved.

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
side, facing the viewer's left.

The head is tipped forward so the chin lowers toward the chest, about 30 degrees
of flexion. The back of the neck is rounded and clearly lengthened. The shoulders
stay relaxed and level, not hunched or lifted. The upper back stays upright — the
bend is at the neck only, not a slump of the whole spine. The hands rest loosely
on the thighs, not touching the head.

Camera: full side profile, at the seated figure's shoulder height.
Props: one plain sturdy wooden chair with a solid back.
```

## `str-neck-04` — Neck Rotation Stretch

> Instruction: *"Turn your head slowly to the right as far as is comfortable."* → patient's right = **viewer's left**

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
front. Both feet flat on the floor, hands resting on the thighs.

The head is turned toward the viewer's LEFT, about 70 degrees, as if looking
over that shoulder. The chin stays level throughout — no tilt up or down. Both
shoulders stay square and facing the viewer, so the rotation is clearly at the
neck and not the trunk. The muscle line along the front of the neck on the
viewer's right side is gently visible.

Camera: straight on, at the seated figure's eye level.
Props: one plain sturdy wooden chair with a solid back.
```

---

# EXERCISE PROTOCOL

## `ex-neck-01` — Neck Range of Motion *(warm-up)*

> Shows the neutral starting position, not a movement. No arrows.

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
front, in a neutral resting position. Both feet flat on the floor, knees at 90
degrees, hands resting loosely on the thighs.

The head is level and centred, facing straight ahead. The chin is level. The
shoulders are relaxed, level, and down away from the ears. The spine is
upright and neutral. The posture reads as calm, balanced and symmetrical — this
image shows the starting position that every neck movement returns to.

Camera: straight on, at the seated figure's eye level, full body in frame.
Props: one plain sturdy wooden chair with a solid back.
```

## `ex-neck-02` — Chin Tuck

> The hardest of the nine. It is a small movement and models usually render it as looking down, which is wrong.

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
side, facing the viewer's left.

The head is drawn straight backward in a horizontal line, so the chin retracts
toward the throat and a gentle double chin forms. This is critical: the head
translates BACKWARD, it does not tip down. The eyes stay level with the horizon
and the face still points straight forward, not at the floor. The back of the
neck lengthens upward and the head sits directly over the shoulders rather than
in front of them.

The shoulders stay relaxed, level and still. The hands rest on the thighs. No
hand touches the face or chin.

Camera: full side profile, at the seated figure's eye level, close enough that
the head and neck position is clearly readable.
Props: one plain sturdy wooden chair with a solid back.
```

## `ex-neck-03` — Isometric Neck Hold

> Instruction: *"Place your palm flat against your forehead. Press your head gently into your hand."*

```
The figure is seated upright on a plain sturdy wooden chair, viewed from the
side, facing the viewer's left.

One arm is raised so the open palm rests flat against the forehead. The elbow is
bent to roughly 90 degrees and points forward and slightly down, well clear of
the face — the forearm must not cross in front of the head or obscure it. The
fingers are together and the palm is flat, making full contact with the forehead.

The head stays perfectly upright and still, facing straight forward, eyes level.
Nothing is moving — this is a static hold against resistance. The neck and jaw
look relaxed rather than strained. The other arm rests loosely at the side.

Camera: full side profile, at the seated figure's eye level, positioned so both
the flat palm and the upright head are clearly visible and not overlapping.
Props: one plain sturdy wooden chair with a solid back.
```

## `ex-neck-04` — Scapular Squeeze

```
The figure is standing upright, viewed from BEHIND. Feet hip-width apart, arms
relaxed and hanging at the sides.

The shoulder blades are drawn together and downward, so they are visibly closer
to the spine than in a resting posture and the upper back looks broad and set.
The shoulders stay down and away from the ears — no shrugging upward. The head
stays level and facing forward. The neck is long and relaxed.

Camera: straight on from behind, at standing shoulder height, full body in frame.
Props: none.
```

## `ex-neck-05` — Wall Angel

```
The figure is standing with its back flat against a plain wall, viewed from the
front, feet a small step away from the wall. The back of the head, the upper
back and the buttocks all stay in contact with the wall behind.

Both arms are raised against the wall in a W shape: elbows bent to about 90
degrees, upper arms roughly level with the shoulders, forearms pointing upward,
and the backs of the hands, wrists and elbows all touching the wall. The
shoulders stay down away from the ears.

The lower back stays flat against the wall — no arching away from it. The head
stays level, facing forward.

Camera: straight on, at standing chest height, full body in frame, with the
plain wall filling the background so the contact between back and wall is
obvious.
Props: a plain flat wall and a plain floor line. No skirting board, no pictures,
no windows.
```

---

## Check every image against this before you keep it

Nine images, ten minutes. Do it in a contact sheet of all nine at once, not one at a time — drift and error only show up in comparison.

1. **Left/right.** Does the side shown match the instruction text quoted above it? Check all four sided images explicitly.
2. **Joint angle.** Could a patient reproduce this position from the picture alone, with no text?
3. **Hands and feet.** Count the fingers. Count the toes. This is where generators fail most.
4. **Neck and spine.** Is the angle physically possible? Chin tuck is the one to scrutinise — if the figure is looking down rather than sliding the head back, reject it.
5. **The chair.** Does it have four legs, a solid back, and does it look like it would hold a person?
6. **Consistency.** Same figure, same clothing, same palette, same background, same camera height across all nine?
7. **Coverage.** Full-length sleeves and leggings, no exposed midriff or shoulders?
8. **Legibility.** Shrink it to 400px wide. Can you still tell what the exercise is?

**If more than two of the nine fail, that is your answer** — buy the illustrations instead. The point of this batch is to find that out for the price of nine images rather than a hundred.

Save what passes as `src/assets/images/<image_id>.png`, minimum 1200px on the long edge, 4:3. The `image_id` is the code in the corner of each card in the prototype.

**Whatever passes here still goes to the physiotherapist for anatomical sign-off before a patient sees it.** A well-drawn image of the wrong position is more dangerous than no image.
