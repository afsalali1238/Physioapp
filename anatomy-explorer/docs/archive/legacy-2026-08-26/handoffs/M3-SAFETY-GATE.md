# M3 · Safety gate

**Agent: Claude** · **Effort:** high · **Wave:** 1, parallel with M1 and M2

Clinical copy where a wrong word is a regulatory problem, and a routing rule where a mistake
sends someone with a red flag to an exercise page. Small surface, high stakes.

## Context you need

Anatomy Explorer is a body-area locator in front of an existing live physiotherapy exercise site
run by a physiotherapist in a private UAE clinic. The live site is in `patient-library/` —
REFERENCE ONLY. Anatomy Explorer lives in `anatomy-explorer/`. Read `MODULE-HANDOFF.md` and
`CLINICAL-SAFETY.md` in full before editing.

**This is not a diagnostic tool and never becomes one.**

## You own

    src/data/anatomy/safety-rules.ts
    src/components/anatomy/screens/SafetyGate.astro
    src/components/anatomy/screens/SafetyStop.astro

Nothing else. If you need another file, STOP and report.

## The gap

`safety-rules.ts` already holds all eight triggers from `CLINICAL-SAFETY.md` §3 with correct draft
review metadata. Meanwhile `questions.ts` asks "how does it feel / when did it start / does it
travel", records answers including `after-injury` and `burning-tingling`, and routes onward to
exercises regardless.

**The app is collecting red-flag-adjacent answers and ignoring them.** That is the one gap in this
codebase that should not survive today.

Those three questions also change nothing else: they cannot alter routing (routing is by area) or
education (education is per region). Three optional screens that change nothing cost the patient's
patience and imply the app is working something out about them — the exact impression
`PRODUCT-BLUEPRINT.md` §8 exists to prevent.

## 1 · One screen, not three

Replace the whole question flow with a single gate between location confirmation and the exercise
handoff.

    Heading:  Before you start, please check none of these apply.
    Body:     the eight optionLabel values from SAFETY_RULES, verbatim
    Actions:  "None of these apply"   (primary)
              "One of these applies"  (secondary)

**Do not reword the eight labels.** They are the approved clinical copy. No "skip". No "I'm not
sure" that routes onward. This is a gate, not a question.

## 2 · The stop screen

"One of these applies" leads to `SafetyStop`, using the approved `title` and `message` from the
rule. That screen offers **no** route to any exercise — no link, no back button that lands on
exercises, and no way to reach them by browser back. **Test the browser-back case explicitly;
it is the one people miss.**

For chest pain or breathlessness the screen must surface the emergency number. Put the number in
a single exported constant with a comment stating it needs the clinic's jurisdiction confirmed by
the Medical Director. Do not inline it in copy, and do not treat the current value as approved.

## 3 · Delete

Remove `src/data/anatomy/questions.ts`. If anything still imports it, report that rather than
leaving a shim in place.

## 4 · Tone

Calm, short, second person, active voice. A person reading this screen may be frightened; its job
is to be clear, not dramatic.

- No alarm colour as the only signal — pair with text and structure.
- No icon carrying meaning alone.
- No urgency communicated through motion. `UX-FLOWS.md` §7 is explicit about this.
- No reassurance you are not qualified to give. Do not write "it's probably nothing", and do not
  estimate severity, likelihood or urgency beyond the approved message.

## 5 · Review metadata

Every rule keeps `status: 'draft'`, empty `reviewedBy`, empty `reviewedDate`. **Never write a
clinician's name or a review date.** These are drafts until a named physiotherapist approves them.

## Do not

Touch the body map, the flow machine, the exercise screen, or styles beyond what these two screens
need. Add or reword any clinical claim. Add a ninth trigger — the eight come from the approved
document. Modify anything inside `patient-library/`.

## Acceptance

- Selecting any one of the eight triggers reaches `SafetyStop`, and no sequence of clicks or
  browser-back reaches an exercise from there. State how you tested this.
- "None of these apply" continues normally.
- All eight labels match `safety-rules.ts` character for character.
- `questions.ts` is gone.
- Keyboard-only completion with visible focus and a live-region announcement on transition.
- Every rule still carries `status: 'draft'` and empty review fields.

## Report

Files changed · exactly how you verified the browser-back case · any copy you were tempted to
soften and left alone · typecheck and build output.
