import sqlalchemy
from sqlalchemy import MetaData, select, func, or_, join

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


class Select(object):
    qb = None
    merge_one_to_many = False
    default_per_page = 25
    _select = None
    is_root = False
    parent_select = None
    select_root_table_name = None
    tables_and_columns = None
    requested_tables_in_order = None
    pending_joins = None
    embedded_selects = None

    def __init__(self, qb, table_name=None, parent_select=None, parent_join=None):
        self.qb = qb
        self.parent_select = parent_select
        self.pending_joins = []

        if table_name:
            # This Select is being created as an embedded or related of another Select, so this is not root
            self.is_root = False
            self.select_root_table_name = table_name
            self.tables_and_columns = {
                table_name: []
            }
            self.pending_joins.append(parent_join)
        else:
            self.is_root = True
            self.tables_and_columns = {}
            table_column = qb.query_specification["select"][0]
            if "." in table_column:
                (self.select_root_table_name, _) = table_column.split(".")
            else:
                self.select_root_table_name = table_column

    def apply_ordering(self):
        qs = self.qb.query_specification
        uc = self.qb.unavailable_columns
        dm = self.qb.database_meta

        for table_column, order_type in qs["order_by"].items():
            if order_type not in ("asc", "desc"):
                order_type = "asc"
            table_name, column_name = table_column.split(".")
            if table_name not in self.tables_and_columns:
                continue

            if column_name not in dm.tables[table_name].columns:
                continue
            if column_name in uc[table_name]:
                continue
            self._select = self._select.order_by(
                getattr(sqlalchemy, order_type)(getattr(dm.tables[table_name].c, column_name))
            )

    def apply_filters(self):
        qs = self.qb.query_specification
        uc = self.qb.unavailable_columns
        dm = self.qb.database_meta
        sel_obj = self._select

        filter_by = qs["filter_by"]
        for table_column, filter_spec in filter_by.items():
            table_name, column_name = table_column.split(".")
            if table_name not in self.tables_and_columns:
                continue
            if column_name in uc[table_name]:
                continue
            current_table = dm.tables[table_name]

            if column_name in current_table.columns:
                column_def = current_table.columns[column_name]
                if str(column_def.type) in ["INTEGER", "FLOAT"]:
                    # We can do an equals query or a range query
                    if filter_spec.get("equal", None):
                        if isinstance(filter_spec["equal"], list):
                            sel_obj = sel_obj.where(
                                or_(*[(getattr(current_table.c, column_name) == x) for x in filter_spec["equal"]])
                            )
                        else:
                            sel_obj = sel_obj.where(getattr(current_table.c, column_name) == filter_spec["equal"])
                    elif filter_spec.get("from", None) and filter_spec.get("to", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) >= filter_spec["from"])
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) <= filter_spec["to"])
                    elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) >= filter_spec["from"])
                    elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) <= filter_spec["to"])
                elif "VARCHAR" in str(column_def.type):
                    if filter_spec.get("like", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name).ilike("%{}%".format(filter_spec["like"])))
                elif "TIMESTAMP" in str(column_def.type):
                    if filter_spec.get("equal", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) == filter_spec["equal"])
                    elif filter_spec.get("from", None) and filter_spec.get("to", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) >= filter_spec["from"])
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) <= filter_spec["to"])
                    elif filter_spec.get("from", None) and not filter_spec.get("to", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) >= filter_spec["from"])
                    elif filter_spec.get("to", None) and not filter_spec.get("from", None):
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name) <= filter_spec["to"])
                elif str(column_def.type) == "BOOLEAN" and filter_spec.get("value", None) is not None:
                    if filter_spec["value"] is True:
                        sel_obj = sel_obj.where(getattr(current_table.c, column_name))
                    else:
                        sel_obj = sel_obj.where(~getattr(current_table.c, column_name))

    def find_to_one_join(self, table_name):
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
        # We check only for Many-to-One or One-to-One relations
        dm = self.qb.database_meta
        to_one_join = False

        # For every column of the select's root table in query order, check if we have a FK to the current table
        for col, col_def in dm.tables[self.select_root_table_name].columns.items():
            # For each FK, is there a direct FK from the previous table to current table?
            for x in col_def.foreign_keys:
                if x.column.table.name == table_name:
                    # So root table has FK to current table, let's use this to JOIN
                    self.pending_joins.append({
                        "left": dm.tables[self.select_root_table_name],
                        "right": dm.tables[table_name],
                        "onclause": getattr(dm.tables[self.select_root_table_name].c, x.parent.name) ==
                        getattr(dm.tables[table_name].c, x.column.name)
                    })
                    to_one_join = True
                    break

        return to_one_join

    def find_to_many_join(self, table_name):
        dm = self.qb.database_meta
        to_many_join = False

        # Let us do the same check, but the other way around
        for col, col_def in dm.tables[table_name].columns.items():
            # Check if the previous table has FK
            if len(col_def.foreign_keys) > 0:
                # For each FK, is there a direct FK from current table to the previous table?
                for x in col_def.foreign_keys:
                    if x.column.table.name == self.select_root_table_name:
                        # The current table has FK to previous table,
                        # this usually means a One to Many relationship from current table to previous table
                        if self.merge_one_to_many:
                            self.pending_joins.append({
                                "left": dm.tables[table_name],
                                "right": dm.tables[self.select_root_table_name],
                                "onclause": getattr(dm.tables[table_name].c, x.parent.name) ==
                                getattr(dm.tables[self.select_root_table_name].c, x.column.name)
                            })
                            to_many_join = True
                            break

        return to_many_join

    def find_embedded_select(self, table_name):
        dm = self.qb.database_meta
        embedded_select = False

        # Let us do the same check, but the other way around
        for col, col_def in dm.tables[table_name].columns.items():
            # Check if the previous table has FK
            if len(col_def.foreign_keys) > 0:
                # For each FK, is there a direct FK from current table to the previous table?
                for x in col_def.foreign_keys:
                    if x.column.table.name == self.select_root_table_name:
                        # The current table has FK to previous table,
                        # this usually means a One to Many relationship from current table to previous table
                        # We do not JOIN One to Many relational data, instead we do a separate query
                        self.embedded_selects.append(Select(
                            qb=self.qb,
                            table_name=table_name,
                            parent_select=self,
                            parent_join={
                                "left": dm.tables[table_name],
                                "right": dm.tables[self.select_root_table_name],
                                "onclause": getattr(dm.tables[table_name].c, x.parent.name) ==
                                getattr(dm.tables[self.select_root_table_name].c, x.column.name)
                            }
                        ))
                        embedded_select = True
                        break

        return embedded_select

    def get_joins(self):
        _joins = join(**self.pending_joins[0])
        for _join in self.pending_joins[1:]:
            _joins = _joins.join(**{
                "right": _join["right"],
                "onclause": _join["onclause"]
            })
        return _joins

    def get_root_joins(self, _joins):
        for _join in self.pending_joins:
            _joins = _joins.join(**{
                "right": _join["right"],
                "onclause": _join["onclause"]
            })
        return _joins

    def columns_to_select(self, table_name):
        dm = self.qb.database_meta
        uc = self.qb.unavailable_columns

        column_list = self.tables_and_columns[table_name]
        # Unavailable columns are configured due to security or similar reasons, we remove them here
        table_column_names = [column_name for column_name in dm.tables[table_name].columns.keys()
                              if column_name not in uc[table_name]]
        current_table = dm.tables[table_name]
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
            if table_name == self.select_root_table_name:
                meta_data_column_names = [col["name"] for col in [
                    column_definition(col, col_def) for col, col_def in current_table.columns.items()
                    if col not in uc[table_name]
                ] if "is_meta" in col["ui_hints"]]
            else:
                meta_data_column_names = [col["name"] for col in [
                    column_definition(col, col_def) for col, col_def in current_table.columns.items()
                    if col not in uc[table_name]
                ] if "is_meta" in col["ui_hints"] or col["is_nullable"]]
            current_table_columns = current_table_columns +\
                [getattr(current_table.c, col) for col in table_column_names if col not in meta_data_column_names]
        else:
            current_table_columns = current_table_columns + \
                [getattr(current_table.c, col) for col in table_column_names if col in column_list]
        return current_table_columns

    def tables_to_select(self):
        qs = self.qb.query_specification
        self.embedded_selects = []

        for table_column in qs["select"]:
            # We use a list for select so that we can retain the order in which `table.columns` were requested
            if "." in table_column:
                (table_name, column_name) = table_column.split(".")
            else:
                table_name = table_column
                column_name = "__auto__"

            if table_name not in self.tables_and_columns:
                # We are encountering this table for the first time in this request
                if len(self.tables_and_columns) == 0:
                    # We have not parsed any tables yet, so this is the first table
                    self.tables_and_columns[table_name] = [column_name]
                else:
                    # This is not the first table to be queried
                    if not self.is_root:
                        # We are not a root Select
                        # So we will not select tables that have already been selected
                        if table_name in self.parent_select.tables_and_columns:
                            continue

                    # Let us check if this table can be directly JOINed
                    if self.find_to_one_join(table_name):
                        # Yes we can join this table, so add it to our list of tables and columns to select
                        self.tables_and_columns[table_name] = [column_name]
                    else:
                        self.find_embedded_select(table_name)
            else:
                # We have encountered this table in this request already, let's just handle the column
                # Check if there is a an existing request for `table.*`.
                # If that was requested then we add no more columns for this table
                if "*" not in self.tables_and_columns[table_name]:
                    # `table.*` was not requested earlier, so we add this current column
                    self.tables_and_columns[table_name].append(column_name)

    def execute(self):
        dm = self.qb.database_meta
        conn = self.qb.database_conn
        qs = self.qb.query_specification
        columns = []

        self.tables_to_select()
        for table_name in self.tables_and_columns.keys():
            columns += self.columns_to_select(table_name)

        self._select = select(columns)
        if self.is_root and self.pending_joins:
            self._select = self._select.select_from(self.get_joins())
        if not self.is_root:
            # We are inside an embedded Select, we surely have a JOIN to the parent Select's root table
            _joins = self.get_joins()
            # Now we apply all the JOINs of the parent Select too
            self._select = self._select.select_from(self.parent_select.get_root_joins(_joins))

        if qs.get("order_by", {}) != {}:
            self.apply_ordering()
        if qs.get("filter_by", {}) != {}:
            self.apply_filters()
        self._select = self._select.limit(qs.get("limit", self.default_per_page))
        self._select = self._select.offset(qs.get("offset", 0))

        # We use a separate query to count the total number of rows in the given query
        count_sel_obj = select([func.count()]).select_from(dm.tables[self.select_root_table_name])
        exc = conn.execute(self._select)

        columns = ["{}.{}".format(x.table.name, x.name) for x in columns]
        rows = exc.cursor.fetchall()
        count = conn.execute(count_sel_obj).scalar()
        query_sql = str(self._select)

        return columns, rows, count, query_sql


class QueryBuilder(object):
    query_specification = None
    unavailable_columns = None

    database_engine = None
    database_conn = None
    database_meta = None

    def __init__(self, query_specification):
        self.query_specification = query_specification

    async def prepare(self):
        source_label = self.query_specification["source_label"]
        settings = get_source_settings(source_label=source_label)
        self.database_engine, self.database_conn = await connect_database(db_url=settings["db_url"])
        self.database_meta = MetaData(bind=self.database_engine)
        self.database_meta.reflect()
        self.unavailable_columns = get_unavailable_columns(settings, self.database_meta)

    async def results(self):
        await self.prepare()
        root_select = Select(qb=self)

        columns, rows, count, query_sql = root_select.execute()
        embedded_rows = []

        query_sql = [query_sql]
        for rs in root_select.embedded_selects:
            _columns, _rows, _, _query_sql = rs.execute()
            columns += [_columns]
            query_sql += [_query_sql]
            embedded_rows += [_rows]

        self.database_conn.close()
        return columns, rows, count, query_sql, embedded_rows
