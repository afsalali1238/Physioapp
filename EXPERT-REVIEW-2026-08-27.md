# Expert Review — pshyapp / anatomy-explorer

**Date:** 2026-08-27
**Scope:** features, workflow, architecture, code quality, safety/compliance, and launch-readiness of the patient-facing physiotherapy library.
**Method:** read-only review of the working tree (~60 source files, ~40 docs) across four parallel deep-dives, plus independent verification of the git, Node, and content state. No files were modified.

> **Two honesty caveats up front.** (1) I could not execute `build`, `lint`, `typecheck`, or the gate/route tests in this environment — the Windows `node_modules` can't run under the Linux bridge — so every statement about the *build passing* is unproven here and must be confirmed on a clean supported runtime. Where the project's own docs claim a check is green, I treat that as a claim, not a fact. (2) This is a point-in-time snapshot; the tree is moving fast (three commits landed since the last memory snapshot).

---

## 1. The headline: the project is not what its own rules say it is

The single most important finding is a **documentation-vs-reality gap at the top of the repo**, and it cuts in the project's favour on structure but against it on governance.

**What actually happened.** The long-planned merge is **done**. `patient-library/` — described everywhere in the governance docs as "the live app, reference-only, never delete" — **has been deleted from disk**. `anatomy-explorer/` is now the whole product, and it is **committed** (440 tracked files, `HEAD = 715cd24` "feat: register optimized 3D locator"). The cross-tree imports that used to couple the two apps are gone; only two stale *doc comments* still mention the old path (`src/lib/library.ts:7-8`, `src/pages/area/[section].astro:5`). Three commits since the last snapshot tell the story: save workspace state (which committed anatomy-explorer and removed patient-library) → resolve compliance issues + clean route crawl → register the optimized 3D locator.

This is genuinely good news: the **"untracked, no git safety net" hazard is resolved** (that was previously the single highest-risk item in the repo), and the architecture is now a single coherent app instead of a confusing two-app split.

**But the rules files never caught up.** The canonical governance docs still describe the deleted world:

- Root `CLAUDE.md` → points at `AGENTS.md` as "the canonical rules file."
- `AGENTS.md` still says **"`anatomy-explorer/` is the build target. `patient-library/` is live and reference-only — read it, copy out of it, never edit it, never delete it,"** and carries a whole section on "how to use patient-library as a reference."
- It still warns *"never run `git clean` — both folders are untracked, so there is no reflog to recover from,"* which is no longer true for anatomy-explorer.

**Why this is a real risk, not a nitpick:** the first thing any agent (or new engineer) does is read `CLAUDE.md`/`AGENTS.md`. Today those files instruct the reader to copy from a folder that doesn't exist, to never delete something already deleted, and to treat an untracked tree that is now committed. The most authoritative document in the repo is now the most misleading. **Fixing these two files is the highest-leverage, lowest-risk action available** — and it's a docs change, so it doesn't touch any of the protected surfaces.

*(The clinical guardrails inside those docs — content lives in the sheet, never invent clinical content, never relax compliance, navigate by body area — remain correct and absolute. It's only the two-folder structural narrative that's stale.)*

---

## 2. The second theme: the safety machinery is impressive but largely unwired

The project has built an unusually thorough set of validation and safety mechanisms. The problem is that **a large share of it doesn't run in the enforcement path.** The gate that actually decides what ships is much smaller than the machinery that exists.

What *does* enforce, and does it well:

- **The publish safety valve is real and fail-closed.** Rendering requires `status: published` **and** `reviewed_by` non-empty (`src/lib/validate.ts:205`) **and** approved image status (`src/lib/check-images.ts:27-31`). With today's content (see §5), that means the patient site renders **zero exercise items** — which is the *correct* behaviour for un-reviewed clinical content, not a bug.
- **The compliance engine is the best-engineered file in the repo.** `src/lib/compliance.ts` uses 53 word-boundary rules (8 superlatives, 4 outcome-claim patterns, 5 booking-CTA patterns, 36 condition names) with proper tokenization that avoids the substring false-positives a naive matcher would hit.

What exists but **does not run**:

- **`scripts/check-assets.ts` is orphaned.** It validates licensing metadata, GLB validity, the media ledger, the model registry, and motion assets — exactly the ASSET-PIPELINE.md contract — but it is wired into **no** npm script and is **not** in `prebuild`/`check:all` (`package.json:18` runs only `check:compliance && check:anatomy && check:images`). The asset-licensing guarantee the RESOURCES report leans on is, right now, unenforced.
- **The test suites are meaningful but unwired.** `tests/gates.test.ts` (5 safety gates) and `tests/routes.test.ts` (6 route fixtures) encode real invariants, but there is **no `test` script** and they run in **no CI** — so they can pass or rot silently. `@astrojs/check` is a prod dependency and there's an orphaned Playwright devDependency, suggesting the test story was refactored and left half-connected.
- **The compliance logic is forked, and the fork is the weak version.** `scripts/sync-content.ts:96,126` re-implements banned-term detection inline as a 6-term `.includes()` substring check — the exact naive approach `compliance.ts` was written to avoid (e.g. "secure the band" contains "cure"). Two matchers, different rules, and the sheet-sync path uses the worse one.

Net: the *intent* of the safety system is excellent; the *wiring* is incomplete. Most fixes here are integration work (add scripts to `check:all`, add a `test` script, delete the fork and import the real engine), not redesign.

---

## 3. What's genuinely strong

Credit where due — several things are done to a professional standard:

- **Progressive-enhancement discipline.** The anatomy locator works with JavaScript disabled: `AnatomyLocator.astro` server-renders real `<a href="/area/{id}/">` links (lines 150, 168) with a JS-off safety gate (349, 375). The 3D upgrade is genuinely optional, exactly as ASSET-PIPELINE.md promises ("a failed upgrade never removes tier 1").
- **The three.js integration is careful.** `NeckThreeSlice.astro` does thorough resource cleanup on teardown (280-305) — disposes geometries/materials/renderer — which is where most web-3D memory leaks live.
- **Privacy-by-architecture.** `astro.config.mjs` has `webAnalytics:false`, there's no backend, and only one localStorage key is used in practice (`physio-scale`). The "no tracking, no accounts, no patient data" principle (D-007) is upheld at the code level, not just asserted.
- **Single-source-of-truth patterns.** Section paths derive from `src/lib/section.ts:21-24` (the singular/plural routing trap is closed — it emits `/exercise/`, with the plural only ever a display label); anatomy geometry has one registry. These are the right abstractions.
- **The preview routes are correctly isolated** from search: `prerender=false`, `noindex`, and sitemap-excluded (`astro.config.mjs:32`). (Caveat in §6 — they have no access control.)

---

## 4. Feature & maturity map

| Capability | Maturity | Notes |
|---|---|---|
| Content model (areas/items, Zod schemas, sheet sync) | **Mature** | Zod-4 schemas correct; generated JSON; fail-closed render gate. |
| Compliance engine (DHA/MOHAP wording) | **Mature** | 53 tokenized rules; best code in the repo. *But* forked/weakened in sync-content. |
| Routing & navigation (by body area) | **Mature** | JS-off links; singular/plural trap closed; head-to-toe ordering honoured. |
| Publish/review safety gate | **Mature & fail-closed** | Requires published + reviewed_by + approved image. |
| 3D locator — Tier 1 (fallback SVG map) | **Real / shipping-grade** | Works, JS-off safe, inline SVG. |
| 3D locator — Tier 2 (full-body GLB) | **Prototype** | 2,936-tri capsule/sphere blockout, **not** Draco/Meshopt; no Draco decoder in loader (`NeckThreeSlice.astro:101`); asset is draft → invisible in prod. |
| 3D locator — Tier 3 (regional GLBs) | **Absent** | Pipeline defines it; no assets exist. |
| Motion / exercise video | **One throwaway prototype** | `generate-video.ts` pose→SVG→Playwright→ffmpeg, hardcoded to one exercise; validation is metadata-only. |
| i18n / Arabic / RTL | **~0% — scaffolding only** | `locale.ts:5-7` registers `en` only; `dir=rtl` never fires. **This is the stated strategic differentiator** (see RESOURCES report §7) and it is the least-built feature. |
| Offline / PWA | **Missing** | Valid manifest, but **no service worker** — despite commit `eff4a71` mentioning offline support. Likely lived in patient-library and wasn't ported. |
| Text-size accessibility control | **Works, with a visible defect** | See §6 (FOUC). |

The through-line: **everything tied to shipping today's content is mature; everything tied to the product's differentiation (3D depth, motion, Arabic) is prototype-or-absent.**

---

## 5. The content → deploy workflow, and where it actually stands

The intended pipeline is sound and is the right shape for this domain:

> Clinician authors in Google Sheet → `sync:content` generates `areas.json` / `items.json` → Zod validates shape → compliance + image + anatomy gates → render **only** published + reviewed + image-approved content (fail-closed).

Current content state (verified today):

- `items.json`: **26 items — 0 published, 26 draft, 0 with `reviewed_by`, 0 with approved image status.**
- `areas.json`: 16 areas — 4 published, 12 draft.
- **Net effect: the production patient site renders no exercises at all.** The container is built; the reviewed clinical content to fill it does not yet exist.

This matters because it reframes what "launch-ready" means. **The blockers are human and regulatory, not code:**

1. **Decision D8 is unresolved** — whether the site is patient *education* or a regulated *medical advertisement* under DHA/MOHAP. This is owned by the clinic's Medical Director and gates everything. The project's own release docs (`R1-RELEASE-REPORT.md`, `RELEASE-CHECKLIST.md`, `V2-VERIFICATION.md`, all dated today) self-declare **NO-GO**, and this is the top reason.
2. **Zero clinician sign-off exists** — 0 of 26 items reviewed. Even with a perfect container, there is nothing approved to show.
3. A cluster of pre-launch content items (emergency/red-flag guidance, medical disclaimer, region-visual approval, domain, clinic licence numbers) remain unapproved per the checklist.

The correct read: **the engineering is far ahead of the content and the regulatory decision.** No amount of code work changes the NO-GO until D8 is decided and the clinician reviews content.

---

## 6. Prioritized risk register

**High — fix before any launch:**

| # | Risk | Location | Why it matters |
|---|---|---|---|
| H1 | Canonical rules docs describe the deleted two-folder world | `CLAUDE.md`, `AGENTS.md` | Every agent/engineer is misled on first read. Docs-only fix, zero protected-surface risk. |
| H2 | Regulatory classification D8 unresolved | governance / Medical Director | Top launch blocker; project self-declares NO-GO. |
| H3 | Zero reviewed clinical content (0/26) | `items.json` | Site renders no exercises; nothing to launch. |
| H4 | Preview routes have no access control | `src/pages/preview/**` | They fetch the live sheet and render **draft + unapproved-image** content with only Zod `safeParse` — no compliance, no `validateItems`. `noindex` stops crawlers, not a shared URL. Unreviewed clinical claims are one link-share from being public. |

**Medium — fix before relying on the safety system:**

| # | Risk | Location |
|---|---|---|
| M1 | Compliance logic forked; sync path uses naive `.includes()` | `scripts/sync-content.ts:96,126` — replace with `compliance.ts` |
| M2 | Asset-licensing/GLB validator never runs | `scripts/check-assets.ts` orphaned; add to `check:all` |
| M3 | Gate & route tests not wired to any script or CI | `tests/gates.test.ts`, `tests/routes.test.ts` |
| M4 | "Never hand-edit generated JSON" is unenforced for anatomy-explorer's own `areas.json`/`items.json` | `.claude/settings.json` deny-list covers `../patient-library` and `../src`, not the current tree's generated files |
| M5 | Text-size FOUC on every load | `TopBar.astro:23` claims a blocking inline head script that doesn't exist in `Base.astro:41-52`; `--scale` is applied by a deferred script (~line 203) |

**Low — hygiene / correctness:**

- L1 — Tier-2 GLB is a crude capsule blockout, not compressed; `-optimized.glb` exists but is unreferenced in `src`; no Draco decoder in the loader. (Invisible in prod anyway since draft.)
- L2 — `NeckThreeSlice.astro` is a misnomer (it's the full-body locator) and has a fallback race (`:80` vs `:316`).
- L3 — Stale internal docs beyond the top-level pair: `anatomy-explorer/memory.md` header still claims "Wave 0… nine source files"; a risk entry claims "check:anatomy doesn't exist" (it does); AGENTS references "A-021" when the log maxes at A-020; footer legal links (`SiteFooter.astro:118`) emit `/legal/{id}` without a trailing slash while `astro.config.mjs:38` uses `format:'directory'`.

---

## 7. Recommendations, sequenced

**Do now (cheap, unblocks correctness, touches no protected surface):**

1. **Rewrite `CLAUDE.md` + `AGENTS.md`** to describe the single-app reality: anatomy-explorer is the product and is committed; patient-library is deleted; keep every clinical guardrail verbatim. Highest leverage in the repo.
2. **Refresh the internal stale docs** (H2/L3 batch): `anatomy-explorer/memory.md` state header, the false "check:anatomy" risk line, the A-021 reference.

**Do before trusting the safety net:**

3. **Delete the compliance fork** in `sync-content.ts` and import `compliance.ts` (M1).
4. **Wire the orphans into the gate:** add `check-assets.ts` to `check:all`, add a `test` script that runs `gates`/`routes`, and put both in CI/`prebuild` (M2, M3).
5. **Extend the generated-JSON write-block** to anatomy-explorer's own `data/*.json` (M4).

**Do before launch (mostly not engineering):**

6. **Get D8 decided** by the Medical Director; then the clinician reviews content so `items.json` has published+reviewed rows. Until then, NO-GO stands regardless of code.
7. **Lock down preview routes** — at minimum a shared secret / basic auth, since they render unreviewed clinical content (H4).

**Product bets (when the above is stable):**

8. **Build Arabic/RTL for real.** It's the honest differentiator versus Physitrack/MedBridge et al. (per the RESOURCES report), and today it's the least-built feature. Turning it on is a strategic move, not a polish task.
9. **Decide the 3D roadmap deliberately:** either invest in real Tier-2/Tier-3 assets (MakeHuman CC0 base → Draco/Meshopt, per the RESOURCES stack) or formally scope the product to Tier-1 for launch. Don't ship a capsule blockout as "3D."

---

## 8. Bottom line

This is a **well-architected container waiting on content and a regulatory decision.** The engineering instincts on display — fail-closed publishing, progressive enhancement, privacy-by-design, a properly tokenized compliance engine — are strong and, in places, better than the platforms it's benchmarked against. The merge that dominated the last phase has completed cleanly, and committing anatomy-explorer removed the scariest risk in the repo.

The gap now is not capability, it's **coherence and connection**: the top-level rules docs describe a repo that no longer exists, and much of the excellent safety machinery isn't plugged into the gate that actually decides what ships. Both are fixable in days, and neither touches the protected clinical or config surfaces. Beyond that, the true launch blockers — D8 and clinician sign-off — sit with the clinic, not the codebase. The most valuable thing the build side can do while waiting is: correct the docs, wire the safety net shut, lock the preview routes, and start Arabic/RTL for real.
