from fastapi import APIRouter, Depends

from app.application.dto.envelope import make
from app.infrastructure.dependencies import Container, get_container
from app.presentation.schemas.query import Limit, Q

router = APIRouter(tags=["society"])


@router.get("/security/cameras")
async def cameras(q: Q = None, limit: Limit = 50,
                  container: Container = Depends(get_container)) -> dict:
    use_case = container.cameras
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/crimes")
async def crimes(q: Q = None, limit: Limit = 50,
                 container: Container = Depends(get_container)) -> dict:
    use_case = container.crimes
    result = await use_case.execute(q, limit)
    return make(result, use_case.source, scope="neighborhood")


@router.get("/locality")
async def locality(q: Q = None, limit: Limit = 50,
                   container: Container = Depends(get_container)) -> dict:
    use_case = container.locality
    result = await use_case.execute(q, limit)
    return make(result, use_case.source, scope="locality")
