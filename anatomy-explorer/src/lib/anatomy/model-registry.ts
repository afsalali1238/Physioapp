export interface BodyRegionVisual {
  readonly regionId: string;
  readonly meshNames: readonly string[];
  readonly hitMeshNames: readonly string[];
  readonly cameraPreset: 'neck' | 'shoulder-left' | 'shoulder-right';
}

/** Stable application IDs mapped to the current prototype GLB. */
export const BODY_REGION_VISUALS: readonly BodyRegionVisual[] = [
  { regionId: 'neck', meshNames: ['region-neck'], hitMeshNames: ['region-neck'], cameraPreset: 'neck' },
  { regionId: 'shoulder-l', meshNames: ['region-shoulder-l'], hitMeshNames: ['region-shoulder-l'], cameraPreset: 'shoulder-left' },
  { regionId: 'shoulder-r', meshNames: ['region-shoulder-r'], hitMeshNames: ['region-shoulder-r'], cameraPreset: 'shoulder-right' },
];

export const CAMERA_PRESETS = {
  neck: { position: [0, 1.9, 3.15], target: [0, 1.72, 0] },
  'shoulder-left': { position: [-0.45, 1.58, 3.25], target: [-0.48, 1.35, 0] },
  'shoulder-right': { position: [0.45, 1.58, 3.25], target: [0.48, 1.35, 0] },
  full: { position: [0, 1.2, 5.5], target: [0, 0.45, 0] },
} as const;
