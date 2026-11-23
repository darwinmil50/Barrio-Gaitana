import json
import logging
from pathlib import Path

from app.domain.entities import FetchResult
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.crimes_series import build as build_rates
from app.infrastructure.providers.sources import SCJ

logger = logging.getLogger(__name__)

FALLBACK = Path(__file__).with_name("data") / "crimes-locality.json"

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

    @staticmethod
    def _suba_attrs(payload: dict) -> list[dict]:
        found = []
        for feature in payload.get("features", []):
            attrs = dict(feature.get("attributes") or feature.get("properties") or {})
            values = {str(value).strip().casefold() for value in attrs.values()}
            if "suba" in values:
                found.append(attrs)
        return found

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        note = NOTE
        payload = None
        try:
            payload = await self.cache.get("crimes:locality")
            if payload is None:
                payload = await self.http.get(self.url, params={
                    "where": "1=1", "outFields": "*",
                    "returnGeometry": "false", "f": "geojson",
                })
                await self.cache.set("crimes:locality", payload)
        except Exception as exc:
            logger.warning("crimes_failed: %s", exc)
            note += f" Falló la consulta oficial: {exc}."

        attrs_list = self._suba_attrs(payload) if payload else []
        if not attrs_list:
            backup = json.loads(FALLBACK.read_text(encoding="utf-8"))
            attrs_list = self._suba_attrs(backup)
            if attrs_list:
                note += " Usando respaldo oficial verificado cuando la fuente no responde."

        context = []
        for attrs in attrs_list:
            attrs = dict(attrs)
            attrs.update({"scope": "locality", "locality": "Suba"})
            context.append(attrs)
            context.append(build_rates(attrs))
        if not context:
            note += " No se obtuvieron agregados de Suba de la fuente oficial."
        return FetchResult([], note, context[:limit])
