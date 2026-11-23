# GAITÁN TERRITORIAL

Sistema de información y consulta territorial del barrio Gaitán, Suba.

El barrio oficial es **La Gaitana** (SDIS, código 110292; sector catastral UAECD 009216), Suba, Bogotá D.C. Esta aplicación no mezcla sus datos con el barrio Jorge Eliécer Gaitán de Barrios Unidos ni con otros barrios.

## Requisitos

- Node.js 20 o superior.
- Backend `api-gaitan` ejecutándose en `http://localhost:8000` ( configurable con `VITE_API_URL` ).

## Puesta en marcha

```bash
npm install
cp .env.example .env
npm run dev
```

La interfaz queda disponible en `http://localhost:5173`.

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Servidor de desarrollo Vite |
| `npm run build` | Typecheck + compilación de producción |
| `npm run preview` | Previsualización del build |
| `npm run typecheck` | TypeScript estricto ( app y configs ) |
| `npm test -- --run` | Pruebas unitarias Vitest / Testing Library |
| `npm run test:e2e` | Pruebas Playwright con mocks de red |
| `npm run check:lines` | Verifica que ningún archivo supere 100 líneas |

## Funcionalidades

- Mapa Leaflet con polígono, capas por categoría, leyenda, popups y `fitBounds`.
- Cada categoría tiene su color: al hacer clic en una opción se activan sus
  puntos y el popup muestra nombre, alcance y fuente. "Incluir alrededores"
  añade puntos de barrios vecinos como contexto punteado.
- Buscador y filtros por categoría con validación `point-in-polygon`.
- Panel de indicadores, tablas y gráficos Recharts por categoría y por periodo de hurtos.
- Fuentes, licencias y fechas de actualización por conjunto de datos.
- Sección independiente para el contexto de la localidad Suba.
- Estados de carga, error y vacío; diseño responsive y accesible.
- Interfaz tipo cómic/infantil: colores vivos, globos de diálogo y un guía
  animado con pistas por sección; los botones y tarjetas tienen borde grueso.
- Sincronización automática cada 20 segundos del mapa, la criminalidad y los
  datos generales. La insignia «EN VIVO» muestra la cuenta regresiva, permite
  pausar y tiene un botón «Actualizar ya» para refrescar sin recargar.

## Notas

- Todos los datos llegan del backend; el navegador solo consulta tiles de OpenStreetMap.
- Si una fuente no entrega registros se muestra «Sin información pública disponible» y la nota del proveedor.
- Consulta `INTEGRATION.md` para la ejecución conjunta con el backend y `docs/API_CONTRACT.md` para el contrato.
