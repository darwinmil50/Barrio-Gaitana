from app.domain.entities.source import Source

OVERPASS = Source(
    "OpenStreetMap vía Overpass API",
    "https://overpass-api.de/api/interpreter",
    "ODbL — OpenStreetMap contributors",
)
BARRIO = Source(
    "SDIS — Barrio Común La Gaitana (código 110292), Suba",
    "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/"
    "ordenamientoterritorial/entidadterritorial/MapServer/0/query",
    "Datos abiertos Bogotá — Secretaría Distrital de Integración Social",
)
CATASTRO = Source(
    "Catastro de Bogotá (UAECD), sector catastral 009216",
    "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/"
    "catastro/sectorcatastral/MapServer/0/query",
    "Datos abiertos Bogotá — UAECD",
)
NOMINATIM = Source(
    "OpenStreetMap vía Nominatim",
    "https://nominatim.openstreetmap.org/search",
    "ODbL — OpenStreetMap contributors",
)
OSM_API = Source(
    "OpenStreetMap — API principal (datos abiertos verificados)",
    "https://api.openstreetmap.org/api/0.6/map",
    "ODbL — OpenStreetMap contributors",
)
SITP = Source(
    "SITP Bogotá — paraderos",
    "https://datosabiertos.bogota.gov.co/dataset/5ba19d20-06af-4c04-b50c-"
    "8ecb9472327d/resource/624bb288-2a6d-466f-801a-93e5497cd879/download/paraderos.json",
    "Datos abiertos Bogotá",
)
TRANSPORT = Source(
    "SITP Bogotá y OpenStreetMap",
    SITP.url,
    "Datos abiertos Bogotá y ODbL — OpenStreetMap contributors",
)
SCJ = Source(
    "Secretaría Distrital de Seguridad, Convivencia y Justicia",
    "https://oaiee.scj.gov.co/agc/rest/services/Tematicos_Pub/"
    "CifrasSCJ/MapServer/0/query",
    "Datos abiertos Bogotá — SCJ",
)
LOCALITY = Source(
    "Alcaldía Mayor de Bogotá — Localidad de Suba",
    "https://bogota.gov.co/mi-ciudad/localidades/suba",
    "Datos abiertos Bogotá",
)
CAMERAS = Source(
    "Cámaras de seguridad (fuente oficial configurada)",
    "",
    "Información no pública: no autorizada para divulgación",
)
ROADS = Source(
    "Estado superficial de vías de Bogotá D.C.",
    "https://datosabiertos.bogota.gov.co/dataset/estado-superficial-bogota-d-c",
    "Datos abiertos Bogotá",
)
