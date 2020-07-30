import sqlalchemy
from sqlalchemy import MetaData, select, func, or_

from utils.database import connect_database, get_unavailable_columns
from utils.settings import get_source_settings
from utils.schema import column_definition


# Example query specification:
example_spec = {
    "source_id": "monster_market",  # This is the data source, like a PostgreSQL database
    "select": ["monster.id", "monster.joined_at"],
    "limit": 100,
    "offset": 0
}


class QueryBuilder(object):
    query_specification = None
    default_per_page = 25
    merge_one_to_many = False
    unavailable_columns = None
    tables_and_columns = None
    requested_tables_in_order = None

    database_engine = None
    database_conn = None
    database_meta = None

    root_select = None
    root_table_name = None
    columns = None
    pending_joins = None
    embedded_selects = None
    pending_embedded_joins = None
    embedded_columns = None

    def __init__(self, query_specification):
        self.query_specification = query_specification

    def find_joins(self):
        """
        This is an example Query request where we want to list all content first and also the author information.
        So `content` table is the first (index 0) table in the `table_query_order`.
        `user` table is the second table in the request. We try to see if `content` table has a direct FK to `user` table.
        This would mean `content` <> `user` relation is Many to One.

        sel_obj.join(
            self.database_meta.tables["content"],
            self.database_meta.tables["users"],
            self.database_meta.tables["content"].c.created_by_id == self.database_meta.tables["users"].c.id
        )
        """
        if len(self.requested_tables_in_order) == 1:
            return None
        # We have more than 1 table in the requested select, we might need to apply JOINS

        self.pending_joins = {}
        self.embedded_selects = {}
        for index, table_name in enumerate(self.requested_tables_in_order):
            if index == 0:
                continue
            relation_found = False

            # We start with the second table (index 1)
            prev_table_name = self.requested_tables_in_order[index - 1]
            # For every column of the previous table in query order, check if we have a FK to the current table
            for col, col_def in self.database_meta.tables[prev_table_name].columns.items():
                # Check if the previous table has FK
                if len(col_def.foreign_keys) > 0:
                    # For each FK, is there a direct FK from the previous table to current table?
                    for x in col_def.foreign_keys:
                        if x.column.table.name == table_name:
                            # So previous table has FK to current table, let's use this to JOIN
                            self.pending_joins[table_name] = self.database_meta.tables[prev_table_name].join(
                                self.database_meta.tables[table_name],
                                getattr(self.database_meta.tables[prev_table_name].c, x.parent.name) ==
                                getattr(self.database_meta.tables[table_name].c, x.column.name)
                            )
                            relation_found = True

            if not relation_found:
                # Let us do the same check, but the other way around
                for col, col_def in self.database_meta.tables[table_name].columns.items():
                    # Check if the previous table has FK
                    if len(col_def.foreign_keys) > 0:
                        # For each FK, is there a direct FK from current table to the previous table?
                        for x in col_def.foreign_keys:
                            if x.column.table.name == prev_table_name:
                                # The current table has FK to previous table,
                                # this usually means a One to Many relationship from current table to previous table
                                # We do not JOIN One to Many relational data, instead we do a separate query
                                if self.merge_one_to_many:
                                    self.pending_joins[table_name] = self.database_meta.tables[table_name].join(
                                        self.database_meta.tables[prev_table_name],
                                        getattr(self.database_meta.tables[table_name].c, x.parent.name) ==
                                        getattr(self.database_meta.tables[prev_table_name].c, x.column.name)
                                    )
                                else:
                                    self.pending_embedded_joins[table_name] = self.database_meta.tables[table_name].join(
                                        self.database_meta.tables[prev_table_name],
                                        getattr(self.database_meta.tables[table_name].c, x.parent.name) ==
                                        getattr(self.database_meta.tables[prev_table_name].c, x.column.name)
                                    )

    def apply_joins(self):
        for table_name, join_ in self.pending_joins.items():
            self.root_select = self.root_select.select_from(join_)

    def apply_ordering(self):
        for table_column, order_type in self.query_specification["order_by"].items():
            if order_type not in ("asc", "desc"):
                order_type = "asc"
            table_name, column_name = table_column.split(".")
            if column_name not in self.database_meta.tables[table_name].columns.keys():
                continue
            if column_name in self.unavailable_columns[table_name]:
                continue
            self.root_select.order_by(getattr(sqlalchemy, order_type)
                                      (getattr(self.database_meta.tables[table_name].c, column_name)))

    def apply_filters(self):
        current_table = self.current_table
        unavailable_columns = self.unavailable_columns
        sel_obj = self.root_select

        filter_by = self.query_specification["filter_by"]
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
        self.root_select = sel_obj

    async def prepare(self):
        source_label = self.query_specification["source_label"]
        settings = get_source_settings(source_label=source_label)
        self.database_engine, self.database_conn = await connect_database(db_url=settings["db_url"])
        self.database_meta = MetaData(bind=self.database_engine)
        self.database_meta.reflect()
        self.unavailable_columns = get_unavailable_columns(settings, self.database_meta)

    def columns_to_select(self, table_name):
        column_list = self.tables_and_columns[table_name]
        # Unavailable columns are configured due to security or similar reasons, we remove them here
        table_column_names = [column_name for column_name in self.database_meta.tables[table_name].columns.keys()
                              if column_name not in self.unavailable_columns[table_name]]
        current_table = self.database_meta.tables[table_name]
        current_table_columns = []
        if "id" in table_column_names:
            # If there is an "id" column then it is always included, the UI hides it as needed
            current_table_columns.append(getattr(current_table.c, "id"))

        if column_list == ["*"]:
            # If the request is explicitly for `table.*` then we return all columns, except the unavailable ones
            current_table_columns = current_table_columns + \
                                    [getattr(current_table.c, col) for col in table_column_names]
        elif column_list == ["__auto__"]:
            # If we have not been asked to show specific columns then we do not send columns which are
            # detected to be metadata
            if table_name == self.root_table_name:
                meta_data_column_names = [col["name"] for col in [
                    column_definition(col, col_def) for col, col_def in current_table.columns.items()
                    if col not in self.unavailable_columns[table_name]
                ] if "is_meta" in col["ui_hints"]]
            else:
                meta_data_column_names = [col["name"] for col in [
                    column_definition(col, col_def) for col, col_def in current_table.columns.items()
                    if col not in self.unavailable_columns[table_name]
                ] if "is_meta" in col["ui_hints"] or col["is_nullable"]]
            current_table_columns = current_table_columns +\
                [getattr(current_table.c, col) for col in table_column_names if col not in meta_data_column_names]
        else:
            current_table_columns = current_table_columns + \
                [getattr(current_table.c, col) for col in table_column_names if col in column_list]
        return current_table_columns

    def tables_to_query(self):
        self.tables_and_columns = {}
        self.requested_tables_in_order = []
        for table_column in self.query_specification["select"]:
            # We use a list for select so that we can retain the order in which `table.columns` were requested
            if "." in table_column:
                (table_name, column_name) = table_column.split(".")
            else:
                table_name = table_column
                column_name = "__auto__"
            if table_name not in self.tables_and_columns:
                # We are encountering this table for the first time in this request, let's add it
                self.tables_and_columns[table_name] = [column_name]
                self.requested_tables_in_order.append(table_name)
            else:
                # We have encountered this table in this request already, let's just handle the column
                # Check if there is a an existing request for `table.*`.
                # If that was requested then we add no more columns for this table
                if "*" not in self.tables_and_columns[table_name]:
                    # `table.*` was not requested earlier, so we add this current column
                    self.tables_and_columns[table_name].append(column_name)
        self.root_table_name = self.requested_tables_in_order[0]

    async def results(self):
        self.columns = []
        self.embedded_columns = {}

        await self.prepare()
        self.tables_to_query()
        self.find_joins()

        for table_name in self.requested_tables_in_order:
            if table_name != self.root_table_name and table_name not in self.pending_joins.keys():
                # Current table is neither the root table nor is it in  JOIN
                continue
            self.columns += self.columns_to_select(table_name)

        for table_name in self.embedded_selects.keys():
            self.embedded_columns[table_name] = self.columns_to_select(table_name)

        self.root_select = select(self.columns)
        count_sel_obj = select([func.count()]).select_from(self.database_meta.tables[self.requested_tables_in_order[0]])

        if self.query_specification.get("order_by", {}) != {}:
            self.apply_ordering()
        """
        if query_specification.get("filter_by", None):
            sel_obj = apply_filters(
                query_specification, sel_obj, current_table, unavailable_columns=unavailable_columns
            )
        """
        self.root_select = self.root_select.limit(self.query_specification.get("limit", self.default_per_page))
        self.root_select = self.root_select.offset(self.query_specification.get("offset", 0))
        self.apply_joins()
        exc = self.database_conn.execute(self.root_select)
        rows = exc.cursor.fetchall()

        # We use a separate query to count the total number of rows in the given query
        # if query_specification.get("filter_by", None):
        #     count_sel_obj = apply_filters(query_specification, count_sel_obj, current_table,
        #                                   unavailable_columns=unavailable_columns)
        count = self.database_conn.execute(count_sel_obj).scalar()
        self.database_conn.close()

        columns = ["{}.{}".format(x.table.name, x.name) for x in self.columns]
        if self.embedded_selects:
            for _columns in self.embedded_columns.values():
                columns += [["{}.{}".format(x.table.name, x.name) for x in _columns]]

        if self.embedded_selects:
            query_sql = [
                str(self.root_select),
                [str(x) for x in self.embedded_selects.values()]
            ]
        else:
            query_sql = str(self.root_select)
        return columns, rows, count, query_sql
