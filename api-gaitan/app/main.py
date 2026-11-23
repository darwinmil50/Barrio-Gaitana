from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.infrastructure.config import Settings
from app.infrastructure.logging.config import configure_logging
from app.presentation.errors import unexpected_handler, validation_handler
from app.presentation.routes import router


def create_app(settings: Settings | None = None) -> FastAPI:
    """Fábrica de la app: permite inyectar configuración en pruebas."""
    settings = settings or Settings()
    configure_logging(settings)
    application = FastAPI(
        title="La Gaitana API",
        description="Datos oficiales del barrio La Gaitana, Suba, Bogotá D.C.",
        version="1.0.0",
        docs_url="/docs",
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    application.include_router(router)
    application.add_exception_handler(RequestValidationError, validation_handler)
    application.add_exception_handler(Exception, unexpected_handler)
    return application


app = create_app()
