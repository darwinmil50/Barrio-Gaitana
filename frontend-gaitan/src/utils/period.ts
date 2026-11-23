import type { Place } from '../models/place';

const PERIOD_KEYS = ['period', 'periodo', 'year', 'ano', 'fecha', 'date', 'mes', 'month'];

export function periodOf(place: Place): string | null {
  for (const key of PERIOD_KEYS) {
    const value = place.properties[key];
    if (typeof value === 'number' || typeof value === 'string') {
      const text = String(value).trim();
      if (text) return text.slice(0, 12);
    }
  }
  return null;
}

export interface PeriodPoint {
  period: string;
  total: number;
}

export function crimeSeries(places: Place[]): PeriodPoint[] {
  const totals = new Map<string, number>();
  for (const place of places) {
    const period = periodOf(place);
    if (period) totals.set(period, (totals.get(period) ?? 0) + 1);
  }
  return [...totals.entries()]
    .map(([period, total]) => ({ period, total }))
    .sort((a, b) => a.period.localeCompare(b.period, 'es'));
}
