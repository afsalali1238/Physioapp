# Anatomy region maps (v0)

Standalone 2D region-map assets for the anatomy explorer, **generated from the
app's own geometry** — not hand-drawn and not produced by any external tool.

## Why this exists

The original ask was to use `heliosgen` / img2threejs (a 2D-image → interactive
3D-character pipeline) "for image generation" of anatomy region maps, with the
3D part removed for now. Two things made a direct integration the wrong first
step:

1. **The repo couldn't be read.** `github.com` is blocked in this sandbox and
   the repo was never cloned locally, so integrating it would have meant coding
   against a guessed API.
2. **The app doesn't consume raster images for this.** The Tier-1 body map in
   `AnatomyLocator.astro` is built live from joint-anchored vector geometry
   (`geometry/skeleton.ts` + `geometry/regions.ts`), validated at build time by
   `check-anatomy.ts`. It wants **vector geometry**, not generated bitmaps — so
   an image→3D character tool is an awkward fit for flat clinical region maps.

So this delivers the actual target — clean region maps — as SVG derived from the
exact geometry the app already ships, guaranteeing they can't drift from it.

## What's here

| File | What it is |
|---|---|
| `generate-region-maps.mjs` | The generator. Faithful copy of `J`, `cap`/`lerp`, `SILHOUETTE`, `DETAIL`, `GEOMETRY_REGIONS`. Re-run with `node generate-region-maps.mjs`. |
| `preview.html` | Interactive preview — front/back toggle, list↔map highlight sync, per-area zone descriptions. Open in any browser. |
| `svg/region-map-front.svg`, `svg/region-map-back.svg` | Neutral overview maps: silhouette + every published area marked faintly. |
| `svg/area-*.svg` | One highlighted map per published area (8 total), with English + Arabic label where the sheet supplies it. |
| `metadata.json` | Asset metadata in the `ASSET-PIPELINE.md` shape: original work, `status: draft`, empty `reviewed_by`. |

## Guardrails honoured

- **No committed app file was touched.** Everything lives in this folder.
- **No coordinate is hand-authored.** Every region capsule is derived from the
  joint table via the same helpers the app uses (`skeleton.ts` rule).
- **No clinical content invented.** Area names come from `areas.json`; Arabic
  only where the sheet already has it (neck الرقبة, shoulder الكتف). Zone strings
  are the app's own navigation labels from `regions.ts`. No condition or
  diagnosis language; no internal anatomy drawn.
- **Draft, unreviewed.** Marked as such; nothing is presented as clinician-signed.

## The 8 published areas

neck · shoulder · elbow · wrist · lower-back (back view only) · hip · knee · ankle

## If you later want to wire these into the app

The maps already match the app's coordinate space (`viewBox 0 0 240 620`). The
cleanest path is **not** to import these SVGs but to render from the shared
geometry the app already has — which is exactly what `AnatomyLocator.astro`
does. Treat these files as review/proof and as ready-to-use static assets (print
handouts, share images, no-JS fallback), and swap the palette constants in
`generate-region-maps.mjs` for the app's CSS tokens (`--line`, `--brand`,
`--ink-3`) before shipping.

## On heliosgen / img2threejs

Where that tool genuinely fits this project is the **future 3D/animation**
direction — turning a reference pose into an animated 3D character demonstrating
an exercise — not flat region maps. If you clone it into `pshyapp/heliosgen`, I
can read it and scope that properly.
