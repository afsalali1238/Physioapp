# RTL Readiness Board (Handoff 6)

**PROTOTYPE — NOT CLINICALLY REVIEWED**

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: Gemini 3.1 Pro (High)
generation_method: Code generation
generation_date: 2026-08-27
replacement_required: true
reference_sources: []
```

## Mission
Demonstrate RTL (Right-to-Left) layout behavior using placeholder text to ensure the UI flows correctly without mirroring anatomical assets.

## Core RTL Principles for Anatomy Explorer
1. **UI flows Right-to-Left:** Text, buttons, icons, and menus reverse their order. (e.g., Back button points right and sits on the top-right).
2. **Anatomy DOES NOT mirror:** A left shoulder is a left shoulder regardless of language. The 3D canvas, SVG fallbacks, and exercise posters must remain strictly LTR in their internal coordinate systems.

## RTL Layout Prototype
*(Save the following code as an HTML file to preview the RTL layout)*
```html
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>RTL Layout Test</title>
<style>
  body { font-family: system-ui; background: #f8fafc; color: #0f172a; margin: 0; padding: 16px; }
  .card { background: #fff; border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 16px; }
  .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 12px; }
  .back-button { display: flex; align-items: center; gap: 8px; color: #0ea5e9; text-decoration: none; font-weight: bold; }
  
  /* CRITICAL: The canvas container must force LTR so the model doesn't flip */
  .canvas-container { direction: ltr; background: #e2e8f0; height: 300px; border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative; }
  .canvas-container::after { content: 'CANVAS (STRICTLY LTR)'; color: #64748b; font-weight: bold; }
  
  .controls { display: flex; gap: 8px; margin-top: 12px; }
  button { padding: 8px 16px; border: 1px solid #cbd5e1; background: #fff; border-radius: 6px; cursor: pointer; }
  
  .exercise-details { margin-top: 16px; }
  .info-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding: 8px 0; }
</style>
</head>
<body>

<div class="card">
  <div class="header">
    <!-- Notice the arrow points right in RTL for 'back' -->
    <a href="#" class="back-button"><span>➔</span> [Placeholder: Back to Regions]</a>
    <strong>[Placeholder: Exercise Title]</strong>
  </div>
  
  <!-- The image/canvas stays LTR so the left arm remains on the viewer's right (front view) -->
  <div class="canvas-container">
    <div style="position:absolute; bottom:8px; left:8px; direction:rtl;">
      <button>▶ [Placeholder: Play]</button>
    </div>
  </div>

  <div class="controls">
    <button>[Placeholder: Front]</button>
    <button>[Placeholder: Back]</button>
  </div>

  <div class="exercise-details">
    <div class="info-row">
      <span>[Placeholder: Sets]</span>
      <strong>3</strong>
    </div>
    <div class="info-row">
      <span>[Placeholder: Reps]</span>
      <strong>10</strong>
    </div>
    <p>[Placeholder: Clinical instruction text goes here. It will automatically flow from right to left.]</p>
  </div>
</div>

</body>
</html>
```

## Verification Checklist
- [x] UI strings and containers respect `dir="rtl"`.
- [x] Icons with directional meaning (like "Back") are horizontally flipped.
- [x] The `canvas-container` is explicitly forced to `direction: ltr` to ensure Three.js or SVG coordinates do not flip the anatomical left/right sides.
- [x] Media controls (Play/Pause) are positioned logically within the RTL layout without breaking the video framing.
