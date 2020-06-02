from sqlalchemy import MetaData

from utils.response import RapidJSONResponse
from utils.database import connect_database, get_unavailable_columns, get_system_tables
from utils.settings import get_all_sources, get_source_settings
from services import all_services


def column_definition(col, col_def):
    types_with_length = ["VARCHAR"]
    _type = type(col_def.type).__name__

    def ui_hints():
        hints = []
        if (col_def.primary_key or
                len(col_def.foreign_keys) > 0 or
                _type in ["INET", "TIMESTAMP", "DATE", "JSONB", "JSON"]):
            hints.append("is_meta")
        elif col.lower()[-3:] in ["_id", "_pk", "_fk"]:
            hints.append("is_meta")
        elif "uuid" in col.lower():
            hints.append("is_meta")
        else:
            if _type == "VARCHAR" and not col_def.nullable:
                # Todo: a good check would be to see if this is the only non-nullable VARCHAR column,
                #  then more likely to be a title
                # Perhaps and import text, like title
                hints.append("is_title")
            if _type == "TEXT" or (_type in types_with_length and col_def.type.length > 200):
                # Perhaps and import text, like title
                hints.append("is_text_lg")
        return hints

    return {
        "name": col,
        "type": type(col_def.type).__name__,
        "length": col_def.type.length if _type in types_with_length else None,
        "is_primary_key": col_def.primary_key,
        "is_nullable": col_def.nullable,
        "has_foreign_keys": len(col_def.foreign_keys) > 0,
        "foreign_keys": [
            {
                "table": str(x.column.table),
                "column": str(x.column.name)
            } for x in col_def.foreign_keys
        ] if len(col_def.foreign_keys) > 0 else None,
        "ui_hints": ui_hints()
    }


def get_table_properties(source_settings):
    system_tables = get_system_tables(source_settings=source_settings)

    def inner(name):
        if name in system_tables:
            return {
                "is_system_table": True
            }
        return {
            "is_system_table": False
        }
    return inner


async def get_source_database(source_settings, table_name):
    engine, conn = await connect_database(db_url=source_settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    unavailable_columns = get_unavailable_columns(source_settings=source_settings, meta=meta)
    table_properties = get_table_properties(source_settings=source_settings)

    if table_name and table_name in meta.tables.keys():
        columns = [
            column_definition(col, col_def) for col, col_def in meta.tables[table_name].columns.items()
            if col not in unavailable_columns.get(table_name, [])
        ]
        conn.close()
        return RapidJSONResponse(columns)
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
        return RapidJSONResponse({
            "columns": ["table_name", "properties", "columns"],
            "rows": tables
        })


async def schema_get(request):
    source_index = request.path_params["source_index"]
    requested_source = get_all_sources()[source_index]
    source_settings = get_source_settings(source_index=source_index)

    if requested_source[1] == "database":
        table_name = request.path_params.get("table_name", None)
        response = await get_source_database(
            source_settings=source_settings,
            table_name=table_name
        )
        return response
    elif requested_source[1] == "service":
        integration = all_services[requested_source[2]](**source_settings)
        return RapidJSONResponse({
            "columns": ["table_name", "columns"],
            "rows": [[x, []] for x in integration.resources.keys()]
        })
