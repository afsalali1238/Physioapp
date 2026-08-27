/**
 * Client-side device and WebGL capability detection.
 * Module V2: 3D-TECHNICAL-ARCHITECTURE.md §8
 */

export interface DeviceCapabilities {
  webgl: boolean;
  reducedMotion: boolean;
  lowMemory: boolean;
  canRun3D: boolean;
}

export function checkCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined') {
    return {
      webgl: false,
      reducedMotion: false,
      lowMemory: false,
      canRun3D: false,
    };
  }

  // 1. Reduced motion check
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 2. Device memory check (if supported by browser)
  const nav = navigator as any;
  const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory < 2;

  // 3. WebGL capability check
  let webgl = false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    webgl = gl !== null;
  } catch (e) {
    webgl = false;
  }

  const canRun3D = webgl && !lowMemory;

  return {
    webgl,
    reducedMotion,
    lowMemory,
    canRun3D,
  };
}
