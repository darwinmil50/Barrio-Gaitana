import { describe, expect, it } from 'vitest';
import { CATEGORY_LOADERS, mapEnvelope, mapPlace, mapSource } from './mappers';
import { INSIDE, mockClient, source } from '../test/fixtures';

describe('mappers', () => {
  it('normaliza un place del backend', () => {
    const place = mapPlace({
      id: 7, name: 'Punto', latitude: '4.74', longitude: -74.11,
      geometry: { type: 'Point' }, properties: { barrio: 'La Gaitana' }, source,
    }, 'police', 2);
    expect(place.id).toBe('police-2');
    expect(place.name).toBe('Punto');
    expect(place.latitude).toBeNull();
    expect(place.properties.barrio).toBe('La Gaitana');
  });

  it('conserva scope, nota y contexto del envelope', () => {
    const result = mapEnvelope({
      scope: 'locality', data: [INSIDE], count: 9, note: 'Solo contexto',
      context: [{ total: 3 }], source, neighborhood: { name: 'La Gaitana' },
    }, (item) => mapPlace(item, 'veterinaries'));
    expect(result.scope).toBe('locality');
    expect(result.note).toBe('Solo contexto');
    expect(result.context).toHaveLength(1);
    expect(result.count).toBe(9);
    expect(result.neighborhood.locality).toBe('Suba');
  });

  it('usa un registro de loaders con la misma firma', () => {
    expect(Object.keys(CATEGORY_LOADERS)).toHaveLength(12);
    expect(mapSource(null).name).toBe('Fuente no identificada');
    return expect(CATEGORY_LOADERS.veterinaries(mockClient()))
      .resolves.toMatchObject({ scope: 'neighborhood', data: [{ name: INSIDE.name }] });
  });
});
