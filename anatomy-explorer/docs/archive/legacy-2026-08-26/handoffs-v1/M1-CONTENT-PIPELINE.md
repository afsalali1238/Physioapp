# M1 — Content pipeline (sheet → snapshot)

**Build tool:** Hermes · **Wave:** 1 · **Branch:** `m1-content-pipeline` · **Depends on:** M0 (contracts, dependencies, `npm run check`)

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

`anatomy-explorer` has no content pipeline. It has one file, `src/lib/library.ts`, which reaches across the folder boundary with `import areasData from '../../../patient-library/src/data/areas.json'` and hands the result to the pages as a bare `as LibraryArea[]` cast.

Three things are wrong with that, and they are different kinds of wrong.

**It cannot deploy.** Vercel with Root Directory `anatomy-explorer` never uploads a file above that folder. The build works locally and dies in CI, which is the worst failure ordering available.

**It bypasses every gate the project has.** `patient-library` validates content through Zod schemas, then `validate.ts`'s cross-row rules, then `check-compliance.ts`'s 52-rule DHA/MOHAP scan. `library.ts` does a type assertion. A `cast` is not a check: `as LibraryArea[]` is a promise to the compiler, and the compiler believes it. Draft rows, banned wording, an item pointing at a nonexistent area — all of it would render.

**It is the reason M5 cannot start.** M5 builds four route files against a data API. Until that API exists inside this app, M5 is building against a function that will be deleted.

M1 replaces all of it: a real sync, real schemas, the one compliance module, and a snapshot that lives inside `anatomy-explorer/`. Judge this module on one sentence — after M1, no file in this app imports anything above `anatomy-explorer/`, and every published row a patient can reach has passed schema, cross-row and compliance validation at build time.

## 2. Files you own

Exactly the M1 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `scripts/sync-content.ts` | **absent** — port from `patient-library/scripts/sync-content.ts` (181 lines) |
| `scripts/sheets.ts` | **absent** — create; the fetch/parse half of sync, split out |
| `scripts/validate.ts` | **absent** — port from `patient-library/src/lib/validate.ts` (224 lines). Note the path move: the matrix puts it in `scripts/`, the source is in `src/lib/`. Follow the matrix. |
| `scripts/check-compliance.ts` | **absent** — port from `patient-library/scripts/check-compliance.ts` (314 lines) |
| `src/lib/compliance.ts` | **absent** — port from `patient-library/src/lib/compliance.ts` (238 lines) **verbatim** |
| `src/lib/schemas.ts` | **absent** — port from `patient-library/src/lib/schemas.ts` (101 lines) |
| `src/lib/content.ts` | **absent** — create. This is the API M5 and M2 consume. |
| `src/content.config.ts` | **absent** — port from `patient-library/src/content.config.ts` |
| `src/data/library/**` | **absent** — generated. Nobody hand-edits, **including you**. |
| `docs/CONTENT-SCHEMA.md` · `docs/SHEET-GUIDE.md` | **absent** in this app — port from `patient-library/docs/` |

**`src/lib/library.ts` is the one file you delete that you do not own.** It is unowned in the matrix and it is M1's replacement target; claim the deletion in `CROSS-MODULE-REQUESTS.md` in your first commit, then delete it. Do not leave it as a re-export shim — a shim is a second path to unvalidated data and it will be used.

## 3. Files you read, never write

- `../patient-library/**` — live, reference-only, and the source of everything you port. Copy out of it; leave it byte-identical.
- `src/lib/contracts/content.ts` — M0's, frozen. Your implementation conforms to it; it does not conform to you.
- `PRD.md`, `ARCHITECTURE.md`, `CLINICAL-SAFETY.md`, `PRODUCT-BLUEPRINT.md`, `PORT-CHECKLIST.md`.
- `src/pages/**`, `src/components/**` — M4's, M5's and M6's. You publish an API; you do not wire it into a page.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 4. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| `src/lib/library.ts` is 13 lines and imports two JSON files from `../../../patient-library/src/data/` | `src/lib/library.ts:1-2` |
| No Zod anywhere in this app. `package.json` has one dependency, `astro` | `package.json:14-16` |
| No `src/content.config.ts`, yet `.astro/content.d.ts` exists — a stale artefact of an earlier config | file tree |
| The live corpus is **16 areas / 26 items**. Published: **4 areas** (neck + shoulder in each section) and **5 items**. Everything else is `draft` | `patient-library/src/data/areas.json`, `items.json` |
| Section value is `exercise` (**singular**); the route is `/exercises/` (**plural**). `stretching` is identical in both | `areas.json`; `PORT-CHECKLIST.md` |
| `patient-library/package.json` declares `zod: ^4.4.3`, but `schemas.ts` calls `z.ZodIssueCode.custom` **ten times** — an API removed in Zod 4 | `patient-library/package.json:32`; `schemas.ts:54-69` |
| **Two blocklists exist.** `patient-library/src/lib/compliance.ts` has 52 word-boundary rules (8 superlatives, 4 outcome claims, 5 booking CTAs, 36 condition names). `anatomy-explorer/src/lib/anatomy/content-validation.ts:3-14` has a second, independent list of **7** patterns | both files |
| The 36 condition names in the first list are absent from the second, so education text passes a check that library text would fail | derived from the two files |
| `sync-content.ts` reads `SHEET_ID` from `.env` via `dotenv` and fetches the CSV export endpoint | `patient-library/scripts/sync-content.ts:8-16` |
| `check-compliance.ts` reads `src/data/*.json` directly rather than through `astro:content`, deliberately, so it runs when the Astro build is broken | `patient-library/scripts/check-compliance.ts:11-13` |
| `COMPLIANCE_STRICT=1` promotes launch-blocking warnings to errors and is intended for the production environment | `patient-library/scripts/check-compliance.ts:17-21` |

**The Zod question is yours and M0 is waiting on it.** M0's handoff says explicitly that the Zod major version is not M0's to pick. Decide it, record it in `memory.md`, and put the pin in `CROSS-MODULE-REQUESTS.md`. Either answer is defensible — port to the Zod 4 `ctx.addIssue({ code: 'custom' })` form, or pin Zod 3 — but **the current state is a version declaration that contradicts the code**, and shipping that forward unexamined is how a validation layer silently stops validating.

## 5. Deliverables

**1. `src/lib/compliance.ts`, ported verbatim.** All 52 rules, the `PLACEHOLDER_MARKER` constant, `scanText`, `scanRecord`, `NON_PROSE_FIELDS`, `formatViolation`. Change imports and nothing else. Keep the file header — it explains why word-boundary matching replaced `includes()`, and the next agent needs that.
**Acceptance:** a rule-count assertion in your own check output reports 52; `grep -c "id: '" src/lib/compliance.ts` matches the source; `image_alt_en` is **not** in `NON_PROSE_FIELDS`.

**2. One blocklist, not two.** `src/lib/anatomy/content-validation.ts` is M2's file, so you do not edit it — you write a `CROSS-MODULE-REQUESTS.md` entry to M2 naming the seven duplicated patterns and asking it to import `scanText` from your module instead. Then add a check that fails if a second literal blocklist array appears anywhere under `src/`.
**Acceptance:** `npm run check:compliance` fails on a planted second blocklist; the request entry to M2 exists and names the file and line.

**3. `src/lib/schemas.ts`.** Ported, with the Zod major-version question resolved and the resolution written into `memory.md`. The `superRefine` block is the part that matters: a `published` row must have start position, movement, safety, target muscles, `image_id` and `image_alt_en`; exercises additionally need `type` and `return_en`; stretches need `direction_en`; and at least one of `hold_seconds` or `reps`. Do not weaken any of these to make the current corpus pass.
**Acceptance:** `tsc --noEmit` clean; a fixture row missing `safety_en` with `status: 'published'` is rejected; the same row as `draft` is accepted.

**4. `scripts/sheets.ts` and `scripts/sync-content.ts`.** Split fetch/parse from write/validate — `patient-library`'s version is one 181-line file doing both, and the parse logic is the part worth unit-testing. Preserve the CSV coercion rules exactly (`TRUE`/`FALSE` → boolean, numeric strings → number, empty → `undefined`); they are load-bearing and subtly wrong to reinvent. Sync writes into `src/data/library/`, validates before writing, and **exits non-zero without writing** if validation fails.
**Acceptance:** sync against an unreachable `SHEET_ID` exits non-zero and leaves the existing snapshot untouched; a row with `hold_seconds: "30"` lands as the number `30`; parse has unit tests M9 can run.

**5. `src/data/library/` — the snapshot, inside this app.** Committed, generated, never hand-edited. It carries **all** rows including drafts; publication filtering happens in `content.ts`, not at sync time, because the preview route the clinician uses needs the drafts.
**Acceptance:** `src/data/library/` exists and is committed; no file in `anatomy-explorer/` imports a path containing `patient-library`; `grep -rn "\.\./\.\./\.\./" src/` returns nothing.

**6. `src/lib/content.ts` — the API.** Implements the signatures in `contracts/content.ts`. At minimum: published areas for a section (sorted by `order`, **head to toe, never alphabetically** — D-014), published items for a `(section, area_id)` pair, the set of published area ids for M2's `check:anatomy`, and a single item lookup by id. **Every accessor filters `status === 'published'` by default.** A caller must pass an explicit flag to see drafts, so that forgetting the filter yields a safe empty result rather than a leak.
**Acceptance:** with the current corpus, published areas returns 2 per section and published items returns 5 in total; no accessor returns a `draft` row without an explicit opt-in argument; `src/lib/library.ts` no longer exists.

**7. `src/content.config.ts`.** The `areas`, `items` and `legal` collections, loaders pointed at `src/data/library/`. **The `legal` collection's schema is yours; its markdown content is M6's** (`src/content/legal/**` is in M6's row). Publish the schema; do not create the files.
**Acceptance:** `astro check` resolves `astro:content` types for all three collections; `src/content/legal/` is untouched by your commits.

**8. `scripts/check-compliance.ts` — the build gate.** Reads `src/data/library/*.json` directly, not through `astro:content`, for the reason in the source header: it must run when the Astro build is broken, which is exactly when it matters. Runs the 52 rules over every string field of every row, runs `validate.ts`'s cross-row rules, reports `missingClinicFields()` from M6's `src/config/clinic.ts` **if that file exists** (M6 is a peer in Wave 1 — use an existence guard, do not create the file), and honours `COMPLIANCE_STRICT=1`. Wire it as `prebuild`.
**Acceptance:** exit 0 clean, 1 on violation; a planted `"the best stretch"` in a published row fails the build; the same string in a `draft` row warns; `COMPLIANCE_STRICT=1` promotes the placeholder warning to an error; the script runs with `src/content.config.ts` deliberately broken.

**9. `scripts/validate.ts`.** Ported cross-row rules: duplicate ids, more than 8 published items per area, orphan and unreachable items, `image_id` prefix matching the item's own section and area, alt text under 45 characters, dosage buried in prose, published rows with an empty `reviewed_by`. Keep every threshold and keep the messages — they explain themselves to the clinician, which is their job.
**Acceptance:** each of the nine rules has a fixture that triggers it; `image-area-mismatch` fires on a `stretching`/`shoulder` row carrying `str-neck-02`; the current live corpus produces the `unreviewed-published-item` warning for all 5 published items, and you report that rather than suppress it.

**10. `docs/CONTENT-SCHEMA.md` and `docs/SHEET-GUIDE.md`.** Ported, then corrected to describe this app. **Do not change a single column name, enum value or field requirement** — the clinician is entering content against this schema right now, in a live sheet. If the port reveals that the document and the live sheet disagree, that is a finding for `CROSS-MODULE-REQUESTS.md` and a note to Afsal, not an edit.
**Acceptance:** every column in the ported schema doc appears in `schemas.ts` and vice versa; the `type` enum lists the same eleven values as the source; no requirement is relaxed.

## 6. What to copy from patient-library/, and what to change on the way

| Source | Take | Change on the way |
|---|---|---|
| `src/lib/compliance.ts` | everything, verbatim | import paths only. **Not one rule, not one comment.** |
| `src/lib/schemas.ts` | field names, enums, the `superRefine` gate | resolve the Zod major version; keep `image_status` optional with `'pending' \| 'generated' \| 'approved'` — M7 and M5 both depend on that exact union |
| `src/lib/validate.ts` | all nine rules and their thresholds | move to `scripts/` per the matrix; keep `Finding`/`Level` shapes so M9 can assert on them |
| `scripts/sync-content.ts` | the CSV coercion, the fetch shape | split into `sheets.ts` + `sync-content.ts`; write to `src/data/library/`; make validation blocking rather than advisory |
| `scripts/check-compliance.ts` | the whole gate, `COMPLIANCE_STRICT`, direct-JSON reading | guard the `clinic.ts` import for existence — M6 has not landed yet |
| `src/content.config.ts` | the three-collection shape | loaders point at `src/data/library/`; you own the schema, M6 owns the legal markdown |
| `src/lib/types.ts` | nothing | types come from `contracts/content.ts` now. **Do not create a second type source.** |

**Do not copy** `src/lib/images.ts` (M7's), `scripts/check-images.ts` (M7's), `scripts/generate-qr.ts` (not a module — claim it in `CROSS-MODULE-REQUESTS.md` if it is wanted), or the `openai` dependency.

## 7. Contracts

**What M1 consumes:** `contracts/content.ts` from M0 — `LibrarySection`, `PublicationStatus`, `LibraryArea`, `LibraryItem`, `ImageStatus`, and the signatures you implement. If a field you need is missing, **do not widen the type**; file it in `CROSS-MODULE-REQUESTS.md`.

**What M1 publishes:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `src/lib/content.ts` accessors | M5 | cannot list areas or items on any route |
| published `(section, area_id)` set | M2 | `check:anatomy` cannot tell a live region from a dead one |
| `src/lib/compliance.ts` | M2, M6, M9 | every text scan in the app forks a second blocklist |
| the `legal` collection schema | M6 | legal markdown has no frontmatter contract |
| `image_status` reaching the item type | M7, M5 | the card cannot gate an unapproved image |
| `check:compliance` exit code | M0, M9 | `npm run check` has no content gate |

**The naming trap.** Data says `exercise`, routes say `/exercises/`. `stretching` is the same in both, so half of any test set passes by coincidence. Your accessors take the **data** value; route construction is M5's problem and M2's check asserts the pluralisation. Do not "helpfully" normalise one into the other inside `content.ts` — pick the data value, document it in one line, and make the boundary explicit.

## 8. Hard rules for this module

1. **Never invent clinical content.** Not an exercise name, not a dosage, not a safety line, not a fixture that looks like one. Test fixtures use `PLACEHOLDER_MARKER` or obviously-synthetic strings.
2. **Never write a clinician's name or a review date** into any file — not a fixture, not a comment, not a default value. `reviewed_by` and `reviewed_date` are hers to fill.
3. **Never relax the compliance check.** Fix the content, never the check. A build that goes green because a rule was loosened has removed the product's core legal constraint invisibly. If a real clinical string trips a rule, that is a `CROSS-MODULE-REQUESTS.md` entry and a note to the clinician — not a regex edit.
4. **One blocklist. Ever.** Two forks already exist and that is the drift the module's own header warns about.
5. **Never hand-edit the snapshot.** `src/data/library/**` is generated. A content change is a sheet change. This binds you too.
6. **No file in this app imports above `anatomy-explorer/`.** You are the module that removes the one that does; do not add another.
7. **No analytics, accounts, tracking or backend** (D-007). The pipeline is build-time only. No patient route may depend on a runtime API.
8. **No diagnosis language anywhere** — including comments, identifiers, filenames and commit messages (D-001).
9. **`patient-library/` is read-only.** It is deployed, the clinician is entering content into it, patients have the link, and it is the rollback target until M9 signs off.
10. **Builds cannot run over the Claude device bridge.** `node_modules` holds Windows native bindings and the bridge shell is Linux. **Say which checks you could not run. Never report a check as passed when the environment prevented it from running.**

## 9. Definition of done

- `src/lib/library.ts` is deleted. `grep -rn "patient-library" src/ scripts/` returns nothing.
- `src/data/library/` exists, is generated, is committed, and carries all 16 areas and 26 items.
- `src/lib/content.ts` implements `contracts/content.ts` and filters to `published` unless explicitly told otherwise.
- One compliance module, 52 rules, imported by everything that scans text. A planted second blocklist fails the check.
- `npm run check:compliance` runs standalone under `tsx`, exits 1 on a violation, honours `COMPLIANCE_STRICT=1`, and is wired as `prebuild`.
- All nine cross-row rules ported with their thresholds and messages intact, each with a fixture.
- The Zod major version is decided, recorded in `memory.md`, and requested from M0.
- `docs/CONTENT-SCHEMA.md` and `docs/SHEET-GUIDE.md` describe this app with **no clinical requirement changed**.
- `git status --short`, from a real terminal, shows changes only in M1's rows of MODULE-MAP.md §5, plus the claimed deletion of `src/lib/library.ts`.
- `CROSS-MODULE-REQUESTS.md` carries: the Zod pin for M0, the duplicate-blocklist request to M2, the `library.ts` deletion claim, and the `clinic.ts` existence-guard note to M6.

## 10. When you are blocked

**`SHEET_ID` is a secret you may not have.** Sync needs the clinician's live sheet. If you cannot reach it, build the pipeline against the committed snapshot copied out of `patient-library/src/data/`, and say plainly in your report that end-to-end sync was never executed. Do not fabricate a sheet to demonstrate the path works.

**If the live corpus fails your own new checks** — and it will, at minimum with `unreviewed-published-item` on all five published items — **that is a finding, not a bug in your check.** Report it with row ids. Do not adjust a threshold to make the current data pass; the whole point of porting the rule is that it tells the truth about content nobody has signed off.

**If a clinical string trips a compliance rule,** flag it and stop. You do not reword her content, and you do not add an exception to the pattern. The `fix your gaze` carve-out in the source is a precedent for a *documented, reasoned* exception — it is not permission to add more on your own judgement.

**If the schema doc and the live sheet disagree,** report both. She is entering content against the sheet right now; changing the schema to match a document would break her in-flight work.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue.
