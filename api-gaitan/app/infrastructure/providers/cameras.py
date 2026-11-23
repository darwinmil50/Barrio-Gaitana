import logging

from app.domain.entities import FetchResult
from app.domain.interfaces import BoundaryReader
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.sources import CAMERAS

logger = logging.getLogger(__name__)

NOTE = (
    "No se publican ubicaciones de cámaras: la información disponible "
    "no es pública y autorizada."
)


class CameraProvider:
    """Sólo `fetch`: no implementa métodos de locales, calles ni negocios."""

    category = "cameras"
    source = CAMERAS

    def __init__(
        self, url: str | None, http: HttpClient, cache: TTLCache, boundary: BoundaryReader
    ) -> None:
        self.url = url
        self.http = http
        self.cache = cache
        self.boundary = boundary

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        if not self.url:
            return FetchResult([], NOTE)
        try:
            verified = await self.boundary.read()
            cached = await self.cache.get("cameras:raw")
            if cached is None:
                cached = await self.http.get(self.url)
                await self.cache.set("cameras:raw", cached)
            features = cached.get("features", []) if isinstance(cached, dict) else []
            logger.info("camera_feed_checked: %s features (not published)", len(features))
        except Exception as exc:
            logger.warning("camera_feed_failed: %s", exc)
        return FetchResult([], NOTE)
