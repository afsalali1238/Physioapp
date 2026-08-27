import { writeFileSync } from 'node:fs';
import { VIEWBOX, SILHOUETTE, DETAIL } from './skeleton.mjs';
import { REGIONS, focusViewBox } from './regions.mjs';

const PALETTE = ['#0f766e','#b91c1c','#1d4ed8','#a16207','#7e22ce','#be185d','#0369a1','#4d7c0f'];

function body(view) {
  const filled = SILHOUETTE.filled.map((d) => `<path d="${d}" fill="#cfd8dc"/>`).join('');
  const strokes = SILHOUETTE.strokes
    .map((s) => `<path d="${s.d}" stroke="#cfd8dc" stroke-width="${s.w}" stroke-linecap="round" fill="none"/>`)
    .join('');
  const detail = DETAIL[view]
    .map((d) => `<path d="${d}" stroke="#94a3b8" stroke-width="2" fill="none" stroke-linecap="round"/>`)
    .join('');
  return `<g>${strokes}${filled}${strokes}${detail}</g>`;
}

function regionsFor(view) {
  return REGIONS.filter((r) => r.views.includes(view)).map((r, i) => {
    const c = PALETTE[i % PALETTE.length];
    const shapes = r.shapes
      .map((s) => `<path d="${s.d}" stroke="${c}" stroke-width="${s.w}" stroke-linecap="round" fill="none" opacity=".45"/>`)
      .join('');
    return `<g>${shapes}</g>`;
  }).join('');
}

function labelsFor(view) {
  return REGIONS.filter((r) => r.views.includes(view)).map((r) => {
    const n = r.shapes[0].d.match(/-?\d+(\.\d+)?/g).map(Number);
    const x = (n[0] + n[2]) / 2, y = (n[1] + n[3]) / 2;
    return `<text x="${x}" y="${y}" font-size="9" font-family="monospace" fill="#0b0f14"
      text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">${r.id}</text>`;
  }).join('');
}

function panel(view, title, opts = {}) {
  const vb = opts.viewBox ?? VIEWBOX;
  return `<figure>
    <svg viewBox="${vb}" width="230" height="594" style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px">
      ${body(view)}
      ${opts.regions !== false ? regionsFor(view) : ''}
      ${opts.labels ? labelsFor(view) : ''}
    </svg>
    <figcaption>${title}</figcaption>
  </figure>`;
}

const zoomPanels = ['neck', 'shoulder-l', 'lower-back', 'knee-r', 'wrist-l', 'ankle-r']
  .map((id) => {
    const r = REGIONS.find((x) => x.id === id);
    const view = r.views.includes('front') ? 'front' : 'back';
    return `<figure>
      <svg viewBox="${focusViewBox(r)}" width="150" height="388"
           style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px">
        ${body(view)}
        <g>${r.shapes.map((s) => `<path d="${s.d}" stroke="#b91c1c" stroke-width="${s.w}" stroke-linecap="round" fill="none" opacity=".5"/>`).join('')}</g>
      </svg>
      <figcaption>zoom · ${id}</figcaption>
    </figure>`;
  }).join('');

const html = `<!doctype html><meta charset="utf-8">
<style>
 body{margin:0;padding:18px;background:#fff;font:12px/1.4 system-ui,sans-serif;color:#0b0f14}
 h2{font-size:13px;margin:16px 0 8px;letter-spacing:.08em;text-transform:uppercase;color:#475569}
 .row{display:flex;gap:14px;flex-wrap:wrap;align-items:flex-start}
 figure{margin:0;display:flex;flex-direction:column;gap:5px;align-items:center}
 figcaption{font:10px monospace;color:#475569}
</style>
<h2>Silhouette only</h2>
<div class="row">
  ${panel('front','front', {regions:false})}
  ${panel('back','back', {regions:false})}
</div>
<h2>Hotspots on the body</h2>
<div class="row">
  ${panel('front','front + regions')}
  ${panel('back','back + regions')}
  ${panel('front','front labelled', {labels:true})}
  ${panel('back','back labelled', {labels:true})}
</div>
<h2>Region zoom framing</h2>
<div class="row">${zoomPanels}</div>`;

writeFileSync(new URL('./out.html', import.meta.url), html);
console.log('regions:', REGIONS.length,
  '| front:', REGIONS.filter(r=>r.views.includes('front')).length,
  '| back:', REGIONS.filter(r=>r.views.includes('back')).length);
