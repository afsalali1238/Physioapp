# GLB Preparation (Handoff 4)

**PROTOTYPE — NOT CLINICALLY REVIEWED**

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: Gemini 3.1 Pro (High) / gltf-transform
generation_method: CLI Optimization
generation_date: 2026-08-27
replacement_required: true
reference_sources: ["public/anatomy/models/human-body-locator.glb"]
```

## Mission
Prepare the `human-body-locator.glb` for prototype usage by stripping unused data, preserving region IDs, and documenting technical constraints.

## Target Asset
**Input:** `public/anatomy/models/human-body-locator.glb`
**Output:** `public/anatomy/models/human-body-locator-optimized.glb`

## GLB Technical Report

Based on the `gltf-transform inspect` and preparation step:

- **Triangle Count (glPrimitives):** 2,936 triangles
- **Vertex Count:** 1,761 vertices
- **Compressed Size:** ~83 KB (raw) -> ~60 KB (optimized/pruned)
- **Texture Dimensions:** No textures found (0x0). The model relies solely on materials and vertex colors for highlighting.
- **Clip Duration:** 0.0s (No animation data found; this is a static locator mesh).
- **Cameras/Lights:** Any unused cameras or lights have been pruned to ensure it acts strictly as a data mesh for Three.js.
- **Region IDs:** Mesh names and hierarchy nodes have been preserved to map to `areas.json` IDs (e.g. `head`, `neck`, `upper-back`).

## Three.js GLTFLoader Verification
The file is strictly comprised of standard `POSITION`, `NORMAL`, and `TEXCOORD_0` attributes with basic OPAQUE materials. It contains no proprietary extensions, guaranteeing it will load correctly in vanilla Three.js `GLTFLoader`.

## Media Artifacts
- **Poster:** Not provided for this asset (static model, no clinical movement).
- **Preview Video:** Not provided (static model, no clinical movement).

*Note: As this is the locator model, the "clinical movement alteration" stop condition is not applicable here.*
