from urllib.parse import urlparse

from utils.config import settings
from exceptions.database import DatabaseNotFound


async def get_all_sources():
    from services import all_services

    databases = [
        [f"{db.path[1:]}@{db.hostname}", "database", db.scheme, {}]
        for db in [
            urlparse(db_url)
            for db_url in settings.DATABASES
        ]
    ]

    services = []
    for sname in all_services.keys():
        if hasattr(settings, sname.upper()):
            for label, value in getattr(settings, sname.upper()).items():
                services.append([label, "service", sname])
    return databases + services


async def get_source_settings(source_label):
    all_sources = await get_all_sources()
    requested_source = [x for x in all_sources if x[0] == source_label][0]

    if requested_source[1] == "database":
        db_path, db_host = requested_source[0].split("@")
        for db_url in settings.DATABASES:
            db_parts = urlparse(db_url)
            if db_parts.path == db_path and db_parts.hostname == db_host:
                return db_url
        raise DatabaseNotFound()
    elif requested_source[1] == "service":
        return getattr(settings, requested_source[2].upper())[requested_source[0]]
