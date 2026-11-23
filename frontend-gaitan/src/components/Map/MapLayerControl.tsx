import type { CategoryKey } from '../../models/category';
import styles from './Map.module.css';
import type { MapLayer } from './mapLayer';

interface Props {
  layers: MapLayer[];
  active: CategoryKey[];
  onToggle: (key: CategoryKey) => void;
}

export function MapLayerControl({ layers, active, onToggle }: Props) {
  return (
    <div className={styles.control} aria-label="Control de capas del mapa">
      <h3 className={styles.panelTitle}>Capas</h3>
      {layers.map((layer) => {
        const enabled = active.includes(layer.key);
        return (
          <button
            type="button"
            key={layer.key}
            className={styles.layerButton}
            aria-pressed={enabled}
            onClick={() => onToggle(layer.key)}
          >
            <span className={styles.checkbox} style={{ borderColor: layer.color }}>
              {enabled ? <span style={{ backgroundColor: layer.color }} /> : null}
            </span>
            <span className={styles.layerLabel}>{layer.label}</span>
            <span className={styles.layerCount}>{layer.places.length}</span>
          </button>
        );
      })}
    </div>
  );
}
