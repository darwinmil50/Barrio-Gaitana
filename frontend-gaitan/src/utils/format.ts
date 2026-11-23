import type { SourceInfo } from '../models/place';

export function formatCount(value: number): string {
  return new Intl.NumberFormat('es-CO').format(value);
}

export function formatCoordinate(value: number | null): string {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(6) : 'Sin coordenada';
}

export function formatUpdated(iso: string | null): string {
  if (!iso) return 'Sin fecha de actualización';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Fecha no válida';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}

export function formatSource(source: SourceInfo): string {
  return `${source.name} · ${source.license} · ${formatUpdated(source.updated_at)}`;
}
