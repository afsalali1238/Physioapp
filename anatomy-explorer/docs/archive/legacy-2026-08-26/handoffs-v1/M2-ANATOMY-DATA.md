# M2 — Anatomy geometry & area mapping

**Build tool:** Hermes · **Wave:** 1 · **Branch:** `m2-anatomy-data` · **Depends on:** M0 (`src/lib/contracts/`), M1-A (`src/lib/compliance.ts` ported into this app)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

Two things are wrong with the body map, and both are measurable rather than matters of taste.

**It points at the wrong places.** The repo already contains geometry that was rendered, inspected and
committed as correct. The shipping map does not use it. It uses hand-authored SVG path strings, and it
reproduces the exact two defects the reference geometry was written to fix.

**Seven of its nine regions lead to nothing.** The map offers areas with no published content and
omits an area that has content, so a patient can complete the whole locator flow and arrive at an
empty screen — or never reach the one area that would have helped.

Both are derivations, not inventions: the correct coordinates exist in
`reference/body-geometry/`, and the set of real areas exists in the library's published data. **That
is why this module is assigned to a tool doing mechanical transformation over a verified source.**
Nothing in M2 requires a judgement about a patient's body.

One consequence to hold onto from the first line of work: a wrong hotspot is a clinical-adjacent
error, not a cosmetic one. The fix is legitimate **only because it derives from the repository's own
verified source**. It is not published on M2's word. It publishes on **H5**, the clinician's visual
sign-off that each region highlights the anatomically correct place (`../../MODULE-MAP.md` §9).

## 2. Files you own

All paths relative to `anatomy-explorer/`.

| File | State |
|---|---|
| `scripts/generate-regions.mjs` | **create** — the generator; the only place geometry is computed |
| `scripts/check-anatomy.ts` | **create** — the drift check that 12 documents already claim exists |
| `src/data/anatomy/body-regions.ts` | **replace** — becomes generated output, not hand-written |
| `src/data/anatomy/pain-zones.ts` | **create** — does not exist; zones are currently inline |
| `src/data/anatomy/region-area-map.ts` | **create** — the region → library area mapping |
| `src/data/anatomy/education.ts` | **edit** — add the publication filter; keep every existing string |
| `src/lib/anatomy/content-validation.ts` | **rewrite** — delete the compliance fork, widen the scan |
| `reference/body-geometry/**` | **read + regenerate only** — see §6 |

## 3. Files you read, never write

- `src/components/AnatomyLocator.astro` — M4's. Read it to know what consumes your data. Every UI
  defect you find there is a `handoffs/CROSS-MODULE-REQUESTS.md` entry, not an edit.
- `src/styles/global.css` — M6's, and being deleted. Do not add a `.back-only` rule to it.
- `src/lib/anatomy/question-flow.ts`, `locator-state.ts` — M4's.
- `src/data/anatomy/safety-rules.ts` — M3's. You will scan its prose; you will not change it.
- `src/lib/contracts/**` — M0's and frozen. See §7 on what to do when a type is too narrow.
- `src/lib/compliance.ts` — M1's. Import it. Never copy from it.
- `package.json` — M0's. **You write `check:anatomy`; M0 wires it into `npm run check`.**
- `../patient-library/**` — live, reference-only.
- `PRD.md`, `ARCHITECTURE.md`, `ANATOMY-DATA-SCHEMA.md`, `CLINICAL-SAFETY.md`, `UX-FLOWS.md`.

## 4. Verified starting state

Verified 2026-08-26 by reading the files. Where a document and the code disagree, the code is the fact.

**The geometry is hand-authored and wrong in the documented ways.** `reference/body-geometry/README.md:14-16`
— "Never hand-author a hotspot coordinate: that is how the previous map ended up with the wrist
floating off the arm and the lower back sitting on the abdomen." `body-regions.ts` holds nine
hand-authored `path` strings at lines 24, 36, 49, 61, 73, 85, 97, 109 and 121, plus hand-authored
`focusViewBox` strings. It has **no `views` field**, so nothing can be view-restricted; `lower-back`
at `body-regions.ts:57-67` is a **front-view path with no view restriction**, against
`regions.mjs:55-58` which marks it `['back']` with the comment "BACK ONLY. This is the bug fix."
`global.css:134-136` swaps only `.silhouette-detail` for `.back-detail`; the region hit areas are
byte-identical in both views. **The bug the reference geometry documents as fixed is live.**

**No patient-side split, and one region missing.** `regions.mjs:26-49` derives per-side regions
(`shoulder-l` / `shoulder-r`) from `skeleton.mjs`'s `J` table, 13 in all, including an `elbow`, with
hips anchored on the trochanter (`skeleton.mjs:36`, `regions.mjs:39-41`) so the two sides cannot
collide at the midline. In the shipping data, `body-regions.ts:36` makes both shoulders one
selectable region via two subpaths, and lines 85, 97, 109 and 121 do the same for knee, ankle, wrist
and foot. There is no `elbow`.

**Zone drift.** `regions.mjs:19` `KNEE_ZONES` has four entries including 'Back of knee';
`body-regions.ts:86-90` has three and no back of knee.

**Dead ends and unreachable content.** `memory.md` A-005 (`memory.md:103-107`): "the locator offered
`upper-back` and `foot` (zero exercises — dead ends) and omitted `elbow` (two exercises —
unreachable)." All three are still true — `body-regions.ts:45`, `:117`, and no elbow.
`../patient-library/src/data/areas.json` has `elbow` in **both** sections and contains neither
`upper-back` nor `foot`. Only `neck` and `shoulder` are published areas, and `stretching:shoulder`
has **zero items of any status**, so it is a published area with no published item — itself a
violation of `ANATOMY-DATA-SCHEMA.md:9`. Net: **three published (section, area) pairs, two area ids,
and 7 of 9 map regions lead to nothing published.**

**The gating function exists and nobody calls it.** `body-regions.ts:134` exports
`getAvailableRegions(availableAreaIds)` — zero callers. `ANATOMY-DATA-SCHEMA.md:21` calls
`library_area_ids` "the single mapping that prevents dead-end map regions"; that field does not exist
anywhere in the code.

**`check:anatomy` is cited 12 times in the present tense and exists nowhere.** `memory.md:107` claims
it "fails the build on drift". `package.json:6-13` has five scripts and it is not one of them.
`.claude/hooks/pre-push-check.sh:17` guards it with `if npm run 2>/dev/null | grep -q 'check:anatomy'`,
so it **silently degrades to no check at all**.

**Draft clinical content reaches a patient route.** `education.ts:22-29` defines `DRAFT_REVIEW` and
spreads it at `:58` and `:86`, so both entries are `status: 'draft'` with empty review metadata —
correct. But `AnatomyLocator.astro:11` serialises `EDUCATION_ENTRIES` wholesale into a
`data-education` attribute with no status filter, against `ARCHITECTURE.md:61` "Do not expose draft
rows on patient routes."

**The validator is a fork with four gaps.** `content-validation.ts:3-14` is a 7-rule
`BANNED_LANGUAGE` list. Against M1's 52 rules it is missing all 8 DHA superlatives, the whole
booking-CTA family, and all 36 condition names — **all 36 currently pass it.** `:37` uses
`String(value)`, so a numeric `0` satisfies a required-field check as `"0"`. And the scan is applied
only to `EducationEntry`: `SAFETY_RULES` prose, `SYMPTOM_QUESTIONS`, `BodyRegion.description` and
roughly forty hardcoded patient-facing strings in `AnatomyLocator.astro` are unscanned.

## 5. Deliverables

**1. `scripts/generate-regions.mjs` — the single source of coordinates.**
Imports `J`, `cap`, `lerp` and `SILHOUETTE` from `reference/body-geometry/skeleton.mjs` and the
`REGIONS` / `bbox` / `focusViewBox` logic from `regions.mjs`, and emits `body-regions.ts` and
`pain-zones.ts` with a generated-file header naming this script.
**Acceptance:** running it twice produces byte-identical output, and every numeric literal in the
generated files traces to a `J` entry or a documented `t` ratio. Grep the generated files for a
coordinate that appears in neither `skeleton.mjs` nor a generator expression: zero hits.

**2. `src/data/anatomy/body-regions.ts` — regenerated, 13 regions.**
Carries `views: BodyView[]`, patient-side `side`, computed `focusViewBox`, and capsule `shapes`
rather than filled paths. `shoulder-l`/`shoulder-r` and the other five limb regions are separately
selectable; `elbow-l`/`elbow-r` exist; `lower-back` is `views: ['back']`.
**Acceptance:** `BODY_REGIONS.length === 13`; `BODY_REGIONS.filter(r => r.views.includes('front'))`
excludes `lower-back`; no region object contains a hand-typed `d` string.

**3. `src/data/anatomy/pain-zones.ts` — zones extracted and reconciled.**
Zone labels come from `regions.mjs:13-20` unchanged. Knee has four zones including back of knee.
**Acceptance:** every zone label in `pain-zones.ts` appears verbatim in `regions.mjs`; the knee zone
count is 4; every zone's `regionId` resolves to a region in deliverable 2.

**4. `src/data/anatomy/region-area-map.ts` — the anti-dead-end mapping.**
Implements `library_area_ids` (`ANATOMY-DATA-SCHEMA.md:19-21`) and
`precision_mode: broad_only | education_variant | reviewed_mapping` (`:39-40`). Default every region
to `broad_only`; only a region with reviewed zone-specific content may be anything else, and M2 has
no authority to declare one reviewed.
**Acceptance:** `region-area-map.ts` contains exactly one entry per region in deliverable 2; every
`library_area_ids` value appears as an `area_id` in the content snapshot; `elbow` maps to the `elbow`
library area; no entry maps to `upper-back` or `foot`.

**5. `scripts/check-anatomy.ts` — the check the docs already claim.**
Fails the build, non-zero exit, with a per-failure line naming the id, on: (a) a region whose
`library_area_ids` resolve to no **published** content; (b) a published library area with no region
pointing at it; (c) a `library_area_ids` value that resolves to nothing at all; (d) a duplicate or
reused region, zone or education id; (e) a zone whose `regionId` does not exist; (f) a region with
an empty `views` array. It also asserts the section-value contract in §7.
**Acceptance:** `node --experimental-strip-types scripts/check-anatomy.ts` exits 0 on the delivered
data; temporarily adding a region with `library_area_ids: ['upper-back']` makes it exit non-zero and
print that region's id; deleting the `elbow` region also makes it exit non-zero, via rule (b).

**6. `src/lib/anatomy/content-validation.ts` — one compliance module, no fork.**
Import `scanText` from M1's `src/lib/compliance.ts` and **delete `BANNED_LANGUAGE` entirely.** Keep
the parts that are genuinely good: the word-boundary discipline, the duplicate-id and
duplicate-region checks, and especially the inverse assertion at `:59-61` that draft content must not
claim completed review metadata — that mechanises this project's most important clinical rule and
must survive the rewrite. Fix `String(value)` at `:37` so a numeric `0` fails a required-field check.
Extend the scan surface to `SAFETY_RULES` prose, `SYMPTOM_QUESTIONS`, `BodyRegion.description` and
every zone and education string. Keep the module-scope assertion call at `education.ts:90` so
validation runs at import time.
**Acceptance:** the file contains no regex literal of its own; `grep -c 'BANNED_LANGUAGE'` is 0;
inserting any one of the 36 condition names into a `BodyRegion.description` fails the build, and
inserting one into a `SAFETY_RULES.message` also fails it. Both currently pass.

**7. Publication filter at the data layer.**
Export a published-only accessor from `education.ts` and use it as the default for anything a patient
route can read. `AnatomyLocator.astro:11` is M4's file — you do not edit it — so file the removal of
the unconditional `data-education` serialisation as a `CROSS-MODULE-REQUESTS.md` entry addressed to
M4, and make the data layer's default export safe so the mistake cannot be repeated.
**Acceptance:** the default export of `education.ts` yields zero entries while both current entries
are `draft`; retrieving draft entries requires an explicitly named function.

**8. Regenerated visual evidence for H5.**
Re-run the reference renderer, produce the front, back, labelled and zoom panels, and attach them to
the branch with a written statement of what you looked at and what you checked — specifically that
`lower-back` appears on the back only, that each wrist capsule sits on its forearm, and that the two
hip capsules do not touch at the midline.
**Acceptance:** images attached; each of those three statements made explicitly. **Not** "the
geometry is correct" — that is H5's call, not yours.

**9. Cross-module and memory records.**
`CROSS-MODULE-REQUESTS.md`: the `data-education` filter (M4); the `views`-aware CSS or per-view
rendering the new `views` field needs (M4/M6); any contract widening (M0); the `check:anatomy` script
wiring (M0). Append the decisions to `memory.md`, including that `upper-back` and `foot` were removed
and `elbow` added, and that A-005's present-tense claim about `check:anatomy` is now true.
**Acceptance:** each entry names the owning module and the file; `memory.md` gains new `A-###`
entries and no existing entry is rewritten.

## 6. Reference material

`reference/body-geometry/` is the verified source of truth and the reason this module is derivation:

- `skeleton.mjs` — the `J` joint table (`:13-37`), silhouette strokes and filled shapes, front/back
  detail lines. Coordinate space `0 0 240 620`, centre line x=120, 8-head proportions
  (`README.md:16-19`).
- `regions.mjs` — 13 capsule regions derived from the same joints, `mk(id, areaId, views, side, label, shapes, zones)`,
  the eight zone lists, `bbox()` and `focusViewBox(region, pad = 58)`.
- `render.mjs` — writes `out.html` with silhouette, hotspot, labelled and zoom panels.
- `verification.png` — the render these were checked against.

Two decisions in `README.md:21-25` are load-bearing and must survive: hips anchor on the trochanter,
and `lower-back` is back-view only. A capsule is a round-capped stroke, so the same shape is both the
highlight and the touch target; the narrowest (`w=30`) is ~45px at 360px width, above the 44px floor
(`README.md:32-34`). **Do not narrow a capsule below `w=30`.**

You may regenerate `out.html` and `verification.png`. You may not change a joint number to make a
shape look better: `README.md:14` — "If you change a number, re-render and look at it" — and any such
change re-opens H5.

## 7. Contracts

**Types come from `src/lib/contracts/anatomy.ts`, never from your own files.** `BodyRegion`,
`PainZone`, `BodyView`, `PrecisionMode`, `EducationEntry` and `RegionAreaMapping` are M0's and frozen.
If `BodyRegion` lacks `views`, `side` or `shapes`, **do not widen the type and do not define a
parallel local type** — file it in `CROSS-MODULE-REQUESTS.md` and let M0 make the edit
(`../../MODULE-MAP.md` §4).

**What M2 publishes, and what M4 may assume.** `BODY_REGIONS` is ordered head to toe, never
alphabetically (D-014). Region ids are stable and never reused. A region is renderable in a view if
and only if `views` includes it — M4 filters on `views`; it does not infer from the shape. Selection
gating goes through the published-content accessor, not through `BODY_REGIONS` directly.

**What M2 consumes from M1.** The set of published `(section, area_id)` pairs, from
`src/lib/content.ts`. Read it through M1's accessor. **Never add an import that reaches above
`anatomy-explorer/`** — `src/lib/library.ts` currently does exactly that and M1 is deleting it.

**The naming trap, and it is your check's job to catch it.** The data value is `exercise`
(**singular**) while the route is `/exercises/` (**plural**). `stretching` is identical in both, which
is precisely why the mismatch gets missed — half your test cases pass by coincidence.
`check-anatomy.ts` asserts that every section value is `stretching` or `exercise` and that route
construction pluralises exactly one of them.

## 8. Hard rules for this module

- **Never hand-author a coordinate.** If a number is not derived, it does not ship.
- **M2 writes no clinical prose.** Region names and short location descriptions in everyday patient
  language are the borderline; anything beyond a location label ships `status: 'draft'` with
  `reviewed_by` and `reviewed_date` **empty**. **Never write a clinician's name or a review date.**
- **Never reword a red-flag trigger**, a safety line or a dosage. If prose you scan looks clinically
  wrong, flag it and stop; do not fix it.
- **Never relax `check:anatomy` or the compliance import to get a build green.** Fix the content. A
  green build bought by loosening a rule has removed the constraint invisibly, which is worse than
  the red build.
- **No second blocklist, ever.** Two forks already exist in this repo and all 36 condition names pass
  both.
- No diagnosis language anywhere — including comments, identifiers, filenames and commit messages
  (D-001).
- Do not edit `AnatomyLocator.astro`, `global.css`, `question-flow.ts`, `safety-rules.ts`,
  `package.json` or anything in `../patient-library/`.
- **Your geometry is not published on your own verification.** H5 gates it.

## 9. Definition of done

1. `BODY_REGIONS` is generated, 13 regions, side-split, `elbow` present, `upper-back` and `foot` gone.
2. `lower-back` is unreachable in the front view — verified in a render, not only in the data.
3. Every region resolves to at least one published library area, and every published library area has
   a region. `check:anatomy` proves both and fails when either breaks.
4. `content-validation.ts` owns zero regexes and imports `scanText`; the 36 condition names fail.
5. No draft education entry reaches a patient route through the data layer's default path.
6. `npm run check:anatomy` exists and exits 0; `.claude/hooks/pre-push-check.sh:17` now finds it.
7. Render attached, with a written account of what you looked at, and H5 requested — not assumed.
8. `git status --short` shows only files in M2's rows of the ownership matrix. If it shows more,
   revert and report; **do not** report a check as passed when the environment stopped it from
   running (`../../MODULE-MAP.md` §6).

## 10. When you are blocked

**A file you need belongs to another module.** You are not blocked. Write the request into
`handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue. This is the rule that keeps four
agents from corrupting each other's work, and it has already been broken twice in this repo.

**M1-A has not landed, so `src/lib/compliance.ts` does not exist yet.** Do deliverables 1–4 first;
they have no dependency on it. Do not stub a blocklist "temporarily" — a temporary fork becomes a
permanent one. If you need placeholder content, use `contracts/__placeholders__/` with the literal
`PLACEHOLDER_MARKER` string (`../patient-library/src/lib/compliance.ts:172`), never realistic prose.

**A contract type is too narrow.** `CROSS-MODULE-REQUESTS.md` → M0. Never widen it yourself.

**The build or `node` will not run.** Builds fail over the Claude device bridge because `node_modules`
holds Windows native bindings and the bridge shell is Linux — nothing to do with the code. **Say the
check could not run.** Do not report green.

**Something looks clinically wrong.** Stop and flag it. That includes a zone label you think reads
oddly and the published `stretching:shoulder` area with zero items — record the latter as a content
defect for the clinician, do not paper over it in the mapping.
