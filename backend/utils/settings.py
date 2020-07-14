from urllib.parse import urlparse

from utils.config import settings


def get_all_sources():
    from services import all_services

    databases = [
        [label, "database", db.scheme, {}] for (label, db) in [
            (label, urlparse(value["db_url"])) for label, value in settings.DATABASES.items()
        ]
    ] + [["dwata_meta", "database", "sqlite", {"is_system_db": True}]]

    services = []
    for sname in all_services.keys():
        if hasattr(settings, sname.upper()):
            for label, value in getattr(settings, sname.upper()).items():
                services.append(
                    [label, "service", sname]
                )
    return databases + services


def get_source_settings(source_label):
    if source_label == "dwata_meta":
        return {
            "db_url": "sqlite:///dwata_meta.db"
        }

    requested_source = [x for x in get_all_sources() if x[0] == source_label][0]
    if requested_source[1] == "database":
        return settings.DATABASES[requested_source[0]]
    elif requested_source[1] == "service":
        return getattr(settings, requested_source[2].upper())[requested_source[0]]
