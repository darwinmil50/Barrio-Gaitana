import pytest

from app.application.services.registry import ProviderRegistry


def test_register_and_build():
    registry = ProviderRegistry()
    registry.register("veterinaries", lambda: "proveedor")
    assert registry.build("veterinaries") == "proveedor"


def test_categories_are_sorted():
    registry = ProviderRegistry()
    registry.register("z", lambda: 1)
    registry.register("a", lambda: 2)
    assert registry.categories() == ["a", "z"]


def test_unknown_category_raises():
    with pytest.raises(KeyError):
        ProviderRegistry().build("inexistente")
