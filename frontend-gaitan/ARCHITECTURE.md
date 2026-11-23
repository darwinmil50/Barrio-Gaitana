# Arquitectura

El frontend sigue cuatro capas con dependencias hacia adentro: presentación → aplicación → dominio ← infraestructura.

## 1. Presentación

- `components/Map`: mapa, límites, capas, marcadores, leyenda y control de capas.
- `components/Sidebar`, `components/Filters`, `components/Cards`, `components/Charts`, `components/Layout`.
- `pages`: `Home`, `Security`, `Mobility`, `Services`, `Territorial`.
- Cada componente tiene una responsabilidad y su CSS Module en `styles/*.module.css`.

## 2. Aplicación

- `hooks/useTerritoryData`: coordinación de las doce consultas y caché.
- `hooks/useCategories`: selección de capas activas.
- `hooks/useFilteredPlaces`: partición barrio/localidad y agrupación por categoría.
- `hooks/useBoundary`: polígono e información territorial.
- `hooks/useApiStatus`: estados de carga, error, vacío y listo.
- `usePageData`, `useHashRoute` y `useDebouncedValue` son hooks de apoyo.

## 3. Dominio

- `models`: `place`, `category`, `envelope`, `territory`. Tipos y reglas puras, sin React.
- `utils/geo`: point-in-polygon y filtrado estricto dentro del polígono.
- `utils/geoBoundary`: extracción de bbox y geometrías del GeoJSON.
- `utils/format`, `utils/period`, `utils/filterPlaces`.

## 4. Infraestructura

- `services/apiClient`: fetch con `AbortController`, timeout y `ApiError`.
- `services/endpoints`, `services/mappers`, `services/loadEnvelopes`.
- `utils/cache`: caché en memoria con expiración.
- `config/env`: URL base desde `VITE_API_URL`.

## Flujo

`App` → `TerritoryProvider` ( hooks de aplicación ) → página → componentes de presentación. El proveedor inyecta el `ApiClient` por defecto, pero los hooks aceptan otra implementación en pruebas ( inversión de dependencias ).
