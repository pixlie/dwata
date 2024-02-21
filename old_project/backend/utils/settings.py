from urllib.parse import urlparse

from utils.env_settings import settings
from exceptions.database import DatabaseException


async def get_all_sources():
    from services import all_services

    databases = [
        (db_label, "database", "", {}) for db_label in settings.DATABASE_LABELS
    ]

    services = []
    for sname in all_services.keys():
        if hasattr(settings, sname.upper()):
            for label, value in getattr(settings, sname.upper()).items():
                services.append([label, "service", sname])
    return databases + services


async def get_source_settings(source_label: str):
    all_sources = await get_all_sources()
    requested_source = [x for x in all_sources if x[0] == source_label][0]

    if requested_source[1] == "database":
        for i, db_label in enumerate(settings.DATABASE_LABELS):
            if db_label == source_label:
                db_url = settings.DATABASES[i]
                return db_url
        raise DatabaseException(
            error_code="db.not_found",
            detail=f"The database with label {source_label} is not in the file `backend/.env`",
        )
    elif requested_source[1] == "service":
        return getattr(settings, requested_source[2].upper())[requested_source[0]]
