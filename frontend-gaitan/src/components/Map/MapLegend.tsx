import type { MapLayer } from './mapLayer';
import styles from './Map.module.css';

export function MapLegend({ layers }: { layers: MapLayer[] }) {
  return (
    <div className={styles.legend} aria-label="Leyenda del mapa">
      <h3 className={styles.panelTitle}>Leyenda</h3>
      <ul className={styles.legendList}>
        <li className={styles.legendItem}>
          <span className={styles.boundarySwatch} aria-hidden="true" />
          Límite de La Gaitana
        </li>
        {layers.map((layer) => (
          <li className={styles.legendItem} key={layer.key}>
            <span className={styles.swatch} style={{ backgroundColor: layer.color }} aria-hidden="true" />
            {layer.label} ({layer.places.length})
          </li>
        ))}
      </ul>
    </div>
  );
}
