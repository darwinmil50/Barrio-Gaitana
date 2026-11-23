from fastapi import APIRouter, Depends

from app.infrastructure.dependencies import Container, get_container

router = APIRouter(tags=["neighborhood"])


@router.get("/neighborhood", summary="Barrio oficial La Gaitana (Suba)")
async def neighborhood(container: Container = Depends(get_container)) -> dict:
    return await container.neighborhood.execute()


@router.get("/neighborhood/boundary", summary="Polígono catastral verificado")
async def boundary(container: Container = Depends(get_container)) -> dict:
    return await container.boundary.execute()
