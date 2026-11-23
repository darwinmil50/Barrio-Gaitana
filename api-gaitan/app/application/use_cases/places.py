"""Casos de uso de lugares: uno por cada operación expuesta en la API."""

from app.application.use_cases.base import FetchPlaces


class GetVeterinaries(FetchPlaces):
    """Consultar veterinarias dentro del polígono oficial."""


class GetBookstores(FetchPlaces):
    """Consultar librerías dentro del polígono oficial."""


class GetRestaurants(FetchPlaces):
    """Consultar restaurantes, cafés, comida rápida y panaderías."""


class GetEducation(FetchPlaces):
    """Consultar colegios, jardines, universidades y college."""


class GetSports(FetchPlaces):
    """Consultar canchas y centros deportivos."""


class GetGreenAreas(FetchPlaces):
    """Consultar parques y jardines."""


class GetPolice(FetchPlaces):
    """Consultar instalaciones de policía."""


class GetTransport(FetchPlaces):
    """Consultar paraderos y estaciones de transporte."""


class GetCadastre(FetchPlaces):
    """Consultar metadatos del sector catastral verificado."""
