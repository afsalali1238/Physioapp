> # RETIRED 2026-08-26 - DO NOT BUILD FROM THIS FILE
>
> This document predates decisions A-002, A-003 and A-007 and was never updated. It
> specifies the introduction screen and the three symptom questions that A-002 cut, a
> safety check triggered by those questions rather than a standalone gate (A-007), and
> a result heading -- "What may be involved" -- that drifts into the condition language
> this product forbids.
>
> Kept for history only. Current spec: `../patient-library/docs/MERGE-PLAN.md` and
> `../patient-library/PRD.md`.

# Unified Product Blueprint

## Product shape

```text
                    ┌─ Find a body area ─ 3D human ─ zoom ─ exact zone ─ safety ─ education ─┐
Home ───────────────┤                                               ├─ Area page
                    └─ Stretching / Exercise Protocols ─────────────┘
```

The product is a digital physiotherapy handbook. The interactive human is its signature discovery
experience, while direct clinician-shared exercise links are its most important repeat-use workflow.
The 3D model is a spatial interface and education surface, never a diagnostic engine.

## Information architecture

```text
HOME
├── Open a shared exercise or scan a QR
├── Find a body area
│   ├── Front/back locator
│   ├── Region selection
│   ├── Highlight and camera zoom
│   ├── Regional detail and exact-zone selection
│   ├── Exact-place confirmation
│   ├── Safety gate
│   └── Structures, scenarios, safety + exercise links
├── Stretching
│   └── Body area → all published stretches
├── Exercise Protocols
│   └── Body area → all published exercises
├── How to use this
├── Legal / Privacy / Credits
└── Clinic mode (unlisted, optional)
```

## Handbook model

```text
Clinician recommendation ─ link / QR / print ─► exact exercise or area
Patient exploration ───── 3D / list / search ─► body-area handbook
                                               ├── About
                                               ├── Stretching
                                               └── Exercise Protocols
```

Both paths end in the same canonical content. There is no separate simplified copy for QR users
and no duplicated clinical record for the 3D experience.

## Principles

Orientation before explanation. Broad location before exact location. Confirmation before interpretation. Safety before exercise. Plain language before anatomical terminology. One primary action per screen. Every canvas action has an equivalent semantic control. A fallback is a complete experience, not an error screen.

## Inspiration adopted carefully

From interactive anatomy products such as Humanome and the referenced Three.js project, adopt the sense of discovery, full-body spatial navigation, focused regional scenes, structure hotspots, progressive detail, and on-demand assets. Do not copy unverified anatomy models or clinical text. Visual polish cannot substitute for anatomical accuracy, accessibility, performance, or clinical review.

## Display rules

Area pages show the first two clinician-selected items as “Start here,” then remaining items in stable order. Cards preserve the approved order: image, identity/type, dosage, instructions, target muscles, safety, local completion control.

The map may describe a region and show broad structures, but it must not infer a condition, recommend an exercise from an answer, or manufacture dosage.

## Home hierarchy

The first viewport presents three workflows, in this order: Find a body area, Stretching, Exercise Protocols. The 3D experience begins immediately after the first choice; there is no marketing intro screen. Returning users must never be forced through the locator.

## Result hierarchy

Use a segmented control or equivalent clear navigation for About this area, Stretching, and Exercises. Preserve the selected location as context, but state that it does not determine diagnosis or exercise suitability.

## Technical principles

Static-first Astro rendering for library and legal routes. Client-side interaction only for map state, safety gate, controls, and optional enhancements. Published content is a normalized build-time snapshot. Regional and 3D assets load only after user intent. The simple SVG map is the canonical fallback and accessibility reference.
