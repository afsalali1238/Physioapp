/**
 * The body regions a patient is actually offered — derived, never hardcoded.
 *
 * ── A-005, implemented ─────────────────────────────────────────────────────
 * "A build-time snapshot of `areas.json` and `items.json` decides which regions
 * exist. Before this, the locator offered `upper-back` and `foot` (zero
 * exercises — dead ends) and omitted `elbow` (two exercises — unreachable)."
 *
 * That decision was written and then not implemented: the previous version of
 * this file hand-listed nine regions including `upper-back` and `foot`, and
 * still had no `elbow`. The drift it was written to prevent was live.
 *
 * Now there is one path: geometry comes from `lib/anatomy/geometry` (A-006,
 * every capsule anchored to two named joints), availability comes from the
 * published library (A-005), and `scripts/check-anatomy.ts` fails the build if
 * the two disagree. There is nothing to keep in sync by hand.
 */

import {
  GEOMETRY_REGIONS,
  focusViewBox,
  type BodyView,
  type GeometryRegion,
  type RegionSide,
} from '../../lib/anatomy/geometry/regions';
import { getAreaRoutes, getReachableAreaIds, type AreaRoute } from '../../lib/library';

export type { BodyView, RegionSide };

export interface BodyRegion {
  readonly id: string;
  /** Joins to `area_id` in the content library. */
  readonly areaId: string;
  readonly name: string;
  readonly side: RegionSide;
  readonly views: readonly BodyView[];
  /** Zoom frame used when this region is selected. */
  readonly focusViewBox: string;
  readonly shapes: readonly { readonly d: string; readonly w: number }[];
  readonly zones: readonly string[];
  /** Sections this region has published content in. Never empty. */
  readonly routes: readonly AreaRoute[];
}

/**
 * Regions with reachable content, in the order the geometry declares them
 * (head to toe — D-014).
 *
 * A region whose area has no published items is omitted entirely rather than
 * shown disabled: a tappable shape that leads nowhere is the dead end A-005
 * names, and a greyed one still invites the tap.
 */
export async function getBodyRegions(): Promise<BodyRegion[]> {
  const reachable = await getReachableAreaIds();

  const regions: BodyRegion[] = [];
  for (const geometry of GEOMETRY_REGIONS) {
    if (!reachable.has(geometry.areaId)) continue;
    const routes = await getAreaRoutes(geometry.areaId);
    if (routes.length === 0) continue;
    regions.push(toBodyRegion(geometry, routes));
  }
  return regions;
}

/** The regions visible on one view. `lower-back` is back-only — see regions.ts. */
export async function getBodyRegionsForView(view: BodyView): Promise<BodyRegion[]> {
  const regions = await getBodyRegions();
  return regions.filter((region) => region.views.includes(view));
}

/**
 * The distinct body areas behind the regions, for the plain-text list that sits
 * beside the map. Left and right knee are one entry here: a patient choosing
 * from a list wants "Knee", not "Left knee" and "Right knee", because the
 * content is the same either way.
 */
export interface AreaChoice {
  readonly areaId: string;
  readonly name: string;
  readonly routes: readonly AreaRoute[];
}

export async function getAreaChoices(): Promise<AreaChoice[]> {
  const regions = await getBodyRegions();
  const seen = new Map<string, AreaChoice>();
  for (const region of regions) {
    if (seen.has(region.areaId)) continue;
    seen.set(region.areaId, {
      areaId: region.areaId,
      name: region.routes[0]?.name ?? region.name,
      routes: region.routes,
    });
  }
  return [...seen.values()];
}

function toBodyRegion(geometry: GeometryRegion, routes: readonly AreaRoute[]): BodyRegion {
  return {
    id: geometry.id,
    areaId: geometry.areaId,
    // Prefer the clinician's own name for the area over the geometry label, so
    // the map and the library never disagree about what a body part is called.
    name: sideLabel(geometry, routes[0]?.name ?? geometry.label),
    side: geometry.side,
    views: geometry.views,
    focusViewBox: focusViewBox(geometry),
    shapes: geometry.shapes,
    zones: geometry.zones,
    routes,
  };
}

/**
 * "Left knee" / "Right knee" / "Neck". Sided regions need the side in their
 * accessible name or a screen-reader user hears the same label twice with no
 * way to tell the two shapes apart.
 */
function sideLabel(geometry: GeometryRegion, areaName: string): string {
  if (geometry.side === 'l') return `Left ${areaName.toLowerCase()}`;
  if (geometry.side === 'r') return `Right ${areaName.toLowerCase()}`;
  return areaName;
}
