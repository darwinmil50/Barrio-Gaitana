from app.domain.entities import FetchResult, Place
from app.infrastructure.providers.sources import LOCALITY

PROPERTIES = {
    "extension_ha": 10056,
    "extension_pct_bogota": 6.1,
    "population_2019": 1348372,
    "upz": 12,
    "upr": 1,
    "sectores_catastrales": 119,
    "ubicacion": "Extremo noroccidental de Bogotá D.C.",
    "plan": "Plan Ambiental Local de Suba 2021-2024",
}
NOTE = "Contexto oficial de la localidad; no corresponde al barrio."


class LocalityProvider:
    """Datos verificados de Suba, siempre marcados como scope=locality."""

    category = "locality"
    source = LOCALITY

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult:
        place = Place(
            id="locality-suba",
            name="Suba",
            category=self.category,
            latitude=None,
            longitude=None,
            geometry=None,
            properties=dict(PROPERTIES),
            source=self.source,
        )
        return FetchResult([place], NOTE)
