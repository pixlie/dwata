from sqlalchemy import create_engine, MetaData
from sqlalchemy.exc import OperationalError

from utils.response import RapidJSONResponse, web_error
from utils.config import settings


async def schema_get(request):
    source_index = request.path_params["source_index"]
    table_name = request.path_params.get("table_name", None)

    try:
        engine = create_engine(settings.DATABASES[source_index])
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
    types_with_length = ["VARCHAR"]

    if table_name and table_name in meta.tables.keys():
        columns = [
            {
                "name": col,
                "type": type(col_def.type).__name__
            } for col, col_def in meta.tables[table_name].columns.items()
        ]
        conn.close()
        return RapidJSONResponse(columns)
    else:
        tables = sorted([
            (
                name, [
                    {
                        "name": col,
                        "type": type(col_def.type).__name__,
                        "length": col_def.type.length if type(col_def.type).__name__ in types_with_length else None,
                        "primary_key": col_def.primary_key,
                        "nullable": col_def.nullable,
                        "has_foreign_keys": len(col_def.foreign_keys) > 0,
                    } for col, col_def in schema.columns.items()
                ]
            ) for name, schema in meta.tables.items()
        ], key=lambda x: x[0])
        conn.close()
        return RapidJSONResponse({
            "columns": ["table_name", "columns"],
            "rows": tables
        })
