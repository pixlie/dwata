from urllib.parse import urlparse
from sqlalchemy import select

from utils.config import settings
from database.dwata_meta import dwata_meta_db
from apps.data_sources.models import data_sources


async def get_all_sources():
    """
    This function reads all the sources that are configured in the internal database (SQLite by default)
    and returns them
    """
    all_sources = await dwata_meta_db.fetch_all(query=select([data_sources]))
    sources = [
        [
            row.label, row.source_type, urlparse(row.configuration_json["db_url"]).scheme, {"is_system_db": False}
        ] for row in all_sources
    ] + [["dwata_meta", "database", "sqlite", {"is_system_db": True}]]

    return sources


async def get_source_settings(source_label: str):
    if source_label == "dwata_meta":
        return {
            "db_url": settings.DWATA_META_DATABASE_URL
        }
    all_sources: list[data_sources] = await dwata_meta_db.fetch_all(query=select([data_sources]))
    requested_source: data_sources = next(x for x in all_sources if x.label == source_label)
    if requested_source.source_type == "database":
        return requested_source.configuration_json
