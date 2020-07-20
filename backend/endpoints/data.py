from starlette.responses import Response
import sqlalchemy
from sqlalchemy import MetaData, select, func, or_
from json.decoder import JSONDecodeError

from utils.response import RapidJSONResponse, web_error
from utils.database import connect_database, get_unavailable_columns
from utils.settings import get_source_settings


# Example query specification:
example_spec = {
    "source_id": "monster_market",  # This is the data source, like a PostgreSQL database
    "select": ["monster.id", "monster.joined_at"],
    "limit": 100,
    "offset": 0
}


def find_best_join(sel_obj, meta, table_query_order):
    """
    This is an example Query request where we want to list all content first and also the author information.
    So `content` table is the first (index 0) table in the `table_query_order`.
    `user` table is the second table in the request. We try to see if `content` table has a direct FK to `user` table.
    This would mean `content` <> `user` relation is Many to One.

    sel_obj.join(
        meta.tables["content"],
        meta.tables["users"],
        meta.tables["content"].c.created_by_id == meta.tables["users"].c.id
    )
    """
    for index, table_name in enumerate(table_query_order):
        if index == 0:
            continue

        # We start with the second table (index 1)
        prev_table_name = table_query_order[index - 1]
        for col, col_def in meta.tables[prev_table_name].columns.items():
            # Check if the previous table has FK
            if len(col_def.foreign_keys) > 0:
                # For each FK, is there a direct FK from the previous table to current table?
                for x in col_def.foreign_keys:
                    if x.column.table.name == table_name:
                        # So previous table has FK to current table, let's use this to JOIN
                        sel_obj = sel_obj.select_from(meta.tables[prev_table_name].join(
                            meta.tables[table_name],
                            getattr(meta.tables[prev_table_name].c, x.parent.name) ==
                            getattr(meta.tables[table_name].c, x.column.name)
                        ))
        return sel_obj


def apply_ordering(query_specification, sel_obj, current_table, unavailable_columns):
    order_by = query_specification["order_by"]
    valid_order_by = [
        (col, ord_type if ord_type in ("asc", "desc") else "asc")
        for col, ord_type in order_by.items() if col in current_table.columns.keys() and col not in unavailable_columns
    ]
    return sel_obj.order_by(*[getattr(sqlalchemy, x[1])(getattr(current_table.c, x[0])) for x in valid_order_by])


def apply_filters(query_specification, sel_obj, current_table, unavailable_columns):
    filter_by = query_specification["filter_by"]
    for col, filter_spec in filter_by.items():
        if col in unavailable_columns:
            continue
        if col in current_table.columns:
            column_def = current_table.columns[col]
            if str(column_def.type) in ["INTEGER", "FLOAT"]:
                # We can do an equals query or a range query
                if filter_spec.get("equal", None):
                    if isinstance(filter_spec["equal"], list):
                        sel_obj = sel_obj.where(
                            or_(*[(getattr(current_table.c, col) == x) for x in filter_spec["equal"]])
                        )
                    else:
                        sel_obj = sel_obj.where(getattr(current_table.c, col) == filter_spec["equal"])
                elif filter_spec.get("from", None) and filter_spec.get("to", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) >= filter_spec["from"])
                    sel_obj = sel_obj.where(getattr(current_table.c, col) <= filter_spec["to"])
                elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) >= filter_spec["from"])
                elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) <= filter_spec["to"])
            elif "VARCHAR" in str(column_def.type):
                if filter_spec.get("like", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col).ilike("%{}%".format(filter_spec["like"])))
            elif "TIMESTAMP" in str(column_def.type):
                if filter_spec.get("equal", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) == filter_spec["equal"])
                elif filter_spec.get("from", None) and filter_spec.get("to", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) >= filter_spec["from"])
                    sel_obj = sel_obj.where(getattr(current_table.c, col) <= filter_spec["to"])
                elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) >= filter_spec["from"])
                elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                    sel_obj = sel_obj.where(getattr(current_table.c, col) <= filter_spec["to"])
            elif str(column_def.type) == "BOOLEAN" and filter_spec.get("value", None) is not None:
                if filter_spec["value"] is True:
                    sel_obj = sel_obj.where(getattr(current_table.c, col))
                else:
                    sel_obj = sel_obj.where(~getattr(current_table.c, col))
    return sel_obj


async def data_post(request):
    """
    This method fetches actual data from one or more sources, given a specification for columns, joins, limits,
    etc. This method is a POST method because the query specification can become large.
    We use JSON (in the POST payload) to specify the query.
    """
    from .schema import column_definition
    default_per_page = 20

    try:
        query_specification = await request.json()
        source_label = query_specification["source_label"]
    except JSONDecodeError:
        return web_error(
            error_code="request.json_decode_error",
            message="We could not handle that request, perhaps something is wrong with the server."
        )
    settings = get_source_settings(source_label=source_label)

    engine, conn = await connect_database(db_url=settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()
    tables_and_columns = {}
    table_query_order = []
    columns = []

    for table_column in query_specification["select"]:
        # We use a list for select so that we can retain the order in which `table.columns` were requested
        if "." in table_column:
            (table_name, column_name) = table_column.split(".")
        else:
            table_name = table_column
            column_name = "__auto__"
        if table_name not in tables_and_columns.keys():
            # We are encountering this table for the first time in this request, let's add it
            tables_and_columns[table_name] = [column_name]
            table_query_order.append(table_name)
        else:
            # We have encountered this table in this request already, let's just handle the column
            # Check if there is a an existing request for `table.*`.
            # If that was requested then we add no more columns for this table
            if "*" not in tables_and_columns[table_name]:
                # `table.*` was not requested earlier, so we add this current column
                tables_and_columns[table_name].append(column_name)

    for table_name in table_query_order:
        column_list = tables_and_columns[table_name]
        # Unavailable columns are configured due to security or similar reasons
        unavailable_columns = get_unavailable_columns(source_settings=settings, meta=meta).get(table_name, [])
        table_column_names = meta.tables[table_name].columns.keys()
        current_table = meta.tables[table_name]

        if column_list == ["*"]:
            # If the request is explicitly for `table.*` then we return all columns, except the unavailable ones
            columns = columns +\
                [getattr(current_table.c, "id")] + \
                [getattr(current_table.c, col) for col in table_column_names
                 if col not in unavailable_columns]
        elif len(column_list) > 0 and column_list != ["__auto__"]:
            # If there is an "id" column then it is always included, the UI hides it as needed
            columns = columns +\
                [getattr(current_table.c, "id")] if\
                ("id" not in column_list and "id" in table_column_names) else []
            columns = columns +\
                [getattr(current_table.c, col) for col in table_column_names
                 if col in column_list and col not in unavailable_columns]
        else:
            # If we have not been asked to show specific columns then we do not send columns which are
            # detected to be meta data
            meta_data_column_names = [col["name"] for col in [
                column_definition(col, col_def) for col, col_def in meta.tables[table_name].columns.items()
                if col not in unavailable_columns
            ] if "is_meta" in col["ui_hints"]]
            columns = columns +\
                [getattr(current_table.c, "id")] +\
                [getattr(current_table.c, col) for col in table_column_names
                    if col not in unavailable_columns and col not in meta_data_column_names]

    sel_obj = select(columns)

    """
    if query_specification.get("order_by", {}) != {}:
        sel_obj = apply_ordering(query_specification, sel_obj, current_table, unavailable_columns=unavailable_columns)
    if query_specification.get("filter_by", None):
        sel_obj = apply_filters(query_specification, sel_obj, current_table, unavailable_columns=unavailable_columns)
    """
    # sel_obj = sel_obj.limit(query_specification.get("limit", default_per_page))
    # sel_obj = sel_obj.offset(query_specification.get("offset", 0))

    if len(table_query_order) > 0:
        # We have more than 1 table in the requested select, we need to apply JOINS
        sel_obj = find_best_join(sel_obj, meta, table_query_order)

        # sel_obj = sel_obj.select_from(meta.tables["content"].join(
        #     meta.tables["users"],
        #     meta.tables["content"].c.created_by_id == meta.tables["users"].c.id
        # ))

    exc = conn.execute(sel_obj)
    rows = exc.cursor.fetchall()

    # We use a separate query to count the total number of rows in the given query
    """
    count_sel_obj = select([func.count(getattr(current_table.c, "id"))])
    if query_specification.get("filter_by", None):
        count_sel_obj = apply_filters(query_specification, count_sel_obj, current_table,
                                      unavailable_columns=unavailable_columns)
    count = conn.execute(count_sel_obj).scalar()
    """
    conn.close()

    return RapidJSONResponse(
        dict(
            columns=["{}.{}".format(x[2][0].table.name, x[2][0].name) for x in exc.context.result_column_struct[0]],
            rows=rows,
            count=0,  # count,
            limit=query_specification.get("limit", default_per_page),
            offset=query_specification.get("offset", 0),
            query_sql=str(sel_obj),
        )
    )
