import { CATEGORY_BY_KEY, type CategoryKey } from '../models/category';
import type { Envelope } from '../models/envelope';
import type { BoundaryCollection } from '../models/territory';
import type { ApiClient, QueryParams } from './apiClient';

export const NEIGHBORHOOD_PATH = '/api/neighborhood';
export const BOUNDARY_PATH = '/api/neighborhood/boundary';

export function envelopePath(key: CategoryKey): string {
  return CATEGORY_BY_KEY[key].endpoint;
}

export function requestNeighborhood(client: ApiClient): Promise<Envelope<unknown>> {
  return client.get<Envelope<unknown>>(NEIGHBORHOOD_PATH);
}

export function requestBoundary(client: ApiClient): Promise<BoundaryCollection> {
  return client.get<BoundaryCollection>(BOUNDARY_PATH);
}

export function requestCategory(
  client: ApiClient,
  key: CategoryKey,
  params: QueryParams = {},
): Promise<Envelope<unknown>> {
  return client.get<Envelope<unknown>>(envelopePath(key), params);
}
