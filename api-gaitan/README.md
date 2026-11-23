# API La Gaitana — backend

Backend FastAPI que consulta datos oficiales del barrio **La Gaitana** (Suba,
Bogotá D.C.), barrio SDIS **110292** (sector catastral 009216 como metadato).
El polígono verificado se lee de un GeoJSON local; nunca se genera uno inventado.

## Tecnologías

Python 3.15, FastAPI, Pydantic v2, pydantic-settings, httpx, pytest,
pytest-asyncio, pytest-cov. Caché TTL en memoria y limitador de peticiones
(propietarios, sin SQLAlchemy ni bases de datos).

## Arquitectura

`presentation` → `application` → `domain` ← `infrastructure`.
El dominio es puro: entidades, reglas de point-in-polygon y Protocols.
La composición de dependencias vive en `app/infrastructure/dependencies.py`.

```text
app/domain        entidades, interfaces, reglas
app/application   casos de uso, DTO, registry de proveedores
app/infrastructure providers, repositorio, HTTP, caché, logging, DI
app/presentation  rutas, esquemas Pydantic, manejo de errores
```

## Estructura

```text
app/main.py                    fábrica FastAPI, CORS, /docs
app/infrastructure/dependencies.py  Container + get_container
app/infrastructure/providers/  OSM API, Catastro, SITP, SCAJ, cámaras
app/infrastructure/providers/data/  boundary.geojson + osm-items.json
app/infrastructure/repositories/    lector del polígono oficial
app/application/use_cases/     un caso de uso por operación
app/presentation/routes/       endpoints /api/*
tests/unit, tests/integration, tests/acceptance
```

## Instalación y ejecución

```bash
python -m pip install -r requirements.txt
copy .env.example .env        # opcional; sin secretos
python -m uvicorn app.main:app --reload --port 8000
```

Documentación interactiva: `http://localhost:8000/docs`.

## Configuración

Variables con prefijo `GAITAN_`: `CORS_ORIGINS`, `OSM_API_URL`, `CRIMES_URL`,
`SITP_URL`, `CAMERAS_URL` (vacía = no consultar), `CACHE_TTL_SECONDS`,
`REQUESTS_PER_MINUTE`, `HTTP_TIMEOUT_SECONDS`, `LOG_LEVEL`.

## Pruebas

```bash
python -m pytest -q
python -m pytest --cov=app --cov-report=term-missing
python ../scripts/check_lines.py     # límite de 100 líneas por archivo
```

Todas las pruebas son offline: simulan httpx y proveedores. Los resultados OSM
se guardan en `app/infrastructure/providers/data/osm-items.json` (TTL de 24 h)
y se reutilizan si la fuente falla; no se inventan ubicaciones.

## Fuentes

- OpenStreetMap API principal: lugares, vías y etiquetas reales (ODbL).
- SDIS: Barrio Común 110292, `BARRIOCOMU=La Gaitana`, `ESTADO=LEGALIZADO`.
- Catastro UAECD: sector 009216, `SCANOMBRE=LA GAITANA` (metadato).
- SITP Bogotá: paraderos. SCAJ: delito de alto impacto (por localidad).
- Alcaldía de Bogotá: contexto de Suba (10.056 ha, 1.348.372 hab. 2019,
  12 UPZ + 1 UPR, 119 sectores catastrales).
- Estado superficial de vías: dataset oficial; no se procesa en runtime.

## Endpoints

`GET /api/neighborhood`, `/api/neighborhood/boundary`, `/api/streets`,
`/api/veterinaries`, `/api/security/cameras`, `/api/cadastre`, `/api/sports`,
`/api/green-areas`, `/api/education`, `/api/crimes`, `/api/bookstores`,
`/api/restaurants`, `/api/transport`, `/api/locality`, `/api/police`.
Aceptan `q` (opcional) y `limit` (1..200); valores inválidos → 422.

## SOLID

Un proveedor por fuente y un caso de uso por operación; registry de fábricas;
todos los proveedores comparten `fetch(query, limit)` asíncrono; Protocolos
pequeños; inyección por constructor. Ver `SOLID.md` y `ARCHITECTURE.md`.

## Limitaciones

No hay serie oficial de delitos por barrio: `/api/crimes` entrega `data=[]`
y `context` de localidad con el agregado SCJ y un objeto `type=crime_rates`
(series 2018–2026, totales, variación y tasas por 100.000 habitantes usando la
población verificada de Suba de 2019). Las cámaras no se publican. El estado
superficial de vías se reporta como no procesado. Los puntos de barrios vecinos
se entregan con `properties.scope=nearby` para mostrarlos como contexto.
