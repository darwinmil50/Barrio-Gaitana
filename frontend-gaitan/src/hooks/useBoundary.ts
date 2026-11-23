import { useCallback, useEffect, useRef, useState } from 'react';
import type { NeighborhoodInfo } from '../models/envelope';
import { GAITANA_TERRITORY, type BoundaryCollection } from '../models/territory';
import { apiClient, type ApiClient } from '../services/apiClient';
import { errorMessage } from '../services/apiError';
import { BOUNDARY_PATH, NEIGHBORHOOD_PATH, requestNeighborhood } from '../services/endpoints';
import { loadBoundary, mapEnvelope } from '../services/mappers';
import { clearCacheByPrefix, getCached, setCached } from '../utils/cache';

export interface BoundaryState {
  boundary: BoundaryCollection | null;
  neighborhood: NeighborhoodInfo;
  boundarySource: string;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useBoundary(client: ApiClient = apiClient): BoundaryState {
  const [boundary, setBoundary] = useState<BoundaryCollection | null>(null);
  const [neighborhood, setNeighborhood] = useState<NeighborhoodInfo>(GAITANA_TERRITORY);
  const [boundarySource, setBoundarySource] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = getCached<BoundaryCollection>(BOUNDARY_PATH);
      const shape = cached ?? setCached(BOUNDARY_PATH, await loadBoundary(client));
      const info = mapEnvelope(await requestNeighborhood(client), (item) => item).neighborhood;
      if (mounted.current) {
        setBoundary(shape);
        setNeighborhood(info);
        setBoundarySource(typeof shape.source === 'string' ? shape.source : '');
      }
    } catch (cause) {
      if (mounted.current) setError(errorMessage(cause));
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    mounted.current = true;
    void reload();
    return () => {
      mounted.current = false;
      clearCacheByPrefix(BOUNDARY_PATH);
      clearCacheByPrefix(NEIGHBORHOOD_PATH);
    };
  }, [reload]);

  return { boundary, neighborhood, boundarySource, loading, error, reload };
}
