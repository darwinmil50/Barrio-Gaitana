import pytest
from pydantic import ValidationError

from app.presentation.schemas.query import SearchParams


def test_search_params_defaults():
    params = SearchParams()
    assert params.q is None
    assert params.limit == 50


def test_search_params_accepts_valid_values():
    params = SearchParams(q="librería", limit=200)
    assert params.limit == 200
    assert params.q == "librería"


@pytest.mark.parametrize("value", [0, 201, -1])
def test_search_params_rejects_bad_limit(value):
    with pytest.raises(ValidationError):
        SearchParams(limit=value)


def test_search_params_rejects_long_query():
    with pytest.raises(ValidationError):
        SearchParams(q="x" * 121)
