import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GAITANA_TERRITORY, type BoundaryCollection } from '../../models/territory';
import type { CategoryKey } from '../../models/category';
import { BoundaryShape } from './BoundaryShape';
import { CategoryLayer } from './CategoryLayer';
import { FitBounds } from './FitBounds';
import { MapLayerControl } from './MapLayerControl';
import { MapLegend } from './MapLegend';
import styles from './Map.module.css';
import type { MapLayer } from './mapLayer';

interface Props {
  boundary: BoundaryCollection | null;
  layers: MapLayer[];
  active: CategoryKey[];
  onToggle: (key: CategoryKey) => void;
}

const CENTER: [number, number] = [
  (GAITANA_TERRITORY.bbox[1] + GAITANA_TERRITORY.bbox[3]) / 2,
  (GAITANA_TERRITORY.bbox[0] + GAITANA_TERRITORY.bbox[2]) / 2,
];

export function MapView({ boundary, layers, active, onToggle }: Props) {
  const visible = layers.filter((layer) => active.includes(layer.key));
  return (
    <section className={styles.wrapper} aria-label="Mapa interactivo del barrio La Gaitana">
      <MapContainer center={CENTER} zoom={14} className={styles.canvas} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <BoundaryShape boundary={boundary} />
        <FitBounds boundary={boundary} />
        {visible.map((layer) => <CategoryLayer key={layer.key} layer={layer} />)}
      </MapContainer>
      <MapLayerControl layers={layers} active={active} onToggle={onToggle} />
      <MapLegend layers={visible} />
    </section>
  );
}
