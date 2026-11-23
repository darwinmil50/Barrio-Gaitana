import { describe, expect, it } from 'vitest';
import {
  filterInsideBoundary, isInsideBoundary, pointInPolygon, pointInRing, ringsFromGeometry,
} from './geo';
import { boundary, INSIDE, OUTSIDE, place } from '../test/fixtures';
import { boundaryGeometries, bboxFromBoundary, bboxToBounds } from './geoBoundary';

describe('geometría y point-in-polygon', () => {
  const ring = [[0, 0], [10, 0], [10, 10], [0, 10], [0, 0]] as [number, number][];

  it('detecta puntos dentro y fuera de un anillo', () => {
    expect(pointInRing([5, 5], ring)).toBe(true);
    expect(pointInRing([11, 5], ring)).toBe(false);
  });

  it('respeta los huecos de un polígono', () => {
    const hole = [[3, 3], [7, 3], [7, 7], [3, 7], [3, 3]] as [number, number][];
    expect(pointInPolygon([5, 5], [ring, hole])).toBe(false);
    expect(pointInPolygon([1, 1], [ring, hole])).toBe(true);
  });

  it('lee Polygon y MultiPolygon de GeoJSON', () => {
    expect(ringsFromGeometry({ type: 'Polygon', coordinates: [ring] })).toHaveLength(1);
    expect(ringsFromGeometry({ type: 'MultiPolygon', coordinates: [[ring], [ring]] })).toHaveLength(2);
    expect(ringsFromGeometry(null)).toEqual([]);
  });

  it('filtra los puntos fuera del polígono del barrio', () => {
    const geometries = boundaryGeometries(boundary);
    expect(isInsideBoundary(INSIDE, geometries)).toBe(true);
    expect(isInsideBoundary(OUTSIDE, geometries)).toBe(false);
    const result = filterInsideBoundary([INSIDE, OUTSIDE, place('x', 'X', 'crimes', null as never, null as never)], geometries);
    expect(result.map((item) => item.id)).toEqual(['in-1']);
    expect(filterInsideBoundary([INSIDE], [])).toEqual([]);
  });

  it('calcula la bbox desde el GeoJSON', () => {
    const bbox = bboxFromBoundary(boundary);
    expect(bbox?.[0]).toBeCloseTo(-74.11303775, 6);
    expect(bboxToBounds(bbox!)[0][0]).toBeCloseTo(4.738106947, 6);
  });
});
