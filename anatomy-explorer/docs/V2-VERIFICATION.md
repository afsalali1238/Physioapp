# V2 vertical slice verification

## Status definitions

- **Implemented:** present in source/assets.
- **Source-reviewed:** inspected by the supervisor.
- **Command-verified:** the exact command completed successfully.
- **Visually verified:** a successful rendered capture was inspected at 360px and desktop.
- **Human-approved:** clinician/visual reviewer explicitly approved anatomy and boundaries.

## Implemented and source-reviewed

- Three.js and `@types/three` are declared and installed.
- `NeckThreeSlice.astro` lazy-loads Three.js and `GLTFLoader` after capability checks.
- Public routes receive only approved registry assets. The registry-backed draft GLB is exposed only by the noindex anatomy preview.
- Front/back orientation, neck highlight, camera framing, semantic fallback, touch-sized controls,
  distinct loading/asset/WebGL error states, and static reduced-motion rendering are implemented in source.
- The semantic handoff remains the stable `/area/neck/` route.
- No clinical instructions or safety content are duplicated in the 3D layer.

## Asset evidence

- GLB actual size: 63,272 bytes.
- Registry `compressed_bytes`: 63,272 bytes.
- Actual GLB triangle count: 2,232 triangles.
- Registry triangle declaration: 2,232 triangles.
- Enforced triangle ceiling: 50,000 triangles.
- Asset status: `draft`; no visual asset is marked approved.
- Source/licence/attribution metadata is present in the registry.

## Command verification

- `npm ci`: completed successfully; 396 packages installed.
- `npm run typecheck`: completed successfully; 41 files, 0 errors.
- `npm run build`: failed in `prebuild` when `check:compliance` could not launch.
- `check:assets`: attempted, but the Node/tsx bridge failed before project execution with `uv_os_get_passwd ENOMEM`.
- Compliance, anatomy, image, and route checks: not command-verified; the same Node 24.13.0/tsx error prevents execution.
- Direct `astro build`: completed successfully and prerendered the patient and noindex preview routes.
- Built patient HTML has an empty `data-asset-url`; built preview HTML contains the draft GLB URL.

## Bundle evidence

- Component bootstrap: 3,884 bytes actual / 1,906 bytes gzip.
- GLTFLoader: 45,017 bytes actual / 12,998 bytes gzip.
- Three.js: 695,080 bytes actual / 174,997 bytes gzip.
- Total lazy 3D JavaScript: 743,981 bytes actual / 189,901 bytes gzip.
- Model transfer: 63,272 bytes.

## Resource lifecycle

- Rendering occurs on model load, successful resize, and orientation/camera changes.
- Animation frames exist only during the bounded 220ms orientation transition.
- Reduced-motion orientation changes render immediately without animation.
- Teardown cancels the active frame, removes resize/button/pointer listeners, disconnects the ResizeObserver, disposes geometry/materials/textures and the renderer, and releases the WebGL context.

## Visual verification

Not verified. Automated CDP coverage for desktop, 360px, front, back, reduced motion, WebGL failure,
asset failure, 200% zoom, keyboard completion, and canvas pixels is implemented in
`scripts/render-v2-qa.mjs`. Chrome launch was blocked by the environment approval reviewer returning
HTTP 503, so no rendered screenshot or pixel result is claimed. Any `v2-desktop.png` or
`v2-360.png` present from earlier attempts is an invalid browser error capture and must not be used
as evidence; its deletion was also blocked by the approval-reviewer outage.

## Clinical review

Anatomical accuracy, region boundaries, orientation, regulatory posture, and publication approval
remain open human gates. The GLB and registry entry remain `draft`.
