import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export type LedgerStatus = 'prototype' | 'draft' | 'approved' | 'retired';

export interface MediaLedgerEntry {
  readonly assetId: string;
  readonly path: string;
  readonly kind: 'anatomy-model' | 'exercise-poster' | 'exercise-preview' | 'exercise-motion';
  readonly status: LedgerStatus;
  readonly sourceUrl: string;
  readonly generationMethod: 'original' | 'generator' | 'adapted' | 'temporary-third-party' | 'manual';
  readonly license: string;
  readonly attribution: string;
  readonly fileHash: string;
  readonly bytes: number;
  readonly replacementRequired: boolean;
  readonly referenceSources: readonly string[];
  readonly reviewedBy: string;
  readonly reviewedDate: string;
  readonly notes: string;
}

const sha256 = (file: string) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/** Build-time provenance ledger. Prototype media is never a patient publication input. */
export const MEDIA_LEDGER: readonly MediaLedgerEntry[] = [
  {
    assetId: 'fallback-body-map-2d', path: '/anatomy/fallback-body-map.svg', kind: 'anatomy-model',
    status: 'draft', sourceUrl: 'Original code-native fallback derived from the shared body geometry', generationMethod: 'original',
    license: 'Internal Web Distribution License', attribution: 'Anatomy Explorer Anatomy Team',
    fileHash: '3456cce3f8127b0e3ed8f9dad1adceabe52a01449c1e7f3ce0f6fa53583cf9b6', bytes: 984, replacementRequired: true, referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Accessible fallback; clinician visual review pending.',
  },
  {
    assetId: 'locator-fullbody-3d', path: '/anatomy/models/human-body-locator.glb', kind: 'anatomy-model',
    status: 'prototype', sourceUrl: 'Deterministic simplified anatomical capsule mesh', generationMethod: 'original',
    license: 'Internal Web Distribution License', attribution: 'Anatomy Explorer 3D Geometry Project',
    fileHash: '01c946c5ff8c54c1642f94b215ba9a816bc6d2be742a404d8048e806112aeacb', bytes: 83648,
    replacementRequired: true, referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Temporary locator blockout; clinician visual review pending.',
  },
  {
    assetId: 'ex-neck-02-storyboard-start', path: '/exercise-media/prototypes/ex-neck-02/storyboard_ex_neck_02_start_1787812497376.jpg', kind: 'exercise-poster',
    status: 'prototype', sourceUrl: 'Internal storyboard prototype', generationMethod: 'generator', license: 'Internal prototype only', attribution: 'Anatomy Explorer prototype production',
    fileHash: 'ee7ece50045a4da61448c9a49e841fb7b9997672e7fabefc9416e7531ef53b78', bytes: 155195, replacementRequired: true,
    referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Storyboard reference; not a patient media asset.',
  },
  {
    assetId: 'ex-neck-02-storyboard-middle', path: '/exercise-media/prototypes/ex-neck-02/storyboard_ex_neck_02_middle_1787812509099.jpg', kind: 'exercise-poster',
    status: 'prototype', sourceUrl: 'Internal storyboard prototype', generationMethod: 'generator', license: 'Internal prototype only', attribution: 'Anatomy Explorer prototype production',
    fileHash: 'fa9621c4a6722243fa54d92b53c0ce6ec07bbe8d2885bdb0d833f401853b86a6', bytes: 152356, replacementRequired: true,
    referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Storyboard reference; not a patient media asset.',
  },
  {
    assetId: 'ex-neck-02-storyboard-end', path: '/exercise-media/prototypes/ex-neck-02/storyboard_ex_neck_02_end_1787812520687.jpg', kind: 'exercise-poster',
    status: 'prototype', sourceUrl: 'Internal storyboard prototype', generationMethod: 'generator', license: 'Internal prototype only', attribution: 'Anatomy Explorer prototype production',
    fileHash: 'f85151113f2cf114d0b3ba0142b76652898dfcae3ca59cea6a544639402f66d7', bytes: 188744, replacementRequired: true,
    referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Storyboard reference; not a patient media asset.',
  },
  {
    assetId: 'ex-neck-02-motion', path: '/exercise-media/prototypes/ex-neck-02/ex-neck-02-motion.mp4', kind: 'exercise-motion',
    status: 'prototype', sourceUrl: 'Deterministic pose interpolation from the internal joint-angle figure', generationMethod: 'manual',
    license: 'Internal prototype only', attribution: 'Anatomy Explorer prototype production',
    fileHash: '6414de80a073ec08f9a63548abadcae82881ccef18721310ccd4c48687da5dec', bytes: 18691,
    replacementRequired: true, referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Internal movement-fidelity review only.',
  },
  {
    assetId: 'ex-neck-02-poster', path: '/exercise-media/prototypes/ex-neck-02/ex-neck-02-poster.png', kind: 'exercise-poster',
    status: 'prototype', sourceUrl: 'Frame rendered from the deterministic prototype motion', generationMethod: 'manual',
    license: 'Internal prototype only', attribution: 'Anatomy Explorer prototype production',
    fileHash: '313a385a71482a142a1900a5d45dce195fac3c51503839e2fc3e7d5ac8376fb9', bytes: 10376,
    replacementRequired: true, referenceSources: [], reviewedBy: '', reviewedDate: '', notes: 'Poster-first fallback for internal review only.',
  },
];

export function auditMediaLedger(entries: readonly MediaLedgerEntry[], baseDir: string): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.assetId)) errors.push(`Duplicate ledger assetId "${entry.assetId}".`);
    ids.add(entry.assetId);
    if (!entry.sourceUrl || !entry.license || !entry.attribution) errors.push(`Asset "${entry.assetId}" is missing provenance metadata.`);
    if (entry.status !== 'approved' && !entry.replacementRequired) errors.push(`Asset "${entry.assetId}" must require replacement while ${entry.status}.`);
    if (entry.status === 'approved' && (!entry.reviewedBy || !/^\d{4}-\d{2}-\d{2}$/.test(entry.reviewedDate))) errors.push(`Approved asset "${entry.assetId}" lacks genuine review metadata.`);
    const file = path.join(baseDir, 'public', ...entry.path.replace(/^\//, '').split('/'));
    if (!fs.existsSync(file)) { errors.push(`Asset "${entry.assetId}" is missing at "${entry.path}".`); continue; }
    const stat = fs.statSync(file);
    if (stat.size !== entry.bytes && entry.bytes !== 0) errors.push(`Asset "${entry.assetId}" bytes changed (ledger ${entry.bytes}, actual ${stat.size}).`);
    if (entry.fileHash && sha256(file) !== entry.fileHash) errors.push(`Asset "${entry.assetId}" hash changed from the ledger.`);
  }
  return errors;
}
