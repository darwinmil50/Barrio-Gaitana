import { describe, expect, it } from 'vitest';
import { extractCrimeRates } from './crimeRates';

describe('extractCrimeRates', () => {
  it(' Lee la estructura oficial del contexto sin inventar datos', () => {
    const rates = extractCrimeRates([
      { LOCALIDAD: 'Suba' },
      {
        type: 'crime_rates',
        locality: 'Suba',
        period: 'Ene-Sep (2018vs2026)',
        population: 1348372,
        population_year: 2019,
        rate_basis: ' Delitos por 100.000 habitantes',
        series: [{ year: 2018, total: 15, rate_per_100k: 1.11 }],
        totals: { Homicidios: 30 },
        variation_pct: { Homicidios: -20 },
      },
    ]);
    expect(rates).not.toBeNull();
    expect(rates?.scope).toBe('locality');
    expect(rates?.series).toHaveLength(1);
    expect(rates?.totals.Homicidios).toBe(30);
  });

  it(' Devuelve null cuando no hay serie oficial', () => {
    expect(extractCrimeRates([])).toBeNull();
  });
});
