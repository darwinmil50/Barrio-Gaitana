from dataclasses import dataclass

from app.application.use_cases.boundary import GetBoundary
from app.application.use_cases.cameras import GetCameras
from app.application.use_cases.crimes import GetCrimes
from app.application.use_cases.locality import GetLocality
from app.application.use_cases.neighborhood import GetNeighborhood
from app.application.use_cases.places import (
    GetBookstores, GetCadastre, GetEducation, GetGreenAreas, GetPolice,
    GetRestaurants, GetSports, GetTransport, GetVeterinaries,
)
from app.application.use_cases.streets import GetStreets
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.config import Settings
from app.infrastructure.http.client import HttpClient
from app.infrastructure.http.rate_limit import RateLimiter
from app.infrastructure.providers.factories import build_registry
from app.infrastructure.repositories.boundary_repository import GeoJsonBoundaryReader


@dataclass
class Container:
    """Composición única de dependencias: casos de uso listos para inyectar."""

    neighborhood: GetNeighborhood
    boundary: GetBoundary
    streets: GetStreets
    veterinaries: GetVeterinaries
    bookstores: GetBookstores
    restaurants: GetRestaurants
    education: GetEducation
    sports: GetSports
    green_areas: GetGreenAreas
    police: GetPolice
    transport: GetTransport
    cadastre: GetCadastre
    crimes: GetCrimes
    cameras: GetCameras
    locality: GetLocality


_container: Container | None = None


def build_container(settings: Settings | None = None) -> Container:
    settings = settings or Settings()
    boundary = GeoJsonBoundaryReader()
    http = HttpClient(settings, RateLimiter(settings.requests_per_minute))
    cache = TTLCache(settings.cache_ttl_seconds)
    registry = build_registry(settings, http, cache, boundary)
    build = registry.build
    return Container(
        neighborhood=GetNeighborhood(boundary),
        boundary=GetBoundary(boundary),
        streets=GetStreets(build("streets")),
        veterinaries=GetVeterinaries(build("veterinaries")),
        bookstores=GetBookstores(build("bookstores")),
        restaurants=GetRestaurants(build("restaurants")),
        education=GetEducation(build("education")),
        sports=GetSports(build("sports")),
        green_areas=GetGreenAreas(build("green_areas")),
        police=GetPolice(build("police")),
        transport=GetTransport(build("transport")),
        cadastre=GetCadastre(build("cadastre")),
        crimes=GetCrimes(build("crimes")),
        cameras=GetCameras(build("cameras")),
        locality=GetLocality(build("locality")),
    )


def get_container() -> Container:
    """Dependencia FastAPI; se puede sobrescribir en pruebas."""
    global _container
    if _container is None:
        _container = build_container()
    return _container
