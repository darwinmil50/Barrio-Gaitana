import { describe, expect, it } from 'vitest';
import { formatCount, formatCoordinate, formatSource, formatUpdated } from './format';
import { source } from '../test/fixtures';

describe('formateo', () => {
  it('formatea cantidades en español', () => {
    expect(formatCount(1234)).toBe('1.234');
  });

  it('muestra coordenadas faltantes', () => {
    expect(formatCoordinate(4.741912345)).toBe('4.741912');
    expect(formatCoordinate(null)).toBe('Sin coordenada');
  });

  it('informa la actualización de la fuente', () => {
    expect(formatUpdated(null)).toBe('Sin fecha de actualización');
    expect(formatUpdated('2026-01-15T00:00:00Z')).toContain('2026');
    expect(formatSource(source)).toContain('Datos Abiertos Suba');
  });
});
