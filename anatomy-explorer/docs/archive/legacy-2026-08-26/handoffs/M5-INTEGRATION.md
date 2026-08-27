# M5 · Integration and the three-screen flow

**Agent: Claude** · **Effort:** high · **Wave:** 2, parallel with M4

Cross-file wiring and state correctness. The module where the product stops being parts.

## Context you need

Anatomy Explorer is a body-area locator in front of an existing physiotherapy exercise site.
The live site is in `patient-library/` — REFERENCE ONLY. Anatomy Explorer lives in
`anatomy-explorer/`. Read `MODULE-HANDOFF.md` first.

Live library: 8 areas, 26 exercises, only neck and shoulder published.

## You own

    src/components/anatomy/AnatomyLocator.astro
    src/components/anatomy/screens/Locate.astro
    src/components/anatomy/screens/Confirm.astro
    src/components/anatomy/screens/Exercises.astro
    src/lib/anatomy/machine.ts
    src/pages/

**Not** `BodyMap.astro` (M1), **not** `SafetyGate.astro` / `SafetyStop.astro` (M3),
**not** `MuscleFigure.astro` (M4). Import them.

## The target

Three screens, not seven: **Locate → Confirm → Exercises**, with M3's safety gate between
Confirm and Exercises.

## 1 · Delete the intro screen

"Where do you feel discomfort? → Explore the body" costs a tap and delivers nothing. The map is
screen one. Move the "this does not diagnose the cause of pain" line into the map screen's
supporting copy, where it is still read.

## 2 · Make Confirm do work

Today it is a yes/no gate: *"You selected the right shoulder. Is this the area you mean?"* — two
taps to learn nothing. Redesign it so confirmation is where education begins:

- **The zoomed map stays visible above the panel.** This is the moment the product exists for and
  it has never once rendered — the map used to live inside a hidden section. Screenshot it.
- Name the spot the way the patient would say it, side included.
- Precision zones as chips from `pain-zones.ts`. Picking one changes what they read; it does
  **not** change which area they route to, and that is intentional.
- Show what this area works — M4's muscle data for that area's exercises. Real content, zero new
  clinical writing. If M4 has not landed, leave a slot and say so; do not build a second figure.
- One primary action onward.
- **Never tell the patient their answer was wrong, vague or imprecise.**

## 3 · Exercises

Two cards, stretching and protocol, deep-linking to the live site. Base URL in one constant in
`src/config.ts` — nowhere else. Hide a card when the area has no items in that section.

Cautious handoff copy: these are general exercises for this area, follow the programme your
physiotherapist gave you, stop if symptoms worsen. Do not write dosage, do not rank exercises,
do not imply a prescription.

**Do not offer "choose another area" prominently** — plain text link, bottom of page. Patients
given more than four or five exercises perform them worse than patients given two, and a body map
invites collecting body parts.

## 4 · State

`machine.ts` owns the flow. The shell's script dispatches events and renders; **it holds no
parallel state of its own** — that duplication is what M0 just removed, do not reintroduce it.

Browser back and forward must never produce an impossible state. Specifically: **back must not
re-enter exercises from the safety stop.** Coordinate with M3's stop screen; test it.

## 5 · localStorage

Exactly two keys: last chosen area, and text-size preference. Wrap reads and writes in try/catch.
On return, a quiet line offering the last area back. Nothing else is stored, nothing is sent
anywhere, ever.

## Do not

Edit the body map, the safety screens, or the muscle figure. Add analytics or a third storage key.
Add clinical copy or dosage. Modify anything inside `patient-library/`.

## Acceptance

- Three taps from cold start to exercises for a returning patient who knows their area.
- The zoomed map is visible on Confirm — screenshot attached.
- Browser back from the safety stop cannot reach exercises. State how you tested it.
- The list path and the map path converge on the identical `Confirm` component.
- `npm run build` passes with M2's checker in `prebuild`.

## Report

Files changed · the tap count you measured · how you tested browser-back from the stop screen ·
anything you stubbed because another module had not landed · typecheck and build output.
