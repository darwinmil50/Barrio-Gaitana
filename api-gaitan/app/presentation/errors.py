import logging

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


async def validation_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """FastAPI ya responde 422; unificamos el cuerpo para el frontend."""
    return JSONResponse(
        status_code=422,
        content={"detail": [{"loc": e.get("loc"), "msg": e.get("msg")} for e in exc.errors()]},
    )


async def unexpected_handler(request: Request, exc: Exception) -> JSONResponse:
    """Errores internos: logged y respuesta JSON controlada."""
    logger.exception("unexpected_error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Error interno del servidor"})
