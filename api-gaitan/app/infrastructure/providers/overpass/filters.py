"""Filtros Overpass por etiquetas reales de OpenStreetMap.

`bus_station` y `public_bookcase` se excluyen deliberadamente.
"""

CATEGORY_FILTERS = {
    "veterinaries": 'nwr["amenity"="veterinary"]({bbox});',
    "bookstores": 'nwr["shop"="books"]({bbox});',
    "restaurants": 'nwr["amenity"~"^(restaurant|cafe|fast_food|bakery)$"]({bbox});',
    "education": (
        'nwr["amenity"~"^(school|kindergarten|college|university)$"]({bbox});'
    ),
    "sports": 'nwr["leisure"~"^(pitch|sports_centre)$"]({bbox});',
    "green_areas": 'nwr["leisure"~"^(park|garden)$"]({bbox});',
    "police": 'nwr["amenity"="police"]({bbox});',
    "streets": 'way["highway"]({bbox});',
    "bus_stops": 'nwr["highway"="bus_stop"]({bbox});',
    "platforms": 'nwr["public_transport"~"^(platform|station)$"]({bbox});',
}
