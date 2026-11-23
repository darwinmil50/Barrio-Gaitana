"""Protocolos segregados. Todos los proveedores de datos comparten `fetch`."""

from typing import Protocol

from app.domain.entities.boundary import Boundary
from app.domain.entities.result import FetchResult
from app.domain.entities.source import Source


class PlaceProvider(Protocol):
    """Contrato único (async, misma firma) para proveedores de lugares."""

    category: str
    source: Source

    async def fetch(self, query: str | None = None, limit: int = 50) -> FetchResult: ...


class StreetProvider(PlaceProvider, Protocol):
    """Vías: misma firma que PlaceProvider, sin métodos adicionales."""


class CrimeProvider(PlaceProvider, Protocol):
    """Delitos: sólo agregados de localidad, vía `FetchResult.context`."""


class LocalityProvider(PlaceProvider, Protocol):
    """Contexto de la localidad Suba, marcado como scope=locality."""


class CameraProvider(PlaceProvider, Protocol):
    """Cámaras: sólo `fetch`; no implementa métodos de locales ni de calles."""


class BoundaryReader(Protocol):
    """Fuente auténtica del polígono oficial verificado."""

    async def read(self) -> Boundary: ...
