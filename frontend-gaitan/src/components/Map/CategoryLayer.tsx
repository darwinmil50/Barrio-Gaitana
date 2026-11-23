import { CircleMarker, Popup } from 'react-leaflet';
import { categoryLabel } from '../../models/category';
import type { Place } from '../../models/place';
import { formatUpdated } from '../../utils/format';
import type { MapLayer } from './mapLayer';

function PlaceMarker({ place, color }: { place: Place; color: string }) {
  if (place.latitude === null || place.longitude === null) return null;
  const center: [number, number] = [place.latitude, place.longitude];
  const nearby = place.properties?.scope === 'nearby';
  return (
    <CircleMarker
      center={center}
      radius={nearby ? 5 : 6}
      color={nearby ? color : '#ffffff'}
      weight={nearby ? 2 : 1.5}
      fillColor={color}
      fillOpacity={nearby ? 0.15 : 0.95}
      dashArray={nearby ? '3 3' : undefined}
    >
      <Popup>
        <strong>{place.name}</strong>
        <br />
        Categoría: {categoryLabel(place.category)}
        <br />
        Alcance: {nearby ? 'Barrio vecino (contexto)' : 'Dentro de La Gaitana'}
        <br />
        Fuente: {place.source.name} · {formatUpdated(place.source.updated_at)}
      </Popup>
    </CircleMarker>
  );
}

export function CategoryLayer({ layer }: { layer: MapLayer }) {
  return (
    <>
      {layer.places.map((place) => (
        <PlaceMarker key={`${layer.key}-${place.id}`} place={place} color={layer.color} />
      ))}
    </>
  );
}
