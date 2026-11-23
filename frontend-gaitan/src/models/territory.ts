import type { SourceInfo } from './place';

export type BoundingBox = [number, number, number, number];

export interface GeometryLike {
  type: string;
  coordinates: unknown;
}

export interface BoundaryFeature {
  type: 'Feature';
  id?: string | number;
  geometry: GeometryLike | null;
  properties: Record<string, unknown>;
}

export interface BoundaryCollection {
  type: 'FeatureCollection';
  features: BoundaryFeature[];
  source?: string | SourceInfo;
}

export interface TerritoryInfo {
  name: string;
  code: string;
  locality: string;
  city: string;
  bbox: BoundingBox;
}

export const GAITANA_TERRITORY: TerritoryInfo = {
  name: 'La Gaitana',
  code: '110292',
  locality: 'Suba',
  city: 'Bogotá D.C.',
  bbox: [-74.11303774999999, 4.738106947000006, -74.10661472700002, 4.745299412999998],
};

export const CADASTRAL_SECTOR = '009216';
export const BOUNDARY_SOURCE = 'SDIS — Barrio Común (código 110292)';

export const APP_TITLE = 'GAITÁN TERRITORIAL';
export const APP_SUBTITLE = 'Sistema de información y consulta territorial del barrio Gaitán, Suba';
