# Integración con el backend

## Configuración

Copiar `.env.example` a `.env` y ajustar:

```env
VITE_API_URL=http://localhost:8000
```

El cliente agrega rutas `/api/...`, parámetros `q` y `limit` ( 1..200 ) y cabecera `Accept: application/json`.

## Ejecución conjunta

```bash
# Terminal 1 (carpeta api-gaitan)
uvicorn app.main:app --reload --port 8000

# Terminal 2 (carpeta frontend-gaitan)
npm run dev
```

Si el backend no está disponible, la interfaz muestra un mensaje de error en español en cada panel; no inventa datos.

## Mapeo de respuestas

- `GET /api/neighborhood` → `NeighborhoodInfo`.
- `GET /api/neighborhood/boundary` → GeoJSON `FeatureCollection`.
- Los doce endpoints de categorías → `Envelope<Place>` normalizado en `services/mappers.ts`.
- `scope=locality` se presenta únicamente en «Contexto de la localidad Suba».

## Geografía

Toda consulta se filtra con `point-in-polygon` contra las geometrías del boundary. Los puntos sin coordenadas válidas o fuera del polígono no aparecen en mapa, tablas, tarjetas ni gráficos.

## Caché y cancelación

`utils/cache` guarda respuestas durante 60 segundos para evitar repetir consultas al cambiar de página. `apiClient` usa `AbortController` con timeout de 10 segundos.

## Pruebas

Las unitarias usan clientes simulados y las E2E interceptan `**/api/**` y los tiles de OpenStreetMap. No se necesita backend ni internet.
