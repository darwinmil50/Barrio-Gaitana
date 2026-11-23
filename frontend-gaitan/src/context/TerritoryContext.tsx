import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CategoryKey } from '../models/category';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import type { BoundaryCollection } from '../models/territory';
import { apiClient, type ApiClient } from '../services/apiClient';
import { useBoundary } from '../hooks/useBoundary';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useTerritoryData } from '../hooks/useTerritoryData';
import { useGeneralData } from '../hooks/useGeneralData';
export const LIVE_INTERVAL_MS = 20000;
export interface TerritoryContextValue {
  boundary: BoundaryCollection | null;
  neighborhoodName: string;
  boundarySource: string;
  boundaryLoading: boolean;
  boundaryError: string | null;
  envelopes: EnvelopeMap<Place>;
  general: ReturnType<typeof useGeneralData>;
  loading: boolean;
  errors: Partial<Record<CategoryKey, string>>;
  query: string;
  setQuery: (value: string) => void;
  includeNearby: boolean;
  setIncludeNearby: (value: boolean) => void;
  live: boolean;
  setLive: (value: boolean) => void;
  countdown: number;
  lastUpdated: number | null;
  updates: number;
  refreshNow: () => Promise<void>;
  reload: () => Promise<void>;
}

const TerritoryContext = createContext<TerritoryContextValue | null>(null);
export function TerritoryProvider({
  children, client = apiClient,
}: { children: ReactNode; client?: ApiClient }) {
  const [query, setQuery] = useState('');
  const [includeNearby, setIncludeNearby] = useState(true);
  const [live, setLive] = useState(true);
  const [tick, setTick] = useState(Date.now());
  const search = useDebouncedValue(query);
  const boundary = useBoundary(client);
  const territory = useTerritoryData(client, { q: search || undefined, limit: 200 });
  const general = useGeneralData(client);

  useEffect(() => {
    const clock = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    if (!live) return;
    const sync = window.setInterval(() => {
      void territory.refresh(true);
      void general.refresh(true);
      setTick(Date.now());
    }, LIVE_INTERVAL_MS);
    return () => window.clearInterval(sync);
  }, [live, territory.refresh, general.refresh]);

  const refreshNow = useCallback(async () => {
    setTick(Date.now());
    await territory.refresh(false);
  }, [territory.refresh]);

  const base = (territory.lastUpdated ?? tick) + LIVE_INTERVAL_MS;
  const countdown = Math.max(0, Math.ceil((base - tick) / 1000));
  const value = useMemo<TerritoryContextValue>(() => ({
    boundary: boundary.boundary,
    neighborhoodName: boundary.neighborhood.name,
    boundarySource: boundary.boundarySource,
    boundaryLoading: boundary.loading,
    boundaryError: boundary.error,
    envelopes: territory.envelopes,
    general,
    loading: territory.loading || boundary.loading,
    errors: territory.errors,
    query,
    setQuery,
    includeNearby,
    setIncludeNearby,
    live,
    setLive,
    countdown,
    lastUpdated: territory.lastUpdated,
    updates: territory.updates,
    refreshNow,
    reload: territory.refresh,
  }), [boundary, territory, general, query, includeNearby, live, countdown, refreshNow]);

  return <TerritoryContext.Provider value={value}>{children}</TerritoryContext.Provider>;
}

export function useTerritory(): TerritoryContextValue {
  const value = useContext(TerritoryContext);
  if (!value) throw new Error('useTerritory debe usarse dentro de TerritoryProvider');
  return value;
}
