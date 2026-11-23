import { GeoJSON } from 'react-leaflet';
import type { GeoJsonObject } from 'geojson';
import type { BoundaryCollection } from '../../models/territory';

const STYLE = {
  color: '#103b4a',
  weight: 3,
  fillColor: '#4b8b78',
  fillOpacity: 0.12,
};

export function BoundaryShape({ boundary }: { boundary: BoundaryCollection | null }) {
  if (!boundary || boundary.features.length === 0) return null;
  return (
    <GeoJSON
      key="gaitana-boundary"
      data={boundary as unknown as GeoJsonObject}
      style={STYLE}
      interactive={false}
    />
  );
}
