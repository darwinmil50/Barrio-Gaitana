from types import SimpleNamespace

from app.domain.entities import FetchResult, Place
from app.domain.rules.matching import select
from tests.fakes import SOURCE, boundary_payload, neighborhood_payload

USE_CASES = (
    "streets", "veterinaries", "bookstores", "restaurants", "education",
    "sports", "green_areas", "police", "transport", "cadastre", "crimes",
    "cameras", "locality", "neighborhood", "boundary",
)


def make_place(pid="osm/1", name="Veterinaria La Gaitana", lon=-74.110,
               lat=4.741, category="veterinaries", **props):
    return Place(
        id=pid, name=name, category=category, latitude=lat, longitude=lon,
        geometry={"type": "Point", "coordinates": [lon, lat]},
        properties=props, source=SOURCE,
    )


def small_result(*places, note=None, context=None):
    return FetchResult(list(places), note, list(context or []))


class FakeHttp:
    """Cliente HTTP simulado: devuelve un payload o lanza un error controlado."""

    def __init__(self, payload=None, error=None):
        self.payload = payload if payload is not None else {"features": [], "elements": []}
        self.error = error
        self.calls = []

    async def get(self, url, params=None):
        self.calls.append(("GET", url, params))
        if self.error:
            raise self.error
        return self.payload

    async def post(self, url, data=None):
        self.calls.append(("POST", url, data))
        if self.error:
            raise self.error
        return self.payload


class FakeUseCase:
    """Imita a un caso de uso real aplicando filtro y límite del dominio."""

    def __init__(self, result=None, source=SOURCE):
        self.result = result if result is not None else small_result(make_place())
        self.source = source

    async def execute(self, query=None, limit=50):
        result = self.result
        return FetchResult(select(result.data, query, limit), result.note, result.context)


class FakeJsonUseCase:
    def __init__(self, payload):
        self.payload = payload

    async def execute(self, query=None, limit=50):
        return self.payload


def make_container(**overrides):
    values = {
        name: FakeUseCase() for name in USE_CASES
        if name not in {"neighborhood", "boundary"}
    }
    values["neighborhood"] = FakeJsonUseCase(neighborhood_payload())
    values["boundary"] = FakeJsonUseCase(boundary_payload())
    values.update(overrides)
    return SimpleNamespace(**values)
