from app.domain.rules.matching import matches, select
from tests.conftest import make_place


def test_matches_ignores_case_and_searches_properties():
    place = make_place(name="Clínica Vet", barrio="La Gaitana")
    assert matches(place, "gaitana") is True
    assert matches(place, "CLÍNICA") is True
    assert matches(place, "otra") is False


def test_matches_empty_query_accepts_all():
    assert matches(make_place(), "") is True
    assert matches(make_place(), None) is True


def test_select_applies_limit():
    places = [make_place(f"osm/{i}", f"Lugar {i}") for i in range(5)]
    assert len(select(places, None, 2)) == 2
    assert len(select(places, "Lugar 3", 10)) == 1
