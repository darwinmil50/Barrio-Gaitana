import pytest

from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.nominatim import disk_cache
from app.infrastructure.providers.nominatim.provider import NominatimProvider
from app.infrastructure.providers.nominatim.terms import viewbox
from app.infrastructure.providers.sources import NOMINATIM
from tests.conftest import FakeHttp
from tests.fakes import FakeBoundary

URL = "https://nominatim.openstreetmap.org/search"
PAYLOAD = [
    {"osm_type": "node", "osm_id": 1, "lat": "1", "lon": "1", "name": "Dentro", "type": "cafe"},
    {"osm_type": "node", "osm_id": 2, "lat": "9", "lon": "9", "name": "Fuera", "type": "cafe"},
]


@pytest.fixture(autouse=True)
def isolated_disk_cache(monkeypatch, tmp_path):
    monkeypatch.setattr(disk_cache, "CACHE_FILE", tmp_path / "cache.json")


def make_provider(http):
    return NominatimProvider("restaurants", URL, http, TTLCache(),
                             FakeBoundary(), pause=0)


def test_viewbox_expands_the_official_bbox():
    assert viewbox([-74.11, 4.73, -74.10, 4.74]).startswith("-74.118,4.748")


async def test_separates_neighborhood_from_nearby_places():
    result = await make_provider(FakeHttp(PAYLOAD)).fetch()
    assert [p.properties["scope"] for p in result.data] == ["neighborhood", "nearby"]
    assert "barrios vecinos" in result.note


async def test_uses_get_caches_and_respects_category_terms():
    http = FakeHttp(PAYLOAD)
    provider = make_provider(http)
    await provider.fetch()
    await provider.fetch()
    assert all(call[0] == "GET" for call in http.calls)
    assert len(http.calls) == 2
    assert http.calls[0][2]["bounded"] == "1"
    assert http.calls[0][2]["q"] == "restaurante"


async def test_failure_returns_empty_data_and_note():
    provider = make_provider(FakeHttp(error=RuntimeError("sin red")))
    result = await provider.fetch()
    assert result.data == []
    assert "sin red" in result.note
    assert provider.source is NOMINATIM
