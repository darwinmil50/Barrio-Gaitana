from typing import Annotated

from fastapi import Query
from pydantic import BaseModel, ConfigDict, Field

Q = Annotated[str | None, Query(max_length=120, description="Búsqueda por nombre")]
Limit = Annotated[int, Query(ge=1, le=200, description="Máximo de resultados")]


class SearchParams(BaseModel):
    """Modelo Pydantic reutilizable y verificable en pruebas unitarias."""

    model_config = ConfigDict(extra="forbid")
    q: str | None = Field(default=None, max_length=120)
    limit: int = Field(default=50, ge=1, le=200)
