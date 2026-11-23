import {
  CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import type { Envelope } from '../../models/envelope';
import type { Place } from '../../models/place';
import { crimeSeries } from '../../utils/period';
import styles from './Charts.module.css';

export function CrimePeriodChart({ envelope }: { envelope: Envelope<Place> | null }) {
  const data = crimeSeries(envelope?.data ?? []);
  return (
    <section className={styles.panel} aria-label="Hurtos por periodo">
      <h3>Hurtos por periodo</h3>
      <p className={styles.description}>
        {envelope?.note ?? 'Serie disponible según los datos publicados por la fuente.'}
      </p>
      {data.length === 0 ? (
        <div className={styles.empty}>Sin series temporales disponibles</div>
      ) : (
        <div className={styles.canvas}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -14, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ea" />
              <XAxis dataKey="period" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip formatter={(value) => [value, 'Hurtos']} />
              <Line type="monotone" dataKey="total" name="Hurtos" stroke="#a33737" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
