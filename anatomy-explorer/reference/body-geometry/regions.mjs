import { J, lerp, cap } from './skeleton.mjs';

// Region hotspots are derived from the same joints as the silhouette.
// `w` is the stroke width of a round-capped capsule — a zero-length capsule is a disc.

const A = (a, b, t) => lerp(a, b, t);

/** side: 'l' | 'r' are the PATIENT's sides. */
const mk = (id, areaId, views, side, label, shapes, zones) => ({
  id, areaId, views, side, label, shapes, zones,
});

const NECK_ZONES = ['Back of neck', 'Side of neck', 'Base of neck and top of shoulders'];
const SHOULDER_ZONES = ['Front of shoulder', 'Top of shoulder', 'Back of shoulder', 'Outside of the upper arm'];
const ELBOW_ZONES = ['Outer elbow', 'Inner elbow', 'Point of the elbow'];
const WRIST_ZONES = ['Back of wrist', 'Palm side of wrist', 'Thumb side of wrist'];
const LOWBACK_ZONES = ['Centre of lower back', 'One side of lower back', 'Low down, towards the buttock'];
const HIP_ZONES = ['Front of hip and groin', 'Side of hip', 'Back of hip and buttock'];
const KNEE_ZONES = ['Front of knee and kneecap', 'Inner side of knee', 'Outer side of knee', 'Back of knee'];
const ANKLE_ZONES = ['Outer ankle', 'Inner ankle', 'Front of ankle', 'Back of ankle and heel cord'];

const limb = (side) => side === 'l'
  ? { sh: J.shoulderL, el: J.elbowL, wr: J.wristL, hip: J.hipL, tr: J.trochL, kn: J.kneeL, an: J.ankleL, toe: J.toeL }
  : { sh: J.shoulderR, el: J.elbowR, wr: J.wristR, hip: J.hipR, tr: J.trochR, kn: J.kneeR, an: J.ankleR, toe: J.toeR };

function sided(side) {
  const p = limb(side);
  const s = side === 'l' ? 'Left' : 'Right';
  return [
    mk(`shoulder-${side}`, 'shoulder', ['front', 'back'], side, `${s} shoulder`,
      [{ d: cap(p.sh, A(p.sh, p.el, 0.24)), w: 40 }], SHOULDER_ZONES),

    mk(`elbow-${side}`, 'elbow', ['front', 'back'], side, `${s} elbow`,
      [{ d: cap(A(p.sh, p.el, 0.86), A(p.el, p.wr, 0.16)), w: 34 }], ELBOW_ZONES),

    mk(`wrist-${side}`, 'wrist', ['front', 'back'], side, `${s} wrist`,
      [{ d: cap(A(p.el, p.wr, 0.88), p.wr), w: 30 }], WRIST_ZONES),

    // Anchored on the trochanter, so the two sides never meet at the midline.
    mk(`hip-${side}`, 'hip', ['front', 'back'], side, `${s} hip`,
      [{ d: cap(p.tr, A(p.hip, p.kn, 0.10)), w: 44 }], HIP_ZONES),

    mk(`knee-${side}`, 'knee', ['front', 'back'], side, `${s} knee`,
      [{ d: cap(A(p.hip, p.kn, 0.90), A(p.kn, p.an, 0.11)), w: 44 }], KNEE_ZONES),

    mk(`ankle-${side}`, 'ankle', ['front', 'back'], side, `${s} ankle`,
      [{ d: cap(A(p.kn, p.an, 0.90), p.an), w: 34 }], ANKLE_ZONES),
  ];
}

export const REGIONS = [
  mk('neck', 'neck', ['front', 'back'], 'c', 'Neck',
    [{ d: cap([120, 102], [120, 126]), w: 40 }], NECK_ZONES),

  // BACK ONLY. This is the bug fix: the lower back was previously tappable on
  // the front of the body, over the abdomen.
  mk('lower-back', 'lower-back', ['back'], 'c', 'Lower back',
    [{ d: cap([120, 236], [120, 278]), w: 56 }], LOWBACK_ZONES),

  ...sided('l'),
  ...sided('r'),
];

/** Bounding box of a region's capsules, in viewBox units. */
export function bbox(region) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const s of region.shapes) {
    const nums = s.d.match(/-?\d+(\.\d+)?/g).map(Number);
    for (let i = 0; i < nums.length; i += 2) {
      const x = nums[i], y = nums[i + 1], r = s.w / 2;
      x0 = Math.min(x0, x - r); y0 = Math.min(y0, y - r);
      x1 = Math.max(x1, x + r); y1 = Math.max(y1, y + r);
    }
  }
  return { x0, y0, x1, y1 };
}

/** A zoom viewBox that frames the region with breathing room, clamped to the canvas. */
export function focusViewBox(region, pad = 58) {
  const b = bbox(region);
  let x = b.x0 - pad, y = b.y0 - pad;
  let w = (b.x1 - b.x0) + pad * 2, h = (b.y1 - b.y0) + pad * 2;
  // keep the 240:620 aspect so the figure never distorts
  const target = 240 / 620;
  if (w / h > target) h = w / target; else w = h * target;
  x = b.x0 - (w - (b.x1 - b.x0)) / 2;
  y = b.y0 - (h - (b.y1 - b.y0)) / 2;
  x = Math.max(-30, Math.min(x, 270 - w));
  y = Math.max(-20, Math.min(y, 640 - h));
  return [x, y, w, h].map((n) => Math.round(n)).join(' ');
}
