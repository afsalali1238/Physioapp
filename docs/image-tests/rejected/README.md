# Rejected test renders

These five images were generated during the image-pipeline trial and **failed
clinical review**. The verdict for each is in [`../IMAGE-TEST-VERDICT.md`](../IMAGE-TEST-VERDICT.md).

They are kept because the verdict document refers to them and because they are
the evidence for why the generation approach was changed. They are **not**
candidate assets.

They were moved out of `src/assets/images/` deliberately. `src/lib/images.ts`
resolves images with `import.meta.glob('../assets/images/*')`, so any file in
that directory is one sheet edit away from appearing on a patient-facing card.
Two of these are worse than a missing picture:

| File | Why it must not ship |
|---|---|
| `ex-neck-02.jpg` | Chin tuck. The head sits slightly **forward** of the shoulders — the forward-head posture the exercise exists to correct. The image depicts the opposite of the instruction beside it. |
| `ex-neck-03.jpg` | Isometric neck hold. Palm on the crown, not the forehead. Pressing down on the crown is axial compression: a different exercise, loading different muscles from the ones named on the card. |
| `ex-neck-04.jpg` | Scapular squeeze, requested from behind. The figure has a face. Anatomically incoherent, and the squeeze is not depicted. |
| `str-neck-01.jpg` | Side neck stretch. ~10° of tilt instead of 25°, mixed with a rotation the brief excluded. A patient copying it gets no stretch. |
| `str-neck-04.jpg` | Neck rotation. No rotation at all — indistinguishable from the neutral start position. |

Do not move these back. A replacement gets a new render, a fresh review, and
`image_status: approved` in the sheet before `ExerciseImage.astro` will render it.
