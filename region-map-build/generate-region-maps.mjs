/**
 * Standalone anatomy region-map generator.
 *
 * This is a FAITHFUL COPY of the joint table and region geometry that the app
 * already ships, taken verbatim from:
 *   anatomy-explorer/src/lib/anatomy/geometry/skeleton.ts
 *   anatomy-explorer/src/lib/anatomy/geometry/regions.ts
 *
 * Nothing here is hand-authored: every region capsule is derived from the joint
 * table `J` via the same `cap` / `lerp` / `A` helpers the app uses, so these
 * maps cannot drift from what `AnatomyLocator.astro` renders. If skeleton.ts or
 * regions.ts change, re-copy the two blocks below and re-run.
 *
 * It writes only into ./ (pshyapp/region-map-build/). It imports nothing from
 * the app and touches no committed file.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = dirname(fileURLToPath(import.meta.url));
const svgDir = join(OUT, 'svg');
mkdirSync(svgDir, { recursive: true });

/* ─────────────────────────────────────────────────────────────────────────
 * 1. Geometry — copied from skeleton.ts (VIEWBOX, CX, J, cap, lerp, SILHOUETTE,
 *    DETAIL) and regions.ts (zones, sided(), GEOMETRY_REGIONS).
 * ───────────────────────────────────────────────────────────────────────── */

const VIEWBOX = '0 0 240 620';
const CX = 120;

const J = {
  headTop: [120, 20], headC: [120, 57], chin: [120, 92], neckTop: [120, 96], neckBase: [120, 122],
  shoulderL: [58, 134], shoulderR: [182, 134],
  elbowL: [46, 228], elbowR: [194, 228],
  wristL: [40, 314], wristR: [200, 314],
  handTipL: [37, 358], handTipR: [203, 358],
  chest: [120, 180], waist: [120, 238], pelvis: [120, 296],
  hipL: [96, 302], hipR: [144, 302],
  kneeL: [94, 442], kneeR: [146, 442],
  ankleL: [93, 552], ankleR: [147, 552],
  toeL: [68, 578], toeR: [172, 578],
  trochL: [80, 296], trochR: [160, 296],
};

const cap = (a, b) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`;
const lerp = (a, b, t = 0.5) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const A = (a, b, t) => lerp(a, b, t);

const SILHOUETTE = {
  filled: [
    'M120 20 C137 20 151 36 151 57 C151 79 137 94 120 94 C103 94 89 79 89 57 C89 36 103 20 120 20 Z',
    'M74 134 C96 124 144 124 166 134 L170 182 L158 238 L162 268 L160 300 C150 314 90 314 80 300 L78 268 L82 238 L70 182 Z',
  ],
  strokes: [
    { d: cap(J.neckTop, J.neckBase), w: 32 },
    { d: cap(J.shoulderL, J.elbowL), w: 30 },
    { d: cap(J.shoulderR, J.elbowR), w: 30 },
    { d: cap(J.elbowL, J.wristL), w: 24 },
    { d: cap(J.elbowR, J.wristR), w: 24 },
    { d: cap(J.wristL, J.handTipL), w: 22 },
    { d: cap(J.wristR, J.handTipR), w: 22 },
    { d: cap(J.hipL, J.kneeL), w: 44 },
    { d: cap(J.hipR, J.kneeR), w: 44 },
    { d: cap(J.kneeL, J.ankleL), w: 32 },
    { d: cap(J.kneeR, J.ankleR), w: 32 },
    { d: cap(J.ankleL, J.toeL), w: 21 },
    { d: cap(J.ankleR, J.toeR), w: 21 },
  ],
};

const DETAIL = {
  front: [
    'M120 140 L120 292',
    'M96 178 C108 190 132 190 144 178',
    'M100 248 C110 256 130 256 140 248',
    'M100 440 L114 440 M126 440 L140 440',
  ],
  back: [
    'M120 132 L120 300',
    'M92 150 L120 142 L148 150',
    'M96 186 C108 176 132 176 144 186',
    'M92 292 C106 306 134 306 148 292',
    'M100 452 L114 452 M126 452 L140 452',
  ],
};

const NECK_ZONES = ['Back of neck', 'Side of neck', 'Base of neck and top of shoulders'];
const SHOULDER_ZONES = ['Front of shoulder', 'Top of shoulder', 'Back of shoulder', 'Outside of the upper arm'];
const ELBOW_ZONES = ['Outer elbow', 'Inner elbow', 'Point of the elbow'];
const WRIST_ZONES = ['Back of wrist', 'Palm side of wrist', 'Thumb side of wrist'];
const LOWBACK_ZONES = ['Centre of lower back', 'One side of lower back', 'Low down, towards the buttock'];
const HIP_ZONES = ['Front of hip and groin', 'Side of hip', 'Back of hip and buttock'];
const KNEE_ZONES = ['Front of knee and kneecap', 'Inner side of knee', 'Outer side of knee', 'Back of knee'];
const ANKLE_ZONES = ['Outer ankle', 'Inner ankle', 'Front of ankle', 'Back of ankle and heel cord'];

const limb = (side) =>
  side === 'l'
    ? { sh: J.shoulderL, el: J.elbowL, wr: J.wristL, hip: J.hipL, tr: J.trochL, kn: J.kneeL, an: J.ankleL }
    : { sh: J.shoulderR, el: J.elbowR, wr: J.wristR, hip: J.hipR, tr: J.trochR, kn: J.kneeR, an: J.ankleR };

function sided(side) {
  const p = limb(side);
  const s = side === 'l' ? 'Left' : 'Right';
  return [
    { id: `shoulder-${side}`, areaId: 'shoulder', views: ['front', 'back'], side, label: `${s} shoulder`, zones: SHOULDER_ZONES, shapes: [{ d: cap(p.sh, A(p.sh, p.el, 0.24)), w: 40 }] },
    { id: `elbow-${side}`, areaId: 'elbow', views: ['front', 'back'], side, label: `${s} elbow`, zones: ELBOW_ZONES, shapes: [{ d: cap(A(p.sh, p.el, 0.86), A(p.el, p.wr, 0.16)), w: 34 }] },
    { id: `wrist-${side}`, areaId: 'wrist', views: ['front', 'back'], side, label: `${s} wrist`, zones: WRIST_ZONES, shapes: [{ d: cap(A(p.el, p.wr, 0.88), p.wr), w: 30 }] },
    { id: `hip-${side}`, areaId: 'hip', views: ['front', 'back'], side, label: `${s} hip`, zones: HIP_ZONES, shapes: [{ d: cap(p.tr, A(p.hip, p.kn, 0.1)), w: 44 }] },
    { id: `knee-${side}`, areaId: 'knee', views: ['front', 'back'], side, label: `${s} knee`, zones: KNEE_ZONES, shapes: [{ d: cap(A(p.hip, p.kn, 0.9), A(p.kn, p.an, 0.11)), w: 44 }] },
    { id: `ankle-${side}`, areaId: 'ankle', views: ['front', 'back'], side, label: `${s} ankle`, zones: ANKLE_ZONES, shapes: [{ d: cap(A(p.kn, p.an, 0.9), p.an), w: 34 }] },
  ];
}

const GEOMETRY_REGIONS = [
  { id: 'neck', areaId: 'neck', views: ['front', 'back'], side: 'c', label: 'Neck', zones: NECK_ZONES, shapes: [{ d: cap([120, 102], [120, 126]), w: 40 }] },
  { id: 'lower-back', areaId: 'lower-back', views: ['back'], side: 'c', label: 'Lower back', zones: LOWBACK_ZONES, shapes: [{ d: cap([120, 236], [120, 278]), w: 56 }] },
  ...sided('l'),
  ...sided('r'),
];

/* ─────────────────────────────────────────────────────────────────────────
 * 2. Area metadata — from src/data/areas.json (the 8 published areas).
 *    name_en / name_ar are used exactly as they appear there; no Arabic is
 *    invented for areas the sheet has not supplied it for.
 * ───────────────────────────────────────────────────────────────────────── */

const AREAS = [
  { areaId: 'neck', name_en: 'Neck', name_ar: 'الرقبة' },
  { areaId: 'shoulder', name_en: 'Shoulder', name_ar: 'الكتف' },
  { areaId: 'elbow', name_en: 'Elbow' },
  { areaId: 'wrist', name_en: 'Wrist' },
  { areaId: 'lower-back', name_en: 'Lower Back' },
  { areaId: 'hip', name_en: 'Hip' },
  { areaId: 'knee', name_en: 'Knee' },
  { areaId: 'ankle', name_en: 'Ankle' },
];

/* ─────────────────────────────────────────────────────────────────────────
 * 3. Palette — light mode, consistent with the app's slate body + amber accent
 *    (matches public/anatomy/fallback-body-map.svg). Swap for CSS vars
 *    (--line / --brand / --ink-3) when wiring into the app.
 * ───────────────────────────────────────────────────────────────────────── */

const C = {
  bg: '#ffffff',
  body: '#c7d0dc',      // silhouette fill + limb strokes (one colour = one body)
  detail: '#7c8aa0',    // interior detail lines
  brand: '#b45309',     // region highlight / hotspot
  ink: '#1f2937',
  muted: '#64748b',
};

/* ─────────────────────────────────────────────────────────────────────────
 * 4. SVG building blocks
 * ───────────────────────────────────────────────────────────────────────── */

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function silhouette() {
  const filled = SILHOUETTE.filled.map((d) => `    <path d="${d}" fill="${C.body}"/>`).join('\n');
  const strokes = SILHOUETTE.strokes
    .map((s) => `    <path d="${s.d}" fill="none" stroke="${C.body}" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round"/>`)
    .join('\n');
  return `  <g class="silhouette">\n${filled}\n${strokes}\n  </g>`;
}

function detail(view) {
  const lines = DETAIL[view]
    .map((d) => `    <path d="${d}" fill="none" stroke="${C.detail}" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>`)
    .join('\n');
  return `  <g class="detail">\n${lines}\n  </g>`;
}

function regionPaths(region, { color, opacity, halo = false }) {
  return region.shapes
    .map((s) => {
      const base = `    <path d="${s.d}" fill="none" stroke="${color}" stroke-width="${s.w}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
      if (!halo) return base;
      const glow = `    <path d="${s.d}" fill="none" stroke="${color}" stroke-width="${s.w + 12}" stroke-linecap="round" stroke-linejoin="round" opacity="0.16"/>`;
      return `${glow}\n${base}`;
    })
    .join('\n');
}

const regionsForView = (view) => GEOMETRY_REGIONS.filter((r) => r.views.includes(view));
const regionsForArea = (areaId) => GEOMETRY_REGIONS.filter((r) => r.areaId === areaId);

/** A neutral overview map: silhouette + detail + every reachable hotspot, faint. */
function baseMapSVG(view) {
  const hotspots = regionsForView(view)
    .map((r) => regionPaths(r, { color: C.brand, opacity: 0.3 }))
    .join('\n');
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img" aria-labelledby="t d">`,
    `  <title id="t">Body-area map — ${view} view</title>`,
    `  <desc id="d">Neutral body silhouette with the published body areas marked. Navigation aid, not a clinical illustration.</desc>`,
    `  <rect width="240" height="620" fill="${C.bg}"/>`,
    silhouette(),
    detail(view),
    `  <g class="hotspots">\n${hotspots}\n  </g>`,
    `</svg>`,
    ``,
  ].join('\n');
}

/** A single-area map: silhouette + detail + that area's region(s) highlighted + label. */
function areaMapSVG(area) {
  const regions = regionsForArea(area.areaId);
  // lower-back only exists on the back view; everything else shows on front.
  const view = regions.every((r) => r.views.includes('front')) ? 'front' : 'back';
  const highlight = regions
    .filter((r) => r.views.includes(view))
    .map((r) => regionPaths(r, { color: C.brand, opacity: 0.92, halo: true }))
    .join('\n');
  const arabic = area.name_ar
    ? `  <text x="120" y="650" text-anchor="middle" font-family="system-ui, sans-serif" font-size="19" fill="${C.muted}" direction="rtl">${esc(area.name_ar)}</text>`
    : '';
  const labelY = area.name_ar ? 630 : 636;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 ${area.name_ar ? 664 : 648}" role="img" aria-labelledby="t d">`,
    `  <title id="t">${esc(area.name_en)} — body-area map</title>`,
    `  <desc id="d">Body silhouette (${view} view) with the ${esc(area.name_en)} area highlighted. Navigation aid, not a clinical illustration.</desc>`,
    `  <rect width="240" height="${area.name_ar ? 664 : 648}" fill="${C.bg}"/>`,
    silhouette(),
    detail(view),
    `  <g class="highlight">\n${highlight}\n  </g>`,
    `  <text x="120" y="${labelY}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="${C.ink}">${esc(area.name_en)}</text>`,
    arabic,
    `</svg>`,
    ``,
  ].join('\n');
}

/* ─────────────────────────────────────────────────────────────────────────
 * 5. Interactive preview (self-contained, light mode, no external deps,
 *    no browser storage). Front/back toggle + list<->map highlight sync.
 * ───────────────────────────────────────────────────────────────────────── */

function previewHTML() {
  // Serialize the data the page needs: per-view silhouette/detail markup and,
  // per area, the region paths grouped by view.
  const viewData = {};
  for (const view of ['front', 'back']) {
    viewData[view] = { detail: DETAIL[view] };
  }
  const areaData = AREAS.map((a) => {
    const regions = regionsForArea(a.areaId);
    const byView = {};
    for (const view of ['front', 'back']) {
      const rs = regions.filter((r) => r.views.includes(view));
      byView[view] = rs.flatMap((r) => r.shapes.map((s) => ({ d: s.d, w: s.w })));
    }
    return { areaId: a.areaId, name_en: a.name_en, name_ar: a.name_ar ?? null, zones: regions[0]?.zones ?? [], byView };
  });

  const DATA = {
    viewBox: VIEWBOX,
    C,
    silhouette: {
      filled: SILHOUETTE.filled,
      strokes: SILHOUETTE.strokes,
    },
    detail: DETAIL,
    areas: areaData,
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Anatomy region maps — preview</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #f1f5f9; color: ${C.ink};
    font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    font-size: 17px; line-height: 1.5;
  }
  .wrap { max-width: 920px; margin: 0 auto; padding: 28px 20px 64px; }
  header h1 { font-size: 26px; margin: 0 0 4px; letter-spacing: -0.02em; }
  header p { margin: 0 0 20px; color: ${C.muted}; max-width: 60ch; }
  .draft {
    display: inline-block; font-size: 12.5px; letter-spacing: .04em; text-transform: uppercase;
    color: #92400e; background: #fef3c7; border: 1px solid #fcd34d;
    border-radius: 999px; padding: 4px 11px; margin-bottom: 22px;
  }
  .grid { display: grid; gap: 28px; }
  @media (min-width: 760px) { .grid { grid-template-columns: 300px 1fr; align-items: start; } }
  .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; }
  .toggle { display: inline-flex; gap: 2px; padding: 3px; background: #e2e8f0; border-radius: 10px; margin-bottom: 14px; }
  .toggle button {
    cursor: pointer; border: 0; background: transparent; color: ${C.muted};
    font: 600 14px system-ui; padding: 8px 18px; border-radius: 8px; min-height: 40px;
  }
  .toggle button.on { background: #fff; color: ${C.ink}; box-shadow: 0 1px 2px rgba(0,0,0,.08); }
  svg.map { width: 100%; max-width: 280px; height: auto; display: block; margin: 0 auto; }
  .hint { color: ${C.muted}; font-size: 13px; text-align: center; margin: 10px 0 0; }
  .list-title { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: ${C.muted}; margin: 0 0 10px; }
  ul.areas { list-style: none; margin: 0; padding: 0; display: grid; gap: 7px; }
  ul.areas button {
    width: 100%; text-align: left; cursor: pointer; display: grid;
    grid-template-columns: auto 1fr auto; gap: 12px; align-items: center;
    background: #fff; border: 1px solid #e2e8f0; border-radius: 11px;
    padding: 12px 14px; min-height: 52px; font: inherit; color: inherit;
  }
  ul.areas button:hover, ul.areas button.on { border-color: ${C.brand}; }
  ul.areas button.on { background: #fff7ed; }
  .num { font: 12px ui-monospace, monospace; color: ${C.muted}; }
  .nm { font-weight: 600; }
  .nm .ar { color: ${C.muted}; font-weight: 500; margin-left: 6px; }
  .na { font: 11px ui-monospace, monospace; color: #94a3b8; }
  .zones { margin: 16px 0 0; padding: 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
  .zones h3 { margin: 0 0 8px; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; color: ${C.muted}; }
  .zones ul { margin: 0; padding-left: 18px; }
  .zones li { margin: 2px 0; }
  .zones .empty { color: ${C.muted}; }
  footer { margin-top: 28px; color: ${C.muted}; font-size: 13px; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>Anatomy region maps</h1>
    <p>Generated from the app's own joint geometry. Tap an area in the list or on the body; use Front / Back to switch views. This is a preview of the asset — nothing here is wired into the site.</p>
    <span class="draft">Draft · not clinically reviewed</span>
  </header>

  <div class="grid">
    <div class="panel">
      <div class="toggle" role="group" aria-label="Body view">
        <button data-view="front" class="on">Front</button>
        <button data-view="back">Back</button>
      </div>
      <div id="mapHost"></div>
      <p class="hint">Lower back appears on the Back view only.</p>
    </div>

    <div>
      <p class="list-title">Body areas · head to toe</p>
      <ul class="areas" id="areaList"></ul>
      <div class="zones" id="zones">
        <h3>Where it covers</h3>
        <p class="empty">Select an area to see the zones it includes.</p>
      </div>
    </div>
  </div>

  <footer>Region names come from <code>areas.json</code>; geometry from <code>geometry/skeleton.ts</code> + <code>regions.ts</code>. Zone descriptions are the app's own navigation labels.</footer>
</div>

<script>
const DATA = ${JSON.stringify(DATA)};
let view = 'front';
let selected = null;

const host = document.getElementById('mapHost');
const list = document.getElementById('areaList');
const zonesBox = document.getElementById('zones');

function pathEl(d, attrs) {
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', d);
  for (const [k, v] of Object.entries(attrs)) p.setAttribute(k, v);
  return p;
}

function renderMap() {
  host.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', DATA.viewBox);
  svg.setAttribute('class', 'map');
  svg.setAttribute('aria-hidden', 'true');

  // silhouette
  for (const d of DATA.silhouette.filled) svg.appendChild(pathEl(d, { fill: DATA.C.body }));
  for (const s of DATA.silhouette.strokes)
    svg.appendChild(pathEl(s.d, { fill: 'none', stroke: DATA.C.body, 'stroke-width': s.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  // detail
  for (const d of DATA.detail[view])
    svg.appendChild(pathEl(d, { fill: 'none', stroke: DATA.C.detail, 'stroke-width': 1.5, 'stroke-linecap': 'round', opacity: 0.5 }));
  // hotspots
  for (const area of DATA.areas) {
    const shapes = area.byView[view];
    if (!shapes.length) continue;
    const on = selected === area.areaId;
    for (const s of shapes) {
      if (on) svg.appendChild(pathEl(s.d, { fill: 'none', stroke: DATA.C.brand, 'stroke-width': s.w + 12, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.16 }));
      const p = pathEl(s.d, { fill: 'none', stroke: DATA.C.brand, 'stroke-width': s.w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: on ? 0.92 : 0.3, style: 'cursor:pointer;transition:opacity .12s' });
      p.addEventListener('click', () => select(area.areaId));
      p.addEventListener('mouseenter', () => { if (!selected) hoverPaint(area.areaId, true); });
      p.addEventListener('mouseleave', () => { if (!selected) hoverPaint(area.areaId, false); });
      svg.appendChild(p);
    }
  }
  host.appendChild(svg);
}

function hoverPaint(areaId, on) {
  for (const btn of list.querySelectorAll('button')) {
    if (btn.dataset.area === areaId) btn.classList.toggle('on', on);
  }
}

function renderList() {
  list.innerHTML = '';
  DATA.areas.forEach((area, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.dataset.area = area.areaId;
    btn.className = selected === area.areaId ? 'on' : '';
    const ar = area.name_ar ? '<span class="ar" dir="rtl">' + area.name_ar + '</span>' : '';
    const onFront = area.byView.front.length > 0;
    const onBack = area.byView.back.length > 0;
    const where = onFront && onBack ? 'front · back' : onFront ? 'front' : 'back';
    btn.innerHTML = '<span class="num">' + String(i + 1).padStart(2, '0') + '</span>'
      + '<span class="nm">' + area.name_en + ar + '</span>'
      + '<span class="na">' + where + '</span>';
    btn.addEventListener('click', () => select(area.areaId));
    btn.addEventListener('mouseenter', () => { if (!selected) previewArea(area.areaId, true); });
    btn.addEventListener('mouseleave', () => { if (!selected) previewArea(area.areaId, false); });
    li.appendChild(btn);
    list.appendChild(li);
  });
}

// Light hover preview on the map without committing a selection.
let hovered = null;
function previewArea(areaId, on) {
  hovered = on ? areaId : null;
  const prev = selected;
  selected = on ? areaId : null;
  renderMap();
  selected = prev;
}

function select(areaId) {
  selected = selected === areaId ? null : areaId;
  const area = DATA.areas.find((a) => a.areaId === areaId);
  // If the area only shows on the other view, switch to it.
  if (selected && area && !area.byView[view].length) {
    view = area.byView.front.length ? 'front' : 'back';
    syncToggle();
  }
  renderMap();
  renderList();
  renderZones();
}

function renderZones() {
  const area = DATA.areas.find((a) => a.areaId === selected);
  if (!area) {
    zonesBox.innerHTML = '<h3>Where it covers</h3><p class="empty">Select an area to see the zones it includes.</p>';
    return;
  }
  const items = area.zones.map((z) => '<li>' + z + '</li>').join('');
  zonesBox.innerHTML = '<h3>' + area.name_en + ' — where it covers</h3><ul>' + items + '</ul>';
}

function syncToggle() {
  for (const b of document.querySelectorAll('.toggle button')) b.classList.toggle('on', b.dataset.view === view);
}

for (const b of document.querySelectorAll('.toggle button')) {
  b.addEventListener('click', () => { view = b.dataset.view; syncToggle(); renderMap(); renderList(); });
}

renderMap();
renderList();
renderZones();
</script>
</body>
</html>
`;
}

/* ─────────────────────────────────────────────────────────────────────────
 * 6. Emit everything
 * ───────────────────────────────────────────────────────────────────────── */

const written = [];
function write(rel, content) {
  const abs = join(OUT, rel);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  written.push(rel);
}

write('svg/region-map-front.svg', baseMapSVG('front'));
write('svg/region-map-back.svg', baseMapSVG('back'));
for (const area of AREAS) write(`svg/area-${area.areaId}.svg`, areaMapSVG(area));
write('preview.html', previewHTML());

const metadata = {
  asset_id: 'anatomy-region-maps-v0',
  source_url_or_provider: 'Generated from anatomy-explorer geometry (skeleton.ts + regions.ts)',
  license: 'Original work — no third-party assets used. Free to relicense within this project.',
  author_or_attribution: 'Generated in-project',
  software_and_version: 'generate-region-maps.mjs (this folder)',
  derived_from: ['src/lib/anatomy/geometry/skeleton.ts', 'src/lib/anatomy/geometry/regions.ts', 'src/data/areas.json'],
  areas: AREAS.map((a) => a.areaId),
  format: 'SVG',
  reviewed_by: '',
  reviewed_date: '',
  status: 'draft',
  note: 'Navigation aid, not a clinical illustration. Not wired into the app. Not clinically reviewed.',
};
write('metadata.json', JSON.stringify(metadata, null, 2) + '\n');

console.log('Wrote ' + written.length + ' files:');
for (const w of written) console.log('  ' + w);
