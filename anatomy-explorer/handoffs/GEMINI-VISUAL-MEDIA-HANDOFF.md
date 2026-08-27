# Gemini / Antigravity Handoff — Prototype Visuals and Exercise Media

**Project:** Anatomy Explorer  
**Target folder:** `C:\Users\HP\Desktop\antigravity\pshyapp\anatomy-explorer`  
**Status:** Prototype-only handoff  
**Owner:** Codex supervisor  
**Date:** 2026-08-27

## Mission

Create temporary visual assets that help the team validate the 3D locator and exercise-media
experience. These assets are for internal preview and design/technical testing. They are not
clinically approved and must not be exposed through patient routes.

## Read before work

Read these files completely:

- `AGENTS.md` at the repository root;
- `anatomy-explorer/AGENTS.md`;
- `anatomy-explorer/PRD.md`;
- `anatomy-explorer/CLINICAL-SAFETY.md`;
- `anatomy-explorer/3D-TECHNICAL-ARCHITECTURE.md`;
- `anatomy-explorer/ASSET-PIPELINE.md`;
- `anatomy-explorer/MEDIA-PLAN.md`;
- `anatomy-explorer/docs/3D-MOTION-IMPLEMENTATION-PLAN.md`.

Never edit `patient-library/`.

## Allowed work

You may:

- create visual style boards;
- assemble multi-source anatomy reference packets;
- create fallback SVG/body-map concepts;
- create temporary body-model references;
- create storyboard frames for a supplied exercise;
- generate temporary short motion/video references from clinician-supplied source material;
- prepare or export prototype GLB/GLTF/MP4/poster assets;
- add prototype-only metadata and preview assets within `anatomy-explorer/`.

You may not:

- invent clinical exercise instructions, dosage, safety text, target muscles or anatomy education;
- assign clinician names or review dates;
- label generated media as approved;
- change compliance, publication, safety or draft-isolation logic;
- add accounts, analytics, tracking, backend or patient data storage;
- change configuration, lockfiles or dependencies without stopping and reporting the need;
- place prototype media on a published patient route.

## Required labels

Every generated or borrowed asset must carry:

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: ...
generation_method: ...
generation_date: ...
replacement_required: true
reference_sources: [...]
```

Use a visible preview label:

```text
PROTOTYPE — NOT CLINICALLY REVIEWED
```

## Handoff 1 — 3D locator style board

Create 3–5 visual directions for a calm, inclusive, low-detail human model. Show:

- neutral standing pose;
- front and back orientation;
- selected neck or shoulder region;
- subtle highlight treatment;
- mobile and desktop framing;
- no internal-organ detail;
- no diagnostic labels or claims.

Deliver:

- PNG/WebP boards;
- prompt and settings used;
- source references;
- recommendation for one direction;
- known visual risks;
- replacement/production notes.

## Handoff 2 — Exercise storyboard

Use only a supplied exercise ID and clinician-provided movement description. Produce a storyboard:

```text
neutral start → movement path → end position → controlled return
```

Do not add dosage, safety text or unprovided clinical meaning. Any uncertainty must be returned as a
question for the physiotherapist.

Deliver:

- start/middle/end frames;
- a 4–10 second timing suggestion;
- camera view and side;
- poster candidate;
- a list of assumptions and questions.

## Handoff 2A — Anatomy reference packet

For the supplied body region, assemble a reviewer-friendly packet using multiple independent sources
such as Z-Anatomy, OpenAnatomy, NIH 3D, BodyParts3D and Servier Medical Art where accessible.

Deliver:

- front, back and useful side references;
- source and usage note beside each image;
- factual surface-location and orientation observations only;
- disagreements or uncertain boundaries as clinician questions;
- no copied clinical prose and no claim that one external source is the product model.

Do not trace a single source into a production asset. The packet is reference evidence only.

## Handoff 2B — Fallback SVG concepts

Create up to three body-map concepts based on the existing stable region IDs. Explore:

- an original silhouette;
- an attributed medical-illustration adaptation where suitable;
- a simple code-native region treatment inspired by permissive body-highlighter patterns.

Each concept must show front/back, selected state, keyboard focus, mobile framing and a text label.
Do not invent or rename regions.

## Handoff 3 — Temporary motion/video reference

Only use supplied source material. The output must:

- be silent;
- show one complete repetition;
- use a stable camera;
- avoid decorative cuts, speed ramps or exaggerated range;
- preserve left/right orientation;
- include a poster frame;
- be labelled prototype in the filename and metadata.

Do not present generated video as the final patient demonstration. The final candidate must be
reconstructed or cleaned in a deterministic rig and reviewed separately by the physiotherapist.

## Handoff 4 — GLB preparation

When preparing a prototype GLB:

- preserve logical region IDs and animation clip names;
- remove unused cameras, lights and materials;
- report triangle count, compressed bytes, texture dimensions and clip duration;
- ensure the file loads with Three.js `GLTFLoader`;
- include a poster and a preview video where available;
- do not alter the clinical movement to make the export look better.

## Handoff 5 — Competitor pattern board

Build a pattern board from PhysiApp, Rehab My Patient/Rehab Guru, Physiotec, HEP2go and MedBridge
where publicly viewable. Focus only on direct exercise context, body navigation, motion controls,
mobile usability, print and media-failure behavior.

Do not reproduce proprietary assets or wording. Exclude accounts, adherence, analytics, remote
monitoring, telehealth and prescription workflows because they are outside this product's scope.

## Handoff 6 — RTL readiness board

Using non-clinical placeholder interface strings, show the locator, exercise media controls, modal
and print layout in RTL. Verify that page direction does not mirror anatomical left/right or create
ambiguous front/back orientation. Do not generate or publish Arabic clinical content.

## Output locations

Keep prototype material under clearly isolated paths, for example:

```text
public/anatomy/prototypes/
public/exercise-media/prototypes/<exercise-id>/
docs/visual-references/
```

Do not overwrite an approved asset. Do not reuse an existing approved filename for a prototype.

## Acceptance packet

Return a concise evidence packet containing:

1. Files created or changed.
2. Source/generation details for each asset.
3. Prototype labels and metadata locations.
4. Dimensions, file sizes, triangle counts and animation durations.
5. Screenshots at 360px and desktop where the asset is shown.
6. Known visual, motion and licensing limitations.
7. Confirmation that no clinical wording was invented.
8. Confirmation that `patient-library/` was not edited.
9. `git status --short` scope check.

## Stop conditions

Stop and report before continuing if:

- a clinical movement description is missing or ambiguous;
- the requested output would be used as patient-facing approved media;
- a config/dependency/lockfile change appears necessary;
- the work would require editing `patient-library/`;
- generated motion visibly changes anatomy, side, contact, range or joint behavior;
- the output cannot be clearly isolated as prototype media.
