# Verified body geometry — reference for M1

Working, visually-checked geometry for the front/back body map. Rendered and inspected
before being committed here; the hotspots sit on the limbs they name.

`skeleton.mjs` — joint table, silhouette strokes and filled shapes, front/back detail lines
`regions.mjs` — hotspot capsules derived from the SAME joints, plus bbox and focusViewBox helpers
`verification.png` — the render these were checked against

## The rule that matters

Hotspots and silhouette are both derived from one joint table. Never hand-author a hotspot
coordinate: that is how the previous map ended up with the wrist floating off the arm and the
lower back sitting on the abdomen. If you change a number, re-render and look at it.

## Coordinate space

viewBox `0 0 240 620`, centre line x=120, 8-head proportions.
head top y=20 · chin y=92 · shoulder y=134 · waist y=238 · crotch y=300 · knee y=442 · sole y=582

## Two decisions worth keeping

- **Hip hotspots anchor on the trochanter (80,296 / 160,296), not the leg root.** Anchored at
  the leg root they collide across the midline and the patient cannot tell left from right.
- **`lower-back` is back-view only.** This is the front/back bug fix. Do not give it a front path.

## Rendering it

    node render.mjs      # writes out.html
    # then open out.html, or screenshot it headless

Regions render as round-capped stroked capsules. A stroked path hit-tests on its stroke, so the
same shape serves as both the visible highlight and the touch target — at 360px width the
narrowest capsule (w=30) is ~45px, above the 44px floor.
