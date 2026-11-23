from app.domain.entities import FetchResult
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.cameras import NOTE, CameraProvider
from app.infrastructure.providers.crimes import CrimeProvider
from app.infrastructure.providers.locality import LocalityProvider
from app.infrastructure.providers.overpass.query import build_query
from app.infrastructure.providers.overpass.transform import to_places
from app.infrastructure.providers.sources import OVERPASS
from tests.conftest import FakeHttp
from tests.fakes import FakeBoundary, SQUARE


def test_overpass_query_uses_bbox_order_and_out_center():
    query = build_query([-74.11, 4.73, -74.10, 4.74], 'node["amenity"="x"]({bbox});')
    assert "4.73,-74.11,4.74,-74.1" in query
    assert query.endswith("out center;")


def test_transform_excludes_points_outside_polygon():
    elements = [
        {"type": "node", "id": 1, "lat": 1, "lon": 1, "tags": {"name": "Dentro"}},
        {"type": "node", "id": 2, "lat": 9, "lon": 9, "tags": {"name": "Fuera"}},
    ]
    places = to_places(elements, "veterinaries", SQUARE, OVERPASS)
    assert [p.name for p in places] == ["Dentro"]


async def test_camera_without_url_never_queries():
    http = FakeHttp()
    provider = CameraProvider(None, http, TTLCache(), FakeBoundary())
    result = await provider.fetch()
    assert result.data == []
    assert result.note == NOTE
    assert http.calls == []


async def test_locality_provider_never_claims_neighborhood_scope():
    result = await LocalityProvider().fetch()
    assert result.data[0].category == "locality"
    assert result.data[0].properties["population_2019"] == 1348372


async def test_crime_provider_marks_only_locality_context():
    payload = {"features": [
        {"attributes": {"LOCALIDAD": "SUBA", "TOTAL": 12}},
        {"attributes": {"LOCALIDAD": "USAQUEN", "TOTAL": 3}},
    ]}
    provider = CrimeProvider("https://ejemplo.org", FakeHttp(payload), TTLCache())
    result = await provider.fetch()
    assert result.data == []
    assert len(result.context) == 2
    assert result.context[0]["scope"] == "locality"
    assert result.context[1]["type"] == "crime_rates"
    assert result.context[1]["scope"] == "locality"


async def test_crime_provider_failure_is_a_note_not_an_exception():
    provider = CrimeProvider("https://ejemplo.org", FakeHttp(error=ValueError("boom")), TTLCache())
    result = await provider.fetch()
    assert isinstance(result, FetchResult)
    assert result.data == []
    assert "boom" in result.note
