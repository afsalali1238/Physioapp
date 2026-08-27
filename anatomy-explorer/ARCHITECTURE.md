# Unified Application Architecture

## Stack

Astro and TypeScript remain the foundation. Static rendering is used for home, library, area, legal, and print routes. A focused Three.js client island owns the signature anatomy experience. Smaller client logic handles safety transitions, text scale, and local completion marks.

## Source of truth

The Google Sheet remains clinician-owned. A migration script reads the validated `patient-library` data, normalizes it, and writes a versioned snapshot inside this app. The production browser never calls Google Sheets.

```text
Google Sheet → sync + Zod/compliance checks → normalized snapshot
→ anatomy mapping checks → Astro build → static patient routes
```

## Routes

`/` home; `/find-my-area/` locator; `/stretching/`; `/stretching/[area_id]/`; `/exercises/`; `/exercises/[area_id]/`; `/legal/[slug]/`; optional unlisted `/clinic/`; optional `/preview/` only after production isolation is proven.

## Boundaries

The anatomy layer references library IDs. It does not duplicate exercise prose, dosage, image metadata, or safety lines. The exercise renderer remains the canonical display of an item.

## Performance

The simple map is immediate and under one second to first interaction. The 3D full-body model upgrades the scene after capability checks. Regional assets load only after selection and are disposed when leaving the region. Direct library pages load no Three.js code.

Targets:

- Initial anatomy JavaScript under 250KB compressed before model assets.
- Full-body locator preferably 2–5.5MB compressed and never above 8MB without explicit review.
- Each regional model preferably 2–6MB compressed.
- Total initial anatomy transfer under 7MB on the normal 3D path.
- Maintain 45fps or better on supported mid-range mobile devices; downgrade or offer simple view below the capability threshold.
- Use glTF/GLB with mesh compression, texture compression, bounded texture dimensions, and on-demand delivery.
- Measure time to first semantic interaction, time to first 3D interaction, model decode time, input latency, 95th-percentile frame time, and fallback completion in controlled device tests.

## Three.js modules

`RendererAdapter`, `AssetRegistry`, `CapabilityPolicy`, `CameraController`, `SelectionController`, `HighlightController`, `HotspotOverlay`, `RegionNavigator`, `SimpleViewFallback`, and `AccessibilityBridge` remain separately testable modules. Mesh names are implementation details; stable region/zone IDs live in metadata.

## Loading sequence

```text
HTML + semantic controls + simple map
→ device/WebGL capability policy
→ compressed full-body locator
→ broad region selection
→ selected regional model and hotspot metadata
→ optional approved anatomy layers
```

Each stage preserves the previous working stage on failure.

## Resilience

If WebGL, memory, frame rate, reduced-complexity preference, or asset loading fails, the SVG map remains fully usable. Cache the shell, full-body locator where appropriate, and current region only; never make offline caching a reason to ship all models.

## Security and privacy

No backend, authentication, telemetry, analytics, or third-party tracking. Validate and escape all sheet content at build time. Do not expose draft rows on patient routes.
