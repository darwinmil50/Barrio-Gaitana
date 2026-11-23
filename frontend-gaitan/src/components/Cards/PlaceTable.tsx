import { categoryLabel } from '../../models/category';
import type { Place } from '../../models/place';
import { formatCoordinate, formatUpdated } from '../../utils/format';
import styles from './Cards.module.css';

interface Props {
  places: Place[];
  caption?: string;
  limit?: number;
}

export function PlaceTable({ places, caption = 'Establecimientos encontrados', limit = 12 }: Props) {
  const rows = places.slice(0, limit);
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Categoría</th>
            <th scope="col">Ubicación</th>
            <th scope="col">Fuente / actualización</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td className={styles.emptyRow} colSpan={4}>Sin información pública disponible</td></tr>
          ) : rows.map((place) => (
            <tr key={`${place.category}-${place.id}`}>
              <td>{place.name}</td>
              <td>{categoryLabel(place.category)}</td>
              <td>{formatCoordinate(place.latitude)}, {formatCoordinate(place.longitude)}</td>
              <td>{place.source.name} · {formatUpdated(place.source.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {places.length > limit ? (
        <p className={styles.note}>Se muestran {limit} de {places.length} resultados.</p>
      ) : null}
    </div>
  );
}
