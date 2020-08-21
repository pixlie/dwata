from urllib.parse import urlparse

from sqlalchemy import MetaData

from utils.schema import get_table_properties, column_definition
from utils.config import settings
from utils.database import connect_database, get_unavailable_columns


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


async def get_source_database(source_settings, table_name=None, meta=None):
    engine, conn = await connect_database(db_url=source_settings["db_url"])
    if meta is None:
        meta = MetaData(bind=engine)
        meta.reflect()
    unavailable_columns = get_unavailable_columns(source_settings=source_settings, meta=meta)
    table_properties = get_table_properties(source_settings=source_settings, meta=meta)

    if table_name and table_name in meta.tables.keys():
        columns = [
            column_definition(col, col_def) for col, col_def in meta.tables[table_name].columns.items()
            if col not in unavailable_columns.get(table_name, [])
        ]
        conn.close()
        return columns
    else:
        tables = sorted([
            (
                name, table_properties(name=name), [
                    column_definition(col, col_def) for col, col_def in schema.columns.items()
                    if col not in unavailable_columns.get(name, [])
                ]
            ) for name, schema in meta.tables.items()
        ], key=lambda x: x[0])
        conn.close()
        return {
            "columns": ["table_name", "properties", "columns"],
            "rows": tables
        }
