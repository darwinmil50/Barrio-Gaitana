import type { QueryParams } from '../services/apiClient';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 60_000;

export function buildCacheKey(path: string, params: QueryParams = {}): string {
  const q = params.q ?? '';
  const limit = params.limit ?? '';
  return `${path}?q=${q}&limit=${limit}`;
}

export function getCached<T>(key: string): T | undefined {
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt < Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs = DEFAULT_TTL): T {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
  return value;
}

export function clearCache(): void {
  store.clear();
}

export function clearCacheByPrefix(prefix: string): void {
  for (const key of store.keys()) {
    if (key.startsWith(`${prefix}?`)) store.delete(key);
  }
}

export function cacheSize(): number {
  return store.size;
}
