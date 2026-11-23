# Integración con el frontend

## Base URL y CORS

```text
http://localhost:8000/api
Swagger: http://localhost:8000/docs
Origen permitido por defecto: http://localhost:5173
```

CORS se configura con `GAITAN_CORS_ORIGINS` (separado por comas).
El frontend debe enviar `Accept: application/json`.

## Envelope estándar

Todos los endpoints excepto `/api/neighborhood/boundary` devuelven:

```json
{
  "scope": "neighborhood",
  "neighborhood": {
    "name": "La Gaitana", "official_name": "LA GAITANA",
    "code": "110292", "cadastral_sector": "009216", "locality": "Suba", "city": "Bogotá D.C."
  },
  "source": {"name": "OpenStreetMap — API principal (datos abiertos verificados)",
             "url": "https://api.openstreetmap.org/api/0.6/map",
             "license": "ODbL — OpenStreetMap contributors",
             "updated_at": null},
  "count": 2,
  "data": [],
  "note": null
}
```

- `scope`: `"neighborhood"` o `"locality"` (sólo `/api/locality`).
- `count`: número de elementos en `data`.
- `note`: `null` o explicación cuando la fuente falla o no aplica.
- `context`: opcional; aparece sólo con agregados oficiales de localidad.

## Place (elementos de `data`)

```json
{
  "id": "node/123",
  "name": "Veterinaria La Gaitana",
  "category": "veterinaries",
  "latitude": 4.74421,
  "longitude": -74.10874,
  "geometry": {"type": "Point", "coordinates": [-74.10874, 4.74421]},
  "properties": {"osm_class": "amenity", "scope": "neighborhood"},
  "source": {"name": "...", "url": "...", "license": "...", "updated_at": null}
}
```

Latitud/longitud pueden ser `null` (por ejemplo, el sector catastral).

## Endpoints

| Ruta | `data` | `scope` |
| --- | --- | --- |
| `/neighborhood` | objeto barrio (no arreglo) | neighborhood |
| `/neighborhood/boundary` | FeatureCollection + `source` | — |
| `/streets`, `/veterinaries`, `/bookstores`, `/restaurants`, `/education`, `/sports`, `/green-areas`, `/police`, `/transport`, `/cadastre` | arreglo de Place | neighborhood |
| `/security/cameras` | `[]` + nota fija | neighborhood |
| `/crimes` | `[]` + `context` de localidad | neighborhood |
| `/locality` | arreglo con indicadores de Suba | locality |

Parámetros: `q` (texto, opcional) y `limit` (1..200, por defecto 50).
Parámetros inválidos devuelven 422 con `detail`.

## Reglas que el frontend puede asumir

- Todo punto se evalúa contra el polígono 110292: dentro =>
  `properties.scope=neighborhood`; fuera => `properties.scope=nearby` (contexto,
  estilo punteado en el mapa). El frontend puede ocultar los `nearby`.
- Si una fuente falla: HTTP 200, `data: []` y `note` con el motivo.
- `/api/crimes` nunca mezcla agregados de localidad en `data`.
- Las ubicaciones de cámaras nunca se publican.
- `/api/neighborhood/boundary` es el único GeoJSON, con `properties.code`
  igual a `110292`; `properties.cadastral_sector` es `009216`.

## Ejemplo

```js
const res = await fetch('/api/restaurants?q=café&limit=20');
const { count, data, note } = await res.json();
```
