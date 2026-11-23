from functools import partial

from app.application.services.registry import ProviderRegistry
from app.domain.interfaces import BoundaryReader
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.config import Settings
from app.infrastructure.http.client import HttpClient
from app.infrastructure.providers.cameras import CameraProvider
from app.infrastructure.providers.catastro import CadastroProvider
from app.infrastructure.providers.crimes import CrimeProvider
from app.infrastructure.providers.locality import LocalityProvider
from app.infrastructure.providers.osm.provider import OsmProvider
from app.infrastructure.providers.sitp import SitpProvider
from app.infrastructure.providers.streets import StreetProvider
from app.infrastructure.providers.transport import TransportProvider

SIMPLE = (
    "veterinaries", "bookstores", "restaurants", "education", "sports",
    "green_areas", "police",
)


def build_registry(
    settings: Settings, http: HttpClient, cache: TTLCache, boundary: BoundaryReader
) -> ProviderRegistry:
    """Único lugar donde se eligen las fábricas por categoría (O)."""
    registry = ProviderRegistry()

    def osm(category: str) -> OsmProvider:
        return OsmProvider(
            category, settings.osm_api_url, http, cache, boundary,
        )

    for category in SIMPLE:
        registry.register(category, partial(osm, category))
    registry.register("streets", lambda: StreetProvider(osm("streets")))

    def transport() -> TransportProvider:
        stops = osm("transport")
        return TransportProvider(
            stops, stops, SitpProvider(settings.sitp_url, http, cache, boundary)
        )

    registry.register("transport", transport)
    registry.register("cadastre", lambda: CadastroProvider(boundary))
    registry.register("cameras", lambda: CameraProvider(
        settings.cameras_url, http, cache, boundary,
    ))
    registry.register("crimes", lambda: CrimeProvider(settings.crimes_url, http, cache))
    registry.register("locality", lambda: LocalityProvider())
    return registry
