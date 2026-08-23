# Research findings — the evidence behind the design

Desk research, August 2026. Where a number is uncertain it says so. **None of this is legal advice.**

---

## 1. What the incumbents actually put on an exercise

Physitrack, MedBridge, PhysioTools, HEP2go, Rehab My Patient, SimpleSet, Exer, Kemtai.

The converged per-exercise standard is:

1. Plain-language name
2. Demonstration media — video is the market norm, photo/line drawing is the accepted floor
3. Step-by-step written instruction
4. **Dosage block: sets · reps · hold · frequency** — near-universal, and rendered as a discrete block, not buried in prose
5. Body-area grouping
6. A clinician's personal note

**Target muscles is not a standard patient-facing field on any platform verified.** Platforms group by region and condition, not muscle. Including it is an addition, not a gap being closed — worth keeping, but don't assume patients expect it.

**The serious libraries ship multiple modalities.** PhysioTools offers video, photographs *and* line drawings. Rehab My Patient offers HD video, pictures *and* line art. A still-image library is a recognised format in this field, not a downgrade — provided the stills are purpose-made rather than stock.

Closest structural precedent to what we're building is **HEP2go**: link or printout, no login, no tracking. It is also the most criticised platform — but the complaints are almost entirely about clinician-side revenue and monitoring features, not patient experience. That distinction matters, because we aren't selling remote monitoring.

**Age caveat with teeth:** adults 85+ used MedBridge GO at OR 0.33 (95% CI 0.23–0.45) versus ages 18–45. Utilisation did *not* differ among adults under 85. Only 42% of US adults 65+ own a smartphone. A paper fallback for the oldest patients is not optional thinking.

**Clinician critique worth internalising:** Physitrack's demonstration images were criticised for depicting unsafe setups — *"many images show user holding a flimsy chair for support."* Props, surfaces, and support points in our images will be judged.

---

## 2. Adherence — does our design hold up?

**Baseline.** Musculoskeletal home-exercise non-adherence runs 50–65%; low back pain 50–70%. In fall-prevention programmes only 21% (95% CI 15–29) were fully adherent.

**Number of exercises.** Henry et al., *Physical Therapy* 1999 (n=15, ages 67–82, randomised to 2 / 5 / 8 exercises): the 2-exercise group performed significantly better than the 8-exercise group; the 5-exercise group differed from neither. Self-reported compliance showed no significant difference. Physiopedia's synthesis adds that patients prescribed 4+ exercises showed lower compliance than those prescribed ≤2.

> **Verdict.** 4–5 per area is defensible. The unmanaged risk is *total* load — a patient using three areas sees 15 exercises, well outside anything supported. Hence D-009. Caveat: Henry's n=15 is small and measured performance quality, not adherence. No post-2015 trial re-tests exercise count directly.

**Digital vs paper.** Lang et al. 2022 (*Archives of Physiotherapy*, 10 RCTs, 1,117 participants): 7 of 10 favoured adding a digital intervention; 4 of 4 positive at under 6 weeks, weaker beyond. JOSPT 2022 meta-analysis (11 trials, 1,144 participants): adherence favoured digital at intermediate term, SMD 0.53 (95% CI 0.35–0.70); no significant difference short-term; long-term SMD 0.28 (95% CI −0.14 to 0.70), not significant.

> **Verdict.** The digital advantage is real but concentrated in the short-to-intermediate window — which is where most physio episodes sit. Good news for the project.

**Do reminders and tracking help?** The Frontiers 2023 meta-analysis of prognostic factors found **insufficient evidence for therapy-related factors, explicitly including supervision and reminders** (only 5 studies). What did predict adherence:

| Factor | Odds ratio | Evidence quality |
|---|---|---|
| Perceived behavioural control | 1.21 (1.07–1.36) | **High** — the only high-quality finding |
| Self-efficacy | 1.58 (1.27–1.97) | Moderate |
| Motivation | 1.25 (1.12–1.39) | Moderate |
| Prior exercise history | 4.05 (1.10–14.90) | Low, very wide CI |
| Education level | 2.07 (1.51–2.82) | Moderate |

The fall-prevention review also found no link between adherence and intervention efficacy — higher completion didn't produce better outcomes.

> **Verdict on shipping no tracking.** Defensible. The trials where digital won mostly bundled *human remote support*, which tracking alone does not replicate. The strongest lever in high-quality evidence is the patient believing they can perform the exercise correctly. That is won with clarity of instruction and image — exactly what a no-login page can do well.
>
> Honest counter-argument to keep in view: we are choosing the cheaper end of a real effect. If adherence turns out to be the clinic's actual problem, human follow-up beats any feature we could build.

---

## 3. Health literacy — the writing rules

**Reading level.** AMA and NIH recommend web health information at 6th-grade level or below. (CDC declines to set a grade threshold, arguing formulas alone are insufficient — audience knowledge and message design matter more.)

**PEMAT (AHRQ).** The recognised checklist: 24 items for print (17 understandability + 7 actionability). No official pass mark, but literature convention treats ≤70% as poorly understandable/actionable; good material targets 80%+. Directly relevant items:
- **Item 22** — actions presented as manageable, explicit steps
- **Item 23** — provide a tangible tool where it would help
- **Item 26** — use visual aids wherever they make the instruction easier to act on

**CDC Clear Communication Index.** 20 items, 7 domains, passing score 90/100. Item 4: at least one visual conveying the main message. Item 6: active voice.

**Concrete rules (ODPHP Health Literacy Online)** — these go straight into our style guide:
- Sentences 20 words or fewer
- Paragraphs 3 lines or fewer
- Active voice, second person, present tense
- Whole numbers; never make the reader calculate
- Context before new information; if/then construction
- Define any medical term at first use
- "Need to know" before "nice to know"

**What makes an exercise instruction followable at home:** numbered explicit steps, one action each · written *and* visual together · an explicit stop condition (pain guidance is a top-3 adherence barrier) · graduated progression to build self-efficacy · dosage as a scannable block.

---

## 4. UAE regulatory position

**Desk research on published regulator documents. Not legal advice. The clinic's Medical Director is the decision-maker — that is the regulators' own stated position.**

**Telehealth: out of scope.** DHA's *Standards for Telehealth Services* (v4, 2023) defines telehealth as ICT used for diagnosis, treatment or prevention involving an *identified* patient, requiring identification, consent, and health-record documentation. A static instruction page with no consultation and no identified patient does not meet that. DHA has published no explicit carve-out saying so, but the definitional gap is wide.

**Health data localisation — Federal Law No. 2 of 2019.** Health data relating to services provided in the UAE may not be stored or transferred outside the UAE without approval (Art. 13); 25-year retention; fines AED 100,000–1,000,000, with localisation breaches AED 500,000–700,000. With no login and no patient data this does not bite — **but the definition is broad, and analytics, form submissions, error logs, and any booking widget are exactly where it quietly starts to.** UAE PDPL (Decree-Law 45/2021) separately covers any personal data including IP addresses and analytics identifiers, so even a no-login site needs a privacy notice.

**Advertising is MOHAP's jurisdiction, not DHA's.** DHA's Sheryan portal states plainly that health advertisement matters fall under MOHAP. MOHAP's medical advertisement licensing (Cabinet Resolution 7/2007; Federal Law 8/2019) **explicitly names websites** as a regulated medium. Indicative fees, secondary source, verify directly: AED 100 application; website/social AED 1,000/month or AED 3,000/year; charged per language.

**DHA content rules that apply to our copy by analogy** (*Standards for Medical Advertisement Content*, v1.1 2022):
- Facilities may publish public-health information but it must be evidence-based wherever possible
- Outcome claims must be substantiated and must always state associated risks
- Before/after images require a variability statement at the same font size
- The Medical Director is accountable and must approve content
- Banned: "unique", "one of a kind", "the best", "exclusive", "safest", guarantees, "miraculous"

**If the clinic sits in Dubai Healthcare City**, DHCR's Advertisement Policy is stricter and explicitly covers websites *and* "education" — submission via MASAAR at least 14 working days before publishing.

### The uncertain part, stated plainly

**No regulator document found draws a clean line between "patient education material" and "medical advertisement."** DHCR's definition explicitly sweeps in education. Agency commentary suggests purely educational content with no outcome claims and no sales CTA is low-risk and typically doesn't need approval — but that is commentary, not a regulator statement.

Practical read: content that is genuinely instructional, makes no outcome claims, names no products, and does not solicit bookings is defensible as education. **The moment it carries a "Book your assessment" button, an outcome claim, or before/after imagery, it becomes advertisement.** Keep all three off the site.

Also unverified: whether patient education material needs clinical pre-approval (found no such requirement, which is absence of evidence, not evidence of absence); exact penalty amounts; any binding Arabic-language requirement.

**Action:** the clinic's Medical Director should confirm the classification, and a direct query to DHA Health Regulation (800342 / regulation@dha.gov.ae) would settle it cheaply.

### Disclaimer must contain
Informational/educational only, not a substitute for diagnosis or treatment · exercises are prescribed individually and this is a reminder of what your physiotherapist already prescribed, not a starting point without assessment · stop and contact the clinic on new, sharp or increasing pain, dizziness, numbness or breathlessness · emergency clause (998/999) · limitation of applicability · limitation of liability · clinic legal name, DHA facility licence number, supervising physiotherapist's licence, date of last content review · copyright.

---

## 5. Imagery

**The one controlled study that matters.** *Patient Education and Counseling* 2019, n=204, randomised across cartoon / anatomical drawing / CT scan / text-only:
- Illustrated leaflets improved correct identification of treatment (p=0.019)
- **Only the simplified illustration significantly beat text alone** (p=0.018)
- Anatomical drawings and CT scans gave **no comprehension advantage over text**
- Participants *rated* the anatomical drawing more helpful while the simplified one actually produced better comprehension

> Simplification beats realism for comprehension. An anatomy inset showing target muscles will feel more credible to patients without helping them perform the exercise. Keep it as a trust signal if wanted; don't mistake it for a comprehension aid.

**Start/end image pairs and muscle highlighting** — could not verify that any major incumbent standardises on either as a patient-facing convention. Treat both as choices we'd be introducing, and put them to the clinician rather than assuming a field standard exists.

**Cultural fit — Arab patient preferences.** Karger, *Medical Principles and Practice*, "Health Education Materials for Arab Patients" (questionnaire n=17, three focus groups n=16):
- 100% preferred photographs over clipart
- 76% preferred Arabic-only over bilingual
- 82% chose 16-point font
- Requested shorter sentences and minimal text with many photographs
- Focus groups stressed culturally feasible advice, explicitly including women's constraints on when and where they can exercise

**Read this carefully — it partly contradicts the comprehension study.** Patients *prefer* photographs; the controlled study found simplified illustration *comprehends* better. Preference and comprehension diverge, as they did within the illustration study itself. Small sample, not UAE-specific, and the 76%-Arabic-only finding should not be read as "ship Arabic only" for Dubai's heavily expatriate population.

**Modesty in demonstration imagery: genuine evidence gap.** Published guidance covers clinical encounters — practitioner gender concordance, modesty during examination, chaperones — not demonstration images. In the absence of evidence, defensible choices:
- Full-coverage athletic clothing on every figure regardless of gender
- Gender-matched demonstration where the exercise involves trunk, hip, pelvic floor or chest
- Home settings, never mixed-gender or public-gym settings
- **A stylised figure or line drawing sidesteps the question entirely** — and the comprehension evidence points the same way, which is unusually convenient

---

## Sources

Physitrack · MedBridge GO · PhysioTools · HEP2go · Rehab My Patient · SimpleSet · Exer Health · Kemtai
Henry et al., *Physical Therapy* 1999 · Physiopedia, Adherence to Home Exercise Programs · Lang et al. 2022, *Archives of Physiotherapy* · JOSPT 2022 digital rehab meta-analysis · Frontiers in Sports and Active Living 2023 prognostic factors meta-analysis
AHRQ PEMAT · CDC Clear Communication Index · ODPHP Health Literacy Online · JMIR Cancer 2022
DHA Standards for Telehealth Services v4 · DHA Standards for Medical Advertisement Content v1.1 · DHA Health Regulation Sector service catalogue · DHCR Advertisement Policy · UAE Federal Law 2/2019 · UAE PDPL Decree-Law 45/2021
*Patient Education and Counseling* 2019, styles of medical illustration · Karger, *Medical Principles and Practice*, Health Education Materials for Arab Patients
