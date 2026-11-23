from app.domain.entities import FetchResult
from app.infrastructure.providers.sources import OSM_API

NOTE = (
    "Se consultan vías y tags de OpenStreetMap; el dataset oficial de estado "
    "superficial de vías no se procesa en tiempo de ejecución, por lo que no "
    "se afirma ningún estado superficial."
)


class StreetProvider:
    """Vías con surface/smoothness cuando Overpass las reporta."""

    category = "streets"
    source = OSM_API

    def __init__(self, overpass) -> None:
        self.overpass = overpass

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        result = await self.overpass.fetch(query, limit)
        note = f"{result.note} {NOTE}" if result.note else NOTE
        return FetchResult(result.data, note, result.context)
