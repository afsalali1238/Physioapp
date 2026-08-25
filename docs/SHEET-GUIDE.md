# How to Update the Physio App

This guide explains how to add, edit, or remove exercises from the Patient Library using your Google Sheet. No coding is required.

## The Two Tabs

Your Google Sheet has two tabs at the bottom:
1. **areas**: This controls the big categories (e.g., "Neck", "Lower Back").
2. **items**: This contains the actual stretches and exercises inside those areas.

## Adding a New Exercise

To add a new exercise, follow these steps:

1. Open the **items** tab in your Google Sheet.
2. Scroll to the bottom and add a new row.
3. Fill in the columns:
   - **id**: A unique ID for the exercise (e.g., `ex-neck-05`). It must start with `ex-` for exercises or `str-` for stretches, followed by the area, and a number. No spaces.
   - **section**: Type either `stretching` or `exercise`.
   - **area_id**: The body area this belongs to (e.g., `neck`, `lower-back`). This must perfectly match an `area_id` in the **areas** tab.
   - **order**: A number (1, 2, 3...) that controls what order the exercise appears in on the page.
   - **status**: Type `draft` while you are writing it. Type `published` when you are ready for patients to see it.
   - **name_en**: The plain-English name of the exercise (e.g., "Chin Tuck").
   - **type**: (For exercises only). Choose one: `range-of-motion`, `mobility`, `strengthening`, `activation`, etc.
   - **Instructions**: Fill out `start_position_en`, `movement_en`, `direction_en` (for stretches), and `return_en` (for exercises).
   - **Dosage**: Fill out `hold_seconds`, `reps`, `sets`, `each_side` (TRUE or FALSE), and `frequency_en`.
   - **safety_en**: A one-sentence stop condition (e.g., "Stop if you feel a sharp pain").
   - **image_id**: The exact filename of the image in the system (e.g., `ex-neck-05`). If you don't have an image yet, type `placeholder`.

## The Review Process

1. When you first add an exercise, set its **status** to `draft`.
2. Open the secret preview link: `https://physioapp-nine.vercel.app/preview`
3. Check the layout, dosage, and wording. Drafts are highlighted with an orange badge.
4. If it looks good, go back to the Google Sheet and change `draft` to `published`.
5. The system will automatically build the site, and within 60 seconds, the exercise will be live on the main patient site!

## Removing an Exercise

If you want to hide an exercise from the live site, simply change its **status** from `published` to `retired` (or `draft`). It will immediately disappear from the patient-facing pages.

## Common Mistakes

*   **Forgetting to set status to published**: If an exercise isn't showing up on the live site, check that its status is `published`, not `draft`.
*   **Mismatched area_id**: If you put `lowerback` in the items tab but `lower-back` in the areas tab, the system will reject it. They must match exactly.
*   **Missing required fields**: If a `published` exercise is missing safety instructions, movement text, or an image ID, the safety checks will block the update to protect patients. Check your email or Vercel logs for errors.
