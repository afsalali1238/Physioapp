# Patient Exercise & Stretching Platform

A web library of physiotherapy stretches and exercise protocols, organised by body area. One link, sent by a physiotherapist to any patient. No login, no accounts, no patient data.

## Read these first

| File | What it is |
|---|---|
| `memory.md` | Decision log and current state. **Start here.** |
| `PRD.md` | What we are building and why |
| `docs/ARCHITECTURE.md` | Stack reasoning, data flow, routes |
| `docs/CONTENT-SCHEMA.md` | The spreadsheet contract |
| `docs/IMAGE-BRIEF.md` | Image style lock and prompt template |
| `docs/RESEARCH-FINDINGS.md` | Evidence base behind the design decisions |
| `.claude/CLAUDE.md` | Rules for AI-assisted work in this repo |

## Quick start

```bash
npm install
npm run sync:content     # pull the Google Sheet into src/data/
npm run dev
```

## The content loop

The physiotherapist owns a Google Sheet. She adds a row and marks it published. Someone runs `npm run sync:content`, reviews the git diff, and ships. The live site never calls Google, so a bad sheet can never break a page in front of a patient.

Never hand-edit `src/data/*.json`.

## Status

Phase 0 — foundations. See `memory.md`.
