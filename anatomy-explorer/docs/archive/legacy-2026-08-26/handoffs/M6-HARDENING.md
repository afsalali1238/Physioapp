# M6 · Accessibility, theme and performance

**Agent: GPT-5.6 Sol** · **Effort:** high · **Wave:** 3, solo, after M1–M5

The module that decides whether a 70-year-old in pain can actually use this. It is visual QA at
many viewports and both themes, which is why it goes to the agent that can see.

## Context you need

Anatomy Explorer is a body-area locator in front of an existing physiotherapy exercise site.
The live site is in `patient-library/` — REFERENCE ONLY. Read `MODULE-HANDOFF.md` first.

**Your user:** often over 60, often in pain, often one-handed, often reading English as a second
language, often on a cheap phone with a weak signal, standing in a corridor. Design decisions
that are fine for you may be unusable for them.

## You own

`src/styles/`. You may make **surgical** edits elsewhere, but every one must be listed
individually in your report with a one-line reason. No refactors, no redesign, no copy changes.

## Test matrix

320px · 360px · 390px · tablet · desktop
× keyboard only · 200% browser zoom · 130% app text scale
× light · dark
× reduced motion · JavaScript disabled

## 1 · Keyboard

The entire flow completable without touching the SVG. A skip link as the **first** focusable
element, going to the semantic region list. Visible focus ring meeting contrast on **both**
themes — check it on the dark ground specifically, that is where it usually fails. Logical focus
order. Focus moved to the new heading on every phase change.

## 2 · Screen reader

SVG is `aria-hidden`; the semantic list carries the real controls. One polite live region
announcing region and zone changes — one, not several competing. Correct heading hierarchy with
no skipped levels. Every button's accessible name says what pressing it does. No icon-only
controls anywhere in the app.

## 3 · Targets and text

Every interactive target at least 44×44px at every breakpoint — **measure them, do not assume**.
Base font 17px, not 16.

Add the text-size control cycling 100 / 115 / 130%, persisted in localStorage inside a try/catch,
scaling the whole interface rather than only body copy. Verify the layout survives 130% combined
with 200% browser zoom — that is the real worst case and it is not rare.

## 4 · Theme

Tokens on bare `:root` for light; redefined under `@media (prefers-color-scheme: dark)` guarded
as `:root:not([data-theme="light"])`; redefined again under `:root[data-theme="dark"]`.
**No colour whose only definition sits inside a media or attribute block** — that is the classic
unreadable-page bug.

Check every text and border colour for AA in both themes, and check the map's silhouette,
highlight and focus ring in both.

## 5 · Motion and performance

`prefers-reduced-motion` turns every transition into an instant change **with no loss of
function**. No layout shift on phase change. Report the built JS and CSS weight for the anatomy
route.

## 6 · The report is the deliverable

    npm run shoot

Attach the full set. Then walk the whole flow yourself at 130% text, one-handed, in portrait, and
**write down every moment you hesitated**. That list is what I want — the fixes are secondary.
"It passes" is not a useful report; "the zone chips wrap to three lines at 130% and the primary
button falls below the fold" is.

## Do not

Redesign anything. Change clinical copy. Touch data files or the state machine. Modify anything
inside `patient-library/`.

## Acceptance

- Nothing scrolls sideways at 320px at any point in the flow.
- Keyboard-only completion of every path, in both themes.
- **Measured contrast figures pasted** for every text and border colour — numbers, not "looks fine".
- Screenshots attached across the matrix.
- `npm run build` passes.
