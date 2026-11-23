export type CategoryKey =
  | 'veterinaries'
  | 'bookstores'
  | 'restaurants'
  | 'education'
  | 'green-areas'
  | 'sports'
  | 'police'
  | 'transport'
  | 'streets'
  | 'cadastre'
  | 'cameras'
  | 'crimes';

export type CategoryGroup = 'services' | 'security' | 'mobility' | 'territorial';

export interface CategoryDefinition {
  key: CategoryKey;
  label: string;
  color: string;
  endpoint: string;
  group: CategoryGroup;
}

export const CATEGORIES: readonly CategoryDefinition[] = [
  { key: 'veterinaries', label: 'Veterinarias', color: '#2f7d6b', endpoint: '/api/veterinaries', group: 'services' },
  { key: 'bookstores', label: 'Librerías', color: '#9a6b2f', endpoint: '/api/bookstores', group: 'services' },
  { key: 'restaurants', label: 'Restaurantes', color: '#b05538', endpoint: '/api/restaurants', group: 'services' },
  { key: 'education', label: 'Educación', color: '#3c6e9e', endpoint: '/api/education', group: 'services' },
  { key: 'green-areas', label: 'Zonas verdes', color: '#3f7d4f', endpoint: '/api/green-areas', group: 'territorial' },
  { key: 'sports', label: 'Deporte', color: '#6b5ca5', endpoint: '/api/sports', group: 'services' },
  { key: 'police', label: 'CAI y policía', color: '#1f4e79', endpoint: '/api/police', group: 'security' },
  { key: 'transport', label: 'Transporte', color: '#ad841f', endpoint: '/api/transport', group: 'mobility' },
  { key: 'streets', label: 'Vías', color: '#64748b', endpoint: '/api/streets', group: 'mobility' },
  { key: 'cadastre', label: 'Catastro', color: '#8a5a44', endpoint: '/api/cadastre', group: 'territorial' },
  { key: 'cameras', label: 'Cámaras', color: '#7a3e6f', endpoint: '/api/security/cameras', group: 'security' },
  { key: 'crimes', label: 'Hurtos', color: '#a33737', endpoint: '/api/crimes', group: 'security' },
];

export const CATEGORY_BY_KEY = Object.fromEntries(
  CATEGORIES.map((category) => [category.key, category]),
) as Record<CategoryKey, CategoryDefinition>;

export function categoryLabel(key: string): string {
  return key in CATEGORY_BY_KEY ? CATEGORY_BY_KEY[key as CategoryKey].label : key;
}

export function categoryColor(key: string): string {
  return key in CATEGORY_BY_KEY ? CATEGORY_BY_KEY[key as CategoryKey].color : '#64748b';
}

export function categoriesByGroup(group: CategoryGroup): CategoryDefinition[] {
  return CATEGORIES.filter((category) => category.group === group);
}
