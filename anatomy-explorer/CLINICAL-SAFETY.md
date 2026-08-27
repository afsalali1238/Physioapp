# Unified Clinical Safety and Governance

## Safety classification

The app is patient education and navigation to clinician-approved general exercise information. It does not assess, diagnose, triage by probability, or prescribe.

## Clinical authority

The physiotherapist owns exercise wording, dosage, target muscles, safety lines, map labels, education wording, and mappings. The Medical Director approves jurisdiction-sensitive emergency and disclaimer wording. Builders may not invent or improve clinical text.

Builders and AI tools may produce structured drafts to accelerate review. Drafts must be source-linked
where possible, clearly identified, and excluded from patient routes. The clinician remains the only
authority who can approve exercise instructions, dosage, safety wording, target muscles, anatomy
education, or movement fidelity. No clinician name or review date may be pre-filled.

## Red-flag interruption

The safety gate interrupts before exercise handoff. Rules are explicit data, not LLM output. The stop screen uses the approved short response:

> This symptom needs urgent medical assessment. Do not use this exercise guide for this problem. Contact emergency services or urgent medical care now, depending on severity.

The clinic must approve final jurisdiction-specific wording and action links before launch.

## Exercise safety

Exercise pages retain the clinician’s safety line. The app must not alter dosage or recommend a different exercise because of map selections.

Images and animations are clinical communication. A polished but incorrect pose is a safety failure.
Review setup, direction, range, return, side, and equipment against the approved text. If media and
text disagree, reject the media; never silently change the text to match.

## Prohibited language

No diagnosis names, causal claims, certainty claims, “cure,” “fix,” “guaranteed,” superlatives, promotional claims, booking CTAs, or language implying the app interpreted the patient. Legal disclaimers may negate prohibited terms under a separate legal-rule set.

## Interpretation guardrails

Precise taps, anatomical hotspots, scenario lists, and exercise links can feel like a diagnosis.
Every result must state: the selected point is a general location guide; the information does not
identify the cause of an individual's discomfort; and exercise links are general clinician-approved
library content, not a new prescription. Never personalize scenario order, confidence, or exercise
ranking from user selections.

## Privacy

No login, accounts, analytics, tracking, server-side symptom history, free-text health diary, or third-party telemetry. Local storage is limited to disclosed UI preferences and completion marks. Locator selections are ephemeral.

## Review workflow

```text
Draft → schema → compliance → image/anatomy checks → clinician review
→ Medical Director approval → published → scheduled review → retired
```

Retirement preserves IDs and history. Missing review metadata blocks clinical publication.
