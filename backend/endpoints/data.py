from starlette.responses import Response
import sqlalchemy
from sqlalchemy import create_engine, MetaData, select, column, table, text
from json.decoder import JSONDecodeError

from utils.response import RapidJSONResponse, web_error
from utils.config import settings


# Example query specification:
example_spec = {
    "source_id": 3,  # This is the data source, like a PostgreSQL database
    "columns": ["client.id", "client.joined_at"],
    "limit": 300
}


async def data_post(request):
    """
    This method fetches actual data from one or more sources, given a specification for columns, joins, limits,
    etc. This method is a POST method because the query specification can become large.
    We use JSON (in the POST payload) to specify the query.
    """
    source_index = request.path_params["source_index"]
    table_name = request.path_params["table_name"]
    try:
        request_data = await request.json()
    except JSONDecodeError:
        return web_error(
            error_code="request.json_decode_error",
            message="We could not handle that request, perhaps something is wrong with the server."
        )

    engine = create_engine(settings.DATABASES[source_index])
    conn = engine.connect()
    meta = MetaData(bind=engine)
    meta.reflect()

    if not table_name or (table_name and table_name not in meta.tables):
        conn.close()
        return Response("", status_code=404)

    tt = meta.tables[table_name]
    sel = {
        "limit": request_data.get("limit", 100)
    }
    if len(request_data.get("columns", [])) > 0:
        sel["columns"] = [column(col) for col in request_data["columns"]]
    else:
        sel["columns"] = [text("*")]

    if request_data.get("order_by", None):
        order_by = request_data["order_by"]
        valid_order_by = [
            (col, ord_type if ord_type in ("asc", "desc") else "asc")
            for col, ord_type in order_by.items() if col in tt.columns.keys()
        ]
        sel["order_by"] = (getattr(sqlalchemy, x[1])(getattr(tt.c, x[0])) for x in valid_order_by)

    sel_obj = select(**sel)
    sel_obj = sel_obj.select_from(table(table_name))

    if request_data.get("filter_by", None):
        filter_by = request_data["filter_by"]
        for col, filter_spec in filter_by.items():
            if col in tt.columns:
                column_def = tt.columns[col]
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
    exc = conn.execute(sel_obj)

    # We use a separate query to count the total number of rows in the given query
    # first_column = tt.columns[tt.columns.keys()[0]]
    # count_sel = {
    #     **sel,
    #     "columns": [func.count(first_column)]
    # }
    # del count_sel["limit"]
    # count = conn.execute(select(**count_sel)).scalar()
    conn.close()
    return RapidJSONResponse(
        dict(
            columns=exc.keys(),
            rows=exc.cursor.fetchall(),
            # count=count,
            query_sql=str(sel_obj),
        )
    )
