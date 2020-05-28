from urllib.parse import urlparse

from utils.config import settings


def get_all_sources():
    from services import all_services

    def get_properties(label):
        return {
            "is_system_db": True if label == "admin_meta" else False
        }

    databases = [
        [label, "database", db.scheme, get_properties(label=label)] for (label, db) in [
            (label, urlparse(value["db_url"])) for label, value in settings.DATABASES.items()
        ]
    ]
    services = []
    for sname in all_services.keys():
        if hasattr(settings, sname.upper()):
            for label, value in getattr(settings, sname.upper()).items():
                services.append(
                    [label, "service", sname]
                )
    return databases + services


def get_source_settings(source_index):
    requested_source = get_all_sources()[source_index]
    if requested_source[1] == "database":
        return settings.DATABASES[requested_source[0]]
    elif requested_source[1] == "service":
        return getattr(settings, requested_source[2].upper())[requested_source[0]]


def get_admin_meta_settings():
    if "admin_meta" in settings.DATABASES:
        return settings.DATABASES["admin_meta"]
