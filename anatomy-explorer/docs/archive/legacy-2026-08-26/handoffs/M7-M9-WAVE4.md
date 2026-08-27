# Wave 4 · Optional modules

Run only after M0–M6 are green. Each is independent; three agents can work at once.
Same constitution as everything else — see `MODULE-HANDOFF.md`.

---

## M7 · Clinician "point here" mode

**Agent: Antigravity or Cursor** · **Effort:** medium
**Owns:** `src/pages/clinic.astro`, `src/components/anatomy/ClinicPicker.astro`,
`scripts/qr.mjs`

The physiotherapist turns a tablet around in the treatment room, taps a region while explaining
what she just found, and gets a link or QR for that area to hand the patient.

This may be the version of the product that earns its keep — daily use from day one, no education
content required, and no patient-facing risk taken.

- A route at `/clinic` — the same body map, tablet-first, larger targets, no patient flow.
- Tapping a region shows the area name, a copyable deep link, and a QR to the same URL.
- No safety gate here: a clinician is present, and she is the safety gate.
- Generate QR client-side or at build time. If you add a QR dependency, state its size and licence.
- **Do not** put this route in the patient navigation, and do not add authentication — there is no
  auth in this app and there will not be.

**Acceptance:** she can go from opening the tablet to a QR on screen in two taps, and the link
resolves to the correct area page on the live site.

---

## M8 · Everyday-language search

**Agent: Antigravity or Cursor** · **Effort:** medium
**Owns:** `src/data/anatomy/search-terms.ts`, `src/components/anatomy/AreaSearch.astro`

People type "shoulder blade", "pins and needles in my hand", "the back of my leg" far more
readily than they navigate anatomy. `UX-FLOWS.md` §6 lists search as a fallback; it should be a
first-class entry beside the map.

- An explicit synonym table mapping everyday phrases to region ids. Explicit, not fuzzy — the same
  rule as M4's muscle map. Include misspellings you can anticipate.
- Never store what is typed. Do not log it, do not put it in localStorage, do not put it in the
  URL. **A navigation box that is never stored is not free-text health history** — write that
  distinction into a comment so nobody relitigates it later.
- No results is a real state: offer the region list, not an apology.
- Fully keyboard operable with proper combobox semantics and an announced result count.

**Acceptance:** every one of the 8 live areas is reachable by at least three different everyday
phrasings, listed in your report. Nothing typed leaves the component.

---

## M9 · 3D layer inside the education card

**Agent: GPT-5.6 Sol** · **Effort:** xhigh
**Owns:** `src/components/anatomy/RegionViewer.astro`, `src/lib/anatomy/viewer/*`,
`public/anatomy/models/*`

Read `3D-TECHNICAL-ARCHITECTURE.md` and `ASSET-PIPELINE.md` in full first.

**The reframe:** 3D does not belong in the locator. For picking a body area it adds nothing over
a flat SVG and costs megabytes plus accessibility work. Where it earns its keep is *inside* a
region — the rotator cuff sitting under the deltoid, the disc between two vertebrae. That is
anatomy education, not location input.

So: one region, in the education card, as progressive enhancement.

- Capability detection first — WebGL, reduced motion, low-power. Anything missing returns cleanly
  to the still image with no error text.
- Lazy-loaded island. Nothing WebGL touches the network until the patient opts in. First paint is
  a static image.
- **Hard budget:** ≤ 6MB compressed, Draco or Meshopt, one region only, disposed on unmount.
  If the model is bigger, say so and stop rather than shipping it.
- Licence recorded before the asset is committed — source, licence, author, hashes, per
  `ASSET-PIPELINE.md` §3. **Do not assume a model-generation service grants redistribution
  rights.** No asset ships without its licence metadata.
- Never the only way to see the content. The still image and the text remain complete on their own.

**Acceptance:** the education card is fully usable with WebGL disabled; the viewer loads only on
opt-in; measured asset size and triangle count reported; licence metadata committed alongside.
