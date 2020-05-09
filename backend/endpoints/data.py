from starlette.responses import Response
import sqlalchemy
from sqlalchemy import create_engine, MetaData, select, column, table, text, func
from json.decoder import JSONDecodeError

from utils.response import RapidJSONResponse, web_error
from utils.source import get_source_settings


# Example query specification:
example_spec = {
    "source_id": 3,  # This is the data source, like a PostgreSQL database
    "columns": ["client.id", "client.joined_at"],
    "limit": 300
}


def apply_ordering(query_specification, sel_obj, current_table):
    order_by = query_specification["order_by"]
    valid_order_by = [
        (col, ord_type if ord_type in ("asc", "desc") else "asc")
        for col, ord_type in order_by.items() if col in current_table.columns.keys()
    ]
    sel_obj.order_by(*[getattr(sqlalchemy, x[1])(getattr(current_table.c, x[0])) for x in valid_order_by])
    return sel_obj


def apply_filters(query_specification, sel_obj, current_table):
    filter_by = query_specification["filter_by"]
    for col, filter_spec in filter_by.items():
        if col in current_table.columns:
            column_def = current_table.columns[col]
            if str(column_def.type) == "INTEGER":
                # We can do an equals query or a range query
                if filter_spec.get("equal", None):
                    sel_obj = sel_obj.where(column(col) == filter_spec["equal"])
                elif filter_spec.get("from", None) and filter_spec.get("to", None):
                    sel_obj = sel_obj.where(column(col) >= filter_spec["from"])
                    sel_obj = sel_obj.where(column(col) <= filter_spec["to"])
                elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                    sel_obj = sel_obj.where(column(col) >= filter_spec["from"])
                elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                    sel_obj = sel_obj.where(column(col) <= filter_spec["to"])
            elif "VARCHAR" in str(column_def.type):
                if filter_spec.get("like", None):
                    sel_obj = sel_obj.where(column(col).ilike("%{}%".format(filter_spec["like"])))
            elif "TIMESTAMP" in str(column_def.type):
                if filter_spec.get("equal", None):
                    sel_obj = sel_obj.where(column(col) == filter_spec["equal"])
                elif filter_spec.get("from", None) and filter_spec.get("to", None):
                    sel_obj = sel_obj.where(column(col) >= filter_spec["from"])
                    sel_obj = sel_obj.where(column(col) <= filter_spec["to"])
                elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                    sel_obj = sel_obj.where(column(col) >= filter_spec["from"])
                elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                    sel_obj = sel_obj.where(column(col) <= filter_spec["to"])
            elif str(column_def.type) == "BOOLEAN" and filter_spec.get("value", None) is not None:
                if filter_spec["value"] is True:
                    sel_obj = sel_obj.where(column(col))
                else:
                    sel_obj = sel_obj.where(~column(col))
    return sel_obj


async def data_post(request):
    """
    This method fetches actual data from one or more sources, given a specification for columns, joins, limits,
    etc. This method is a POST method because the query specification can become large.
    We use JSON (in the POST payload) to specify the query.
    """
    source_index = request.path_params["source_index"]
    table_name = request.path_params["table_name"]
    settings = get_source_settings(source_index=source_index)
    query_specification = {}
    default_per_page = 20

    if request.method == "POST":
        try:
            query_specification = await request.json()
        except JSONDecodeError:
            return web_error(
                error_code="request.json_decode_error",
                message="We could not handle that request, perhaps something is wrong with the server."
            )

    engine = create_engine(settings["db_url"])
    conn = engine.connect()
    meta = MetaData(bind=engine)
    meta.reflect()

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        return Response("", status_code=404)

    current_table = meta.tables[table_name]
    if len(query_specification.get("columns", [])) > 0:
        columns = [column(col) for col in query_specification["columns"]]
    else:
        columns = [text("*")]

    sel_obj = select(columns)
    sel_obj = sel_obj.select_from(table(table_name))
    if query_specification.get("order_by", None):
        sel_obj = apply_ordering(query_specification, sel_obj, current_table)
    if query_specification.get("filter_by", None):
        sel_obj = apply_filters(query_specification, sel_obj, current_table)
    sel_obj = sel_obj.limit(query_specification.get("limit", default_per_page))
    sel_obj = sel_obj.offset(query_specification.get("offset", 0))
    exc = conn.execute(sel_obj)

    # We use a separate query to count the total number of rows in the given query
    count_sel_obj = select([func.count(text("*"))]).select_from(table(table_name))
    if query_specification.get("filter_by", None):
        count_sel_obj = apply_filters(query_specification, count_sel_obj, current_table)
    count = conn.execute(count_sel_obj).scalar()
    conn.close()

    return RapidJSONResponse(
        dict(
            columns=exc.keys(),
            rows=exc.cursor.fetchall(),
            count=count,
            limit=query_specification.get("limit", default_per_page),
            offset=query_specification.get("offset", 0),
            query_sql=str(sel_obj),
        )
    )
