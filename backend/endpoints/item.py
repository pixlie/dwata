from starlette.responses import Response
from sqlalchemy import MetaData, select, column, table

from utils.response import RapidJSONResponse
from utils.database import connect_database, get_unavailable_columns
from utils.settings import get_source_settings


async def item_get(request):
    """
    This method fetches a single row of data given the source_id, table_name and primary key id.
    There are tables which do not have a primary key and in those case an index might be used.
    """
    from .schema import column_definition
    source_index = request.path_params["source_index"]
    table_name = request.path_params["table_name"]
    item_pk = request.path_params["item_pk"]
    settings = get_source_settings(source_index=source_index)

    engine, conn = await connect_database(db_url=settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    unavailable_columns = get_unavailable_columns(source_settings=settings, meta=meta).get(table_name, [])

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        return Response("", status_code=404)
    table_column_names = meta.tables[table_name].columns.keys()
    columns = [column(col) for col in table_column_names if col not in unavailable_columns]

    sel_obj = select(columns)
    sel_obj = sel_obj.select_from(table(table_name))
    sel_obj = sel_obj.where(column("id") == item_pk)
    sel_obj = sel_obj.limit(1)
    exc = conn.execute(sel_obj)

    return RapidJSONResponse(
        dict(
            item=dict(zip(exc.keys(), exc.cursor.fetchone())),
            query_sql=str(sel_obj),
        )
    )
