from urllib.parse import urlparse

from utils.config import settings


def get_all_sources():
    from services import all_services
    databases = [
        [label, "database", db.scheme] for (label, db) in [
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


def get_all_unavailable_columns(source_index):
    """
    For any given source_index (currently SQL source only), we create a dict with keys being table names
    and for each key we have a list of unavailable columns.
    """
    requested_source = get_all_sources()[source_index]
    for name, configuration in requested_source.items():
        pass
