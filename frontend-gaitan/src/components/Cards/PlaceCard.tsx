import { categoryLabel } from '../../models/category';
import type { Place } from '../../models/place';
import { formatCoordinate, formatUpdated } from '../../utils/format';
import styles from './Cards.module.css';

export function PlaceCard({ place }: { place: Place }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.name}>{place.name}</h3>
      <p className={styles.meta}>Categoría: {categoryLabel(place.category)}</p>
      <p className={styles.meta}>
        Coordenadas: {formatCoordinate(place.latitude)}, {formatCoordinate(place.longitude)}
      </p>
      <p className={styles.meta}>
        Fuente: {place.source.name} · {formatUpdated(place.source.updated_at)}
      </p>
    </article>
  );
}
