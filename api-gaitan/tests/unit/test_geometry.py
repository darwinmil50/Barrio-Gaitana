from app.domain.rules.geometry import bbox, center, in_geometry, in_ring

SQUARE = {"type": "Polygon", "coordinates": [
    [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]],
]}
HOLE = {"type": "Polygon", "coordinates": [
    [[0, 0], [4, 0], [4, 4], [0, 4], [0, 0]],
    [[1, 1], [3, 1], [3, 3], [1, 3], [1, 1]],
]}


def test_in_ring_inside():
    assert in_ring(1, 1, SQUARE["coordinates"][0]) is True


def test_in_ring_outside():
    assert in_ring(3, 1, SQUARE["coordinates"][0]) is False


def test_in_geometry_polygon():
    assert in_geometry(1.5, 1.5, SQUARE) is True


def test_in_geometry_hole_is_excluded():
    assert in_geometry(2, 2, HOLE) is False
    assert in_geometry(0.5, 0.5, HOLE) is True


def test_in_geometry_multipolygon():
    multi = {"type": "MultiPolygon", "coordinates": [
        [[[10, 10], [12, 10], [12, 12], [10, 12], [10, 10]]],
    ]}
    assert in_geometry(11, 11, multi) is True
    assert in_geometry(1, 1, multi) is False


def test_in_geometry_missing_values():
    assert in_geometry(None, None, SQUARE) is False
    assert in_geometry(1, 1, None) is False


def test_bbox_from_ring():
    assert bbox(SQUARE) == [0, 0, 2, 2]


def test_center_from_node():
    assert center({"type": "node", "lon": -74.11, "lat": 4.74}) == (-74.11, 4.74)


def test_center_from_way():
    element = {"type": "way", "center": {"lon": -74.12, "lat": 4.75}}
    assert center(element) == (-74.12, 4.75)
