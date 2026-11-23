from app.domain.entities import FetchResult
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.overpass.provider import OverpassProvider
from app.infrastructure.providers.streets import StreetProvider
from app.infrastructure.providers.transport import TransportProvider
from tests.conftest import FakeHttp, make_place
from tests.fakes import FakeBoundary

FRAGMENT = 'nwr["amenity"="veterinary"]({bbox});'
PAYLOAD = {"elements": [
    {"type": "node", "id": 1, "lat": 1, "lon": 1, "tags": {"name": "Vetinside"}},
    {"type": "node", "id": 2, "lat": 9, "lon": 9, "tags": {"name": "Vetoutside"}},
]}


def make_provider(http):
    return OverpassProvider(
        "veterinaries", FRAGMENT, "https://overpass-api.de/api/interpreter",
        http, TTLCache(), FakeBoundary(),
    )


async def test_overpass_filters_by_point_in_polygon():
    result = await make_provider(FakeHttp(PAYLOAD)).fetch()
    assert [p.name for p in result.data] == ["Vetinside"]


async def test_overpass_uses_cache_and_posts_to_real_endpoint():
    http = FakeHttp(PAYLOAD)
    provider = make_provider(http)
    await provider.fetch()
    await provider.fetch()
    assert len(http.calls) == 1
    assert http.calls[0][0] == "POST"
    assert http.calls[0][1] == "https://overpass-api.de/api/interpreter"
    assert http.calls[0][2]["data"].startswith("[out:json][timeout:25];")


async def test_overpass_failure_returns_empty_data_and_note():
    provider = make_provider(FakeHttp(error=RuntimeError("timeout")))
    result = await provider.fetch()
    assert result.data == []
    assert "timeout" in result.note


async def test_streets_note_explains_road_surface_limitation():
    provider = StreetProvider(make_provider(FakeHttp(PAYLOAD)))
    result = await provider.fetch()
    assert "no se procesa en tiempo de ejecución" in result.note


class Stub:
    def __init__(self, places, note=None):
        self.places = places
        self.note = note

    async def fetch(self, query=None, limit=50):
        return FetchResult(self.places[:limit], self.note)


async def test_transport_merges_and_deduplicates_sources():
    provider = TransportProvider(
        Stub([make_place("osm/1", "A")]),
        Stub([make_place("osm/2", "B")]),
        Stub([make_place("osm/1", "A"), make_place("sitp/9", "C")], "nota SITP"),
    )
    result = await provider.fetch(limit=10)
    assert [p.id for p in result.data] == ["osm/1", "osm/2", "sitp/9"]
    assert result.note == "nota SITP"
