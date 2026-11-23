import { describe, expect, it } from 'vitest';
import {
  CATEGORIES, CATEGORY_BY_KEY, categoriesByGroup, categoryColor, categoryLabel,
} from './category';

describe('registro de categorías', () => {
  it('contiene las doce categorías contratadas', () => {
    expect(CATEGORIES).toHaveLength(12);
    expect(CATEGORIES.map((item) => item.key)).toContain('green-areas');
    expect(CATEGORIES.map((item) => item.key)).toContain('cameras');
  });

  it('resuelve etiquetas y colores desde el registro', () => {
    expect(categoryLabel('bookstores')).toBe('Librerías');
    expect(categoryColor('police')).toBe('#1f4e79');
    expect(categoryLabel('desconocida')).toBe('desconocida');
    expect(categoryColor('desconocida')).toBe('#64748b');
  });

  it('permite agrupar sin condicionales', () => {
    expect(categoriesByGroup('security').map((item) => item.key)).toEqual(['police', 'cameras', 'crimes']);
    expect(CATEGORY_BY_KEY.transport.endpoint).toBe('/api/transport');
  });
});
