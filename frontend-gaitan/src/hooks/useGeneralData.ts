import { useCallback, useEffect, useState } from 'react';
import type { LocalityFacts } from '../models/general';
import { apiClient, type ApiClient } from '../services/apiClient';
import { asRecord, mapEnvelope } from '../services/mappers';

export interface GeneralState {
  facts: LocalityFacts | null;
  loading: boolean;
  error: string | null;
  refresh: (silent?: boolean) => Promise<void>;
}

function number(value: unknown): number {
  return typeof value === 'number' ? value : Number(value) || 0;
}

export function useGeneralData(client: ApiClient = apiClient): GeneralState {
  const [facts, setFacts] = useState<LocalityFacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const raw = await client.get<unknown>('/api/locality');
      const envelope = mapEnvelope<Record<string, unknown>>(raw, asRecord);
      const place = envelope.data[0] ?? {};
      const props = asRecord(place.properties);
      setFacts({
        name: typeof place.name === 'string' ? place.name : 'Suba',
        areaHa: number(props.extension_ha),
        areaPctBogota: number(props.extension_pct_bogota),
        population: number(props.population_2019),
        populationYear: 2019,
        upz: number(props.upz),
        upr: number(props.upr),
        cadastralSectors: number(props.sectores_catastrales),
        location: String(props.ubicacion ?? ''),
        plan: String(props.plan ?? ''),
        sourceName: envelope.source.name,
        sourceUrl: envelope.source.url,
      });
      setError(null);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Error al consultar datos generales');
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { facts, loading, error, refresh };
}
