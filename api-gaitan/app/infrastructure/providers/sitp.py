import logging

from app.domain.entities import FetchResult, Place
from app.domain.interfaces import BoundaryReader
from app.domain.rules.geometry import in_geometry
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.sources import SITP

logger = logging.getLogger(__name__)


class SitpProvider:
    """Paraderos SITP oficiales, filtrados por el polígono de La Gaitana."""

    category = "bus_stop"
    source = SITP

    def __init__(
        self, url: str, http: HttpClient, cache: TTLCache, boundary: BoundaryReader
    ) -> None:
        self.url = url
        self.http = http
        self.cache = cache
        self.boundary = boundary

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            verified = await self.boundary.read()
            payload = await self.cache.get("sitp:paraderos")
            if payload is None:
                payload = await self.http.get(self.url)
                await self.cache.set("sitp:paraderos", payload)
            places = []
            for index, feature in enumerate(payload.get("features", [])):
                geometry = feature.get("geometry") or {}
                if geometry.get("type") != "Point":
                    continue
                lon, lat = (geometry.get("coordinates") or [None, None])[:2]
                if not in_geometry(lon, lat, verified.geometry):
                    continue
                props = dict(feature.get("properties") or {})
                places.append(Place(
                    id=str(props.get("codigo") or f"sitp-{index}"),
                    name=props.get("nombre") or props.get("name") or f"Paradero {index}",
                    category=self.category,
                    latitude=lat,
                    longitude=lon,
                    geometry={"type": "Point", "coordinates": [lon, lat]},
                    properties=props,
                    source=self.source,
                ))
            return FetchResult(places[:limit])
        except Exception as exc:
            logger.warning("sitp_failed: %s", exc)
            return FetchResult([], f"No se pudieron obtener paraderos SITP: {exc}")
