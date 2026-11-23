# Contrato de API consumido

Base URL: `VITE_API_URL` ( por defecto `http://localhost:8000` ).

## Envelope

```json
{
  "scope": "neighborhood",
  "neighborhood": { "name": "La Gaitana", "code": "110292", "cadastral_sector": "009216", "locality": "Suba", "city": "Bogotá D.C." },
  "source": { "name": "...", "url": "...", "license": "...", "updated_at": null },
  "count": 0,
  "data": [],
  "note": null,
  "context": []
}
```

`scope` es `neighborhood` o `locality`. `note` puede ser `null` o texto; se muestra en la interfaz.

En `/api/crimes`, `context` incluye el agregado SCJ y un objeto
`{ "type": "crime_rates", "scope": "locality", "series": [...], "totals": {...},
"variation_pct": {...}, "population": 1348372, "population_year": 2019 }`.
El frontend lo convierte en tasas por 100.000 habitantes; nunca se reparte a La Gaitana.

## Place

```json
{
  "id": "str",
  "name": "str",
  "category": "str",
  "latitude": 4.7419,
  "longitude": -74.1098,
  "geometry": null,
  "properties": {},
  "source": { "name": "...", "url": "...", "license": "...", "updated_at": null }
}
```

`latitude` y `longitude` pueden ser `null`. `geometry` puede ser un GeoJSON.

## Endpoints

| Método | Ruta | Respuesta |
| --- | --- | --- |
| GET | `/api/neighborhood` | Envelope |
| GET | `/api/neighborhood/boundary` | FeatureCollection con propiedad extra `source` |
| GET | `/api/streets` | Envelope |
| GET | `/api/veterinaries` | Envelope |
| GET | `/api/security/cameras` | Envelope |
| GET | `/api/cadastre` | Envelope |
| GET | `/api/sports` | Envelope |
| GET | `/api/green-areas` | Envelope |
| GET | `/api/education` | Envelope |
| GET | `/api/crimes` | Envelope |
| GET | `/api/bookstores` | Envelope |
| GET | `/api/restaurants` | Envelope |
| GET | `/api/transport` | Envelope |
| GET | `/api/locality` | Envelope ( contexto ) |
| GET | `/api/police` | Envelope |

Parámetros opcionales: `q` ( texto ) y `limit` ( entero 1..200 ).

## Regla crítica

Los registros con `scope=locality` nunca se cuentan ni se muestran como datos del barrio La Gaitana. El único barrio atendido es La Gaitana, SDIS 110292 (sector catastral 009216), Suba, Bogotá D.C. Los puntos con `properties.scope=nearby` pertenecen a barrios vecinos: se muestran como contexto punteado y pueden ocultarse con "Incluir alrededores".
