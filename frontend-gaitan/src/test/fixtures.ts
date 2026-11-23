import type { Envelope, Scope } from '../models/envelope';
import type { Place, SourceInfo } from '../models/place';
import type { BoundaryCollection } from '../models/territory';
import type { ApiClient } from '../services/apiClient';

export const source: SourceInfo = {
  name: 'Datos Abiertos Suba',
  url: 'https://example.test/datos',
  license: 'CC BY 4.0',
  updated_at: '2026-01-15T00:00:00Z',
};

export function place(
  id: string,
  name: string,
  category = 'veterinaries',
  longitude = -74.1098,
  latitude = 4.7419,
  properties: Record<string, unknown> = {},
): Place {
  return {
    id, name, category, latitude, longitude,
    geometry: null, properties, source,
  };
}

export const INSIDE = place('in-1', 'Veterinaria Centro');
export const OUTSIDE = place('out-1', 'Punto fuera', 'veterinaries', -74.05, 4.7);

export const boundary: BoundaryCollection = {
  type: 'FeatureCollection',
  source: 'SDIS — Barrio Común (110292)',
  features: [{
    type: 'Feature',
    properties: { source: 'SDIS', code: '110292' },
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-74.11303775, 4.738106947],
        [-74.106614727, 4.738106947],
        [-74.106614727, 4.745299413],
        [-74.11303775, 4.745299413],
        [-74.11303775, 4.738106947],
      ]],
    },
  }],
};

export function envelope(
  data: Place[],
  options: Partial<{ scope: Scope; note: string | null }> = {},
): Envelope<Place> {
  return {
    scope: options.scope ?? 'neighborhood',
    neighborhood: { name: 'La Gaitana', code: '110292', locality: 'Suba', city: 'Bogotá D.C.' },
    source,
    count: data.length,
    data,
    note: options.note ?? null,
    context: [],
  };
}

export function mockClient(resolver?: (path: string) => unknown): ApiClient {
  return {
    async get<T>(path: string): Promise<T> {
      if (resolver) return resolver(path) as T;
      if (path.includes('/boundary')) return boundary as T;
      if (path.includes('/neighborhood')) return envelope([]) as T;
      if (path.includes('/crimes')) {
        return envelope([place('c1', 'Hurto enero', 'crimes', -74.1098, 4.7419, { period: '2026-01' })]) as T;
      }
      return envelope([INSIDE]) as T;
    },
  };
}
