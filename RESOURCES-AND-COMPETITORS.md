# Resources & Competitor Landscape

**For:** the unified anatomy-explorer + patient exercise library (UAE clinic, patient-facing, static Astro, by-body-area).
**Compiled:** 2026-08-27. **Author:** build side (Afsal). Not clinical content — no exercise instructions or clinician names here.

## How to read this

You said: *don't worry about licensing — if a resource is good enough, we'll build our own.* So this report is scored first on **quality and rebuild-ability**, not on whether a license lets you copy directly. But every entry still carries a one-line **license flag**, for two reasons:

1. Your own `anatomy-explorer/ASSET-PIPELINE.md` refuses to ship any asset without license metadata and fails the build on missing license. So even a clean-room rebuild needs the provenance recorded.
2. The license decides *whether you even need to rebuild*. A CC0 / public-domain asset you can ship as-is; a CC BY asset you can ship with a credit line; only viral (share-alike) or non-commercial assets actually force a from-scratch rebuild. Knowing which is which saves you work.

Everything is mapped to the three delivery tiers already defined in your asset pipeline: **(1) fallback SVG body map → (2) full-body GLB locator → (3) regional GLBs**, plus the two layers your pipeline doesn't cover: the **exercise content** itself and the **patient-app UX**.

> **Accuracy note:** this is reconstructed from the research trail in the prior session (it was never saved). The asset facts and platform feature sets are stable and reliable. **Pricing and exact language counts drift** — treat every dollar figure and "supports language X" claim below as *approximate, verify before quoting to anyone*. Several vendor pages (Servier, BioDigital, PoseMy.Art, some Capterra) failed to fetch during research, so their license lines are flagged "verify."

---

## 1. Bottom line — the shortlist

| Your need | Use this | Why | License reality |
|---|---|---|---|
| **Full-body base mesh** (locator tier 2) | **MakeHuman / MPFB2** | Clean, riggable topology; export straight to GLB; you control detail so web-optimizing is trivial | **CC0 output** — ship as-is, no rebuild needed |
| **Labeled internal anatomy** (regional tier 3) | **Z-Anatomy** (primary), **OpenAnatomy** (accuracy check), **NIH 3D** (individual bones/organs) | Z-Anatomy is the best *complete labeled* open atlas; OpenAnatomy is real-scan accurate; NIH 3D has clean single parts | Z-Anatomy **CC BY-SA** (viral → clean-room if you don't want SA); NIH 3D has **CC0** items |
| **SVG body map** (fallback tier 1) | **Servier Medical Art** diagrams + a **react-body-highlighter**–style interaction model + **healthicons** for UI | Servier is clean, recolorable medical line art; the highlighter pattern is the exact click-a-region UX you need | Servier **CC BY 4.0**; healthicons **CC0/MIT**; highlighter libs **MIT** |
| **Exercise data scaffold** (schema + seed) | **free-exercise-db** (structure/seed) + **wger** (data model, multilingual pattern) | Gets your JSON shape and i18n approach right fast; NOT your clinical content | free-exercise-db **public domain**; wger data **CC BY-SA** |
| **Which exercises/params a physio library must cover** (reference only) | **PhysiotherapyExercises.com**, **Physitrack**, **Physiotec** | The most complete physio-specific coverage to benchmark against — as a checklist, not a copy source | Proprietary — reference only |
| **Patient-app UX to imitate** | **PhysiApp** (Physitrack) + **Rehab My Patient** | PhysiApp = offline + params + adherence done right; RMP = body-chart-first navigation, closest to your by-area model | Proprietary — imitate patterns, not assets |
| **Exercise pose/illustration reference** | **PoseMy.Art** (free) or **Daz 3D** renders | Generate consistent house-style figure poses for your own illustrations | PoseMy.Art renders (verify ToS); Daz **2D renders OK**, mesh needs Interactive License |

**One-line strategy:** MakeHuman for the body you show, Z-Anatomy/OpenAnatomy for the anatomy you label, Servier + healthicons for the flat UI, free-exercise-db + wger to shape your data — and PhysiApp + Rehab My Patient as the UX bar to clear.

---

## 2. 3D anatomy models (regional tier)

| Resource | What it is | Quality | Format | License |
|---|---|---|---|---|
| **Z-Anatomy** | Open-source whole-body labeled 3D atlas, built in Blender, derived from BodyParts3D | **Best open option.** Full body, thousands of named/selectable structures, actively maintained | Blender native → export glTF/GLB | **CC BY-SA 4.0** (share-alike is viral) |
| **BodyParts3D** (DBCLS, Japan) | The anatomical parts database Z-Anatomy was built on; FMA-linked per-part meshes | Comprehensive coverage but **dated (2011) and rough** meshes; needs heavy cleanup | OBJ / STL | **CC BY-SA 2.1 Japan** |
| **OpenAnatomy.org** (Brigham/SPL, 3D Slicer) | Atlases segmented from **real patient scans** (knee, head & neck, abdomen, brain, etc.) | **Highest clinical accuracy**, but per-scan specific and uneven coverage | glTF / OBJ via Slicer | Custom **SPL license**, free for research/education — verify commercial terms |
| **NIH 3D** (formerly NIH 3D Print Exchange) | Large mixed library of anatomical models | Variable; good for grabbing **one clean bone/organ** at a time | STL / GLB | **Mixed — many CC0**, some CC BY. Filter for CC0 |
| **AnatomyTOOL.org / Open3Dmodel** | Leiden-hosted aggregator of open anatomy teaching models | Good curation, uneven per-model quality | Mixed | Mixed **CC BY-SA**, some **NC** (non-commercial — avoid for a clinic site) |
| **BioDigital Human** | Commercial best-in-class interactive anatomy | **The gold standard** for what "great" feels like | Embed/SaaS | **Commercial** — reference only, paid to embed |

**Reading it:** For a patient-facing product, photoreal internal accuracy matters less than *clear, correctly-oriented regions* (your pipeline's visual-review checklist says exactly this — "no misleadingly precise internal anatomy"). That argues for **Z-Anatomy as your regional source**, decimated hard, with a clinician confirming orientation. Pull **OpenAnatomy** only where you need a specific joint to be genuinely accurate (e.g., a knee explainer), and **NIH 3D CC0** parts when you want one clean bone without the SA obligation.

**On the share-alike trap:** Z-Anatomy and BodyParts3D are CC BY-**SA**. If you ship a mesh *derived* from them, share-alike attaches to that mesh. Since you're rebuilding anyway, the clean path is: use them as *visual reference*, model your own meshes on your MakeHuman base, and you owe nothing. If you'd rather not rebuild, ship them with attribution + accept SA on those specific assets.

---

## 3. Full-body base mesh & body map (locator + fallback tiers)

| Resource | Role | Why it's good | License |
|---|---|---|---|
| **MakeHuman + MPFB2** (Blender plugin) | Generate the **full-body figure** for the locator, and the source silhouette for the SVG map | Parametric (any body type), clean quad topology, riggable, and you dial the detail so GLB optimization is easy | **CC0** on output meshes (code is AGPL but does not infect the mesh) — cleanest license in this whole report |
| **Servier Medical Art** | Flat **body diagrams / regional illustrations** for the fallback SVG map and handouts | 3,000+ professional medical illustrations, consistent style, trivially recolorable to your palette | **CC BY 4.0** (historically 3.0 France — verify current) → ship with a credit line |
| **react-body-highlighter** (and similar MIT body-map libs) | The **interaction pattern** for click-a-region → filter exercises | Exactly your by-body-area UX; front/back muscle SVGs with hit regions already modeled | **MIT** |
| **healthicons.org** | UI iconography (body parts, medical, actions) | Clean, consistent, genuinely free-of-strings | **CC0 / MIT** (public domain) |

**Reading it:** This is your cheapest, cleanest tier. A **MakeHuman CC0 base** for the locator means your single most-loaded 3D asset has *zero* licensing friction — worth building around. For the fallback SVG map, trace a MakeHuman front/back render or adapt Servier diagrams, and copy the *interaction model* (not the code, though MIT lets you) from react-body-highlighter. healthicons covers the small UI glyphs so you're not drawing those.

---

## 4. Exercise content & media

| Resource | Coverage | Quality | Best use | License |
|---|---|---|---|---|
| **free-exercise-db** (yuhonas, GitHub) | ~870 exercises, JSON + images | Clean structured data; **gym-weighted**, thin on rehab/stretch | **Seed your JSON schema** and bootstrap the data shape | **Public domain (Unlicense)** — use freely |
| **wger** | Community exercise DB, multilingual | Decent; more fitness than clinical | Learn the **data model + i18n / translation pattern** (relevant for Arabic) | Software **AGPLv3**; exercise data **CC BY-SA 4.0** |
| **everkinetic** | Illustrated exercise dataset | Nice SVG-style illustrations, gym-focused | Illustration reference | Open — **verify exact license** |
| **PhysiotherapyExercises.com** | **Physio-specific**, very broad (built by physiotherapists) | **The best physio coverage** of any accessible source | **Reference checklist** for which movements + parameters a real physio library needs | Proprietary — free to *prescribe from*, not to bulk-copy → reference only |
| **Physitrack / Physiotec / MedBridge libraries** | 5,000+ each, HD video | Top production value | Benchmark for video/param completeness | Proprietary — reference only |

**Reading it — and the guardrail:** Use free-exercise-db + wger to get your **structure** right (fields, IDs, translations), and PhysiotherapyExercises.com/Physitrack as a **coverage checklist**. But per your project rules, the **actual clinical content is authored by your physiotherapist in the sheet** — never seed real exercise text/params from these sources or invent it. These tell you *what shape the library should be and which movements to ask your clinician to cover*, not what the clinical copy says.

---

## 5. Medical illustration & icons

- **Servier Medical Art** (smart.servier.com) — 3,000+ medical illustrations, PowerPoint + SVG, **CC BY 4.0** (verify — historically CC BY 3.0 France). The single best free source for anatomically clean, restyleable illustration. Ideal for body diagrams, handouts, and the SVG map.
- **healthicons.org** — public-domain (**CC0/MIT**) health icon set, includes body parts and clinical glyphs. Zero-friction UI icons.
- **Avoid for reuse:** BioRender (proprietary, subscription, no redistribution), and any Wikimedia anatomy image without checking its individual license (they vary from CC0 to CC BY-SA to non-free).

---

## 6. Competitor HEP platforms — what to learn from each

These are the home-exercise-program (HEP) platforms your product sits next to. None are open, so they're **feature/UX references**. What matters is *which idea to take from each*.

| Platform | Known for | The idea worth taking | Pricing (approx — verify) |
|---|---|---|---|
| **Physitrack / PhysiApp** | Market leader; 5,000+ HD video exercises; **PhysiApp** patient app with **offline access**, adherence tracking, telehealth, PROMs; ~20+ languages **incl. Arabic** | The **patient app done right**: offline, clear params (sets/reps/hold/rest/frequency), adherence loop | ~$10–20 / clinician / mo |
| **Rehab My Patient** | UK; **body-chart-first** navigation (click a body part → exercises); ~13k exercises; strong visuals | **Closest to your by-body-area model** — study its region navigation | ~$10–30 / user / mo |
| **Physiotec (Wibbi)** | Large HD video + **3D anatomy**, body-chart search; praised for quality | Combining 3D anatomy *with* exercise prescription — your exact fusion | Enterprise / quote |
| **HEP2go** | The **free/cheap workhorse**; huge illustrated (line-drawing) library; print/PDF handouts | Proof that a **no-frills illustrated library + printable handout** is enough for many clinicians | Free tier; pro ~$3–10 / mo |
| **MedBridge** | US; HEP **+ clinician CEU education + patient education**; MedBridge GO patient app | Bundling patient education *alongside* exercises | ~$250–600 / provider / yr |
| **SimpleSet** | Builder with drawing/annotation tools; image-based | In-app **annotation** of images for custom cues | ~$15–30 / mo |
| **Rehab Guru** | Affordable, body-map driven, mobile-first | Lightweight body-map UX on mobile | ~$10–20 / mo |
| **WebPT HEP** | Bundled with WebPT EMR (US) | HEP as a feature of the practice system | Bundled |
| **Exer Health** | **AI motion tracking** via phone camera | Camera-based rep counting / form feedback (future bet) | Quote |
| **PtEverywhere / TheraNow** | Practice platform + HEP + telehealth/RTM | HEP inside a broader care-delivery flow | Quote |
| **Jane App / Cliniko** | Practice-management/EMR with built-in basic exercise/HEP | Baseline "good enough" library bundled into PM software | Add-on |

**The pattern:** the leaders (Physitrack, MedBridge, Physiotec) win on **video library size + a polished patient app**; the challengers (HEP2go, Rehab Guru) win on **cost + simplicity**; Rehab My Patient wins on **body-chart navigation**. Your product is a different shape — a *free, no-login, by-body-area, patient-facing library* — so you're not competing on library size. You're competing on **clarity, load speed, and localization**.

### The UAE / Arabic differentiator

Almost all of these are English-first. **Physitrack is the notable one with Arabic support**; the US tools (MedBridge, WebPT, HEP2go) are effectively English-only. For a UAE clinic, an **Arabic-first, right-to-left, culturally-localized** patient library is a real gap none of the incumbents fill well. That — plus your zero-login, one-link, fast-loading static delivery — is the honest reason your in-house build deserves to exist rather than just buying Physitrack seats. Build Arabic/RTL in from the start, not as a bolt-on.

---

## 7. Recommended build stack, per tier

**Tier 1 — fallback SVG body map.** Trace a MakeHuman front/back render (or adapt Servier diagrams) into a semantic SVG with named regions. Model the click-to-filter interaction on react-body-highlighter (MIT — you can use it directly). healthicons for the surrounding UI. *All clean licenses; ships immediately.*

**Tier 2 — full-body GLB locator.** Generate the figure in **MakeHuman/MPFB2 (CC0)**, decimate + Draco/Meshopt per your optimization checklist, export GLB. This keeps your heaviest, most-loaded asset license-free.

**Tier 3 — regional GLBs.** Rebuild region models using **Z-Anatomy** as visual reference (avoids the SA obligation), reach for **OpenAnatomy** where a joint must be genuinely accurate, and **NIH 3D CC0** parts for individual bones/organs. Clinician verifies orientation and region boundaries before publish, exactly as your pipeline requires.

**Exercise content layer.** Shape the data with **free-exercise-db (public domain)** + **wger**'s model and translation approach. Use **PhysiotherapyExercises.com** / **Physitrack** as a *coverage checklist* to hand your physiotherapist. The clinical text and parameters stay clinician-authored in the sheet — `status: draft`, empty `reviewed_by`, per your governance.

**Patient-app UX.** Set the bar at **PhysiApp** (offline, clean parameter display, adherence) and borrow **Rehab My Patient**'s body-chart-first navigation, since that mirrors your by-area organization.

---

## 8. Licensing quick-reference (clean-room map)

Even though you'll rebuild what's worth rebuilding, here's what each source *actually* obligates — so you only rebuild what you must:

| License type | Assets here | What it means for you |
|---|---|---|
| **CC0 / Public domain** | MakeHuman output, healthicons, free-exercise-db, some NIH 3D | **Ship as-is.** No attribution, no rebuild. Prefer these. |
| **CC BY** | Servier Medical Art, some NIH 3D | Ship with a credit line. No rebuild needed. |
| **CC BY-SA (viral)** | Z-Anatomy, BodyParts3D, wger data, some AnatomyTOOL | If you ship a derivative, share-alike attaches. **Rebuild/clean-room to avoid**, or accept SA on that asset. |
| **CC BY-NC (non-commercial)** | some AnatomyTOOL / Open3Dmodel items | **Avoid** — a clinic site is commercial. |
| **Custom education/research** | OpenAnatomy (SPL) | Fine for reference/education; verify before commercial ship. |
| **Proprietary** | Physitrack, MedBridge, Physiotec, RMP, HEP2go, PhysiotherapyExercises.com, BioDigital, PhysiApp | **Reference only** — imitate patterns, never lift assets. |
| **Special (2D vs 3D)** | Daz 3D | 2D renders OK commercially; shipping the mesh needs the Interactive License. |

---

## 9. What to re-verify before relying on this

- **All pricing figures** — they change; confirm on each vendor's current page before quoting.
- **Servier Medical Art license version** (3.0 vs 4.0) and **PoseMy.Art ToS** on commercial render use — both pages failed to fetch during research.
- **everkinetic's exact license.**
- **Physitrack's current Arabic support + full language list** — the differentiator argument leans on it, so confirm it directly.
- **OpenAnatomy commercial terms** — the SPL license is education-friendly but worth reading before shipping on a commercial clinic site.
