from app.domain.entities import Boundary, FetchResult, Place, Source


def test_source_to_dict():
    source = Source("Nombre", "https://ejemplo.org", "Licencia", "2026-01-01")
    assert source.to_dict()["updated_at"] == "2026-01-01"
    assert source.to_dict()["url"] == "https://ejemplo.org"


def test_place_contract_shape():
    place = Place("a/1", "Nombre", "shop", 4.7, -74.1, None, {"x": 1}, Source("S", "U"))
    payload = place.to_dict()
    assert set(payload) == {
        "id", "name", "category", "latitude", "longitude",
        "geometry", "properties", "source",
    }
    assert payload["source"]["name"] == "S"


def test_boundary_rings_for_polygon_and_multipolygon():
    polygon = Boundary({"type": "Polygon", "coordinates": [[[0, 0]]]})
    assert len(polygon.rings) == 1
    multi = Boundary({"type": "MultiPolygon", "coordinates": [
        [[[0, 0]], [[1, 1]]], [[[2, 2]]],
    ]})
    assert len(multi.rings) == 3


def test_fetch_result_defaults():
    result = FetchResult()
    assert result.data == []
    assert result.note is None
    assert result.context == []
