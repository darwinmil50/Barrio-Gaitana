""" Caso de uso genérico de consulta; las operaciones concretas lo especializan."""

from app.domain.entities import FetchResult
from app.domain.interfaces import PlaceProvider
from app.domain.rules.matching import select


class FetchPlaces:
    """Depende sólo de PlaceProvider (D); filtra y limita en el dominio."""

    def __init__(self, provider: PlaceProvider) -> None:
        self.provider = provider

    @property
    def source(self) -> dict:
        return self.provider.source.to_dict()

    async def execute(self, query: str | None = None, limit: int = 50) -> FetchResult:
        result = await self.provider.fetch(query, limit)
        return FetchResult(select(result.data, query, limit), result.note, result.context)
