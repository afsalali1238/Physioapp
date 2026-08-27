# Agent assignments

Nine modules, split by the character of the work rather than by preference.

## The split

**GPT-5.6 Sol owns everything you have to look at.** It takes vision input, so it can render a
screen, screenshot it, and judge its own output. Every visual module below requires that loop and
fails without it — the current map has hotspots floating off the arm precisely because someone
reasoned about coordinates instead of looking at them.

**Claude owns structure, state and clinical language.** Long refactors that must not change
behaviour, the state machine, and the copy where a wrong word is a regulatory problem.

**Antigravity owns scripts and validation.** It wrote `check-compliance.ts` in `patient-library/` and
already knows those conventions.

| Module | Work | Agent | Effort |
|---|---|---|---|
| M0 Contract & scaffold | Large refactor, zero behaviour change | Claude | high |
| M1 Body map | **Visual** — geometry, render, look, adjust | **GPT-5.6 Sol** | high |
| M2 Library + validation | Node scripts, deterministic, no UI | Antigravity | medium |
| M3 Safety gate | Clinical copy precision, small surface | Claude | high |
| M4 Muscle figure | **Visual** + a data mapping | **GPT-5.6 Sol** | medium |
| M5 Integration | State machine, flow, cross-file wiring | Claude | high |
| M6 A11y · theme · perf | **Visual QA** at many viewports and themes | **GPT-5.6 Sol** | high |
| M7 Clinician mode | Small feature | Antigravity / Cursor | medium |
| M8 Search | Small feature, data normalisation | Antigravity / Cursor | medium |
| M9 3D layer | **Visual** + three.js | **GPT-5.6 Sol** | xhigh |

Reasoning effort follows the convention already in `GPT-5.6-SOL-BUILD-PROMPT.md`: medium for
routine implementation, high or xhigh for architecture, clinical safety, and rendering problems.

## Sequence

| Wave | Modules | Agents at once |
|---|---|---|
| 0 · blocking | M0 | 1 |
| 1 · parallel | M1 · M2 · M3 | 3 |
| 2 · parallel | M4 · M5 | 2 |
| 3 · solo | M6 | 1 |
| 4 · optional | M7 · M8 · M9 | 3 |

## Launching an agent

Do not paste the brief. Point the agent at its file:

    Read anatomy-explorer/handoffs/M1-BODY-MAP.md in full, then execute it.
    Follow the constitution in anatomy-explorer/MODULE-HANDOFF.md.
    Do not start until you have read both. Report as the brief specifies.

Set the working directory to `anatomy-explorer/` for every agent.

## Before Wave 1 — the visual harness

M0 ships `scripts/shoot.mjs`. Every visual agent uses it and none of them should hand-inspect
by clicking around:

    npm run shoot                    # every state, every viewport, both themes → .shots/
    npm run shoot -- --only=confirm  # narrow while iterating
    npm run shoot -- --viewport=360  # one width

Sol agents: attach the produced PNGs to your own chat and evaluate them. A visual module is not
finished until you have looked at the output and said what you saw.

## The rule that keeps this safe

Exclusive file ownership, table in `MODULE-HANDOFF.md`. An agent that needs a file it does not
own STOPS and reports. Never edits it, never duplicates it, never shadows it. Commit between
every module — from a real terminal, not through an agent; the mounted filesystem refuses
`.git/index.lock` operations over the bridge.
