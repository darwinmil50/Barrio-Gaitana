from fastapi import APIRouter

from app.presentation.routes import infrastructure, neighborhood, places, society

router = APIRouter(prefix="/api")
router.include_router(neighborhood.router)
router.include_router(places.router)
router.include_router(infrastructure.router)
router.include_router(society.router)
