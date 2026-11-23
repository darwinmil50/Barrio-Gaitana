import { CATEGORIES, type CategoryKey } from '../models/category';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import { errorMessage } from './apiError';
import type { ApiClient, QueryParams } from './apiClient';
import { envelopePath } from './endpoints';
import { CATEGORY_LOADERS } from './mappers';
import { buildCacheKey, getCached, setCached } from '../utils/cache';

export interface LoadResult {
  envelopes: EnvelopeMap<Place>;
  errors: Partial<Record<CategoryKey, string>>;
}

export function emptyEnvelopes(): EnvelopeMap<Place> {
  return Object.fromEntries(CATEGORIES.map((item) => [item.key, null])) as EnvelopeMap<Place>;
}

export async function loadEnvelopes(client: ApiClient, params: QueryParams): Promise<LoadResult> {
  const envelopes = emptyEnvelopes();
  const errors: Partial<Record<CategoryKey, string>> = {};
  await Promise.all(CATEGORIES.map(async (category) => {
    const key = buildCacheKey(envelopePath(category.key), params);
    try {
      const cached = getCached<EnvelopeMap<Place>[CategoryKey]>(key);
      envelopes[category.key] = cached ?? setCached(key, await CATEGORY_LOADERS[category.key](client, params));
    } catch (error) {
      errors[category.key] = errorMessage(error);
    }
  }));
  return { envelopes, errors };
}
