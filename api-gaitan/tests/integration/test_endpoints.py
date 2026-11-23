import pytest

from app.infrastructure.dependencies import get_container
from tests.conftest import FakeJsonUseCase, FakeUseCase, make_container, make_place, small_result
from tests.fakes import boundary_payload, neighborhood_payload

ENVELOPE_ENDPOINTS = [
    "streets", "veterinaries", "bookstores", "restaurants", "education",
    "sports", "green-areas", "police", "transport", "cadastre", "crimes",
    "security/cameras", "locality", "neighborhood",
]


@pytest.mark.parametrize("endpoint", ENVELOPE_ENDPOINTS)
def test_endpoint_returns_contract_envelope(client, endpoint):
    body = client.get(f"/api/{endpoint}").json()
    assert body["neighborhood"]["official_name"] == "LA GAITANA"
    assert body["neighborhood"]["code"] == "110292"
    assert body["neighborhood"]["cadastral_sector"] == "009216"
    assert set(body) >= {"scope", "source", "count", "data", "note"}
    assert body["source"]["name"] == "Fuente de prueba"
    if endpoint == "neighborhood":
        assert body["count"] == 1  # `data` es un objeto, no un arreglo
    else:
        assert body["count"] == len(body["data"])


def test_neighborhood_data_is_an_object(client):
    body = client.get("/api/neighborhood").json()
    assert isinstance(body["data"], dict)
    assert body["data"]["locality"] == "Suba"


def test_boundary_is_feature_collection_with_source(client):
    body = client.get("/api/neighborhood/boundary").json()
    assert body["type"] == "FeatureCollection"
    assert len(body["features"]) == 1
    assert body["features"][0]["properties"]["code"] == "110292"
    assert "source" in body


@pytest.mark.parametrize("suffix", ["?limit=0", "?limit=201", "?q=" + "x" * 121])
def test_invalid_query_returns_422(client, suffix):
    assert client.get("/api/veterinaries" + suffix).status_code == 422


def test_query_and_limit_are_applied(client):
    places = [make_place(f"osm/{i}", f"Librería {i}") for i in range(4)]
    container = make_container(
        bookstores=FakeUseCase(small_result(*places)),
        neighborhood=FakeJsonUseCase(neighborhood_payload()),
        boundary=FakeJsonUseCase(boundary_payload()),
    )
    client.app.dependency_overrides[get_container] = lambda: container
    body = client.get("/api/bookstores?q=Librería%202&limit=1").json()
    assert body["count"] == 1
    assert body["data"][0]["name"] == "Librería 2"


def test_openapi_docs_available(client):
    assert client.get("/docs").status_code == 200
    assert "/api/veterinaries" in client.get("/openapi.json").json()["paths"]
