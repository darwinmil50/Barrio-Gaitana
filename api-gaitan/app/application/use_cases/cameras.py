from app.application.use_cases.base import FetchPlaces


class GetCameras(FetchPlaces):
    """Sin URL pública autorizada devuelve data=[] y una nota explicativa."""
