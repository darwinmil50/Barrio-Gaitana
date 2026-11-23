import type { CategoryKey } from './category';
import type { SourceInfo } from './place';

export type Scope = 'neighborhood' | 'locality';

export interface NeighborhoodInfo {
  name: string;
  code: string;
  locality: string;
  city: string;
}

export interface Envelope<T> {
  scope: Scope;
  neighborhood: NeighborhoodInfo;
  source: SourceInfo;
  count: number;
  data: T[];
  note: string | null;
  context: unknown[];
}

export function isEnvelope(value: unknown): value is Envelope<unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Envelope<unknown>>;
  return (
    (candidate.scope === 'neighborhood' || candidate.scope === 'locality') &&
    Array.isArray(candidate.data)
  );
}

export function envelopeCount(envelope: Envelope<unknown>): number {
  return typeof envelope.count === 'number' ? envelope.count : envelope.data.length;
}

export function isLocality(envelope: Envelope<unknown>): boolean {
  return envelope.scope === 'locality';
}

export type EnvelopeMap<T> = Record<CategoryKey, Envelope<T> | null>;
