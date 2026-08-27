# Cross-module requests

**Append-only. Never edit or delete another module's entry.** Add yours at the bottom of §3.

This file is what makes the one rule in `../../MODULE-MAP.md` §1 workable: *every file has exactly one owning module, and only that module may create, edit, delete or rename it.* When your task appears to require a file you do not own, you are **not blocked** and you do **not** get to make an exception. You write the request here, implement around it, and continue. The owning module picks it up.

Two incidents are why this file exists. An agent deleted `astro.config.mjs` while working on something else and the Vercel adapter and sitemap were missing for days. And D-025/D-026 reversed three written design rules — the locked palette, the no-page-transitions rule, and the always-present disclaimer — as uncommented "UX polish". Neither would have been caught by reading a diff for correctness. Scope is a separate question from correctness.

---

## 1. How to write an entry

Copy this shape. Keep it short; the owner needs to act, not to read.

```
### R-NNN · <one-line summary>
**From:** M<n> · **To:** M<n> (or H) · **Date:** YYYY-MM-DD · **Status:** open

**What:** the exact file, and the exact change.
**Why:** what is blocked, or what breaks without it.
**Evidence:** file:line, or the document and section.
**Meanwhile:** what you did instead, so the owner knows what to expect.
```

Number entries `R-001` upward, never reuse a number, and set **Status** to `open`, `done`, `declined` or `superseded`. The **owner** changes the status, not the requester. A declined request gets one line of reason.

**Four kinds of entry belong here:**

1. **An edit to a file you do not own.** The common case.
2. **A claim on an unowned file** — anything not in `MODULE-MAP.md` §5 is unowned, and you claim it here *before* you create it.
3. **A contract change.** Only M0 edits `src/lib/contracts/**`, and contracts are frozen once published. **A request whose only justification is "my module does not compile" will be declined** — widening a type after Wave 1 starts silently changes four modules' assumptions at once.
4. **A finding for the H track.** Anything clinical or regulatory that no agent may decide. Address it to **H** and it lands in `H-CLINICAL-SIGNOFF.md`'s scope.

**What does not belong here:** a decision you made inside your own module — that goes in `memory.md`. And a defect you found and fixed in your own row — that goes in your report.

---

## 2. Unowned files — claim before you create

Nothing in `MODULE-MAP.md` §5 covers these. They came up during module planning and each needs a claim entry before it exists. Listed so nobody creates one silently.

| File | Wanted by | Note |
|---|---|---|
| `.claude/hooks/pre-push-check.sh` | M0 | exists; in no row. Its `npm run … \| grep -q` existence guard is load-bearing. |
| `src/data/anatomy/questions.ts` | M4 | exists; holds `SYMPTOM_QUESTIONS`, which A-002 says are cut and which still ship. Clinical wording — the cut/keep decision goes to **H**. |
| `src/lib/library.ts` | M1 | exists; the cross-boundary import M1 deletes. Claim the **deletion**. |
| `src/components/AnatomyLocator.astro` | M4 | exists, 464 lines; the monolith M4 replaces. Claim the **deletion**. |
| `src/lib/images.ts` | M5 | the `import.meta.glob` image resolver. |
| `scripts/check-images.ts` | M7 | the automated half of the image gate. |
| `scripts/generate-qr.ts` | — | exists in `patient-library`. Nobody has asked for it here. |
| `src/pages/preview/**` | M5 | the clinician's review surface, where the image approval gate deliberately inverts. Genuinely useful, genuinely unassigned. |

---

## 3. Requests

*(Empty. First entry is R-001.)*

---

## 4. Known items that will land here — do not pre-file them

These were identified while writing the handoffs. Each is the responsibility of the module named, who files it **when they reach it**, with real evidence rather than this list. They are recorded here only so none of them is lost.

**M0 → M4.** The two type errors M0's new `astro check` will surface and must not fix: `AnatomyLocator.astro:329` passes `string | undefined` into `findSafetyRule`'s `string` parameter (TS2345), and `:440` reads `event.key` off an untyped `Event` (TS2339), tracing back to the un-generic `document.querySelector` at `:244`.

**M0 ↔ M4.** The `/find-my-pain` → `/find-my-area` redirect and the deletion of `src/pages/find-my-pain.astro` must both land or neither. A redirect over a live page is dead config; a deleted page with no redirect is a 404 on a URL patients may already hold.

**M1 → M0.** The Zod major-version pin. `patient-library/package.json` declares `zod: ^4.4.3` while `schemas.ts:54-69` calls `z.ZodIssueCode.custom` ten times — an API removed in Zod 4. M0's handoff states explicitly that this pin is M1's to decide.

**M1 → M2.** `src/lib/anatomy/content-validation.ts:3-14` is a second, independent blocklist of 7 patterns. The 36 condition names in the canonical 52-rule module are absent from it, so education text passes a check library text would fail. M2 imports `scanText` instead.

**M1 → M6.** `check-compliance.ts` needs an existence guard around `src/config/clinic.ts` — M6 is a Wave 1 peer and may not have landed.

**M3 → M4.** Remove `answerSafetyCheck` from `question-flow.ts`; `safety-gate.ts` supersedes it. **Two live gate implementations at the end of Wave 2 is an M9 failure.** Plus: M4 mounts and may style the gate, but may never change which options exist, what they say, what an answer does, or when the gate runs.

**M3 → H.** The wording for the "I'm not sure" stop screen. M3 makes `unsure` stop rather than skip; what the screen *says* is the Medical Director's, and ships as `PLACEHOLDER_MARKER` until it is answered.

**M6 → M4 and M5.** `global.css` is deleted after M6 splits it. Both modules' pages import it directly today and will break; each needs the import change plus, for M4, the list of locator-specific blocks extracted from it.

**M6 → M8.** Whether a favicon or any `public/` asset is wanted. `public/**` is M8's row, and D-027's service worker and manifest are **not** being ported.

**M5 → M0/M1.** `image_status` has no `'rejected'` value, though `IMAGE-TEST-VERDICT.md` instructs marking the nine test images with one. Five images were moved out of the tree instead, so the row still says `generated` and the reason lives only in a document.

**M5 → M6 + H.** The completion control. `MODULE-MAP.md` §7 permits exactly two `localStorage` keys — last chosen area and text size. `CLINICAL-SAFETY.md` · Privacy separately allows "completion marks". The live implementation writes a **date-derived key**, `physio-done-YYYY-M-D`, creating a new key every day with no cleanup — which satisfies neither. M5 ships without the control.

**M5 → M6.** The semantic-colour mapping: all eleven `type` enum values must resolve onto `mobility` · `stretch` · `strengthen`. **Not a fourth colour.**

**M7 → M0/M1.** Same `image_status: 'rejected'` gap, from the images side, with both citations.

**M8 → M0.** `three`, a GLTF/Draco/Meshopt loader path, and any KTX2 transcoder, with exact pins. M8 cannot add a dependency; vendoring a copy into `public/` to avoid asking is the same rule broken by a different route.

**M8 → M2 + M0.** Any per-region 3D field — camera target, hit-mesh id — is a field on M2's region data and a change to M0's `contracts/anatomy.ts`. **Never a parallel table under `renderer/`.**

**M8 → M6.** Licence attribution required by any shipped asset must appear in `src/content/legal/credits.md`.

**M9 → everyone.** Every out-of-lane change found by the per-branch ownership audit, and every unresolved row of `MODULE-MAP.md` §8's documented-but-absent table.

**Anyone → H.** Anything clinical or regulatory. Including, specifically, the finding that the physiotherapist may never have seen the five rejected images — see `H-CLINICAL-SIGNOFF.md` §3.
