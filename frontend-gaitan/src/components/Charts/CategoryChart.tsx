import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { CATEGORIES, type CategoryKey } from '../../models/category';
import type { Place } from '../../models/place';
import styles from './Charts.module.css';

interface Props {
  byCategory: Record<CategoryKey, Place[]>;
  title?: string;
}

export function CategoryChart({ byCategory, title = 'Establecimientos por categoría' }: Props) {
  const data = CATEGORIES
    .map((category) => ({ name: category.label, total: byCategory[category.key]?.length ?? 0, fill: category.color }))
    .filter((item) => item.total > 0);

  return (
    <section className={styles.panel} aria-label={title}>
      <h3>{title}</h3>
      <p className={styles.description}>Solo registros localizados dentro del polígono de La Gaitana.</p>
      {data.length === 0 ? (
        <div className={styles.empty}>Sin información pública disponible</div>
      ) : (
        <div className={styles.canvas}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: -14, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8ea" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip formatter={(value) => [value, 'Registros']} />
              <Bar dataKey="total" name="Registros" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
