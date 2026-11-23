# SOLID en el proyecto

## S — Responsabilidad única

- `OsmProvider`: sólo consulta la API principal de OSM, transforma y separa
  el barrio de los barrios vecinos.
- `CadastroProvider`: sólo entrega metadatos del sector catastral 009216.
- `CrimeProvider`: sólo pide agregados por localidad; nunca los baja a barrio.
- `CameraProvider`: sólo decide si publica (no publica) y devuelve la nota.
- `GetVeterinaries`, `GetBookstores`, `GetRestaurants`, ...: un caso de uso por
  operación HTTP, sin lógica de transporte ni de presentación.
- `GeoJsonBoundaryReader`: sólo lee el archivo oficial; no lo modifica.

## O — Abierto/Cerrado

`ProviderRegistry` mantiene `dict[str, Callable[[], provider]]`. Para agregar,
por ejemplo, una segunda fuente de paraderos se registra otra fábrica en
`infrastructure/providers/factories.py`; los casos de uso y las rutas no cambian.
`TransportProvider` ya combina varias fuentes sin conocer sus detalles.

## L — Sustitución de Liskov

Todos los proveedores cumplen el mismo `PlaceProvider` (Protocol): atributos
`category` y `source`, y el método asíncrono
`fetch(query: str | None = None, limit: int = 50) -> FetchResult`.
`StreetProvider`, `CrimeProvider`, `LocalityProvider` y `CameraProvider` son
extensiones del mismo contrato sin métodos nuevos. Por eso `FetchPlaces`
acepta cualquiera de ellos indistintamente.

## I — Segregación de interfaces

`domain/interfaces/base.py` define Protocolos pequeños:

- `BoundaryReader`: sólo `read()`.
- `PlaceProvider`: sólo `fetch()`.
- `StreetProvider`, `CrimeProvider`, `LocalityProvider`, `CameraProvider`:
  especializaciones sin métodos adicionales.

Un proveedor de cámaras no implementa métodos de locales, negocios ni calles.
Las pruebas usan los mismos Protocols con dobles (`FakeHttp`, `FakeUseCase`).

## D — Inversión de dependencias

- Los casos de uso reciben interfaces por constructor:
  `FetchPlaces(provider: PlaceProvider)`, `GetNeighborhood(boundary: BoundaryReader)`.
- `infrastructure/dependencies.py` es la única composición: crea `Settings`,
  `HttpClient`, `RateLimiter`, `TTLCache`, `GeoJsonBoundaryReader`, el registry
  y el `Container` de casos de uso.
- `app/main.py` expone `create_app()` y `get_container` como dependencia
  FastAPI; las pruebas la sobrescriben sin tocar las rutas.

## Demostración en pruebas

- `tests/unit/test_registry.py`: O+I (fábricas y Protocols).
- `tests/integration/test_providers.py`: L (mismo `fetch` para todos).
- `tests/integration/test_failure.py`: D (contenedor simulado por endpoint).
- `tests/acceptance/test_isolation.py`: flujo real con polígono oficial.
