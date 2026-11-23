import type { CrimeRates } from '../models/general';
import { asRecord } from '../services/mappers';

export function extractCrimeRates(context: unknown[]): CrimeRates | null {
  for (const entry of context) {
    const raw = asRecord(entry);
    if (raw.type !== 'crime_rates') continue;
    return {
      type: 'crime_rates',
      scope: 'locality',
      locality: String(raw.locality ?? 'Suba'),
      period: typeof raw.period === 'string' ? raw.period : null,
      population: Number(raw.population) || 0,
      populationYear: Number(raw.population_year) || 2019,
      rateBasis: String(raw.rate_basis ?? ''),
      series: Array.isArray(raw.series) ? raw.series as CrimeRates['series'] : [],
      totals: asRecord(raw.totals) as CrimeRates['totals'],
      variationPct: asRecord(raw.variation_pct) as CrimeRates['variationPct'],
    };
  }
  return null;
}
