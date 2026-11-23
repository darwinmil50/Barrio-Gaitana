from fastapi import APIRouter, Depends

from app.application.dto.envelope import make
from app.infrastructure.dependencies import Container, get_container
from app.presentation.schemas.query import Limit, Q

router = APIRouter(tags=["infrastructure"])


@router.get("/streets")
async def streets(q: Q = None, limit: Limit = 50,
                  container: Container = Depends(get_container)) -> dict:
    use_case = container.streets
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/transport")
async def transport(q: Q = None, limit: Limit = 50,
                    container: Container = Depends(get_container)) -> dict:
    use_case = container.transport
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/cadastre")
async def cadastre(q: Q = None, limit: Limit = 50,
                   container: Container = Depends(get_container)) -> dict:
    use_case = container.cadastre
    return make(await use_case.execute(q, limit), use_case.source)
