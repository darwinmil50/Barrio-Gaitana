import asyncio
import logging
import time

from app.domain.entities import FetchResult
from app.domain.interfaces import BoundaryReader
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.nominatim import disk_cache
from app.infrastructure.providers.nominatim.terms import TERMS, viewbox
from app.infrastructure.providers.nominatim.transform import collect
from app.infrastructure.providers.sources import NOMINATIM

logger = logging.getLogger(__name__)
_LOCK = asyncio.Lock()
_LAST: dict[str, float] = {"value": 0.0}


async def throttled_get(http: HttpClient, url: str, params: dict, pause: float):
    """Respeta el límite de Nominatim: una petición cada `pause` segundos."""
    async with _LOCK:
        wait = pause - (time.monotonic() - _LAST["value"])
        if wait > 0:
            await asyncio.sleep(wait)
        payload = await http.get(url, params)
        _LAST["value"] = time.monotonic()
        return payload


class NominatimProvider:
    """Datos OSM reales vía Nominatim; separa barrio y barrios vecinos."""

    source = NOMINATIM

    def __init__(
        self, category: str, url: str, http: HttpClient, cache: TTLCache,
        boundary: BoundaryReader, pause: float = 1.2,
    ) -> None:
        self.category = category
        self.url = url
        self.http = http
        self.cache = cache
        self.boundary = boundary
        self.pause = pause

    async def _download(self, box: list[float]) -> list[dict]:
        items: list[dict] = []
        for term in TERMS.get(self.category, ()):
            params = {
                "format": "jsonv2", "q": term, "viewbox": viewbox(box),
                "bounded": "1", "limit": "50", "dedupe": "1",
            }
            payload = await throttled_get(self.http, self.url, params, self.pause)
            items.extend(payload if isinstance(payload, list) else [])
        unique: dict[str, dict] = {}
        for item in items:
            unique.setdefault(f"{item.get('osm_type')}/{item.get('osm_id')}", item)
        return list(unique.values())

    def _result(self, items: list[dict], geometry: dict, limit: int,
                note: str | None = None) -> FetchResult:
        inside, nearby = collect(
            items, self.category, self.source, geometry, self.category
        )
        message = note or (
            "Datos abiertos de OpenStreetMap. Los puntos con "
            "properties.scope='nearby' están en barrios vecinos: no forman "
            "parte de La Gaitana y se muestran sólo como contexto."
        )
        return FetchResult(inside[:limit] + nearby[:limit], message)

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            verified = await self.boundary.read()
            key = f"nominatim:{self.category}"
            items = await self.cache.get(key)
            if items is None:
                items = disk_cache.read(self.category)
            if items is None:
                items = await self._download(verified.properties["bbox"])
                disk_cache.write(self.category, items)
                await self.cache.set(key, items)
            return self._result(items, verified.geometry, limit)
        except Exception as exc:
            logger.warning("nominatim_failed: %s (%s)", self.category, exc)
            fallback = disk_cache.read(self.category, allow_stale=True) or []
            note = (
                f"Nominatim no respondió ({exc}). Se muestran datos reales "
                "verificados en una consulta anterior."
                if fallback else f"No se pudieron obtener datos de OpenStreetMap: {exc}"
            )
            geometry = (await self.boundary.read()).geometry
            return self._result(fallback, geometry, limit, note)
