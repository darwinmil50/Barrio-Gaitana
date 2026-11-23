from app.application.use_cases.cameras import GetCameras
from app.application.use_cases.locality import GetLocality
from app.application.use_cases.places import GetCadastre
from app.infrastructure.cache.memory import TTLCache
from app.infrastructure.providers.cameras import CameraProvider, NOTE
from app.infrastructure.providers.locality import LocalityProvider
from app.infrastructure.providers.catastro import CadastroProvider
from app.infrastructure.repositories.boundary_repository import GeoJsonBoundaryReader
from tests.conftest import FakeHttp, FakeUseCase, make_container, make_place, small_result


def test_search_flow_keeps_contract_and_filters(api):
    places = [make_place(f"osm/{i}", f"Café {i}") for i in range(5)]
    container = make_container(restaurants=FakeUseCase(small_result(*places)))
    response = api(container).get("/api/restaurants?q=Caf%C3%A9%203&limit=2")
    body = response.json()
    assert response.status_code == 200
    assert body["count"] == 1
    assert body["data"][0]["name"] == "Café 3"
    assert set(body) >= {"scope", "neighborhood", "source", "note"}


def test_cadastre_flow_reads_verified_sector(api):
    use_case = GetCadastre(CadastroProvider(GeoJsonBoundaryReader()))
    body = api(make_container(cadastre=use_case)).get("/api/cadastre").json()
    assert body["data"][0]["id"] == "sector-009216"
    assert body["data"][0]["properties"]["SCANOMBRE"] == "LA GAITANA"
    assert body["scope"] == "neighborhood"


def test_camera_flow_without_url_does_not_touch_network(api):
    http = FakeHttp()
    provider = CameraProvider(None, http, TTLCache(), GeoJsonBoundaryReader())
    body = api(make_container(cameras=GetCameras(provider))).get(
        "/api/security/cameras"
    ).json()
    assert body["data"] == []
    assert body["note"] == NOTE
    assert http.calls == []


def test_locality_flow_is_marked_as_locality(api):
    use_case = GetLocality(LocalityProvider())
    body = api(make_container(locality=use_case)).get("/api/locality").json()
    assert body["scope"] == "locality"
    assert body["data"][0]["properties"]["sectores_catastrales"] == 119
