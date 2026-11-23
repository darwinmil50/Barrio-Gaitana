from app.application.dto.envelope import make
from app.domain.entities import FetchResult, Source
from tests.conftest import make_place, small_result

SOURCE = Source("Prueba", "https://ejemplo.org")


def test_envelope_has_contract_keys():
    payload = make(small_result(make_place()), SOURCE)
    assert set(payload) == {"scope", "neighborhood", "source", "count", "data", "note"}
    assert payload["scope"] == "neighborhood"
    assert payload["neighborhood"]["code"] == "110292"


def test_envelope_count_and_serialization():
    payload = make(small_result(make_place(), make_place("osm/2", "Otra")), SOURCE)
    assert payload["count"] == 2
    assert payload["data"][0]["source"]["name"] == "Fuente de prueba"


def test_envelope_context_only_when_present():
    payload = make(FetchResult([], "nota", [{"scope": "locality"}]), SOURCE)
    assert payload["context"] == [{"scope": "locality"}]
    assert "context" not in make(FetchResult(), SOURCE)
