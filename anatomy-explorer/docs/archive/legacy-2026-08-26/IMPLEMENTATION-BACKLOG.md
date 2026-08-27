# Implementation Backlog

## Phase 0 — protect the current product

### A0.1 Freeze the current exercise contract

Acceptance:

- Existing exercise pages continue to build.
- Current Google Sheet sync remains the source of truth.
- No anatomy feature changes exercise dosage or safety copy.

### A0.2 Add documentation and decision log

Acceptance:

- This documentation index is linked from the repository README or handoff.
- Open decisions are recorded with owner and due date.

## Phase 1 — clickable 2D locator

### A1.1 Add anatomy route

Route: `/find-my-pain`

Acceptance:

- Route renders a front/back body map.
- It works without WebGL or external API calls.

### A1.2 Add region data

Acceptance:

- Neck, shoulder, upper back, lower back, hip, knee, ankle, wrist, and foot can be selected.
- Each region has a simple fallback asset.

### A1.3 Add confirmation flow

Acceptance:

- Selected region is highlighted.
- User can confirm, change, or choose “I’m not sure.”
- Browser back and reset work predictably.

### A1.4 Add precision zones

Acceptance:

- At least shoulder, neck, and lower back have precision zones.
- Zones are usable at 360px width.

## Phase 2 — safety and education

### A2.1 Add controlled symptom questions

Acceptance:

- Questions use controlled answers.
- No free-text health history is collected.

### A2.2 Add red-flag interruption

Acceptance:

- Configured red flags stop exercise handoff.
- Urgent copy is sourced from approved content.

### A2.3 Add education entries

Acceptance:

- Neck and shoulder have reviewed educational entries.
- Banned diagnostic language checks run during build.

### A2.4 Link to current exercises

Acceptance:

- Education entries reference existing exercise IDs.
- Missing or retired exercise references fail validation.

## Phase 3 — 3D progressive enhancement

### A3.1 Add capability detection

Acceptance:

- WebGL support is detected without crashing.
- Unsupported devices see the simple view.

### A3.2 Add full-body model

Acceptance:

- Model loads after the simple shell.
- Region selection matches the 2D map.
- Reset and front/back controls work.

### A3.3 Add regional model

Acceptance:

- Shoulder or neck loads on demand.
- Asset is disposed when leaving the region.
- Loading failure returns to simple view.

### A3.4 Add semantic control bridge

Acceptance:

- Keyboard and screen-reader users complete the flow without canvas interaction.

## Phase 4 — hardening

- Lighthouse/performance review on a low-end mobile profile.
- Accessibility audit with keyboard and screen reader.
- 200% zoom review.
- Reduced-motion review.
- Offline/simple-view review.
- License and attribution audit.
- Clinician sign-off on every published clinical row.
- Build failure tests for missing assets and bad mappings.

## Phase 5 — controlled expansion

Add one region at a time. Each region requires:

```text
region definition → simple map → precision zones → education copy
→ safety review → exercise mappings → 3D asset → visual QA → publish
```

Do not create all regions in parallel before the first region is approved.
