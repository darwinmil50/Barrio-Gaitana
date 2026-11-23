import { describe, expect, it } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import { useFilteredPlaces } from './useFilteredPlaces';
import { boundary, envelope, INSIDE, OUTSIDE, place } from '../test/fixtures';
import { emptyEnvelopes } from '../services/loadEnvelopes';

function withData(data: Place[], scope: 'neighborhood' | 'locality' = 'neighborhood'): EnvelopeMap<Place> {
  const base = emptyEnvelopes();
  base.veterinaries = envelope(data, { scope });
  return base;
}

describe('useFilteredPlaces', () => {
  it('excluye puntos fuera del barrio y categorías inactivas', () => {
    const envelopes = withData([INSIDE, OUTSIDE]);
    const { result } = renderHook(() => useFilteredPlaces(envelopes, boundary, ['veterinaries']));
    expect(result.current.total).toBe(1);
    expect(result.current.neighborhoodPlaces[0].name).toBe(INSIDE.name);
  });

  it('muestra los alrededores como contexto sólo cuando se activan', () => {
    const nearby = place('near-1', 'Comercio vecino', 'veterinaries',
      -74.05, 4.7, { scope: 'nearby' });
    const envelopes = withData([INSIDE, nearby]);
    const hidden = renderHook(
      () => useFilteredPlaces(envelopes, boundary, ['veterinaries'], false),
    );
    expect(hidden.result.current.total).toBe(1);
    const shown = renderHook(
      () => useFilteredPlaces(envelopes, boundary, ['veterinaries'], true),
    );
    expect(shown.result.current.total).toBe(2);
    expect(shown.result.current.neighborhoodPlaces[1].name).toBe('Comercio vecino');
  });

  it('separa los datos de localidad del barrio', () => {
    const local = place('loc', 'Punto localidad', 'cadastre');
    const envelopes = emptyEnvelopes();
    envelopes.cadastre = envelope([local], { scope: 'locality' });
    const { result } = renderHook(() => useFilteredPlaces(envelopes, boundary, ['cadastre']));
    expect(result.current.total).toBe(0);
    expect(result.current.localityTotal).toBe(1);
    expect(result.current.neighborhoodPlaces).toEqual([]);
  });
});
