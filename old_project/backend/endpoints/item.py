from typing import Union
from importlib import import_module
from starlette.responses import Response
from starlette.requests import Request
from sqlalchemy import MetaData, select
from sqlalchemy.exc import IntegrityError
from json.decoder import JSONDecodeError

from utils.http import OrJSONResponse, web_error
from utils.database import get_unavailable_columns
from database.connect import connect_database
from utils.settings import get_source_settings


async def item_get(request: Request) -> Union[Response, OrJSONResponse]:
    """
    This method fetches a single row of data given the source_id, table_name and primary key id.
    There are tables which do not have a primary key and in those case an index might be used.
    """
    source_label = request.path_params["source_label"]
    table_name = request.path_params["table_name"]
    item_pk = None
    try:
        item_pk = request.path_params["item_pk"]
    except KeyError:
        # We do not have a PK in request, check if we have any filters
        if len(request.query_params.keys()) == 0:
            return Response("", status_code=404)
    settings = await get_source_settings(source_label=source_label)

    engine, conn = connect_database(db_label=settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    unavailable_columns = get_unavailable_columns(
        source_settings=settings, meta=meta
    ).get(table_name, [])

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        return Response("", status_code=404)
    target_table = meta.tables[table_name]
    # Remove out the unavailable columns from the list of columns to send back
    columns = [
        col for col in target_table.columns.keys() if col not in unavailable_columns
    ]
    sel_obj = select([getattr(target_table.c, col) for col in columns])
    if item_pk is not None:
        sel_obj = sel_obj.where(getattr(target_table.c, "id") == item_pk)
    else:
        # Check if the query filters are actual columns
        if len([col for col in request.query_params.keys() if col in columns]) == 0:
            return Response("", status_code=404)
        for col, value in request.query_params.items():
            sel_obj = sel_obj.where(getattr(target_table.c, col) == value)

    # sel_obj = sel_obj.limit(1)
    exc = conn.execute(sel_obj)
    record = exc.cursor.fetchone()

    if record is None:
        return Response("", status_code=404)

    return OrJSONResponse(
        dict(
            item=dict(zip(exc.keys(), record)),
            query_sql=str(
                sel_obj.compile(engine, compile_kwargs={"literal_binds": True})
            ),
        )
    )


async def item_post(request: Request) -> Union[Response, OrJSONResponse]:
    source_label = request.path_params["source_label"]
    table_name = request.path_params["table_name"]
    settings = await get_source_settings(source_label=source_label)

    engine, conn = connect_database(db_label=settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    unavailable_columns = get_unavailable_columns(
        source_settings=settings, meta=meta
    ).get(table_name, [])

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        # Todo: Refactor all 404 Response to be a `raise` statement instead
        return Response("", status_code=404)
    table_to_insert = meta.tables[table_name]
    table_column_names = meta.tables[table_name].columns.keys()
    columns = [
        col
        for col in table_column_names
        if col not in unavailable_columns and col != "id"
    ]

    try:
        payload = await request.json()
    except JSONDecodeError:
        return web_error(
            error_code="request.json_decode_error",
            message="We could not handle that request, perhaps something is wrong with the server.",
        )
    if len([x for x in payload.keys() if x not in columns]) > 0:
        return web_error(
            error_code="request.params_mismatch",
            message="There are columns in the request payload that are not allowed",
        )
    if request.app.state.IS_DWATA_APP:
        app_name = request.app.state.DWATA_APP_NAME
        # Todo: Refactor this to use a configurable settings (SQLite store) based approach
        module = import_module("apps.{}.models".format(app_name))
        if hasattr(module, "{}_pre_insert".format(app_name)):
            payload = getattr(module, "{}_pre_insert".format(app_name))(payload)

    ins_obj = table_to_insert.insert().values(**payload)
    try:
        exc = conn.execute(ins_obj)
        return OrJSONResponse(
            {
                "status": "success",
                "lastrowid": exc.lastrowid,
                "rowcount": exc.rowcount,
            }
        )
    except IntegrityError as e:
        # Todo: handle error when required fields are not provided
        if hasattr(e, "args") and "UNIQUE constraint failed" in e.args[0]:
            return Response("", status_code=404)


async def item_put(request: Request) -> Union[Response, OrJSONResponse]:
    source_label = request.path_params["source_label"]
    table_name = request.path_params["table_name"]
    item_pk = request.path_params["item_pk"]
    settings = await get_source_settings(source_label=source_label)

    engine, conn = connect_database(db_label=settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    unavailable_columns = get_unavailable_columns(
        source_settings=settings, meta=meta
    ).get(table_name, [])

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        return Response("", status_code=404)
    table_to_update = meta.tables[table_name]
    table_column_names = meta.tables[table_name].columns.keys()
    columns = [
        col
        for col in table_column_names
        if col not in unavailable_columns and col != "id"
    ]

    try:
        payload = await request.json()
    except JSONDecodeError:
        return web_error(
            error_code="request.json_decode_error",
            message="We could not handle that request, perhaps something is wrong with the server.",
        )
    if len([x for x in payload.keys() if x not in columns]) > 0:
        return web_error(
            error_code="request.params_mismatch",
            message="There are columns in the request payload that are not allowed",
        )
    if request.app.state.IS_DWATA_APP:
        app_name = request.app.state.DWATA_APP_NAME
        module = import_module("apps.{}.models".format(app_name))
        if hasattr(module, "{}_pre_update".format(app_name)):
            payload = getattr(module, "{}_pre_update".format(app_name))(payload)

    upd_obj = (
        table_to_update.update()
        .where(getattr(table_to_update.c, "id") == item_pk)
        .values(**payload)
    )
    try:
        exc = conn.execute(upd_obj)
        return OrJSONResponse(
            {
                "status": "success",
                "lastrowid": exc.lastrowid,
                "rowcount": exc.rowcount,
            }
        )
    except IntegrityError as e:
        if hasattr(e, "args") and "UNIQUE constraint failed" in e.args[0]:
            # Todo: update this response status
            return Response("", status_code=404)
