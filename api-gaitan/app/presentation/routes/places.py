from fastapi import APIRouter, Depends

from app.application.dto.envelope import make
from app.infrastructure.dependencies import Container, get_container
from app.presentation.schemas.query import Limit, Q

router = APIRouter(tags=["places"])


@router.get("/veterinaries")
async def veterinaries(q: Q = None, limit: Limit = 50,
                       container: Container = Depends(get_container)) -> dict:
    use_case = container.veterinaries
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/bookstores")
async def bookstores(q: Q = None, limit: Limit = 50,
                     container: Container = Depends(get_container)) -> dict:
    use_case = container.bookstores
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/restaurants")
async def restaurants(q: Q = None, limit: Limit = 50,
                      container: Container = Depends(get_container)) -> dict:
    use_case = container.restaurants
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/education")
async def education(q: Q = None, limit: Limit = 50,
                    container: Container = Depends(get_container)) -> dict:
    use_case = container.education
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/sports")
async def sports(q: Q = None, limit: Limit = 50,
                 container: Container = Depends(get_container)) -> dict:
    use_case = container.sports
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/green-areas")
async def green_areas(q: Q = None, limit: Limit = 50,
                      container: Container = Depends(get_container)) -> dict:
    use_case = container.green_areas
    return make(await use_case.execute(q, limit), use_case.source)


@router.get("/police")
async def police(q: Q = None, limit: Limit = 50,
                 container: Container = Depends(get_container)) -> dict:
    use_case = container.police
    return make(await use_case.execute(q, limit), use_case.source)
