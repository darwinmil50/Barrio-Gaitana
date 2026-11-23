from collections.abc import Callable
from typing import Any


class ProviderRegistry:
    """Fábricas por categoría: agregar fuentes no modifica los casos de uso (O)."""

    def __init__(self) -> None:
        self._factories: dict[str, Callable[[], Any]] = {}

    def register(self, category: str, factory: Callable[[], Any]) -> None:
        self._factories[category] = factory

    def categories(self) -> list[str]:
        return sorted(self._factories)

    def build(self, category: str) -> Any:
        factory = self._factories.get(category)
        if factory is None:
            raise KeyError(f"Proveedor no registrado: {category}")
        return factory()
