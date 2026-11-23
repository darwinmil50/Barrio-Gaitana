import { useMemo } from 'react';
import type { CategoryKey } from '../models/category';
import { CATEGORIES } from '../models/category';
import type { MapLayer } from '../components/Map/mapLayer';
import { useTerritory } from '../context/TerritoryContext';
import { useApiStatus } from './useApiStatus';
import { useCategories } from './useCategories';
import { useFilteredPlaces } from './useFilteredPlaces';

export interface PageData {
  territory: ReturnType<typeof useTerritory>;
  categories: ReturnType<typeof useCategories>;
  filtered: ReturnType<typeof useFilteredPlaces>;
  status: ReturnType<typeof useApiStatus>;
  layers: MapLayer[];
  includeNearby: boolean;
  setIncludeNearby: (value: boolean) => void;
}

export function usePageData(keys: CategoryKey[]): PageData {
  const territory = useTerritory();
  const categories = useCategories(keys);
  const filtered = useFilteredPlaces(
    territory.envelopes, territory.boundary, categories.active, territory.includeNearby,
  );

  const notes = useMemo(
    () => keys
      .map((key) => territory.envelopes[key]?.note)
      .filter((note): note is string => typeof note === 'string' && note.length > 0),
    [keys, territory.envelopes],
  );

  const error = territory.boundaryError
    ?? keys.map((key) => territory.errors[key]).find((value): value is string => !!value)
    ?? null;
  const status = useApiStatus(
    territory.loading,
    error,
    filtered.total,
    notes,
  );

  const layers = useMemo<MapLayer[]>(
    () => CATEGORIES.filter((category) => keys.includes(category.key)).map((category) => ({
      key: category.key,
      label: category.label,
      color: category.color,
      places: filtered.byCategory[category.key] ?? [],
    })),
    [keys, filtered.byCategory],
  );

  return {
    territory, categories, filtered, status, layers,
    includeNearby: territory.includeNearby,
    setIncludeNearby: territory.setIncludeNearby,
  };
}
