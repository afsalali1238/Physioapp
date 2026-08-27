# M8 — 3D locator island

**Build tool:** GPT-5.6-SOL · **Wave:** 3 · **Branch:** `m8-3d-island` · **Depends on:** M4 (the 2D locator it enhances), M7 (asset discipline), **H5** (clinician sign-off that regions point at the right places)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

A-012 makes the full-body 3D human the signature experience on capable devices: broad region selection highlights and zooms, an on-demand regional scene supports exact-zone selection, and the app asks whether that is the exact place of discomfort before safety and education.

**None of it exists.** `package.json` has one dependency, `astro`. There is no `three`, no GLB, no `public/` directory, and not one of the paths in `3D-TECHNICAL-ARCHITECTURE.md` §12 is real. `README.md` describes "a focused Three.js island for the 3D locator" in the present tense. MODULE-MAP §8 lists that as the first entry in a table of things the documents claim and the code does not have.

So M8 builds it from zero. It is Wave 3 for a reason: it sits on top of a complete 2D locator, a settled content pipeline, and a clinician's sign-off on where the regions actually are.

Judge this module on one sentence, and it is not about the render: **turning WebGL off, or the model load off, or the network off, leaves a complete and usable locator behind.**

## 2. Do not redesign

The previous visual agent shipped three uninstructed reversals of written decisions (D-025, D-026). A WebGL canvas is the single richest surface in this project for that failure to repeat on. Specific locks:

| Locked | Source |
|---|---|
| **The map is an orientation tool, not a game.** No auto-rotate on mobile, no ambient motion, no hover reveals, no game-like feedback | `DESIGN-SYSTEM.md` · Locator; `3D-TECHNICAL-ARCHITECTURE.md` §6 |
| **A click selects; a second explicit action confirms.** Never confirm on the first tap | `3D-TECHNICAL-ARCHITECTURE.md` §5 |
| Selection shown by **outline, colour tint and an accessible text label** — never colour alone, never flashing | §5; `DESIGN-SYSTEM.md` |
| Do not make the whole model one selectable object | §5 |
| Front view initial, back view explicit, orbit and zoom constrained so the model cannot be lost or viewed from confusing internal angles | §6 |
| Camera transitions cancellable; reset returns to the last **intentional** orientation, not an arbitrary animation | §6 |
| **No misleadingly precise internal anatomy.** Layers explain anatomy; they never claim to identify the source of the patient's discomfort | §3, §5; `ASSET-PIPELINE.md` §5 |
| Colours and type come from M6's tokens. The canvas must remain usable in both themes | MODULE-MAP §5; `ASSET-PIPELINE.md` §5 |

**And the one that is not a style rule.** `CLINICAL-SAFETY.md` · Interpretation guardrails: precise taps and anatomical hotspots *feel* like a diagnosis. Every result states that the selected point is a general location guide, that the information does not identify the cause of the patient's discomfort, and that exercise links are general clinician-approved library content rather than a new prescription. **Never personalise scenario order, confidence or exercise ranking from what the patient selected.** Precision is the product's main interpretive risk, and this module is the one that adds precision.

## 3. Files you own

Exactly the M8 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `src/components/anatomy/three/**` | **absent** — create |
| `src/lib/anatomy/renderer/**` | **absent** — create |
| `public/**` | **absent** — create |
| `scripts/check-assets.ts` | **absent** — create |
| `docs/ASSET-PIPELINE.md` | root-level `ASSET-PIPELINE.md` exists and is **read-only**; the `docs/` copy is yours to create |

**`package.json` is M0's, and `three` is a dependency.** You cannot add it. File the exact package list and version pins in `CROSS-MODULE-REQUESTS.md` and let M0 install them. This is the rule that the recorded config incident came from — an agent deleted `astro.config.mjs` while working on something else and the Vercel adapter and sitemap were missing for days.

**`src/components/anatomy/**` outside `three/` is M4's.** You mount a canvas inside M4's shell; you do not restructure it.

## 4. Files you read, never write

- `3D-TECHNICAL-ARCHITECTURE.md` — the specification. §12's file layout describes nothing that exists; treat it as intent, not as a map.
- `ASSET-PIPELINE.md` (root) — the asset contract, the thirteen metadata fields, the licensing policy, the seven build-check failures.
- `src/components/anatomy/**`, `src/lib/anatomy/locator-state.ts` — M4's. Read to synchronise; never edit.
- `src/data/anatomy/**` — M2's and M3's. The 3D and 2D tiers use the **same** `body-regions` and `pain-zones` data, so content cannot diverge between views (§10).
- `src/styles/tokens.css`, `base.css` — M6's.
- `memory.md` A-005, A-006, A-012; `PRD.md`; `CLINICAL-SAFETY.md`; `BUILD-PLAN.md` Phase 2 gate.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 5. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `package.json` has **one** dependency: `astro: ^7.2.4`. No `three`, no loader, no compression tooling | `package.json:14-16` |
| **`public/` does not exist** in `anatomy-explorer/`. No models, no textures, no fallback assets, no favicon | file tree |
| **Not one path from `3D-TECHNICAL-ARCHITECTURE.md` §12 exists.** No `AnatomyCanvas.ts`, no `lib/anatomy/assets.ts`, `interaction.ts`, `capabilities.ts`, no `public/anatomy/` | file tree vs §12 |
| `README.md` describes the Three.js island in the present tense; MODULE-MAP §8 lists this as a documented-but-absent feature | `README.md`; MODULE-MAP §8 |
| The 2D locator is an **inline SVG**, `viewBox="0 0 240 620"`, with per-region `focusViewBox` — Level 0 of the asset tiers already exists in a usable form | `AnatomyLocator.astro:60` (M4's, being decomposed) |
| `BODY_REGIONS` holds **nine** regions with 2D `path` and optional `backPath`. There is no 3D mesh naming, no camera target, no hit-mesh definition | `src/data/anatomy/body-regions.ts` |
| A-006: the silhouette and every hotspot derive from **one shared joint table**, because hand-authored coordinates produced a wrist marker floating off the arm and a lower back tappable on the abdomen | `memory.md` A-006 |
| `reference/body-geometry/` holds the derivation source — `regions.mjs`, `skeleton.mjs`, `render.mjs`, `verification.png` — and is **M2's**, read-and-regenerate only | directory; MODULE-MAP §5 |
| `patient-library/public/` holds `sw.js` and `manifest.json` from D-027, an unrequested PWA addition | directory; `memory.md` D-027 |
| Performance budgets are already written: simple view interactive **under 1s**; full-body **2–5.5 MB** compressed, **8 MB** hard review threshold; regional **2–6 MB**; first anatomy-route JS **under 250 KB** compressed before models | `3D-TECHNICAL-ARCHITECTURE.md` §7 |
| **H5 is open**: no clinician has confirmed that any region highlights the anatomically correct place. It blocks M8 and blocks publishing M2 | MODULE-MAP §9 |

**The thing to notice about H5.** M2 regenerates the 2D geometry from the repo's own verified source, which is strictly better than the hand-authored coordinates that produced a floating wrist marker. It is still not sign-off. `ASSET-PIPELINE.md` §5 and `3D-TECHNICAL-ARCHITECTURE.md` §11 both say the same thing in different words: *a professional-looking render is not evidence of anatomical correctness.* A 3D model raises the stakes on that, because it looks far more authoritative than an SVG silhouette.

## 6. Deliverables

**1. File the dependency request first.** `three`, a GLTF/Draco/Meshopt loader path, and any KTX2 transcoder, with exact version pins and a one-line justification each. M0 installs. Do not vendor a copy into `public/` to avoid asking — that is the same rule broken by a different route.
**Acceptance:** the request exists with pins; `package.json` shows the additions in **M0's** commit, not yours; nothing under `src/` or `public/` is a vendored copy of a library.

**2. Capability detection before anything loads.** WebGL availability, device memory, reduced-motion preference, and an explicit user opt-out. The check runs before a single byte of model is requested.
**Acceptance:** with WebGL disabled, the network tab shows **zero** model requests; with `prefers-reduced-motion`, no camera animation runs; the opt-out is discoverable and persists only within the session.

**3. Tier 1 is never removed. This is the module's central constraint.** The browser gets the semantic locator and the 2D map immediately, upgrades to the full-body model after the capability check, and requests a regional model only after a region is selected. **A failed upgrade at any step preserves the previous working step** (§8, §10). Not a re-render, not a reload, not a flash of empty canvas — the working locator stays on screen.
**Acceptance:** all four of — WebGL unavailable, model 404, model load timeout, transcoder failure — leave a fully usable locator with the patient's current selection intact; no failure path produces an empty canvas, a spinner that never resolves, or a lost selection.

**4. The accessibility bridge, synchronised.** A semantic control list rendering alongside the canvas: front, back, the region list, the selected-region heading, continue to exact location, use simple view. **Keyboard users complete the entire flow without the canvas** (§9).
**Acceptance:** the whole flow completes with the canvas hidden via CSS; every canvas selection updates the semantic list and fires a live-region announcement; the canvas is not in the tab order as an interactive control without an equivalent.

**5. Selection semantics identical to M4's.** Raycasting, an invisible slightly-enlarged hit mesh where precision is hard, logical hotspot ids kept **separate** from mesh names, and the last broad region preserved while a regional model loads or fails. Click selects; a second explicit action confirms. **M4 owns the state machine** — you drive it, you do not fork it.
**Acceptance:** `locator-state.ts` remains the only transition source; no phase or reducer is defined under `three/` or `renderer/`; mesh names appear nowhere in application logic; the same region id means the same thing in both tiers.

**6. One data source for both tiers.** Regions, zones and labels come from M2's data. If the 3D tier needs a camera target or a hit-mesh id per region, that is a **field request to M2 and M0**, not a parallel table under `renderer/`.
**Acceptance:** no region, zone or label is defined under `three/` or `renderer/`; `check:anatomy` passes with the island in the tree; disabling 3D changes nothing about which regions exist.

**7. `scripts/check-assets.ts`.** Fails the build on the seven conditions in `ASSET-PIPELINE.md` §7: missing model referenced by a published region; missing simple fallback; file over budget; invalid GLB/GLTF; duplicate asset id; retired asset referenced by published content; missing licence metadata.
**Acceptance:** each of the seven has a fixture; the script runs standalone under `tsx`; it is wired into `npm run check`; an 8.1 MB full-body model fails.

**8. Budgets measured, not assumed.** Simple view interactive under 1s after page load; full-body 2–5.5 MB compressed with 8 MB as a hard review threshold; regional 2–6 MB; first anatomy-route JS under 250 KB compressed before models. Dispose geometries, materials and textures when leaving a regional view. Record **measured** first interaction, transfer, frame rate and memory on representative phones (`ASSET-PIPELINE.md` §4).
**Acceptance:** a table of measured figures on at least one low-power device; every budget either met or explicitly reported as missed with the number; a regional view entered and left twice shows no growth in retained memory.

**9. Asset metadata, complete, per asset.** All thirteen fields from `ASSET-PIPELINE.md` §3. **Licence terms recorded from the actual terms used** — and a model-generation service granting you output does not grant redistribution rights (§6). No asset enters the tree without them.
**Acceptance:** every file under `public/` has a metadata record; `check-assets.ts` fails on a missing licence field; attribution required by any licence is exposed in the app's credits page (M6's `src/content/legal/credits.md` — a **request**, not an edit).

**10. `public/` is yours, and it stays minimal.** No service worker, no manifest, no PWA shell this wave. D-027 added both to `patient-library` unrequested; MODULE-MAP §11 does not list a PWA as a module, and `BUILD-PLAN.md` places the PWA shell in Phase 3. If M6 has requested a favicon, add that.
**Acceptance:** `public/` contains models, textures, fallbacks and at most a favicon; no `sw.js`; no `manifest.json`; no service-worker registration anywhere in `src/`.

**11. Visual and anatomical QA, produced for review — not performed by you.** §11 of `3D-TECHNICAL-ARCHITECTURE.md`: screenshots of full-body front and back, every region focus, and every exact-zone selection, at mobile and desktop viewports, in both themes. Check framing, wrong-side mapping, floating hotspots, clipped geometry, unreadable labels, and mismatch between the selected text and the highlighted anatomy. **Then look at them and say what you saw** (A-009).
**Acceptance:** the full screenshot set exists; each has a written description; **no description asserts anatomical correctness** — that is H5, and it is the clinician's.

## 7. Contracts

**What M8 consumes:**

| From | What | Rule |
|---|---|---|
| M4 | `locator-state.ts`, the component shell, screen boundaries | drive the state machine; never fork it |
| M2 | `BODY_REGIONS`, `PAIN_ZONES`, `region-area-map` | the same data as the 2D tier. New fields are a request, not a local table. |
| M3 | `canProceed()` | the gate applies identically in the 3D flow |
| M6 | tokens, base CSS, layout | the canvas is usable in both themes |
| M0 | `contracts/assets.ts`, `anatomy.ts`, `locator.ts`; **the dependencies** | frozen; `three` arrives through M0 |
| M7 | asset discipline, the thirteen metadata fields | same licensing and review standard applies to models |

**What M8 publishes:** the island, `public/`, `check-assets.ts`, the measured budget table, and the QA screenshot set that H5 is decided on.

**The one-way rule with M4, stated plainly.** M4's 2D locator is the **canonical, complete, mandatory** experience, not a fallback (`3D-TECHNICAL-ARCHITECTURE.md` §2, §9). You enhance it. If a 3D need would change M4's semantics, that is a `CROSS-MODULE-REQUESTS.md` entry to M4.

## 8. Hard rules for this module

1. **Tier 1 is never removed.** No failure, timeout, capability gap or user choice may leave a patient with less than a complete working locator.
2. **The 3D tier is not the product's only path.** Keyboard-complete without the canvas, always.
3. **Never claim precision the model does not have.** No misleadingly precise internal anatomy. Layers explain; they never identify the source of the patient's discomfort.
4. **Never personalise from a selection** — no ranking, ordering, confidence or "based on where you tapped".
5. **The result always carries the three guardrail statements** — general location guide, does not identify the cause, links are general library content not a new prescription.
6. **Your QA is not sign-off.** H5 is the clinician's. A professional-looking render is not evidence of anatomical correctness; describe what you see and stop there.
7. **Do not touch config.** `package.json`, lockfiles, `astro.config.mjs`, `tsconfig.json` and `.github/` are M0's — including "just to add three". File the request.
8. **No analytics, accounts, tracking or backend** (D-007). No telemetry from the renderer. No performance beacon. Measure locally and write the numbers into your report.
9. **No PWA, no service worker, no manifest this wave.** D-027 is the precedent for why.
10. **No diagnosis language anywhere** — including mesh names, asset ids, filenames, comments and commit messages (D-001).
11. **Never ship an asset whose licence does not permit the intended web distribution**, and never assume a generator grants redistribution.
12. **Builds cannot run over the Claude device bridge** — Windows native bindings, Linux shell, and WebGL does not exist there at all. **Say which checks you could not run.** A 3D module that reports green from an environment with no GPU has reported nothing.

## 9. Definition of done

- `three` and its loaders arrived through M0, pinned, with no vendored copy.
- Capability detection runs before any model request; WebGL off means zero model bytes.
- All four failure paths preserve a complete working locator with the selection intact.
- The flow completes with the canvas hidden; every canvas selection announces; hotspot ids are separate from mesh names.
- One data source for both tiers; no region, zone or label defined under `three/` or `renderer/`; `check:anatomy` green.
- `check-assets.ts` implements all seven failures with fixtures and is wired into `npm run check`.
- Budgets **measured** on a real low-power device and reported as numbers, met or missed.
- Thirteen metadata fields per asset; licences recorded; attribution requested from M6 for the credits page.
- `public/` holds assets and at most a favicon. No `sw.js`, no `manifest.json`.
- The full QA screenshot set exists with written descriptions, **none asserting anatomical correctness**.
- `git status --short`, from a real terminal, shows changes only in M8's rows of MODULE-MAP.md §5.
- `memory.md` carries a decision entry for the renderer choice, the asset tiering, and any budget deliberately missed.
- `CROSS-MODULE-REQUESTS.md` carries: the dependency request to M0, any per-region 3D field request to M2 and M0, the credits attribution request to M6, and any mount-point need from M4.

## 10. When you are blocked

**H5 blocks publishing, not building.** Build the island, produce the QA set, and hold publication. What you must not do is treat your own screenshots as the sign-off, or let a good-looking render substitute for it. This is non-negotiable #8 in the project's own list for a reason: a technically valid model can still point at the wrong body location, and it will look authoritative while doing it.

**If M7's H2 is still open, that does not block you** — 3D models and demonstration images are separate assets and separate decisions. Do not conflate them, and do not offer 3D renders as a solution to the demonstration-image question without saying so explicitly; that is a real option (`memory.md` D-010's zero-budget fallback) but it is **M7's decision to raise with the clinician**, not a side effect of this module existing.

**If a budget cannot be met with the assets available, report the number.** An 8 MB model on a clinic-corridor phone connection is a product failure, not a rounding error — and `BUILD-PLAN.md`'s Phase 2 gate includes a low-power fallback completion for exactly that reason.

**If the environment cannot run WebGL,** say so plainly and state which acceptance criteria are therefore unverified. Do not infer that the renderer works because the code compiles.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue. Both recorded damage incidents in this project were visual modules editing outside their lane, and one of them was a config file deleted as a side effect.
