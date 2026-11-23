import { useState } from 'react';
import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { CrimeRates } from '../../models/general';
import styles from './Charts.module.css';

interface Props {
  rates: CrimeRates | null;
  note?: string | null;
}

const DEFAULT_METRICS = [
  { key: 'rate_per_100k', label: 'Tasa total por 100.000 habitantes' },
  { key: 'total', label: 'Total de delitos' },
];

export function CrimeRatesChart({ rates, note }: Props) {
  const [metric, setMetric] = useState('rate_per_100k');
  const metrics = rates
    ? [...DEFAULT_METRICS, ...Object.keys(rates.totals)
      .filter((key) => rates.series.some((row) => key in row))
      .map((key) => ({ key, label: key }))]
    : DEFAULT_METRICS;
  const data = (rates?.series ?? []).map((row) => ({
    year: Number(row.year),
    value: Number(row[metric] ?? 0),
  }));

  return (
    <section className={styles.panel} aria-label="Tasas de criminalidad">
      <h3>Tasas de criminalidad — Suba</h3>
      <p className={styles.description}>
        {rates?.period ?? 'Serie oficial'} · {rates?.rateBasis ?? 'Datos del SCJ'}
      </p>
      <label className={styles.description} htmlFor="crime-metric">
        Indicador:
        <select id="crime-metric" value={metric}
          onChange={(event) => setMetric(event.target.value)}>
          {metrics.map((item) => (
            <option key={item.key} value={item.key}>{item.label}</option>
          ))}
        </select>
      </label>
      {data.length === 0 ? (
        <div className={styles.empty}>Sin series oficiales disponibles</div>
      ) : (
        <div className={styles.canvas}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -14, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ea" />
              <XAxis dataKey="year" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip formatter={(value) => [value, metric]} />
              <Line type="monotone" dataKey="value" stroke="#a33737" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {note && <p className={styles.description}>{note}</p>}
    </section>
  );
}
