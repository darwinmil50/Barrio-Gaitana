import { CATEGORIES } from '../models/category';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import type { BoundaryCollection } from '../models/territory';
import { boundaryGeometries } from './geoBoundary';
import { filterInsideBoundary } from './geo';

export interface PartitionedPlaces {
  neighborhoodPlaces: Place[];
  localityPlaces: Place[];
  context: unknown[];
}

function isNearby(place: Place): boolean {
  return place.properties?.scope === 'nearby';
}

export function partitionPlaces(
  envelopes: EnvelopeMap<Place>,
  boundary: BoundaryCollection | null,
  active: readonly string[],
  includeNearby = false,
): PartitionedPlaces {
  const geometries = boundaryGeometries(boundary);
  const result: PartitionedPlaces = {
    neighborhoodPlaces: [], localityPlaces: [], context: [],
  };
  for (const category of CATEGORIES) {
    const envelope = envelopes[category.key];
    if (!envelope || !active.includes(category.key)) continue;
    const inside = filterInsideBoundary(envelope.data, geometries);
    const nearby = includeNearby ? envelope.data.filter(isNearby) : [];
    const selected = [...inside, ...nearby.filter(
      (place) => !inside.some((item) => item.id === place.id),
    )];
    if (envelope.scope === 'locality') {
      result.localityPlaces.push(...selected);
      result.context.push(...envelope.context);
    } else {
      result.neighborhoodPlaces.push(...selected);
    }
  }
  return result;
}
