import { useCallback, useEffect, useRef, useState } from 'react';
import type { CategoryKey } from '../models/category';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import { apiClient, type ApiClient, type QueryParams } from '../services/apiClient';
import { CATEGORIES } from '../models/category';
import { emptyEnvelopes, loadEnvelopes } from '../services/loadEnvelopes';
import { clearCacheByPrefix } from '../utils/cache';
import { envelopePath } from '../services/endpoints';

export interface TerritoryDataState {
  envelopes: EnvelopeMap<Place>;
  loading: boolean;
  errors: Partial<Record<CategoryKey, string>>;
  lastUpdated: number | null;
  updates: number;
  refresh: (silent?: boolean) => Promise<void>;
}

export function useTerritoryData(
  client: ApiClient = apiClient,
  params: QueryParams = {},
): TerritoryDataState {
  const [envelopes, setEnvelopes] = useState<EnvelopeMap<Place>>(emptyEnvelopes);
  const [errors, setErrors] = useState<Partial<Record<CategoryKey, string>>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [updates, setUpdates] = useState(0);
  const mounted = useRef(true);
  const q = params.q ?? '';
  const limit = params.limit;

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    for (const category of CATEGORIES) clearCacheByPrefix(envelopePath(category.key));
    const result = await loadEnvelopes(client, { q, limit });
    if (mounted.current) {
      setEnvelopes(result.envelopes);
      setErrors(result.errors);
      setLoading(false);
      setLastUpdated(Date.now());
      setUpdates((count) => count + 1);
    }
  }, [client, q, limit]);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    return () => { mounted.current = false; };
  }, [refresh]);

  return { envelopes, loading, errors, lastUpdated, updates, refresh };
}
