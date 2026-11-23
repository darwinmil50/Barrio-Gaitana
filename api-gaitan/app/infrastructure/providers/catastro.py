import logging

from app.domain.entities import FetchResult, Place
from app.domain.entities.neighborhood import CODE, OFFICIAL_NAME
from app.domain.interfaces import BoundaryReader
from app.infrastructure.providers.sources import CATASTRO

logger = logging.getLogger(__name__)

NOTE = "Sector catastral verificado UAECD 009216, tipo urbano, EPSG:4326."


class CadastroProvider:
    """Entrega los metadatos catastrales verificados del polígono oficial."""

    category = "cadastre"
    source = CATASTRO

    def __init__(self, boundary: BoundaryReader) -> None:
        self.boundary = boundary

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        try:
            verified = await self.boundary.read()
            properties = dict(verified.properties)
            place = Place(
                id=f"sector-{properties.get('SCACODIGO', CODE)}",
                name=properties.get("SCANOMBRE", OFFICIAL_NAME),
                category=self.category,
                latitude=None,
                longitude=None,
                geometry=verified.geometry,
                properties=properties,
                source=self.source,
            )
            return FetchResult([place], NOTE)
        except Exception as exc:
            logger.warning("catastro_failed: %s", exc)
            return FetchResult([], f"No se pudo leer el catastro verificado: {exc}")
