# Visual Media and Motion Plan

## Goal

Use visuals to reduce uncertainty about starting position and movement direction without making the
app heavier or clinically misleading. Text remains authoritative; media explains it.

Media must work in all handbook contexts: direct exercise URL, area chapter, QR-opened mobile page,
print handout, and clinician tablet view. The same approved source asset serves every context.

## Media ladder

1. Approved still image — required baseline.
2. Two-frame start/end sequence — when it communicates movement clearly.
3. Short motion loop — 4–10 seconds, one repetition, explicit playback.
4. Interactive 3D demonstration — later, only where it materially improves understanding.

Use the lowest tier that communicates safely. More motion is not automatically better.

## Production strategy

- Start with one neck or shoulder exercise whose reviewed text and pose are stable.
- Storyboard setup, movement path, end position, and controlled return.
- Create the approved still first and derive the poster from the same source.
- Prefer deterministic rigged 3D or licensed source footage.
- Do not use unconstrained generative image-to-video for patient demonstrations; plausible joint drift is a safety risk.
- Export MP4/H.264 for compatibility and WebM only when size savings justify it.
- Keep each motion asset preferably below 1.5MB; 3MB is a hard review threshold.
- Use a fixed 4:3 viewport and no audio.

## Review gates

Automated format/size/duration/poster/checksum checks → visual review → movement-fidelity review →
accessibility review → mobile performance review → approval.

## Draft workflow

```text
source collection → structured draft → compliance scan → internal review
→ noindex clinician preview → clinician approval → production publication
```

Drafts retain empty review fields and include source, rationale, generation method, version, and
unresolved questions. Accidental production release must be blocked technically.

## User rules

- Poster first; no blank video frame.
- One active animation at a time.
- Pause when off-screen or the page is hidden.
- No autoplay; never autoplay for reduced-motion users.
- Play/Pause has an accessible name.
- Replay returns to the starting frame.
- Still-image fallback is always available.
- Print uses the poster or approved start/end sequence.
