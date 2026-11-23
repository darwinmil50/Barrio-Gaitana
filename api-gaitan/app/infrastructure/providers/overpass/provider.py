import logging

from app.domain.entities import FetchResult
from app.domain.interfaces import BoundaryReader
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.overpass.query import build_query
from app.infrastructure.providers.overpass.transform import to_places
from app.infrastructure.providers.sources import OVERPASS

logger = logging.getLogger(__name__)


class OverpassProvider:
    """Proveedor genérico por categoría; aporta geometría y tags reales."""

    source = OVERPASS

    def __init__(
        self,
        category: str,
        fragment: str,
        url: str,
        http: HttpClient,
        cache: TTLCache,
        boundary: BoundaryReader,
    ) -> None:
        self.category = category
        self.fragment = fragment
        self.url = url
        self.http = http
        self.cache = cache
        self.boundary = boundary

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            verified = await self.boundary.read()
            key = f"overpass:{self.category}"
            elements = await self.cache.get(key)
            if elements is None:
                box = verified.properties["bbox"]
                text = build_query(box, self.fragment)
                payload = await self.http.post(self.url, {"data": text})
                elements = payload.get("elements", [])
                await self.cache.set(key, elements)
            places = to_places(elements, self.category, verified.geometry, self.source)
            return FetchResult(places[:limit])
        except Exception as exc:
            logger.warning("overpass_failed: %s (%s)", self.category, exc)
            return FetchResult([], f"No se pudieron obtener datos de OpenStreetMap: {exc}")
