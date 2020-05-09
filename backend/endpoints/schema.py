from sqlalchemy import create_engine, MetaData
from sqlalchemy.exc import OperationalError

from utils.response import RapidJSONResponse, web_error
from utils.source import get_all_sources, get_source_settings
from services import all_services


def column_definition(col, col_def):
    types_with_length = ["VARCHAR"]
    _type = type(col_def.type).__name__

    def ui_hints():
        hints = []
        if (col_def.primary_key or
                len(col_def.foreign_keys) > 0 or
                _type in ["BOOLEAN", "INET", "TIMESTAMP", "DATE"] or
                len(col_def.foreign_keys) > 0):
            hints.append("is_meta")
        elif "_url" in col.lower() or col.lower() == "url":
            hints.append("is_meta")
        else:
            if _type == "VARCHAR" and not col_def.nullable:
                # Todo: a good check would be to see if this is the only non-nullable VARCHAR column,
                #  then more likely to be a title
                # Perhaps and import text, like title
                hints.append("is_title")
            if _type == "TEXT" or (_type in types_with_length and col_def.type.length > 100):
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


async def get_source_database(db_url, table_name):
    try:
        engine = create_engine(db_url)
    except ModuleNotFoundError as e:
        if hasattr(e, "name") and e.name == "psycopg2":
            return web_error(
                error_code="db.psycopg2",
                message="Please install psycopg2 in the backend folder `pipenv install psycopg2`"
            )
        return web_error(
            error_code="unknown",
            message="We encountered an unknown error"
        )

    try:
        conn = engine.connect()
    except OperationalError as e:
        if e.code == "e3q8":
            return web_error(
                error_code="db.not_running",
                message="It seems that we can not connect to the PostgreSQL DB, can you please double check?",
            )
        return RapidJSONResponse({
            "error_code": "unknown",
            "error": "We encountered an unknown error",
        })
    meta = MetaData(bind=engine)
    meta.reflect()

    if table_name and table_name in meta.tables.keys():
        columns = [
            column_definition(col, col_def) for col, col_def in meta.tables[table_name].columns.items()
        ]
        conn.close()
        return RapidJSONResponse(columns)
    else:
        tables = sorted([
            (
                name, [
                    column_definition(col, col_def) for col, col_def in schema.columns.items()
                ]
            ) for name, schema in meta.tables.items()
        ], key=lambda x: x[0])
        conn.close()
        return RapidJSONResponse({
            "columns": ["table_name", "columns"],
            "rows": tables
        })


async def schema_get(request):
    source_index = request.path_params["source_index"]
    requested_source = get_all_sources()[source_index]
    source_settings = get_source_settings(source_index=source_index)

    if requested_source[1] == "database":
        table_name = request.path_params.get("table_name", None)
        response = await get_source_database(
            **source_settings,
            table_name=table_name
        )
        return response
    elif requested_source[1] == "service":
        integration = all_services[requested_source[2]](**source_settings)
        return RapidJSONResponse({
            "columns": ["table_name", "columns"],
            "rows": [[x, []] for x in integration.resources.keys()]
        })
