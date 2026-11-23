from dataclasses import dataclass, field
from typing import Any

from app.domain.entities.place import Place


@dataclass
class FetchResult:
    """Resultado uniforme de cualquier proveedor (datos, nota y contexto)."""

    data: list[Place] = field(default_factory=list)
    note: str | None = None
    context: list[dict[str, Any]] = field(default_factory=list)
