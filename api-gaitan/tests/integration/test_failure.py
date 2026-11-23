from app.infrastructure.providers.cameras import NOTE
from tests.conftest import FakeUseCase, make_container, small_result


def test_failed_provider_yields_200_with_empty_data_and_note(api):
    container = make_container(
        veterinaries=FakeUseCase(small_result(note="Fuente no disponible"))
    )
    response = api(container).get("/api/veterinaries")
    assert response.status_code == 200
    body = response.json()
    assert body["count"] == 0
    assert body["data"] == []
    assert body["note"] == "Fuente no disponible"


def test_camera_endpoint_never_publishes_locations(api):
    container = make_container(cameras=FakeUseCase(small_result(note=NOTE)))
    payload = api(container).get("/api/security/cameras").json()
    assert payload["data"] == []
    assert payload["note"] == (
        "No se publican ubicaciones de cámaras: la información disponible "
        "no es pública y autorizada."
    )


def test_crimes_context_is_never_mixed_into_data(api):
    container = make_container(crimes=FakeUseCase(small_result(
        note="Sin serie por barrio",
        context=[{"scope": "locality", "LOCALIDAD": "SUBA", "TOTAL": 12}],
    )))
    body = api(container).get("/api/crimes").json()
    assert body["data"] == []
    assert body["scope"] == "neighborhood"
    assert body["context"][0]["scope"] == "locality"
