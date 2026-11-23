export interface LocalityFacts {
  name: string;
  areaHa: number;
  areaPctBogota: number;
  population: number;
  populationYear: number;
  upz: number;
  upr: number;
  cadastralSectors: number;
  location: string;
  plan: string;
  sourceName: string;
  sourceUrl: string;
}

export interface CrimeRates {
  type: 'crime_rates';
  scope: 'locality';
  locality: string;
  period: string | null;
  population: number;
  populationYear: number;
  rateBasis: string;
  series: Array<Record<string, number | string | null>>;
  totals: Record<string, number | null>;
  variationPct: Record<string, number | null>;
}
