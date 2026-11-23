import { useMemo } from 'react';
import { CATEGORIES, type CategoryKey } from '../models/category';
import type { EnvelopeMap } from '../models/envelope';
import type { Place } from '../models/place';
import type { BoundaryCollection } from '../models/territory';
import { partitionPlaces } from '../utils/filterPlaces';

export interface FilteredPlaces {
  neighborhoodPlaces: Place[];
  localityPlaces: Place[];
  byCategory: Record<CategoryKey, Place[]>;
  total: number;
  localityTotal: number;
  context: unknown[];
}

export function useFilteredPlaces(
  envelopes: EnvelopeMap<Place>,
  boundary: BoundaryCollection | null,
  active: CategoryKey[],
  includeNearby = false,
): FilteredPlaces {
  const partition = useMemo(
    () => partitionPlaces(envelopes, boundary, active, includeNearby),
    [envelopes, boundary, active, includeNearby],
  );
  const byCategory = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((item) => [item.key, []])) as unknown as Record<CategoryKey, Place[]>;
    for (const place of partition.neighborhoodPlaces) {
      const key = place.category as CategoryKey;
      if (key in map) map[key].push(place);
    }
    return map;
  }, [partition.neighborhoodPlaces]);

  return {
    ...partition,
    byCategory,
    total: partition.neighborhoodPlaces.length,
    localityTotal: partition.localityPlaces.length,
  };
}
