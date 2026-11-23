# SOLID demostrable

## S — Responsabilidad única

Cada archivo de `components`, `hooks`, `models` y `services` resuelve una sola tarea. `FitBounds` solo ajusta la vista; `BoundaryShape` solo dibuja el polígono; `SourceNote` solo muestra una fuente.

## O — Abierto/Cerrado

Agregar una categoría no requiere cambiar lógica:

1. Añadir una entrada a `CATEGORIES` en `models/category.ts` ( clave, etiqueta, color, endpoint y grupo ).
2. El registro `CATEGORY_LOADERS` de `services/mappers.ts` genera su adaptador automáticamente.
3. Los hooks, mapas, filtros, tablas y gráficos recorren el registro.

No hay cadenas de `if/else` por categoría.

## L — Sustitución de Liskov

Todos los adaptadores son `CategoryLoader = (client: ApiClient, params?: QueryParams) => Promise<Envelope<Place>>`. Cualquiera puede reemplazar a otro sin alterar `loadEnvelopes`.

## I — Segregación de interfaces

`Place`, `Locatable`, `Envelope<T>`, `SourceInfo`, `CategoryKey`, `ApiClient` y props específicas ( `MapViewProps`, `FiltersProps` ) evitan objetos genéricos con campos no usados.

## D — Inversión de dependencias

Los hooks reciben `ApiClient` como parámetro y no importan `fetch`. `TerritoryProvider` inyecta el cliente real por defecto; las pruebas inyectan mocks. `apiClient` es el único adaptador que conoce `fetch`, `AbortController` y la URL base.

## Verificación

- `npm run typecheck`: contratos estáticos.
- `npm test -- --run`: models, geo, apiClient, mappers, hooks y componentes.
- `npm run check:lines`: límite de 100 líneas por archivo que obliga a dividir responsabilidades.
