# 3D and Illustration Asset Pipeline

## 1. Asset principles

- Clinical correctness is more important than photorealism.
- Every asset has a source, license, version, and reviewer.
- Models are region-specific whenever possible.
- The simple fallback is treated as a first-class asset, not a temporary placeholder.
- The full-body model is the primary capable-device locator; regional models are loaded on demand.
- Interactive polish inspired by Humanome-style anatomy experiences is welcome, but no generated model is trusted clinically without mesh, placement, and clinician review.

## 2. Production route

1. Define the region and required interaction zones.
2. Obtain or create a source model with clear rights.
3. Separate logical parts into named meshes.
4. Remove hidden geometry and unnecessary interior detail.
5. Retopologize or decimate conservatively.
6. Generate UVs and compressed textures.
7. Export GLB/GLTF.
8. Run automated size and integrity checks.
9. Review the model visually on desktop and mobile.
10. Have a clinician verify orientation and region boundaries.
11. Publish only after metadata and fallback assets are complete.

## Delivery tiers

1. **Fallback tier:** front/back SVG or illustrated map, semantic region list, and labels.
2. **Locator tier:** one compressed full-human GLB with broad-region and enlarged hit meshes.
3. **Regional tier:** independently compressed regional GLBs with exact zones, camera targets, and optional hotspot layers.

The browser loads tier 1 immediately, upgrades to tier 2 after capability checks, and requests tier 3 only after a region is selected. A failed upgrade never removes tier 1.

## 3. Required metadata

```text
asset_id
source_url_or_provider
license
author_or_attribution
original_file_hash
optimized_file_hash
software_and_version
triangle_count
texture_dimensions
compressed_bytes
reviewed_by
reviewed_date
status
```

## 4. Optimization checklist

- Remove unused cameras, lights, animations, and materials.
- Merge materials where visually safe.
- Prefer compressed textures.
- Use Draco or Meshopt compression.
- Keep selectable meshes logically separate.
- Avoid high-frequency detail that disappears on a phone.
- Test model at low and high pixel density.
- Confirm that transparent or hidden layers do not block raycasts.
- Confirm model loading does not block the first semantic interaction.
- Record measured first interaction, model transfer, frame rate, and memory on representative phones.

## 5. Visual review checklist

- Correct left/right orientation.
- Correct front/back orientation.
- Region boundaries are understandable to a non-clinician.
- No misleadingly precise internal anatomy.
- No visible geometry errors at the default camera distance.
- Selected region is obvious without flashing.
- Labels do not overlap the body or controls.
- Model remains usable in light and dark themes.

## 6. Licensing policy

Do not ship an asset until its license permits the intended web distribution. Keep attribution in the repository and expose required credits in the application.

Do not assume that a model-generation service grants redistribution rights for the resulting model. Record the actual terms used for each asset.

## 7. Asset tests

Build checks should fail for:

- Missing model referenced by a published region.
- Missing simple fallback.
- File larger than the configured budget.
- Invalid GLB/GLTF.
- Duplicate asset ID.
- Retired asset referenced by published content.
- Missing license metadata.
