# Design System

Extracted from the working prototype. These are the actual values — copy them into `src/styles/tokens.css` rather than re-deriving.

---

## Who this is designed for

A patient on a phone. Possibly older. Possibly in pain, so possibly one-handed. Possibly reading a second language. Standing in a clinic corridor or sitting on a bed at home. They arrived by scanning a code or tapping a WhatsApp link, they will not log in, they will not type, and they may never come back after two weeks.

That reader dictates everything below: large type, high contrast, enormous tap targets, no cleverness, no motion that isn't functional.

**This is a UI, not a document.** It is scanned and operated. Information design beats typographic flourish — which is why the dosage block is the most visually assertive element on a card, not the heading.

---

## Colour

The neutral is a **cool grey with a slight green bias**, chosen rather than inherited — it sits under a green-anchored palette without the clinical coldness of a blue-grey or the AI-default warmth of a cream.

The accent anchor is a **deep pine** that reads as calm and medical without being hospital blue. Boldness is spent in exactly one place: the three semantic exercise-type colours. Everything else stays quiet.

### Light

```css
:root{
  --ground:#EEF1EE;      /* page */
  --surface:#FFFFFF;     /* cards */
  --surface-2:#E3E8E4;   /* inset panels, dosage block */
  --ink:#17211D;         /* body text */
  --ink-2:#4B5B55;       /* secondary text */
  --ink-3:#7C8C86;       /* labels, meta */
  --line:#D5DDD8;
  --line-2:#B7C3BD;

  --brand:#12433A;       /* top bar */
  --brand-ink:#FFFFFF;

  --mobility:#41618F;    --mobility-bg:#E2E8F1;
  --stretch:#8F5310;     --stretch-bg:#F5E8D6;
  --strengthen:#175C4E;  --strengthen-bg:#DBEAE5;

  --warn:#7E5200;        --warn-bg:#F7EFDC;
  --slot:#E6EBE8;        --slot-line:#BECAC5;
}
```

### Dark

Defined twice — once under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, and again under `:root[data-theme="dark"]` — so both the OS default and an explicit toggle win in the right direction.

```css
--ground:#0E1412;   --surface:#161E1B;   --surface-2:#1F2926;
--ink:#E7EEEA;      --ink-2:#A3B2AC;     --ink-3:#75847E;
--line:#28332F;     --line-2:#3A4642;
--brand:#66C6B0;    --brand-ink:#0E1412;
--mobility:#93A9D4; --mobility-bg:#1E2734;
--stretch:#D89E58;  --stretch-bg:#332619;
--strengthen:#57BCA3;--strengthen-bg:#18302B;
--warn:#D6A94F;     --warn-bg:#2E2716;
--slot:#1C2522;     --slot-line:#313E39;
```

### The semantic three

`mobility` · `stretch` · `strengthen` are **information, not decoration.** They tell the patient at a glance what kind of work an exercise is, which is the one classification the clinician said should be visible. They are deliberately separate from the brand hue so the brand never competes with them.

Do not add a fourth. If a new exercise type appears, map it onto one of these three.

---

## Typography

Three faces, three jobs.

| Role | Face | Why |
|---|---|---|
| Display — headings, labels, chips | **Archivo** 500/600/700 | Grotesque with signage and wayfinding DNA. The whole site is a wayfinding problem: *which part of my body*. |
| Body — instructions, everything read | **Source Sans 3** 400/500/600/700 | Large x-height, excellent screen legibility at small sizes and under magnification. Built for exactly this reader. |
| Data — dosage, counts, codes | **IBM Plex Mono** 500/600 | Tabular numerals. Dosage is clinical data and should look like it. Numbers align down a column. |

Fallback stacks are mandatory — a silent font fallback is a visual bug.

**Base size is 17px, not 16.** Deliberate. The reader is older and often magnifying. Every size is `calc(<px> * var(--scale))` where `--scale` is 1, 1.15 or 1.3, set by the text-size control.

Scale in use: 40 / 23 / 21 / 17.5 / 17 / 15.5 / 14 / 12.5 / 11 / 10.

Headings get `text-wrap: balance` and `letter-spacing: -0.02em`. Uppercase labels get `letter-spacing: 0.11–0.15em`. Body line-height 1.45–1.55. Running text never exceeds ~56ch.

---

## Layout

- Single column, `max-width: 780px`, centred
- Page padding `clamp(15px, 4vw, 24px)`
- Card radius 14px, inner elements 10–12px
- Sibling groups laid out with grid/flex and `gap` — never per-element margins that collapse or double
- Area tiles: 1 column below 560px, 2 above
- Home choice cards: 1 column below 600px, 2 above

**Minimum touch target 44×44px, everywhere.** Area tiles are 62px tall, choice cards 150px. The whole tile is the target, never just the text.

---

## The item card

Fixed vertical order. Do not rearrange — the order is the information hierarchy.

```
┌──────────────────────────────┐
│  IMAGE                  4:3  │
├──────────────────────────────┤
│  01   [STRETCH]              │  ← number + type chip
│  Side Neck Stretch           │  ← name, largest text
│  ┌────┬────────┬───────────┐ │
│  │HOLD│ REPEAT │ HOW OFTEN │ │  ← dosage block
│  │30s │3 times │Twice a day│ │     mono, tabular
│  └────┴────────┴───────────┘ │
│  START      Sit upright…     │
│  MOVEMENT   Let your right…  │  ← labelled steps
│  KEEP IN…   Keep your left…  │
│  ─────────────────────────── │
│  Works on Upper trapezius    │
│  ⚠ Stop if you feel pain…    │  ← safety, warn-toned
│  [    Mark as done      ]    │
└──────────────────────────────┘
```

**Why the dosage block is a bordered strip and not prose.** It is the near-universal field standard across every commercial HEP platform, and it is the thing patients scan back to mid-exercise. Cells render only when they have a value, so a stretch with no sets doesn't show an empty Sets cell. Numbers in monospace with tabular figures so they align between cards.

**Why the safety line is always present and always styled differently.** Pain guidance is a documented top-three barrier to home-exercise adherence — patients stop entirely because they cannot tell normal discomfort from a warning sign. It gets its own colour and its own icon so it is never skimmed past.

---

## Motion

Almost none, and only functional: 120ms border and 1px lift on card hover. No page transitions, no scroll reveals, no ambient animation. A patient in pain does not need delight; they need the thing to be still and legible. Everything inside `@media (prefers-reduced-motion: reduce)` is disabled.

---

## Copy

- Second person, present tense, active voice
- **Sentences 20 words or fewer** (ODPHP Health Literacy Online)
- One action per sentence
- Target 6th-grade reading level (AMA/NIH guidance for patient web material)
- Whole numbers. Never make the reader calculate.
- Any anatomical term glossed in plain English at first use
- British English, matching the clinician's register
- Controls say what happens: "Mark as done", then it says "Done today"

**Banned:** condition and diagnosis names · outcome claims · guarantees · superlatives ("best", "safest", "unique") · any booking CTA. The last one is not a style preference — it is the element that would reclassify the page from patient education to medical advertisement under MOHAP rules.

---

## Accessibility floor

- Contrast ≥4.5:1 body, ≥3:1 large text and UI borders, **in both themes**
- Visible focus ring on everything focusable — 3px, offset 2px, brand colour
- Full keyboard operation
- `alt` on every image describing the *body position*, not "a person exercising"
- Skip link, `<main>` landmark, correct `lang`
- Legible and operable at 200% browser zoom on a 360px viewport
- Every `localStorage` access in try/catch — private browsing throws, and the page must still render

---

## Print

Print is a first-class output, not an afterthought. Her current handover *is* paper, and only 42% of adults 65+ own a smartphone.

Hide: top bar, back link, tick buttons, tools, guidance strip. Force black on white. `break-inside: avoid` on every card. Print the disclaimer, the clinic identification block, and the page URL so the patient can find it again.

---

## What to change and what not to

**Free to change:** the brand hue and the neutral bias, to match clinic branding when decision D3 lands.

**Do not change without a reason recorded in `memory.md`:** the semantic three, the item card field order, the dosage block treatment, base font size, minimum tap target, or the safety line's visual separation. Each is doing a specific job for this specific reader.
