# M9 — Verification & release

**Build tool:** Hermes · **Wave:** 3 · **Branch:** `m9-verification` · **Depends on:** every other module

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

Eight modules will each report themselves done. M9 is the module that does not take their word for it.

That is not a slight on the other modules — it is a structural fact about this project. Every one of its highest-consequence defects is **silent**: a compliance rule dropped from a blocklist, a draft row on a patient route, a gate a Back button walks around, a placeholder shipped as real copy, a region that highlights the wrong part of the body. None of them looks wrong on screen. Several of them have already happened here: two forked blocklists exist today, three design decisions were reversed as uncommented "polish", and a config file was deleted as a side effect of unrelated work.

M9 has a second job that matters as much. MODULE-MAP §8 lists **eight** places where a document in this repository describes something the code does not have. An agent that trusts those documents builds on things that do not exist. M9 closes that table, one row at a time, by making the code true or the document honest — and the documents are mostly owned by other modules, so most of that work is filing findings, not editing.

Judge this module on one sentence: **after M9, a green build is evidence, and a red build names a file and a line.**

## 2. Files you own

Exactly the M9 row of MODULE-MAP.md §5, no additions.

| File | State |
|---|---|
| `tests/**` | **absent** — create. M0 configures `vitest` and `playwright` with zero tests; you write them. |
| `docs/RELEASE-CHECKLIST.md` | **absent** — create |
| `docs/VERIFICATION-LOG.md` | **absent** — create |

**You own no source file.** Every defect you find in someone else's row is a `CROSS-MODULE-REQUESTS.md` entry and a `VERIFICATION-LOG.md` line — never a fix. This is the module most tempted to make a one-character correction "since it's obviously wrong", and the one where doing so is worst: a verifier that edits the thing it verifies has no independent signal left.

**One exception, and it is M0's to grant.** The `PLACEHOLDER_MARKER` build gate is described in MODULE-MAP §4 as M9's mechanism, but a build gate is a script and `package.json` wiring is M0's. Build the check inside `tests/` or request a `scripts/` claim; do not edit `package.json`.

## 3. Files you read, never write

Everything. That is the module. Specifically:

- Every module's source, `git status --short` output, and definition-of-done claim.
- `MODULE-MAP.md` §5 — the ownership matrix you audit every branch against.
- `BUILD-PLAN.md` — the Phase 2 gate and the definition of done, which are the release criteria and are **not yours to soften**.
- `PRD.md`, `ARCHITECTURE.md`, `CLINICAL-SAFETY.md`, `DESIGN-SYSTEM.md`, `3D-TECHNICAL-ARCHITECTURE.md`, `ASSET-PIPELINE.md`, `PORT-CHECKLIST.md`, `CLINICIAN-QUESTIONS.md`.
- `patient-library/**` — the live app, the rollback target, and the route-by-route comparison baseline.
- `memory.md` (both), and `handoffs/CROSS-MODULE-REQUESTS.md` — append-only and shared.

## 4. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| **No test exists anywhere** in `anatomy-explorer/`. No `tests/`, no `vitest.config.ts`, no `playwright.config.ts` | file tree |
| `npm run lint` is an alias for `tsc --noEmit`, so there is no linter; and `tsc` does not read `.astro` files, so the 228-line client script has never been typechecked | `package.json:11-12` |
| Two real type errors live in that unchecked script and have never been reported | `AnatomyLocator.astro:329,440`; M0 handoff §4 |
| CI runs at the repository root, where there is **no `package.json`**, so it fails at step one | `.github/workflows/ci.yml:22-35` |
| **Neither tree is committed.** `git ls-files` returns zero for both, so there is no reflog | MODULE-MAP §6 |
| **Two blocklists exist**: `patient-library/src/lib/compliance.ts` (52 word-boundary rules) and `anatomy-explorer/src/lib/anatomy/content-validation.ts:3-14` (7 patterns). The 36 condition names appear only in the first | both files |
| `check:anatomy` is referenced **18 times** across docs, `memory.md` and the pre-push hook, in the present tense, and **does not exist**. The hook's existence guard means it silently skips | `.claude/hooks/pre-push-check.sh:17-22` |
| Every area card on both index pages is a **404** — `/stretching/[area_id]/` and `/exercises/[area_id]/` do not exist | file tree vs `stretching/index.astro` |
| The safety gate has a skip control wired to advance the flow, and `popstate` restores downstream phases without checking whether the gate was answered | `AnatomyLocator.astro:189`, `:441-462` |
| The live corpus is 16 areas / 26 items; **4 areas and 5 items are published**; all five published items have an empty `reviewed_by` | `patient-library/src/data/*.json` |
| `patient-library`'s `tokens.css` still carries the D-026 palette reversal; the `ClientRouter` and dismissible-disclaimer reversals from D-025 were repaired | `tokens.css:34-49`; `Base.astro`, `Disclaimer.astro` headers |
| `COMPLIANCE_STRICT=1` exists to promote launch-blocking warnings to errors and is intended for the production environment | `patient-library/scripts/check-compliance.ts:17-21` |
| MODULE-MAP §8 lists **eight** documented-but-absent features, verified the same day | MODULE-MAP §8 |
| **Eight human decisions (H1–H8) are open**, three of which block launch and cannot be built around | MODULE-MAP §9 |
| Builds fail over the Claude device bridge — `node_modules` holds Windows native bindings (`@rolldown/binding-win32-x64-msvc`, `lightningcss-win32-x64-msvc`, `@img/sharp-win32-x64`) and the bridge shell is Linux | M0 handoff §8 |

## 5. Deliverables

**1. `docs/VERIFICATION-LOG.md` — the standing record.** One line per verified claim: what was checked, how, when, the result, and **whether the check could actually run in this environment**. This is the file that makes "done" mean something later. Start it on day one and append; never rewrite history.
**Acceptance:** every acceptance criterion across all nine handoffs appears as a row with a result or an explicit "not verified, and why"; no row says "passed" where the environment prevented execution.

**2. The `PLACEHOLDER_MARKER` build gate.** Fails the build if the marker reaches any patient route's rendered output. This is the mechanism MODULE-MAP §4 relies on to make placeholders safe — without it, `contracts/__placeholders__/`, `clinic.ts`, `emergency.ts` and the legal frontmatter are all just strings that might ship.
**Acceptance:** a planted marker in a rendered page fails the build; the marker inside `contracts/__placeholders__/` and inside `src/config/` does **not** fail it; the gate distinguishes source from output.

**3. Unit tests for the silent-failure surfaces.** In priority order: **M3's four bypass cases** (skip, Back, Back-then-Forward, fabricated history state) and the four `canProceed` defaults, from the case list M3 hands you; M1's nine cross-row validation rules; the 52 compliance rules including the `fix your gaze` carve-out; M1's CSV coercion; M2's `check:anatomy` region-to-content mapping; M5's published-only filtering.
**Acceptance:** each has a failing case and a passing case; the suite fails if M3's gate is bypassable; the suite fails if a second blocklist appears; the suite fails if a draft row is reachable.

**4. Browser smoke tests.** One patient journey end to end: home → locator → region → confirm → gate → education → area page → card. Then the same journey **keyboard-only, ignoring the SVG entirely**. Then a red-flag answer landing on the stop screen and failing to escape it. At 360px and at 200% zoom.
**Acceptance:** all four complete; the keyboard-only run reaches an exercise card without a pointer; the red-flag run cannot reach exercise content by any route.

**5. Zero-404 verification across every published surface.** Crawl the built output: every area card, every legal link, every footer link, every locator handoff. **`/find-my-pain` must redirect, not 404** — patients may already hold that URL.
**Acceptance:** a crawl of `dist/` reports zero broken internal links; `/find-my-pain` resolves to `/find-my-area/`; exactly one indexable locator URL exists.

**6. The ownership audit, run per branch.** For each module branch, read `git status --short` against MODULE-MAP §5 and report every file changed outside that module's rows. **This is the check that would have caught both recorded incidents** — the deleted `astro.config.mjs`, and D-025/D-026's uninstructed reversals — and neither was caught by reading a diff for correctness. Scope is a separate question from correctness.
**Acceptance:** every module branch has an audit line in `VERIFICATION-LOG.md`; out-of-lane changes are listed by path and reported, not fixed.

**7. Close MODULE-MAP §8's table.** Eight rows where a document claims something the code lacks. For each: verify whether it is still true, then either confirm the owning module closed it or file the correction request. **You own none of those documents** — `README.md`, `memory.md`, `ARCHITECTURE.md` and `3D-TECHNICAL-ARCHITECTURE.md` are all read-only to you.
**Acceptance:** all eight rows resolved as "closed by M*", "still open, request filed", or "document corrected by owner"; no row left unexamined; `check:anatomy`'s 18 present-tense references either describe a real script or have correction requests filed.

**8. One compliance module, verified.** Assert at build time that exactly one blocklist exists, that it carries 52 rules, and that every module scanning text imports it. Two forks exist today and all 36 condition names pass only one of them — that is precisely the drift the module's own header warns about.
**Acceptance:** a planted second literal blocklist array under `src/` fails the check; `content-validation.ts` imports M1's `scanText`; a condition name in an education entry fails the build.

**9. `docs/RELEASE-CHECKLIST.md`.** The launch gate, written down, **taken verbatim from `BUILD-PLAN.md` Phase 2 and its definition of done** — not paraphrased and not softened:

> Phone or tablet review by the physiotherapist · five representative patient tests · one semantic-list completion · one low-power fallback completion · a debrief showing users did **not** interpret the result as a diagnosis or a personalised prescription · then preview deploy · approval · **rollback tested** · then production.

Plus the definition of done: no patient route depends on a runtime API; every map region resolves to published content; the safety stop cannot be bypassed; direct browsing remains available; compliance is enforced; the clinician can update content without code; and `git status` contains only intentional changes.

Plus the H-blocker table: which of H1–H8 are still open, what each blocks, and who decides. **A launch blocker that is open is a stop, not a warning.**
**Acceptance:** every clause above appears; each has a verification method and an owner; no clause is reworded in a way that weakens it; open H items are listed as blocking.

**10. Route-by-route comparison against the live app.** `BUILD-PLAN.md` Phase 4: compare unified output against `patient-library` route by route before switching production. Content parity, not pixel parity.
**Acceptance:** a table of live routes against unified routes; every published area and item in the live app is reachable in the unified app; every difference is explained, and any missing content is a stop.

**11. Rollback tested, not assumed.** `patient-library/` stays live and is the rollback target until this module signs off. Test the rollback before production, not after an incident.
**Acceptance:** a documented, executed rollback with a timestamp in `VERIFICATION-LOG.md`; `patient-library` confirmed still deployed and serving; the QR codes and links already in patients' hands confirmed still resolving.

**12. Report what could not be verified, prominently.** Builds fail over the device bridge; WebGL does not exist there; git writes fail on the mount; `SHEET_ID` may be unavailable. Each of those makes specific criteria unverifiable, and a checklist that hides that is worse than no checklist.
**Acceptance:** `VERIFICATION-LOG.md` has a dedicated "not verified in this environment" section listing each criterion and the reason; the release checklist marks those as requiring a real terminal.

## 6. Contracts

**What M9 consumes:** every module's output, and specifically these hand-offs into your suite — M3's four bypass cases and four `canProceed` defaults; M1's nine validation rules and 52 compliance rules; M2's `check:anatomy`; M7's `check-images.ts`; M8's `check-assets.ts` and measured budget table; M6's screenshot set; M4's screenshot set.

**What M9 publishes:** `VERIFICATION-LOG.md`, `RELEASE-CHECKLIST.md`, the test suite, and the go/no-go itself.

**M9's checkpoints are MODULE-MAP §10's, and they are the wave gates:**

- **End of Wave 0.** Both trees committed. `npm run check` runs and its failures are real code failures. `contracts/` published and frozen. CI runs inside `anatomy-explorer/`.
- **End of Wave 1.** No file above `anatomy-explorer/` is imported anywhere. One compliance module, 52 rules, zero forks. `check:anatomy` exists and fails on a region that leads to no published content. The safety gate is unbypassable by Back button, by skip, or by "I'm not sure". `global.css` is gone.
- **End of Wave 2.** Zero 404s from any published surface. Every area card resolves. Images render for approved items and degrade to a labelled empty slot otherwise. One indexable locator URL, with `/find-my-pain` a redirect.
- **End of Wave 3.** `BUILD-PLAN.md`'s Phase 2 gate, unchanged, then preview, approval, rollback tested, production.

## 7. Hard rules for this module

1. **You do not fix. You report.** Every defect in another module's row is a `CROSS-MODULE-REQUESTS.md` entry and a log line. A verifier that edits the thing it verifies has destroyed its own signal.
2. **Never report a check as passed when the environment prevented it from running.** This is the single most important rule in this handoff. A report that says "typecheck could not run here" is worth more than a green tick nobody verified.
3. **Never relax a check, a threshold, or a release criterion to get to green.** Not the 52 rules, not the 8-items-per-area cap, not the 45-character alt-text floor, not the Phase 2 gate. Fix the content or hold the release.
4. **An open launch blocker is a stop.** H1 (regulatory classification), H3 (emergency number and stop-screen wording) and H4 (disclaimer wording) block launch and no test result overrides them.
5. **Never invent clinical content** and **never write a clinician's name or a review date** — including in a test fixture. Fixtures use `PLACEHOLDER_MARKER` or obviously-synthetic values.
6. **If content looks clinically wrong, flag it and stop.** Do not fix it. All five published items currently carry an empty `reviewed_by`; report that, do not fill it.
7. **No diagnosis language anywhere** — including test names, fixture ids, filenames and commit messages (D-001).
8. **`patient-library/` is read-only and stays live** until you sign off. It is the rollback target. Do not decommission it as part of a release.
9. **Do not touch config.** `package.json`, lockfiles, `astro.config.mjs`, `tsconfig.json` and `.github/` are M0's, including to wire your own gate.
10. **Never run `git clean -fd`, `git clean -fdx` or `git checkout -- .` at the repository root.** Until M0's first commit lands there is no reflog. `git reset --hard` is survivable; `git clean` is not.

## 8. Definition of done

- `VERIFICATION-LOG.md` carries a row for every acceptance criterion in all nine handoffs, each with a result or an explicit unverified reason.
- The `PLACEHOLDER_MARKER` gate fails on a rendered page and passes on the placeholder source.
- The unit suite covers M3's gate, M1's validation and compliance, M1's CSV coercion, M2's mapping, and M5's published-only filter — each with a failing and a passing case.
- Four browser journeys pass, including keyboard-only without the SVG and a red-flag run that cannot escape the stop screen.
- Zero broken internal links; `/find-my-pain` redirects; one indexable locator URL.
- Every module branch has an ownership-audit line; every out-of-lane change is reported.
- All eight rows of MODULE-MAP §8 resolved; `check:anatomy`'s references either true or corrected by their owners.
- Exactly one blocklist, 52 rules, imported everywhere text is scanned; a planted fork fails the build.
- `RELEASE-CHECKLIST.md` carries `BUILD-PLAN.md`'s Phase 2 gate and definition of done **verbatim**, plus the live H-blocker table.
- Route-by-route comparison complete; no live content missing from the unified app.
- **Rollback executed and timestamped**, with `patient-library` confirmed still serving.
- A prominent "not verified in this environment" section, with each criterion and reason.
- `git status --short`, from a real terminal, shows changes only in `tests/**`, `docs/RELEASE-CHECKLIST.md` and `docs/VERIFICATION-LOG.md`.

## 9. When you are blocked

**You will not be able to run most of this over the device bridge.** Builds fail on Windows native bindings under a Linux shell; WebGL is absent; git writes fail on the mount. That is an environment fact and it is not a reason to guess. Run what you can, list what you could not, and mark those criteria as requiring a real terminal.

**If a module reports done and your audit disagrees, the audit is the record.** Log both, file the request, and do not sign the wave off. This is the one module whose usefulness depends entirely on being willing to say no.

**If three launch blockers are still open when everything else is green** — which is the most likely end state, since MODULE-MAP §9 records them as stalled since 2026-08-23 — say so plainly at the top of the release checklist. Every build blocker in this repository is fixable by an agent in a week; every launch blocker needs one conversation with two people. Do not let a green build imply a launchable product.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, log it, and continue.
