# M1 · Body map

**Agent: GPT-5.6 Sol** · **Effort:** high · **Wave:** 1, parallel with M2 and M3

You are chosen for this because you can see. This module cannot be completed by reasoning about
coordinates — the current map has hotspots floating off the arm and a lower back sitting on the
abdomen precisely because someone did that. **Render, screenshot, look, adjust. Every iteration.**

## Context you need

Anatomy Explorer is a mobile-first body-area locator in front of an existing live physiotherapy
exercise site. A patient taps where it hurts, confirms the spot, passes a safety check, and
reaches clinician-reviewed exercises for that area.

The live site is in `patient-library/` — REFERENCE ONLY, never modify it. Anatomy Explorer
lives entirely in `anatomy-explorer/`. Read `MODULE-HANDOFF.md` for the full constitution first.

Live library: 8 areas — ankle, elbow, hip, knee, lower-back, neck, shoulder, wrist. 26 exercises.
**This is not a symptom checker.** Never name a condition anywhere, including comments and
variable names.

## You own

    src/data/anatomy/body-regions.ts
    src/data/anatomy/pain-zones.ts
    src/lib/anatomy/geometry.ts
    scripts/build-body.mjs
    src/components/anatomy/BodyMap.astro

Nothing else. If you need another file, STOP and report — another agent is in it right now.

## The bug you are fixing

`backPath` is declared on the region type and set on **zero** regions. Switching front/back
changes a label and some decorative lines; the hit paths are identical in both views. So the
lower back and upper back are currently tappable on the chest and abdomen.
`ASSET-PIPELINE.md` §5 lists front/back orientation as a review gate and this fails it.

## The approach — never hand-author a coordinate

Build a generator. `scripts/build-body.mjs` defines a joint table and derives **both** the
silhouette **and** every hotspot from those same joints, so a hotspot cannot drift off the limb
it belongs to. Run it to emit `body-regions.ts` and `pain-zones.ts`.

**Working, visually-verified geometry is already in the repo:**

    reference/body-geometry/skeleton.mjs      joint table, silhouette, front/back detail
    reference/body-geometry/regions.mjs       hotspot capsules, bbox and focusViewBox helpers
    reference/body-geometry/render.mjs        the harness that produced the verification image
    reference/body-geometry/verification.png  the render these were checked against

Start from these. `node render.mjs` in that folder writes `out.html` — confirmed working on this
machine, output is 14 regions (13 front, 14 back). Port the geometry into `scripts/build-body.mjs`
and `lib/anatomy/geometry.ts`, adapting the shape to the `Capsule`/`BodyRegion` types in
`lib/anatomy/types.ts`.

### Coordinate space

viewBox `0 0 240 620`, centre line x=120, 8-head proportions.
head top y=20 · chin y=92 · shoulder y=134 · waist y=238 · crotch y=300 · knee y=442 · sole y=582

    headC 120,57      neckTop 120,96      neckBase 120,122
    shoulderL 58,134  shoulderR 182,134
    elbowL 46,228     elbowR 194,228
    wristL 40,314     wristR 200,314
    handTipL 37,358   handTipR 203,358
    hipL 96,302       hipR 144,302
    trochanterL 80,296  trochanterR 160,296
    kneeL 94,442      kneeR 146,442
    ankleL 93,552     ankleR 147,552
    toeL 68,578       toeR 172,578

Silhouette: round-capped strokes on those bones — neck 32, upper arm 30, forearm 24, hand 22,
thigh 44, shank 32, foot 21 — plus the head ellipse and the torso path

    M74 134 C96 124 144 124 166 134 L170 182 L158 238 L162 268 L160 300
    C150 314 90 314 80 300 L78 268 L82 238 L70 182 Z

### Hotspots — round-capped capsules on the same joints

| Region | From → to | w | Views |
|---|---|---|---|
| neck | 120,102 → 120,126 | 40 | both |
| shoulder | shoulder → 24% toward elbow | 40 | both |
| elbow | 86% shoulder→elbow → 16% elbow→wrist | 34 | both |
| wrist | 88% elbow→wrist → wrist | 30 | both |
| hip | **trochanter** → 10% hip→knee | 44 | both |
| knee | 90% hip→knee → 11% knee→ankle | 44 | both |
| ankle | 90% knee→ankle → ankle | 34 | both |
| lower-back | 120,236 → 120,278 | 56 | **back only** |

**Two decisions that are the actual bug fixes — do not undo them:**

- **Hip anchors on the trochanter, not the leg root.** At the leg root the two sides collide
  across the midline and the patient cannot tell left from right.
- **`lower-back` is back-view only.** Do not give it a front path.

If you change any number, re-render and look at it. Do not adjust by reasoning.

## Also required

- **Region availability comes from the library snapshot.** Read `src/data/library/areas.json` and
  render only regions whose `areaId` exists there. Do not hardcode the list and do not invent
  regions for areas with no exercises. `upper-back` and `foot` must NOT appear — they have zero
  exercises. `elbow` MUST appear — it has two and is currently unreachable.
- **Interior detail differs front vs back** — sternum and pectoral line vs spine, scapulae and
  gluteal fold — so the two views are distinguishable at a glance without reading the label.
- **`focusViewBox` per region:** hotspot bounding box plus padding, preserving the 240:620 aspect
  so the figure never distorts, clamped to the canvas.
- **`?debug=1`** renders every hotspot translucent and labelled with its region id.
- **Each region** is a `<g role="button" tabindex="0" aria-pressed>` with an accessible name,
  keyboard activation on Enter and Space, and a visible focus ring. Never signal selection by
  colour alone — pair it with an outline and a text label.
- **Both themes.** The silhouette, the highlight and the focus ring must all work on light and
  dark grounds. Warm reds are the ones that fail on dark; check yours.

## Your verification loop — this is not optional

    npm run shoot -- --only=locate-front
    npm run shoot -- --only=locate-back

Attach the PNGs to your own chat and **say what you see**. For each of the 14 hotspots, state
whether it sits on the body part it names. A hotspot that is 10 units off is invisible in code
and obvious in a render.

Check at 360px and at desktop width, in both themes, with `?debug=1` and without.

## Do not

Build any 3D or canvas. Touch the flow, the screens, or the state machine. Add clinical copy.
Add a dependency. Modify anything inside `patient-library/`.

## Acceptance

- The back view offers `lower-back`; the front view does not.
- Every hotspot sits visibly on the body part it names — with attached screenshots proving it.
- No region exists whose `areaId` is absent from the library snapshot; `elbow` is present,
  `upper-back` and `foot` are not.
- Selecting a region by keyboard alone works, announces, and shows a visible focus ring.
- `npm run typecheck` and `npm run build` pass.

## Report

Files changed · the screenshots, with your own assessment of each view · any coordinate you
changed and why · typecheck and build output · anything you could not do.
