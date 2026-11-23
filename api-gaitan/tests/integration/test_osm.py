import pytest

from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.osm import store
from app.infrastructure.providers.osm.parse import parse_items
from app.infrastructure.providers.osm.provider import OsmProvider
from app.infrastructure.providers.osm.tags import category_for, bounding_box
from app.infrastructure.providers.sources import OSM_API
from tests.fakes import FakeBoundary

XML = """<osm version="0.6">
  <node id="1" lat="1" lon="1"><tag k="amenity" v="restaurant"/>
    <tag k="name" v="Dentro"/></node>
  <node id="2" lat="9" lon="9"><tag k="amenity" v="restaurant"/>
    <tag k="name" v="Fuera"/></node>
  <node id="3" lat="0.5" lon="0.5"/>
  <node id="4" lat="1.5" lon="1.5"/>
  <way id="10"><nd ref="3"/><nd ref="4"/><tag k="leisure" v="park"/>
    <tag k="name" v="Parque"/></way>
  <node id="5" lat="1" lon="1"><tag k="shop" v="books"/></node>
</osm>"""


def test_category_mapping_is_strict():
    assert category_for({"amenity": "veterinary"}) == "veterinaries"
    assert category_for({"shop": "books"}) == "bookstores"
    assert category_for({"leisure": "pitch", "sport": "soccer"}) == "sports"
    assert category_for({"shop": "pet"}) is None
    assert category_for({"name": "algo"}) is None


def test_bounding_box_expands_official_limits():
    assert bounding_box([-74.11, 4.73, -74.10, 4.74], 0.001) == (
        "-74.111,4.729,-74.099,4.741"
    )


def test_parse_items_uses_centroid_of_ways():
    items = parse_items(XML)
    assert len(items) == 4
    park = next(item for item in items if item["osm_type"] == "w")
    assert (park["lon"], park["lat"]) == (1.0, 1.0)
    assert park["name"] == "Parque"
    assert park["category"] == "green_areas"


@pytest.fixture(autouse=True)
def isolated_store(monkeypatch, tmp_path):
    monkeypatch.setattr(store, "CACHE_FILE", tmp_path / "osm.json")


def provider(category):
    return OsmProvider(category, "https://osm.test/map", object(),
                       TTLCache(), FakeBoundary())


async def test_provider_splits_inside_and_nearby(monkeypatch):
    monkeypatch.setattr(store, "items", lambda *a, **k: _ready())
    result = await provider("restaurants").fetch()
    assert [p.name for p in result.data] == ["Dentro", "Fuera"]
    assert [p.properties["scope"] for p in result.data] == [
        "neighborhood", "nearby",
    ]
    assert provider("restaurants").source is OSM_API


def _ready():
    async def load(*args, **kwargs):
        return [item for item in parse_items(XML)
                if item["category"] == "restaurants"]
    return load()


async def test_empty_category_has_honest_note(monkeypatch):
    async def none(*args, **kwargs):
        return []
    monkeypatch.setattr(store, "items", none)
    result = await provider("veterinaries").fetch()
    assert result.data == []
    assert "No se inventan" in result.note


class FakeTextHttp:
    def __init__(self, text):
        self.text = text
        self.calls = []

    async def get_text(self, url, params=None):
        self.calls.append((url, params))
        return self.text


async def test_store_downloads_once_and_caches(monkeypatch):
    http = FakeTextHttp(XML)
    first = await store.items(http, "https://osm.test/map", FakeBoundary())
    second = await store.items(http, "https://osm.test/map", FakeBoundary())
    assert first == second
    assert len(http.calls) == 1
    assert "bbox" in http.calls[0][1]
