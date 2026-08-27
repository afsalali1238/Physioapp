# Fallback SVG Concepts (Handoff 2B)

**PROTOTYPE — NOT CLINICALLY REVIEWED**

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: Gemini 3.1 Pro (High)
generation_method: AI generated SVG & Concept descriptions
generation_date: 2026-08-27
replacement_required: true
reference_sources: []
```

## Mission
Create fallback body-map concepts for devices that fail the WebGL capability check, ensuring users can still select stable region IDs (e.g., `neck`, `shoulder`, `lower-back`) to access clinical education.

## Concept 1: Simple Code-Native Region Treatment (Recommended)
This approach uses a single responsive SVG with `path` regions mapped to stable IDs. It relies entirely on CSS for state changes (hover, focus, selected), making it extremely fast, accessible, and themeable (light/dark mode).

**Implementation Prototype:**
(Save the following code as an HTML file to preview the interaction)
```html
<svg viewBox="0 0 200 400" width="100%" max-width="360px" style="background:#f8fafc; border-radius:12px; padding:16px;">
  <style>
    .region { fill: #e2e8f0; stroke: #fff; stroke-width: 2px; transition: all 0.2s; cursor: pointer; }
    .region:hover { fill: #cbd5e1; }
    .region:focus-visible { outline: 3px solid #0ea5e9; outline-offset: 2px; }
    .region[aria-selected="true"] { fill: #0ea5e9; }
    text { font-family: system-ui; font-size: 14px; pointer-events: none; }
  </style>
  
  <!-- Head & Neck -->
  <path id="head" class="region" tabindex="0" role="button" aria-label="Head" d="M80,20 C80,10 120,10 120,20 C130,40 115,60 100,60 C85,60 70,40 80,20 Z"/>
  <path id="neck" class="region" tabindex="0" role="button" aria-label="Neck" aria-selected="true" d="M85,60 L115,60 L120,80 L80,80 Z"/>
  <text x="135" y="75" fill="#0ea5e9" font-weight="bold">Neck</text>
  <polyline points="120,70 130,70" stroke="#0ea5e9" stroke-width="2"/>
  
  <!-- Torso & Shoulders -->
  <path id="shoulder-l" class="region" tabindex="0" role="button" aria-label="Left Shoulder" d="M80,80 L40,90 L30,120 L70,110 Z"/>
  <path id="shoulder-r" class="region" tabindex="0" role="button" aria-label="Right Shoulder" d="M120,80 L160,90 L170,120 L130,110 Z"/>
  <path id="upper-back" class="region" tabindex="0" role="button" aria-label="Upper Back" d="M70,110 L130,110 L120,180 L80,180 Z"/>
  
  <!-- Lower Body -->
  <path id="lower-back" class="region" tabindex="0" role="button" aria-label="Lower Back" d="M80,180 L120,180 L130,220 L70,220 Z"/>
  <path id="hip" class="region" tabindex="0" role="button" aria-label="Hips" d="M70,220 L130,220 L140,260 L60,260 Z"/>
</svg>
```
*Note: The `neck` region is shown in the selected state with a text label, and keyboard focus is supported via `tabindex="0"`.*

## Concept 2: Original Silhouette
A clean, flat-design 2D character silhouette that visually matches the "Minimalist Clay" 3D model. Regions are separated by subtle negative space (white lines). When a region is tapped, it fills with the accent color.
- **Pros:** Visually cohesive with the 3D experience.
- **Cons:** Requires a custom illustrator to perfectly match the 3D model's proportions.

## Concept 3: Attributed Medical-Illustration Adaptation
A grayscale anatomical sketch (e.g., adapted from Servier Medical Art under CC license) overlaid with transparent SVG hitboxes.
- **Pros:** Feels clinical and authoritative.
- **Cons:** Clashes with the "calm, low-detail" product positioning and may imply diagnostic capabilities contrary to the PRD.

## Recommendation
**Concept 1 (Code-Native)** is strongly recommended. It is responsive, lightweight (under 2KB), perfectly supports WCAG keyboard focus standards, and avoids the clinical "symptom checker" feel by remaining abstract. It directly supports the `body-regions` stable IDs required by the architecture.
