# 3D Technical Architecture

## 1. Rendering strategy

Use Three.js in a small client-side island only for the anatomy experience. Keep the existing Astro pages static and JavaScript-light.

Suggested modules:

```text
AnatomyLocator
├── RendererAdapter
├── AssetRegistry
├── CameraController
├── SelectionController
├── HotspotOverlay
├── RegionNavigator
├── SimpleViewFallback
└── AccessibilityBridge
```

## 2. Product role

3D is the primary experience on capable devices and the distinguishing product surface. It is progressive in delivery, not optional in product intent: the app must be designed around full-body selection, regional zoom, exact-zone selection, and educational hotspots. The 2D/semantic experience remains a complete mandatory equivalent.

## 3. Asset levels

### Level 0 — simple view

SVG or raster front/back body map. Always available.

### Level 1 — full-body navigation

One optimized full human model in a neutral pose. It exposes stable region and enlarged hit meshes. It is used to select a broad surface area and establish spatial orientation.

### Level 2 — regional detail

Separate regional models for approved areas. They provide better geometry, exact-location zones, and educational hotspots without forcing the whole catalogue into the initial load.

### Level 3 — anatomy layers

Optional reviewed muscles, bones, nerves, and other layers. Layers explain anatomy; they never claim to identify the source of the user’s discomfort.

## 4. Asset registry

```ts
type AnatomyAsset = {
  id: string;
  regionId: string;
  kind: 'locator' | 'regional' | 'layer' | 'fallback';
  url: string;
  bytes?: number;
  compressed: boolean;
  checksum?: string;
  status: 'draft' | 'approved' | 'retired';
};
```

The registry should be generated from content metadata so missing assets fail during build.

## 5. Interaction model

- Use raycasting for model selection.
- Use an invisible, slightly enlarged hit mesh where precise selection is difficult.
- Keep logical hotspot IDs separate from mesh names.
- Highlight selected regions with an outline, color tint, and accessible text label.
- Never rely on color alone.
- Do not make the whole model one selectable object.
- Preserve the last broad region while a regional model loads or fails.
- A click selects; a second explicit action confirms. Do not confirm on the first tap.
- Hotspot markers must avoid obscuring geometry and collapse into an accessible list on small screens.

## 6. Camera behavior

- Front view is the initial state.
- Back view is explicit.
- Zoom target is stored per region.
- Camera transitions are cancellable.
- Reset returns to the last intentional orientation, not an arbitrary animation.
- No auto-rotate on mobile.
- Constrain orbit and zoom so the model cannot be lost or viewed from confusing internal angles.
- Use stored, visually reviewed camera targets per region and zone.

## 7. Performance budgets

Targets:

- Simple view first meaningful interaction: under 1 second after page load.
- Full-body model: preferably 2–5.5 MB compressed; 8 MB hard review threshold.
- Regional model: preferably 2–6 MB compressed.
- First anatomy route JavaScript: keep under 250 KB compressed before model assets.
- Do not load all regional assets on initial page load.
- Dispose geometries, materials, and textures when leaving a regional view.
- Prefer Draco or Meshopt geometry compression and KTX2/Basis texture compression.
- Limit texture resolution to what remains visibly useful on mobile.
- Provide LOD or a simpler asset for constrained devices.

## 8. Loading sequence

```text
HTML shell → simple map → renderer capability check
→ low-detail model → user-selected regional model → optional layers
```

If any step fails, preserve the previous working step.

## 9. Accessibility bridge

The 3D canvas is not the only interface. Render a synchronized semantic control list:

- “Front of body” button.
- “Back of body” button.
- List of available body regions.
- Selected region heading.
- “Continue to exact location” button.
- “Use simple view” button.

Keyboard users must be able to complete the entire flow without the canvas.

## 10. Browser and device fallback

Fallback when:

- WebGL is unavailable.
- Device memory is constrained.
- Asset load fails.
- User requests reduced complexity.

Fallback must use the same `body_regions` and `pain_zones` data, so content does not diverge between 3D and simple views.

## 11. Visual and anatomical QA

Every model release requires automated asset validation plus screenshots of full-body front/back, every region focus, and every exact-zone selection at mobile and desktop viewports. Review checks framing, wrong-side mapping, floating hotspots, clipped geometry, unreadable labels, and mismatch between selected text and highlighted anatomy. A professional-looking render is not evidence of anatomical correctness.

## 12. Recommended file layout

```text
src/
  components/anatomy/
    AnatomyLocator.astro
    AnatomyCanvas.ts
    SimpleBodyMap.astro
    RegionControls.astro
    PainZonePicker.astro
  lib/anatomy/
    assets.ts
    interaction.ts
    state.ts
    capabilities.ts
  data/anatomy/
    body-regions.json
    pain-zones.json
    education.json
    safety-rules.json
public/anatomy/
  models/
  textures/
  fallback/
```
