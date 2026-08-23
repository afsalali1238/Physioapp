Audit the current published content for patient-readability, not for clinical correctness.

For every published item in `src/data/items.json`, check:
- Any sentence over 20 words
- Any instruction field over ~200 characters
- Medical terms used without a plain-English gloss
- Passive voice in instructions
- Missing or decorative `image_alt_en`
- Dosage written into instruction text instead of the dosage fields
- Any area with more than 8 published items
- Any outcome claim, guarantee, superlative, or condition/diagnosis language (banned — see PRD and DHA advertisement content rules)

Report as a table: item id, issue, the offending text, and a suggested rewrite.

Never edit content yourself. Output goes to the physiotherapist, who decides.
