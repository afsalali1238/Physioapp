Pull the latest content from the Google Sheet and prepare it for review.

1. Run `npm run sync:content`.
2. If validation fails, report the failing rows exactly as the script names them — row number, column, and what is wrong. Do not attempt to fix the data. The sheet is the clinician's, not ours.
3. Run `npm run check:images` and report both directions: published items with no image file, and image files nothing references.
4. Run `npm run build` to confirm the site still builds.
5. Show `git diff --stat src/data/` and summarise what changed in plain language: items added, removed, reworded, dosage changed.
6. Do NOT commit or push. Stop and let the user review the diff.
