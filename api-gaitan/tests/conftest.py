import pytest
from fastapi.testclient import TestClient

from app.infrastructure.dependencies import get_container
from app.main import create_app
from tests.stubs import (
    SOURCE, FakeHttp, FakeJsonUseCase, FakeUseCase,
    make_container, make_place, small_result,
)

__all__ = [
    "SOURCE", "FakeHttp", "FakeJsonUseCase", "FakeUseCase",
    "make_container", "make_place", "small_result", "client", "api",
]


@pytest.fixture
def client():
    app = create_app()
    app.dependency_overrides[get_container] = lambda: make_container()
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def api():
    """Fábrica de clientes con un contenedor de dependencias personalizado."""

    def build(container=None):
        app = create_app()
        app.dependency_overrides[get_container] = lambda: container or make_container()
        return TestClient(app)

    return build
