export interface SourceInfo {
  name: string;
  url: string;
  license: string;
  updated_at: string | null;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  geometry: Record<string, unknown> | null;
  properties: Record<string, unknown>;
  source: SourceInfo;
}

export interface Locatable {
  latitude: number | null;
  longitude: number | null;
}

export function hasCoordinates(place: Locatable): boolean {
  return (
    typeof place.latitude === 'number' &&
    Number.isFinite(place.latitude) &&
    typeof place.longitude === 'number' &&
    Number.isFinite(place.longitude)
  );
}

export function isPlace(value: unknown): value is Place {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Place>;
  return typeof candidate.id === 'string' && typeof candidate.name === 'string';
}

export function placeName(place: Place): string {
  return place.name.trim() || 'Sin nombre registrado';
}
