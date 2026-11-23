import type { BoundaryCollection, BoundingBox, GeometryLike } from '../models/territory';

export function boundaryGeometries(boundary: BoundaryCollection | null): GeometryLike[] {
  if (!boundary || !Array.isArray(boundary.features)) return [];
  return boundary.features
    .filter((feature) => feature?.geometry !== null && feature?.geometry !== undefined)
    .map((feature) => feature.geometry as GeometryLike);
}

function collectPositions(value: unknown, output: number[][]): void {
  if (!Array.isArray(value)) return;
  if (value.length >= 2 && typeof value[0] === 'number' && typeof value[1] === 'number') {
    output.push(value as number[]);
    return;
  }
  for (const item of value) collectPositions(item, output);
}

export function bboxFromBoundary(boundary: BoundaryCollection | null): BoundingBox | null {
  const positions: number[][] = [];
  for (const geometry of boundaryGeometries(boundary)) collectPositions(geometry.coordinates, positions);
  if (positions.length === 0) return null;
  const longitudes = positions.map((position) => position[0]);
  const latitudes = positions.map((position) => position[1]);
  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ];
}

export function bboxToBounds(bbox: BoundingBox): [[number, number], [number, number]] {
  return [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
}
