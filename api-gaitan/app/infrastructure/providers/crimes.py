import logging

from app.domain.entities import FetchResult
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.crimes_series import build as build_rates
from app.infrastructure.providers.sources import SCJ

logger = logging.getLogger(__name__)

NOTE = (
    "No hay datos oficiales de delito de alto impacto por barrio: La Gaitana "
    "no tiene serie propia publicada. Sólo se muestra el agregado de localidad."
)


class CrimeProvider:
    """Solicita agregados oficiales por localidad; jamás los reparte por barrio."""

    category = "crimes"
    source = SCJ

    def __init__(self, url: str, http: HttpClient, cache: TTLCache) -> None:
        self.url = url
        self.http = http
        self.cache = cache

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            payload = await self.cache.get("crimes:locality")
            if payload is None:
                payload = await self.http.get(self.url, params={
                    "where": "1=1", "outFields": "*",
                    "returnGeometry": "false", "f": "geojson",
                })
                await self.cache.set("crimes:locality", payload)
            context = []
            for feature in payload.get("features", []):
                attrs = dict(feature.get("attributes") or feature.get("properties") or {})
                if "suba" not in {str(v).strip().casefold() for v in attrs.values()}:
                    continue
                attrs.update({"scope": "locality", "locality": "Suba"})
                context.append(attrs)
                context.append(build_rates(attrs))
            note = NOTE
            if not context:
                note += " No se obtuvieron agregados de Suba de la fuente oficial."
            return FetchResult([], note, context[:limit])
        except Exception as exc:
            logger.warning("crimes_failed: %s", exc)
            return FetchResult([], f"{NOTE} Falló la consulta oficial: {exc}")
