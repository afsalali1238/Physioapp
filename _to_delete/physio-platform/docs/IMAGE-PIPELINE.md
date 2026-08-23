# Image Pipeline

**Supersedes the AI-generation plan in the previous `IMAGE-BRIEF.md`.** Two independent research passes reached the same conclusion by different routes, and it is not the plan we started with.

---

## The decision

**Licence a commercial illustration library. Do not generate the demonstration images with AI.**

Order of preference:

1. **WorkoutLabs** — the only source that is physio-relevant, visually consistent and cleanly licensed at once. Has a dedicated **Rehab & Physical Therapy** collection plus senior, office and prenatal sets. 679 core exercises + 146 yoga. **SVG vector with alpha**, male and female variants, colour and B&W, structured metadata (muscle groups, equipment, step text). Already licensed by hospitals, so the clinical use case is precedented.
   - ~$25/illustration perpetual with volume discounts from 15+ → ~$2,500 for 100
   - **Full library perpetual $3,500+** — buy this instead. The 100-image à la carte price is close enough that the full library is the obvious move, and it permanently kills the marginal cost of every future exercise she adds.
2. **GymVisual** — under $0.75/illustration after 10 in cart. **~$75 for 100.** Larger catalogue (8,000+), slightly more variation in style, more gym-oriented. Absurd value if coverage is adequate.
3. **MoveKit** — $299 for a 412-exercise pack, uniform 3D mannequin style, commercial licence bundled.

**Step 0, before spending anything: take the finished 100-item list and check coverage against WorkoutLabs' rehab/PT category and GymVisual's catalogue.** One hour of work. If coverage is 85% or better, buy the library, commission the gaps from a single vector illustrator matched to that style, and stop. Every other route below costs 20–60 hours to beat that.

---

## Why not AI generation

Three findings, in order of weight.

**1. Gemini cannot constrain pose, and the tool that could was retired.** `imagen-3.0-capability-001` — Google's controlled-customisation model with edge and scribble conditioning — was **retired 30 June 2026**. The suggested migration target has no control-image input and no mask input. Gemini image models also have **no seed parameter**, so generations are not reproducible.

Feeding an OpenPose skeleton to Nano Banana works *semantically* — the model reads it as a diagram and reasons about it. It is an instruction, not a constraint. An Autodesk Platform Services test in 2026 put it directly: Gemini produced "strong overall aesthetics" but **altered geometry and reinterpreted spatial proportions**, while depth-ControlNet models preserved them faithfully. Their conclusion — *"'better' without depth map constraints still means the model is free to reimagine your floor plan."*

**2. That is a clinical problem, not an aesthetic one.** A model that reimagines proportions will hand you a levator scapulae stretch at the wrong rotation angle, or a clamshell with the wrong hip position. A patient copies it and does the exercise wrong. In a patient-facing clinical product that is a safety and liability issue. Every one of the 100 would need physiotherapist review of anatomical accuracy — at which point licensing is cheaper and correct by construction.

**3. The economics are not close.** GymVisual at ~$75 or MoveKit at $299 undercut every custom route by orders of magnitude, with consistency guaranteed and commercial licences included.

**Where AI generation is still fine:** the anatomy inset showing target muscles, UI illustration, and marketing. Not the demonstrations.

---

## Why not the free datasets

Checked thoroughly. All fail, for two independent reasons.

**Licensing.** `yuhonas/free-exercise-db` (873 exercises, all with images, "Unlicense" badge) contains **professional branded studio photography with visible third-party trademarks on the model's apparel and mat**. Its upstream source, `wrkout/exercises.json`, sells a *separate* dataset "which can be used in commercial projects" — an admission that the free one is not. Two GitHub issues asking exactly this went unanswered. The Unlicense plausibly covers the JSON structuring; it cannot launder photographs the repo owner never held rights to. **Do not ship these.**

The rest: `wger` is well-governed but per-image licensed (CC-BY-SA/CC0/CC-BY/ODbL, must be audited file by file) and visually inconsistent — different people, rooms and cameras. Everkinetic is CC BY-SA, so ShareAlike infects your adaptations. Kaggle exercise datasets are ML scrapes with self-asserted licences the uploader does not hold.

**Coverage.** Ran the actual rehab movement list against the 873-exercise corpus:

| Movement | Matches |
|---|---|
| chin tucks · pendulum swings · clamshells · heel slides · nerve glides · ankle alphabet · plantar fascia stretch · scapular retraction · bird dog · wall slides · straight leg raise · quad sets · rotator cuff · resistance band | **0 each** |

Every rehab-specific movement returns zero. The corpus is 581 strength / 123 stretching / 61 plyometrics / rest gym work. The stretching category genuinely overlaps — roughly 35–45% of a stretching library is conceptually covered. The therapeutic exercise half is at **0%**. Blended: ~25–30% coverage at best, and unusable anyway on licensing.

**There is no open physiotherapy image library.** GitHub's entire physio ecosystem is computer-vision research — nothing above 31 stars, no content libraries. The one near-perfect asset set is **PhysiotherapyExercises.com** (1,500+ exercises, 5,000+ drawings by Paul Pattie, built with NSW Department of Health, free for clinicians, 13 languages) — but it is free *as a tool*, with no reuse licence found. **Worth emailing them directly.** Assume no by default.

---

## What we should use for free

These are clean and solve adjacent problems:

| Asset | Licence | Use |
|---|---|---|
| **Servier Medical Art** | **CC BY 4.0** — upgraded from 3.0, explicitly permits commercial use in apps | Anatomy diagrams for the "which muscle does this work" layer |
| **Health Icons** | **CC0**, ~1,368 SVG, no attribution | UI chrome, body-region navigation icons |

Servier's required credit, one line on the credits page: *"Images provided by Servier Medical Art (https://smart.servier.com/), licensed under CC BY 4.0."* Do not use their trademarks, and do not market the result as a standalone image collection — neither applies here.

---

## Fallback if the budget is zero: render, don't generate

Not AI. A posed 3D figure, rendered.

**Why it wins over AI:** consistency is perfect *by construction* rather than coaxed, poses are exact rather than approximated, you own the assets, and re-rendering at a new angle or palette is free forever.

**Licensing is better than most assume — 2D renders are treated far more permissively than the 3D models:**

| Tool | Render licence | Skill | Time/pose |
|---|---|---|---|
| **PoseMy.Art** | Renders explicitly cleared for commercial use; 3D models prohibited (irrelevant — you never ship the model) | Low | 3–8 min |
| **Blender + MPFB2** | MakeHuman exports are **CC0** | High | 15–30 min |
| **Daz Studio** | General Licence covers commercial 2D renders | Medium | 10–20 min |
| **MB-Lab** | Models AGPL, **2D renders explicitly exempt** | High | — |
| **Mixamo** | ❌ Wrong tool — canned animations, not arbitrary posing |

**PoseMy.Art is the fastest on-ramp** and the sleeper finding: browser-based, 6,300+ premade poses, 2,400+ mocap animations you can scrub and pause, IK/FK posing, and it **exports Depth, OpenPose, Canny and Normals directly**. Many physio positions already exist in its preset library.

**Realistic effort:** 2–5 days building the rig, lighting and camera presets, then 5–15 min per pose. **Roughly 1.5–2 weeks for 100 images.** No published workflow exists for consistent exercise illustration sets — you would be building it. That is a real cost, stated honestly.

**Pure Blender NPR (toon/Freestyle) with no AI at all** is arguably the technically correct answer for flat simplified instructional illustration: perfect consistency, resolution-independent, zero AI risk. 30–65 hours.

---

## If you generate anyway — the only defensible pipeline

Not recommended, documented for completeness. Gemini alone is not sufficient; the pose must be constrained structurally.

1. Lock the style with a single hero illustration. Nano Banana Pro, iterating via the Interactions API. Freeze it. 4–6 flat colours maximum.
2. Build a reference set of 4–6 images in that style. **Do not exceed 6** — quality degrades past that as the model averages conflicting details. Character-reference budget is 4 (Google's docs and DeepMind's page disagree; assume 4).
3. **Train a style LoRA** on 15–20 derived images. ~30–40 min, ~$2–5 on Replicate `fast-flux-trainer`. This is what stops drift at image 100, and it is a capability Gemini structurally does not have.
4. **Pose every exercise in PoseMy.Art.** One fixed camera FOV, one fixed light rig, never changed — camera consistency is half of visual consistency. Export **Depth** (primary) and **OpenPose** (secondary).
5. **Generate in ComfyUI**: Qwen-Image or SDXL + Image Union ControlNet LoRA in depth mode at high strength, OpenPose as a second ControlNet at lower strength, style LoRA at 0.9–1.0. Fixed seed per exercise. Batch from a CSV.
6. Optional Nano Banana Pro upres pass — **with a hard gate**: overlay the output on the depth map and reject anything where joint angles moved.
7. **QC in contact sheets of 10, never one at a time.** Drift is only visible in sequence.

~20–35 hours, under $50 compute. Depth beats OpenPose beats canny for anatomical precision. Hands remain poorly handled under any control type — relevant for wrist and hand exercises.

**On Antigravity:** it is an agentic IDE where the agent decides when to generate, with unpublished image quotas and no batch primitive. Fine for prototyping prompts and eyeballing style. Not where you run a 100-image batch — use the Gemini Batch API (50% discount) or ComfyUI, where you get retries, deterministic filenames and a reproducible graph. Antigravity is a good place to *write* that pipeline script.

---

## Whatever the source: the delivery contract

These hold regardless of which route is chosen.

- One file per `image_id`, named exactly: `src/assets/images/ex-neck-02.svg` (or `.png`)
- **Prefer SVG.** WorkoutLabs and GymVisual both ship vector. Vector means one file at every screen size and a palette you can restyle to match the brand.
- Raster fallback: minimum 1200px long edge, 4:3, transparent or flat background
- Never commit resized derivatives — `astro:assets` handles it
- Every image needs `image_alt_en` describing the body position, not "a person exercising"
- Track state in the sheet: `pending` → `licensed`/`rendered` → `approved`. Only `approved` ships.
- **The physiotherapist approves every image for anatomical accuracy before it goes live.** Licensed stock is not automatically correct for the specific instruction beside it.

## Review gate

Each image passes all six or goes back:

1. Is the joint angle unambiguous? Could a patient reproduce it from the picture alone?
2. Does the depicted position match the written instruction beside it, exactly?
3. Is any prop stable and safe to lean on? *(A published review criticised Physitrack's imagery for showing patients bracing on flimsy chairs. Clinicians judge whether the setup is replicable, not whether it looks nice.)*
4. Consistent with the rest of the set — same figure treatment, palette, background, camera height?
5. Clothing full-coverage, setting domestic rather than gym?
6. Does it read at 400px wide on a phone?
