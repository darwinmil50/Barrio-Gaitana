import logging

from app.domain.entities import FetchResult
from app.domain.interfaces import BoundaryReader
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.nominatim.transform import collect
from app.infrastructure.providers.osm import store
from app.infrastructure.providers.sources import OSM_API

logger = logging.getLogger(__name__)

EMPTY_NOTE = (
    "OpenStreetMap no registra elementos de esta categoría en La Gaitana "
    "ni en sus alrededores. No se inventan ubicaciones."
)
CONTEXT_NOTE = (
    "Datos abiertos reales de OpenStreetMap. Los puntos con "
    "properties.scope='nearby' están en barrios vecinos: no forman parte "
    "de La Gaitana y se muestran sólo como contexto."
)


class OsmProvider:
    """Datos reales de OSM vía API principal; separa barrio y vecindades."""

    source = OSM_API

    def __init__(
        self, category: str, url: str, http: HttpClient, cache: TTLCache,
        boundary: BoundaryReader,
    ) -> None:
        self.category = category
        self.url = url
        self.http = http
        self.cache = cache
        self.boundary = boundary

    async def _build(self, items: list[dict], limit: int) -> FetchResult:
        geometry = (await self.boundary.read()).geometry
        subset = [item for item in items if item["category"] == self.category]
        inside, nearby = collect(
            subset, self.category, self.source, geometry, self.category
        )
        data = inside[:limit] + nearby[:limit]
        return FetchResult(data, CONTEXT_NOTE if data else EMPTY_NOTE)

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            items = await store.items(self.http, self.url, self.boundary)
            return await self._build(items, limit)
        except Exception as exc:
            logger.warning("osm_api_failed: %s (%s)", self.category, exc)
            stale = store._load(allow_stale=True)
            if stale:
                result = await self._build(stale, limit)
                return FetchResult(
                    result.data,
                    f"OpenStreetMap no respondió ({exc}). Se muestran datos "
                    "reales verificados en una consulta anterior.",
                )
            return FetchResult(
                [], f"No se pudieron obtener datos de OpenStreetMap: {exc}"
            )
