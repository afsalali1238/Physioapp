# M0 — Foundation & toolchain

**Build tool:** Hermes · **Wave:** 0 · **Branch:** `m0-foundation` · **Depends on:** nothing — this is the root of the graph, and every Wave 1 module is blocked until it lands.

Read `../../MODULE-MAP.md` before this file. It owns the file-ownership matrix and the rules that bind every module; this handoff adds detail and may not contradict it.

## 1. Why this module exists

Three separate problems, one module, because all three are config and **M0 is the only module allowed to touch config** (MODULE-MAP.md §7).

**The repository is not committed.** The split into `anatomy-explorer/` and `patient-library/` was done with plain `mv` and never committed. There is no ancestor commit for either tree and therefore no reflog. Until that changes, one careless `git clean -fd` erases 26 items of irreplaceable clinical work and the entire build target. This is deliverable #1 and it outranks everything else in this file.

**The repository is not checkable.** `npm run lint` is aliased to `tsc --noEmit`, so there is no linter; `tsc` does not read `.astro` files, so the 228-line client script that *is* the application's behaviour has never been typechecked. A module that finishes with `npm run check` today learns nothing.

**Wave 1 cannot start in parallel without frozen types.** M1, M2, M3 and M6 all run at once and all four need to agree on shapes they do not own. M0 publishes `src/lib/contracts/` so they can compile against a contract instead of against each other's half-built implementations.

M0 does not build a feature. Judge it on this: after M0, a Wave 1 agent can clone, install, run one command, and get a list of real code failures — nothing about missing tooling.

## 2. Files you own

Exactly the M0 row of MODULE-MAP.md §5, no additions. Present state in brackets.

| File | State |
|---|---|
| `package.json` | exists, one dependency |
| `package-lock.json` | exists |
| `astro.config.mjs` | exists, 5 lines |
| `tsconfig.json` | exists, 5 lines |
| `eslint.config.mjs` | **absent** — create |
| `.prettierrc` | **absent** — create |
| `vitest.config.ts` · `playwright.config.ts` | **absent** — create, configured but with no tests (`tests/**` is M9's) |
| `.gitignore` | **absent** in `anatomy-explorer/` — create |
| `.github/workflows/**` | exists at the **repository root**, wrong place |
| `src/lib/contracts/**` | **absent** — create, then freeze |
| `src/env.d.ts` | **absent** — create |

Two files you will want and do not own. `src/components/AnatomyLocator.astro` is M4's (§4 below explains what to do with its two type errors instead of fixing them). `.claude/hooks/pre-push-check.sh` appears in no row of the matrix — claim it in `CROSS-MODULE-REQUESTS.md` before touching it.

## 3. Files you read, never write

- `../patient-library/**` — live, reference-only. `patient-library/package.json` is the closest thing to a known-good dependency set for this stack; read it, do not copy the `openai` dependency or the `webAnalytics` config.
- `PORT-CHECKLIST.md`, `PRD.md`, `ARCHITECTURE.md`, `BUILD-PLAN.md`, `DESIGN-SYSTEM.md`, `CLINICAL-SAFETY.md`, `ANATOMY-DATA-SCHEMA.md`, `3D-TECHNICAL-ARCHITECTURE.md`, `UX-FLOWS.md`, `PRODUCT-BLUEPRINT.md`, `CLINICIAN-QUESTIONS.md`.
- Every `src/**` file outside `src/lib/contracts/` and `src/env.d.ts`. You read them to derive contract types. You do not edit them, including to fix an error you find.
- `memory.md` and `handoffs/CROSS-MODULE-REQUESTS.md` are append-only and shared.

## 4. Verified starting state

Verified against the working tree on 2026-08-26. Where this section and a document disagree, this section is the fact.

| Fact | Evidence |
|---|---|
| One runtime dependency, `astro: ^7.2.4` (7.2.6 installed) | `package.json:14-16` |
| `lint` is an alias for `typecheck`, so **there is no linter** | `package.json:11-12` |
| `dev` script carries the invented flag `astro dev --background` | `package.json:7` |
| `tsconfig.json` includes only `.astro/types.d.ts` and `src/**/*` — it will not cover `scripts/` once M1 adds them | `tsconfig.json:3` |
| `astro.config.mjs` is 5 lines: no adapter, no sitemap, no `redirects`, and `site` is the non-routable placeholder `https://anatomy-explorer.local`, which will poison any sitemap or canonical URL | `astro.config.mjs:1-5` |
| Root CI runs `npm ci`, `npm run lint`, `npm run sync:content` and `npm run build` from the repository root, where there is no `package.json` — so it fails at step one, and would fail at `lint` anyway | `.github/workflows/ci.yml:22-35` |
| `dist/` on disk holds only `index.html`, `find-my-pain/index.html` and one `_astro` chunk — it predates the A-014 route rename | `dist/` (4 files) |
| Root `.gitignore` already lists `dist/` and `.astro/`, so committing the tree will not re-add them at the new paths — but `origin/main` still holds the old flat structure, so confirm with `git ls-files` from a real terminal before assuming | `../.gitignore:2,4` |
| `src/env.d.ts` absent; `.astro/content.d.ts` exists despite there being no content config yet | file tree |
| `check:anatomy` is referenced 18 times across docs, `memory.md` and the pre-push hook, in the present tense, and does not exist. The hook's guard at line 17 means it silently skips rather than failing | `.claude/hooks/pre-push-check.sh:17-22`; `memory.md:107` |

**The two type errors, and why you must not fix them.** `tsc --listFilesOnly` loads 11 files and none of them is an `.astro` file. The client script at `src/components/AnatomyLocator.astro:236-464` is therefore unchecked, and it contains two real errors: line 329 passes `string | undefined` into `findSafetyRule`'s `string` parameter (TS2345), and line 440 reads `event.key` off an untyped `Event` (TS2339), which traces back to the un-generic `document.querySelector` at line 244. **That file belongs to M4.** Your job is to build the check that reveals them and to write both, with line numbers, into `handoffs/CROSS-MODULE-REQUESTS.md` addressed to M4. Adding `astro check` will therefore make `npm run check` fail on landing. That is the correct outcome and it must be stated in your report rather than hidden by fixing someone else's file.

## 5. Deliverables

**1. Both trees committed.** One commit for the restructure, from a real terminal, with `anatomy-explorer/` and `patient-library/` both tracked. Git writes fail over the Claude device bridge (`.git/index.lock` is not writable on the mount), so this is a hand-run step, not an automated one. Commit messages carry no diagnosis language (MODULE-MAP.md §7).
**Acceptance:** `git ls-files anatomy-explorer | wc -l` and `git ls-files patient-library | wc -l` both return non-zero; `git ls-files | grep -c 'anatomy-explorer/dist/'` returns 0.

**2. Dependencies installed and declared.** Add `zod`, `papaparse` + `@types/papaparse`, `@astrojs/vercel`, `@astrojs/sitemap`, `eslint` + `eslint-plugin-astro`, `prettier` + `prettier-plugin-astro`, `vitest`, `@playwright/test`, `tsx`. **The Zod major version is not yours to pick** — M1 must resolve a Zod 3 / Zod 4 conflict in the schemas it is porting. Take M1's answer through `CROSS-MODULE-REQUESTS.md` and pin what it asks for. Do not copy `openai` or `dotenv`-by-reflex from `patient-library/package.json`.
**Acceptance:** `npm ci` from a clean clone exits 0; `npm ls zod papaparse @astrojs/vercel @astrojs/sitemap` resolves every one; no dependency in `package.json` is imported by nothing.

**3. `npm run check` becomes a real aggregate.** `typecheck` (tsc), `lint` (eslint, genuinely eslint), `astro check`, plus hooks that call M1's `check:schema` / `check:compliance` and M2's `check:anatomy` **if the script exists** — the same conditional shape the pre-push hook already uses, so M0 can land before its Wave 1 providers do. Delete the `lint → typecheck` alias and the `--background` flag on `dev`.
**Acceptance:** `npm run check` invokes at least four distinct tools; `npm run lint` fails on a deliberately unused variable; `npm run check` reports the two `AnatomyLocator.astro` errors from §4 by file and line.

**4. `eslint.config.mjs` and `.prettierrc`.** Flat config, `eslint-plugin-astro` registered so `.astro` files are actually linted. The config file was deliberately removed earlier and its absence is one of the two reasons CI is red — restoring it is a decision, so append it to `memory.md`.
**Acceptance:** `npx eslint src --max-warnings=0` runs to completion and reports on at least one `.astro` file; `npx prettier --check .` runs without erroring on config.

**5. `tsconfig.json` covers everything that will exist.** Add `scripts/**/*` and `*.config.*` to `include`; keep `astro/tsconfigs/strict`; keep `dist` excluded. Do not loosen `strict` to make anything pass.
**Acceptance:** after M1 lands, `tsc --noEmit` typechecks files under `scripts/`; `tsc --listFilesOnly | grep -c 'src/lib/contracts'` is non-zero; no `strict*` flag in the file is set to `false`.

**6. `astro.config.mjs`, rewritten from scratch.** Vercel adapter, sitemap integration, and `redirects: { '/find-my-pain': '/find-my-area' }`. **Never restore this file from git history** — the historical version carries a Vercel `webAnalytics` flag that D-007 forbids. `site` stays a clearly-labelled placeholder with a comment naming open decision H6/D5; it is not yours to guess.
**Acceptance:** the file contains no string matching `webAnalytics` or `analytics`; the redirect entry is present; a comment names H6/D5 beside `site`.

> **Coordination with M4.** M4 deletes `src/pages/find-my-pain.astro` (MODULE-MAP.md §5). Your redirect and M4's deletion must both land or neither: a redirect over a live page is dead config, and a deleted page with no redirect is a 404 on a URL patients may already hold. Land the redirect, then write the dependency into `CROSS-MODULE-REQUESTS.md` so M4 knows the redirect is already there.

**7. `dist/` deleted and ignored.** Delete the stale directory from disk. Add `anatomy-explorer/.gitignore` covering `dist/`, `.astro/`, `node_modules/`, `.vercel/`, `.env*` — local to the app, so the app is self-contained if the folders ever separate.
**Acceptance:** `anatomy-explorer/dist/` does not exist; `git check-ignore -v anatomy-explorer/dist` resolves; `git status --short` shows no `dist/` entry.

**8. CI runs inside `anatomy-explorer/`.** Set `working-directory` (or a `defaults.run` block) on every step. **Do not carry over the `sync:content` step**: it needs a live Google Sheet and a `SHEET_ID` secret, which makes CI depend on a third party being up and on content the clinician may be mid-edit on. Content sync is a deliberate local action; CI checks the committed snapshot. Note in the workflow that `patient-library/` is deliberately not built by CI.
**Acceptance:** every `run:` step executes with `anatomy-explorer` as its working directory; the workflow contains no `sync:content` step and no `SHEET_ID`; CI's remaining failures are the §4 code failures, nothing about missing tooling.

**9. `src/lib/contracts/` published, then frozen.** The five files in MODULE-MAP.md §4, **types only — no runtime code, no constants, no functions with bodies**. Derive them from what exists: `contracts/content.ts` from `patient-library/src/lib/schemas.ts` and `docs/CONTENT-SCHEMA.md` (`image_status` is `'pending' | 'generated' | 'approved'`, optional — M1 depends on that field existing in the type); `contracts/anatomy.ts` from `src/data/anatomy/*.ts`; `contracts/safety.ts` from `src/data/anatomy/safety-rules.ts`; `contracts/locator.ts` from `src/lib/anatomy/locator-state.ts` and the `Phase` union at `src/components/AnatomyLocator.astro:242`; `contracts/assets.ts` from `ASSET-PIPELINE.md`'s thirteen metadata fields.
**Acceptance:** every file compiles under `tsc --noEmit`; `grep -rn "function\|const\|class" src/lib/contracts/*.ts` returns only `declare`/type-level matches; an import of any contract from a module file resolves; and the compiled JS output for the directory is empty.

**10. `contracts/__placeholders__/`.** Every string value is the literal `PLACEHOLDER_MARKER` constant, the pattern `patient-library/src/config/clinic.ts:49-60` already uses. Non-string fields get obviously-synthetic values. **No realistic clinical prose, no exercise names, no dosages, no clinician name, no review date** — not even as a comment showing "what it would look like".
**Acceptance:** `grep -c PLACEHOLDER_MARKER` over the directory equals the number of string-valued fields; no file in the directory matches `/reviewed_(by|date)\s*[:=]\s*['"][^'"]/`; M9's later `PLACEHOLDER_MARKER` build gate finds nothing on a patient route.

**11. `src/env.d.ts`.** The Astro reference types, plus any `import.meta.env` declarations. One line of substance; it belongs to nobody else.
**Acceptance:** `tsc --noEmit` resolves `astro:content` and `astro:assets` type references without error.

## 6. What to copy from patient-library/, and what to change on the way

| Source | Take | Change on the way |
|---|---|---|
| `patient-library/package.json:22-40` | the dependency set for this exact stack — Astro 7, Vercel adapter, sitemap, papaparse, zod, tsx | drop `openai` (imported by nothing); drop `dotenv` unless M1 asks for it; do not copy the version pin for `zod` until M1 has resolved its major-version question |
| `patient-library/package.json:8-21` | the *shape* of the script set: separate `check:*` scripts, a `prebuild` that gates the build, one `check:all` aggregate | rename the aggregate to `check` per MODULE-MAP.md §6; keep the conditional-existence pattern so M0 can land before M1 and M2 |
| `patient-library/src/config/clinic.ts:20,49-67` | the placeholder discipline: one marker constant, and a function that lists what is still unfilled | you are creating `__placeholders__/`, not a clinic config — `src/config/clinic.ts` is M6's file |
| `patient-library/src/lib/schemas.ts` | the field names and enums, as the source for `contracts/content.ts` | types only. Zod belongs to M1; a `z.object` in `contracts/` is runtime code and breaks deliverable #9 |
| `.claude/hooks/pre-push-check.sh:17` | the `npm run 2>/dev/null \| grep -q` existence guard | keep it; it is what lets an aggregate reference scripts that do not exist yet |

**Do not copy** `patient-library/astro.config.mjs` at git `HEAD` (`webAnalytics`, D-007 violation), `public/sw.js`, `README.md`'s React/Tailwind boilerplate — it is the origin of this app's broken `dev` script — or `add-lowerback.js`.

## 7. Contracts

**What M0 consumes:** nothing. Nothing is upstream of you.

**What M0 publishes, and what depends on it:**

| Published | Consumer | Consumer's first blocked action |
|---|---|---|
| `contracts/content.ts` | M1, M5 | M5 cannot type the exercise card |
| `contracts/anatomy.ts` | M2, M4 | M2 cannot type its regenerated regions |
| `contracts/safety.ts` | M3, M4 | M3 cannot type the gate API |
| `contracts/locator.ts` | M4 | M4 cannot type the reducer |
| `contracts/assets.ts` | M7, M8 | M7 cannot type image metadata |
| working `npm run check` | all | nobody can satisfy their definition of done |
| dependencies in `package.json` | M1 | `import { z } from 'zod'` does not resolve |

**Contracts are frozen once published.** Widening a type after Wave 1 starts silently changes four modules' assumptions at once. Requests arrive through `handoffs/CROSS-MODULE-REQUESTS.md` and you make the edit — which means you stay reachable for the whole of Wave 1. Do not accept a widening whose only justification is "my module does not compile".

## 8. Hard rules for this module

1. **You are the only module allowed to touch config, and that is a duty as well as a permission.** Every config change is deliberate, named in your report, and appended to `memory.md`. No config change is ever a side effect of something else.
2. **Do not fix code in a file you do not own,** including the two errors your own new check will surface. Report them to M4.
3. **Never restore `astro.config.mjs` from git history.** Write it fresh. The historical version violates D-007.
4. **No analytics, accounts, tracking, backend or third-party origin** enters `package.json` or the config. That is D-007 and it is why `webAnalytics` is not coming back.
5. **Never relax a check to make a build green.** If `astro check` fails, the code is wrong. `strict` stays on.
6. **Never write a clinician's name or a review date** into a contract, a placeholder, a test scaffold, or a comment. Never invent clinical content, not even as illustration.
7. **Contracts hold no runtime code.** A single exported constant makes every module's build depend on M0's implementation, which is the coupling `contracts/` exists to prevent.
8. **`patient-library/` is read-only.** Copy out of it; leave it byte-identical. It is live, patients have the link, and it is the rollback target until M9 signs off.
9. **Do not run `git clean -fd`, `git clean -fdx` or `git checkout -- .` at the repository root** before deliverable #1 lands. `git reset --hard` is survivable; `git clean` is not.
10. **Builds cannot run over the Claude device bridge.** `node_modules` holds Windows native bindings (`@rolldown/binding-win32-x64-msvc`, `lightningcss-win32-x64-msvc`, `@img/sharp-win32-x64`) and the bridge shell is Linux, so `astro build` fails with "Cannot find native binding" for reasons that have nothing to do with the code. **Say which checks you could not run. Never report a check as passed when the environment prevented it from running.**

## 9. Definition of done

- Both trees committed; `git ls-files` non-zero for each; `dist/` neither on disk nor tracked.
- `npm ci` succeeds from a clean clone. `npm run check` runs four or more real tools and every remaining failure is a code failure attributable to a named file and line.
- `eslint.config.mjs` exists and lints `.astro`. `astro check` is wired in. `vitest` and `playwright` are configured and runnable with zero tests.
- `astro.config.mjs` has the Vercel adapter, sitemap, the `/find-my-pain` → `/find-my-area` redirect, a placeholder `site` annotated with H6/D5, and no analytics of any kind.
- CI runs every step inside `anatomy-explorer/` and contains no `sync:content` step.
- `src/lib/contracts/` publishes all five files plus `__placeholders__/`, emits no JavaScript, and is announced as frozen.
- `git status --short`, read from a real terminal, shows changes only in M0's rows of MODULE-MAP.md §5. Anything else is reverted and reported.
- `memory.md` carries a new decision entry for each of: the Zod pin, restoring ESLint, the CI working-directory change, dropping `sync:content` from CI, and the `site` placeholder. Nothing existing is silently reversed.
- `handoffs/CROSS-MODULE-REQUESTS.md` carries the two `AnatomyLocator.astro` errors addressed to M4, the redirect/deletion coordination note for M4, and the `pre-push-check.sh` ownership claim.

## 10. When you are blocked

**The Vercel Root Directory must be set to `anatomy-explorer`.** That is a dashboard setting, not a file — you cannot do it and you should not try to work around it in config. Note it in your report as a human action. It is also exactly why `src/lib/library.ts`'s cross-boundary import cannot deploy: Vercel never uploads anything above the root directory. M1 removes the import; you do not.

**H6/D5, the domain name, is open and blocks nothing you do.** Ship the annotated placeholder and move on. Do not invent a domain to make a sitemap look complete — a wrong canonical URL on patient-facing material is worse than a visibly missing one.

**If a Wave 1 module asks for a contract change,** decide on the merits and record it. If the request is "widen this so my module compiles", the answer is no and the module implements around it.

**If you cannot run a check,** say which one and why, in one sentence, in your report. Git and builds both fail over the bridge; both are environment facts and neither is a reason to guess. A report that says "typecheck could not run here" is worth more than a green tick nobody verified.

**If a task appears to need a file you do not own,** you are not blocked: write it into `handoffs/CROSS-MODULE-REQUESTS.md`, implement around it, continue. This project has been damaged twice by agents editing outside their lane; MODULE-MAP.md §1 records both incidents.
