import type { GeometryLike } from '../models/territory';
import type { Locatable } from '../models/place';

export type Point = [number, number];
export type Ring = Point[];
export type PolygonRings = Ring[];

function asPoint(value: unknown): Point | null {
  if (!Array.isArray(value) || value.length < 2) return null;
  const [lon, lat] = value;
  if (typeof lon !== 'number' || typeof lat !== 'number') return null;
  if (!Number.isFinite(lon) || !Number.isFinite(lat)) return null;
  return [lon, lat];
}

export function pointInRing(point: Point, ring: Ring): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = yi > point[1] !== yj > point[1]
      && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

export function pointInPolygon(point: Point, rings: PolygonRings): boolean {
  if (rings.length === 0 || !pointInRing(point, rings[0])) return false;
  return !rings.slice(1).some((hole) => pointInRing(point, hole));
}

function readRings(value: unknown): PolygonRings {
  if (!Array.isArray(value)) return [];
  return value
    .map((ring) => (Array.isArray(ring) ? ring.map(asPoint).filter((p): p is Point => p !== null) : []))
    .filter((ring) => ring.length >= 3);
}

export function ringsFromGeometry(geometry: GeometryLike | Record<string, unknown> | null): PolygonRings[] {
  if (!geometry || geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon') return [];
  if (geometry.type === 'Polygon') return [readRings(geometry.coordinates)];
  if (!Array.isArray(geometry.coordinates)) return [];
  return geometry.coordinates.map(readRings);
}

export function isInsideGeometry(point: Point, geometry: GeometryLike | Record<string, unknown> | null): boolean {
  return ringsFromGeometry(geometry).some((polygon) => pointInPolygon(point, polygon));
}

export function isInsideBoundary(
  place: Locatable,
  geometries: Array<GeometryLike | Record<string, unknown>>,
): boolean {
  if (place.latitude === null || place.longitude === null) return false;
  const point: Point = [place.longitude, place.latitude];
  return geometries.some((geometry) => isInsideGeometry(point, geometry));
}

export function filterInsideBoundary<T extends Locatable>(
  places: T[],
  geometries: Array<GeometryLike | Record<string, unknown>>,
): T[] {
  if (geometries.length === 0) return [];
  return places.filter((place) => isInsideBoundary(place, geometries));
}
