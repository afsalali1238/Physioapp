# Unified Physiotherapy Education Platform — PRD

**Status:** Unified product contract v1.1 — quality revision  
**Owner:** Afsal (product and engineering)  
**Clinical owner:** Physiotherapist, with Medical Director approval where required  
**Date:** 2026-08-26

## Product definition

One calm, mobile-first physiotherapy handbook helps a patient revisit information recommended by
their physiotherapist and independently explore approved body-area education. It combines direct
exercise links, area handouts, QR entry points, a full-body 3D locator, anatomy education,
stretching, and exercise protocols in one application.

The product is educational. It is not a diagnostic tool, symptom checker, treatment recommender, or patient-management system.

## Product positioning

The primary position is: **your physiotherapy handbook** — a visual companion for information
discussed with a physiotherapist. A clinician can point to a specific exercise, send its link, or
share a QR code. Patients may also explore a body area using the 3D human and review general,
clinician-approved information. The app does not promise to diagnose discomfort or choose treatment.

## Primary journeys

**Visual discovery:** Home → Find a body area → interactive full-body 3D human → tap a broad region → highlighted camera zoom → optionally choose an exact zone → “Is this the exact place you feel discomfort?” → safety gate → area education → choose a direct library section.

**Direct browsing:** Home → Stretching or Exercise Protocols → body area → complete item cards.

**Clinician handoff:** Clinic mode → choose area → generate/copy area URL or QR → hand to patient. Clinician mode never creates clinical content and uses the same published snapshot.

**Specific exercise handoff:** Physiotherapist opens or shares a stable exercise anchor/URL → patient
lands directly on the exercise → sees its name, approved media, dosage, instructions, target muscles,
safety line, surrounding handbook context, and a route back to the body area.

**Return visit:** Patient reopens the shared link, QR, browser bookmark, or handbook navigation →
returns to the same stable content without logging in.

## v1 scope

- Unified home page with visual entry and direct library entry.
- A rotatable full-body 3D human as the signature experience on capable devices.
- Direct selection of approved surface regions using raycasting and generous invisible hit meshes.
- Selected-region outline/tint, persistent text label, and cancellable camera zoom.
- On-demand regional-detail models with selectable exact-location zones and educational hotspots.
- Exact-location confirmation with Confirm, Change location, and I’m not sure paths.
- Adaptive precision: skip exact zones when they do not change reviewed education or safety content.
- Synchronized 2D and semantic controls using the same region and zone records.
- Confirmation that teaches orientation without interpreting cause.
- Explicit red-flag safety gate before exercise discovery.
- Published-area education and complete stretching/exercise pages.
- Exercise cards with image, type, instructions, dosage, target muscles, safety, print, and local completion mark.
- A media hierarchy for each exercise: approved still image as the baseline, optional short motion demonstration, and complete text instructions that work without media.
- Small muscle figure and optional layer highlights derived from approved target-muscle metadata.
- Clinician-reviewed education covering structures, normal role, common ways discomfort may be described, common non-diagnostic scenarios, aggravating activities, and when to seek help.
- On-demand loading, progress feedback, asset-error recovery, and a “Use simple view” control.
- Light/dark themes, 17px base type, 200% zoom, keyboard-complete flow.
- Complete simple-map fallback; WebGL is never required to finish the journey.
- Clear separation between About this area, Stretching, and Exercise Protocols.
- Stable shareable URLs and QR codes for the handbook home, every published area, and every published exercise.
- A clinician handoff panel that supports Copy link, Show QR, Print handout, and Open patient view.
- Handbook search by approved exercise name, body-area name, and clinician-approved everyday terms.
- Exercise deep links that remain understandable without completing the 3D locator first.
- Build-time schema, content, image, anatomy, and compliance validation.
- A noindex draft workflow where content and media can be produced now, clearly labelled unreviewed, and withheld from patient routes until approval.

## Explicit exclusions

No diagnosis, probability, cause, severity scoring, patient accounts, server-side symptom history, analytics, tracking, advertising, patient-specific prescriptions, chat, free-text health diary, booking CTAs, promotional claims, automated clinical prose, or an exhaustive organ atlas. Arabic patient-facing content waits for native clinical review.

## Non-negotiables

1. Navigation is by body area, never by condition.
2. Clinical content comes from the physiotherapist and approved source records.
3. Published content requires review metadata and passes compliance checks.
4. The safety gate is a real interruption; no answer can route around it.
5. The visual map is never the only route; semantic controls provide the complete journey.
6. The app never transmits patient selections by default.
7. IDs are permanent; retire records instead of deleting or reusing them.
8. 3D model geometry, region hit areas, camera targets, and educational hotspots require rendered visual QA; a technically valid model can still point to the wrong body location.
9. Exact-zone selection is optional per region and must have a reviewed purpose; precision for its own sake is prohibited.
10. The product must never imply that a map selection chose the correct exercise for an individual.
11. Motion is explanatory, not decorative: it demonstrates only the reviewed movement, is pausable, and never replaces instructions or dosage.
12. Draft speed never weakens publication gates. AI-assisted clinical copy, anatomy explanations, images, and animations remain draft with empty review fields.
13. A physiotherapist's direct link is navigation, not a digital prescription record. The app stores no patient identity, assignment, or clinician-patient relationship.

## Handbook requirements

- Every published exercise has a permanent, human-readable URL and stable ID anchor.
- Every published body area has one canonical page containing About, Stretching, and Exercises.
- A shared exercise URL opens the exact item and preserves enough area context to avoid disorientation.
- QR codes encode canonical HTTPS URLs and include a printed text fallback.
- Printed handouts show clinic identification, exercise title, approved poster/start-end media, dosage,
  instructions, safety, review/version information where appropriate, and the source URL.
- Patients can browse head-to-toe, search, or use the 3D locator; none is a mandatory gateway.
- Returning users should reach a known exercise in one action from a saved direct link.
- The handbook remains static and readable on weak connections and after media failure.

## 3D experience requirements

- Start with the whole human visible in a calm neutral pose.
- Support explicit front and back controls, drag rotation where safe, and a reset action.
- Do not auto-rotate on mobile or while the user is choosing a location.
- The user may tap any configured surface area; unsupported areas must not pretend to have clinical content.
- Broad-region selection highlights the region and moves the camera to a stored focus target.
- Regional detail replaces or supplements the full-body model only after selection.
- Exact zones use stable logical IDs independent of mesh names.
- Educational hotspots may explain approved structures inside the selected region.
- Every visual selection updates a text heading and synchronized semantic control state.
- A user can switch to the simple view at any time without losing the selected region.

## Educational result requirements

The result can contain these clinician-reviewed sections:

- Where this area is and what structures it includes.
- What the area normally helps the body do.
- Common ways people describe discomfort there.
- Common scenarios associated with irritation or overload, phrased without diagnosis or certainty.
- Activities that may aggravate the area.
- When to stop and seek professional or urgent care.
- Relevant published stretching and exercise-protocol links.

All new clinical education starts as `draft` with empty review fields. Builders and AI tools may create structure and placeholders but may not publish the wording.

Drafting may begin before clinician review. Each draft carries sources or rationale, version,
generation metadata, and unresolved review questions. Draft content is available only through a
clearly marked noindex preview and is excluded from patient collections.

## Exercise media requirements

- Every published exercise requires an approved still image or approved equivalent poster.
- Motion is optional; use it only when it improves understanding of direction or timing.
- Prefer a silent 4–10 second demonstration of one complete repetition from a stable camera.
- Provide Play/Pause and Replay; never autoplay for reduced-motion users.
- Avoid decorative camera movement, cuts, speed ramps, exaggerated range, and mirrored ambiguity.
- The poster, motion, alt text, and written movement must describe the same action.
- Motion requires separate movement-fidelity review; visual polish is not approval.
- Failed or unsupported motion falls back to the approved still without layout shift.

## Content lifecycle

```text
draft → schema/compliance/image checks → clinician review → Medical Director approval
→ published → periodic review → retired
```

During migration, the existing Google Sheet and validated library JSON remain the source. The unified app consumes a normalized build-time snapshot; content is never copied manually.

## Success criteria

- A first-time user finds a region within 30 seconds.
- A patient reaches published exercises in five intentional actions or fewer after confirmation.
- Direct Stretching or Exercise Protocol browsing is reachable from home in two actions.
- The direct library route remains obvious.
- Works at 360px, 200% text scale, keyboard-only, and without WebGL.
- On capable devices, selecting a broad region visibly highlights and zooms within 500ms after assets are ready.
- Full-body and regional assets load independently; the initial route never downloads the whole anatomy catalogue.
- The semantic list and simple map are interactive before the 3D asset finishes loading.
- Five representative patients and the physiotherapist complete the intended journey without builder guidance.
- No diagnostic or promotional language reaches a patient surface.
- Bad content fails before deployment with row, field, and reason.
- The physiotherapist can add one item without code assistance.
- A physiotherapist can generate a specific exercise link or QR in under 30 seconds.
- Scanning a printed QR opens the intended exercise or area with zero additional navigation.

## Launch strategy and migration

Build alongside the live library. Launch first as a clinician-assisted companion for one region, not a broad public symptom-discovery campaign. Prove one region end-to-end, obtain clinician review, test with representative patients, compare route and content parity, deploy to preview, test rollback, then cut over production. The live library remains the rollback target until acceptance.

## Open clinical decisions

Final clinic branding and legal identification; disclaimer and emergency wording; usefulness of local completion marks; “Start here” items; image conventions; confirmation/education wording; and whether clinician mode launches in v1.
