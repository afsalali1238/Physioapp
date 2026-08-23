Help draft a new stretch or exercise row for the Google Sheet.

$ARGUMENTS names the item and body area.

Read `docs/CONTENT-SCHEMA.md` first. Then produce a complete row, tab-separated so it pastes straight into the sheet, with every required column filled and `_ar` columns left empty.

Rules:
- `status` starts as `draft`, never `published`. A human clinician publishes.
- `id` follows the convention and must not collide with an existing id — check `src/data/items.json`.
- Instructions: second person, sentences under 20 words, one action per sentence, no medical jargon without a plain-English gloss.
- Dosage goes in the dosage columns, never in the instruction text.
- Write `image_alt_en` as a description of the body position, useful to someone who cannot see the image.
- Add a matching image prompt using the locked style block in `docs/IMAGE-BRIEF.md`.

End by stating plainly: this row is a draft for the physiotherapist to review, edit, and publish. It is not clinical advice and has not been reviewed.
