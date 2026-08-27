# Temporary Motion/Video Reference (Handoff 3)

**PROTOTYPE — NOT CLINICALLY REVIEWED**

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: Gemini 3.1 Pro (High) / `render-poses.ts` SVG generator
generation_method: Node.js (Playwright Canvas -> FFmpeg MP4)
generation_date: 2026-08-27
replacement_required: true
reference_sources: ["scripts/render-poses.ts item ex-neck-02"]
```

## Mission
Provide a silent, 4-second looping video reference of a single repetition using the supplied source material for `ex-neck-02`.

## Asset
- **Video:** `/exercise-media/prototypes/ex-neck-02/ex-neck-02-motion.mp4`
- **Poster Frame:** `/exercise-media/prototypes/ex-neck-02/ex-neck-02-poster.png`

## Execution Details
- **Duration:** 4.0 seconds (120 frames at 30 fps).
- **Repetitions:** One complete repetition (Neutral -> Tuck -> Neutral).
- **Camera:** Stable side-view camera. Left/right orientation is preserved.
- **Motion:** No speed ramps. The motion strictly follows the linear interpolation data defined in the `tweenPose` source logic.
- **Audio:** Silent.
- **Constraints Met:** The video contains no additional medical instructions or decorative cuts. It is clearly labeled as a prototype using a visible on-screen overlay.

*Note: This temporary SVG-based motion video must be replaced by a deterministic MPFB2/MakeHuman render before final clinical review.*
