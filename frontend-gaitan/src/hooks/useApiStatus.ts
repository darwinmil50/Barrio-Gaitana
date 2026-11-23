import { useMemo } from 'react';

export type StatusKind = 'loading' | 'error' | 'empty' | 'ready';

export interface ApiStatus {
  kind: StatusKind;
  loading: boolean;
  error: string | null;
  hasData: boolean;
  notes: string[];
  message: string;
}

export function useApiStatus(
  loading: boolean,
  error: string | null,
  count: number,
  notes: string[] = [],
): ApiStatus {
  return useMemo(() => {
    const hasData = count > 0;
    const kind: StatusKind = loading
      ? 'loading'
      : error
        ? 'error'
        : hasData
          ? 'ready'
          : 'empty';
    const message = kind === 'loading'
      ? 'Cargando información territorial…'
      : kind === 'error'
        ? (error ?? 'No fue posible cargar la información.')
        : kind === 'empty'
          ? 'Sin información pública disponible'
          : `${count} ${count === 1 ? 'resultado' : 'resultados'} dentro del barrio La Gaitana`;
    return { kind, loading, error, hasData, notes: [...new Set(notes)], message };
  }, [loading, error, count, notes]);
}
