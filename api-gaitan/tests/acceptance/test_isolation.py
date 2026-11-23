import json
from pathlib import Path

from app.application.use_cases.places import GetVeterinaries
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.crimes import CrimeProvider
from app.infrastructure.providers.overpass.filters import CATEGORY_FILTERS
from app.infrastructure.providers.overpass.provider import OverpassProvider
from app.infrastructure.repositories.boundary_repository import (
    BOUNDARY_FILE, GeoJsonBoundaryReader,
)
from tests.conftest import FakeHttp, make_container

INSIDE = (-74.10874137931035, 4.744210344827587)
OUTSIDE = (-74.130, 4.741)


def elements():
    return {"elements": [
        {"type": "node", "id": 1, "lat": INSIDE[1], "lon": INSIDE[0],
         "tags": {"name": "Veterinaria La Gaitana"}},
        {"type": "node", "id": 2, "lat": OUTSIDE[1], "lon": OUTSIDE[0],
         "tags": {"name": "Veterinaria de otro barrio"}},
    ]}


def provider(http):
    return OverpassProvider(
        "veterinaries", CATEGORY_FILTERS["veterinaries"],
        "https://overpass-api.de/api/interpreter",
        http, TTLCache(), GeoJsonBoundaryReader(),
    )


async def test_point_from_another_neighborhood_is_excluded():
    http = FakeHttp(elements())
    result = await provider(http).fetch()
    assert [p.name for p in result.data] == ["Veterinaria La Gaitana"]
    assert "4.738106947" in http.calls[0][2]["data"]


def test_endpoint_uses_real_verified_polygon(api):
    container = make_container(veterinaries=GetVeterinaries(provider(FakeHttp(elements()))))
    body = api(container).get("/api/veterinaries").json()
    assert body["count"] == 1
    assert body["data"][0]["name"] == "Veterinaria La Gaitana"
    assert body["source"]["name"] == "OpenStreetMap vía Overpass API"


def test_boundary_file_is_official_and_untouched():
    payload = json.loads(Path(BOUNDARY_FILE).read_text(encoding="utf-8"))
    feature = payload["features"][0]
    assert feature["properties"]["code"] == "110292"
    assert feature["properties"]["cadastral_sector"] == "009216"
    assert feature["properties"]["verified"] is True
    assert len(feature["geometry"]["coordinates"][0]) == 77


def test_crimes_endpoint_has_no_neighborhood_data(api):
    payload = {"features": [{"attributes": {"LOCALIDAD": "SUBA", "TOTAL": 12}}]}
    provider = CrimeProvider("https://ejemplo.org", FakeHttp(payload), TTLCache())
    from app.application.use_cases.crimes import GetCrimes
    container = make_container(crimes=GetCrimes(provider))
    body = api(container).get("/api/crimes").json()
    assert body["data"] == []
    assert body["context"][0]["scope"] == "locality"
    assert body["context"][0]["TOTAL"] == 12
