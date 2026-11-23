import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildCacheKey, cacheSize, clearCache, clearCacheByPrefix, getCached, setCached } from './cache';

afterEach(() => {
  vi.useRealTimers();
  clearCache();
});

describe('caché en memoria', () => {
  it('guarda y recupera valores por clave', () => {
    setCached('a', { total: 1 });
    expect(getCached<{ total: number }>('a')).toEqual({ total: 1 });
    expect(cacheSize()).toBe(1);
    expect(getCached('b')).toBeUndefined();
  });

  it('expira entradas y limpia por prefijo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    setCached('caduca', 1, 100);
    vi.setSystemTime(new Date('2026-01-01T00:01:00Z'));
    expect(getCached('caduca')).toBeUndefined();

    setCached(buildCacheKey('/api/streets', { q: 'a' }), 1);
    setCached(buildCacheKey('/api/police'), 2);
    clearCacheByPrefix('/api/streets');
    expect(cacheSize()).toBe(1);
  });
});
