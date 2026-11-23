import { CATEGORIES, type CategoryKey } from '../models/category';
import type { Envelope, NeighborhoodInfo, Scope } from '../models/envelope';
import type { Place, SourceInfo } from '../models/place';
import { GAITANA_TERRITORY, type BoundaryCollection } from '../models/territory';
import { requestCategory } from './endpoints';
import type { ApiClient, QueryParams } from './apiClient';

export function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? value as Record<string, unknown> : {};
}

export function mapSource(value: unknown): SourceInfo {
  const raw = asRecord(value);
  return {
    name: typeof raw.name === 'string' ? raw.name : 'Fuente no identificada',
    url: typeof raw.url === 'string' ? raw.url : '',
    license: typeof raw.license === 'string' ? raw.license : 'No especificada',
    updated_at: typeof raw.updated_at === 'string' ? raw.updated_at : null,
  };
}

export function mapNeighborhood(value: unknown): NeighborhoodInfo {
  const raw = asRecord(value);
  return {
    name: typeof raw.name === 'string' ? raw.name : GAITANA_TERRITORY.name,
    code: typeof raw.code === 'string' ? raw.code : GAITANA_TERRITORY.code,
    locality: typeof raw.locality === 'string' ? raw.locality : GAITANA_TERRITORY.locality,
    city: typeof raw.city === 'string' ? raw.city : GAITANA_TERRITORY.city,
  };
}

export function mapPlace(value: unknown, category: CategoryKey, index = 0): Place {
  const raw = asRecord(value);
  const reported = typeof raw.category === 'string' ? raw.category : '';
  const known = CATEGORIES.some((item) => item.key === reported);
  return {
    id: typeof raw.id === 'string' ? raw.id : `${category}-${index}`,
    name: typeof raw.name === 'string' ? raw.name : 'Sin nombre registrado',
    category: known ? reported as CategoryKey : category,
    latitude: typeof raw.latitude === 'number' ? raw.latitude : null,
    longitude: typeof raw.longitude === 'number' ? raw.longitude : null,
    geometry: typeof raw.geometry === 'object' && raw.geometry !== null
      ? raw.geometry as Record<string, unknown> : null,
    properties: asRecord(raw.properties),
    source: mapSource(raw.source),
  };
}

type ItemMapper<T> = (value: unknown, index: number) => T;

export function mapEnvelope<T>(value: unknown, mapper: ItemMapper<T>): Envelope<T> {
  const raw = asRecord(value);
  const data = Array.isArray(raw.data) ? raw.data.map(mapper) : [];
  const scope: Scope = raw.scope === 'locality' ? 'locality' : 'neighborhood';
  return {
    scope,
    neighborhood: mapNeighborhood(raw.neighborhood),
    source: mapSource(raw.source),
    count: typeof raw.count === 'number' ? raw.count : data.length,
    data,
    note: typeof raw.note === 'string' ? raw.note : null,
    context: Array.isArray(raw.context) ? raw.context : [],
  };
}

export function mapBoundary(value: unknown): BoundaryCollection {
  const raw = asRecord(value);
  return {
    type: 'FeatureCollection',
    features: Array.isArray(raw.features) ? raw.features as BoundaryCollection['features'] : [],
    source: typeof raw.source === 'string' ? raw.source : undefined,
  };
}

export type CategoryLoader = (client: ApiClient, params?: QueryParams) => Promise<Envelope<Place>>;

export function createCategoryLoader(key: CategoryKey): CategoryLoader {
  return async (client, params = {}) =>
    mapEnvelope(await requestCategory(client, key, params), (item) => mapPlace(item, key));
}

export const CATEGORY_LOADERS = Object.fromEntries(
  CATEGORIES.map((category) => [category.key, createCategoryLoader(category.key)]),
) as Record<CategoryKey, CategoryLoader>;

export async function loadBoundary(client: ApiClient): Promise<BoundaryCollection> {
  const raw = await client.get<unknown>('/api/neighborhood/boundary');
  return mapBoundary(raw);
}
