# Competitor Pattern Board (Handoff 5)

**PROTOTYPE — NOT CLINICALLY REVIEWED**

```text
status: prototype
reviewed_by: ""
reviewed_date: ""
source_url_or_provider: Gemini 3.1 Pro (High) - Market Research
generation_method: Pattern Synthesis
generation_date: 2026-08-27
replacement_required: false
reference_sources: ["Public interfaces of PhysiApp, Rehab Guru, Physiotec, HEP2go, MedBridge"]
```

## Mission
Identify common UX/UI patterns in existing physiotherapy platforms to inform the Anatomy Explorer's patient-facing handbook, focusing on exercise context, body navigation, motion controls, print, and mobile usability. Out-of-scope features (telehealth, logging) are excluded.

## 1. Direct Exercise Context
- **Pattern:** The "Exercise Card" is the atomic unit. It universally contains: Title, Media (Image/Video), Instructions (Bulleted or Numbered), and Dosage (Sets/Reps/Hold time).
- **Anti-Pattern:** Showing media without text. Text remains the clinical source of truth across all platforms.
- **Anatomy Explorer Alignment:** We follow this atomic card pattern exactly. Our addition of a "Target Muscles" highlight and "Safety" warning is an improvement over older platforms (like HEP2go) which often bury safety in the general instructions.

## 2. Body Navigation
- **Pattern:** Most platforms (Physiotec, Rehab Guru) use a 2D list or a very basic 2D segmented body map for clinicians to *assign* exercises. Patient-facing apps rarely have body-based discovery, as they rely on direct clinician assignment.
- **Anatomy Explorer Alignment:** Our 3D locator is a significant differentiator. Competitors do not typically offer patient-driven spatial discovery, validating our need for a clear, calm map that avoids looking like a diagnostic symptom-checker.

## 3. Motion Controls & Mobile Usability
- **Pattern:** Video is heavily utilized (PhysiApp, MedBridge). Controls are typically native OS video players or simple custom play/pause overlays. 
- **Anti-Pattern:** Autoplaying videos on mobile with sound.
- **Anatomy Explorer Alignment:** Our rule of "silent, 4-10 second loop, explicit playback, no autoplay" aligns perfectly with mobile best practices and prevents the jarring experience seen in older platforms.

## 4. Print & Media-Failure Behavior
- **Pattern:** Print layouts (HEP2go is widely used for this) default to a 2-up or 3-up grid per page. They rely on "Start" and "End" frame images with arrows. 
- **Media-Failure:** On slow connections, platforms fallback to the poster frame of the video.
- **Anatomy Explorer Alignment:** Our Handoff 2 storyboard approach (Neutral Start -> End Position with arrow) perfectly matches the print industry standard. Our requirement that "Failed or unsupported motion falls back to the approved still without layout shift" is standard best-practice.

## Summary Recommendations for Anatomy Explorer
1. **Stick to the 2-frame print convention:** Start and End poses are sufficient for print and fallback.
2. **Avoid Custom Video Players:** Use standard, accessible `<video>` tags or simple 3D animation mixers with explicit, high-contrast Play/Pause buttons.
3. **Embrace the 3D Differentiator:** Keep the 3D map clean and educational, as it is a unique feature compared to the standard list-based competition.
