from sqlalchemy import MetaData

from database.select import Select
from utils.database import get_unavailable_columns
from database.connect import connect_database
from utils.settings import get_source_settings

# Example query specification:
example_spec = {
    "source_id": "monster_market",  # This is the data source, like a PostgreSQL database
    "select": ["monster.id", "monster.joined_at"],
    "limit": 100,
    "offset": 0
}


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
        settings = await get_source_settings(source_label=source_label)
        self.database_engine, self.database_conn = connect_database(db_url=settings["db_url"])
        self.database_meta = MetaData(bind=self.database_engine)
        self.database_meta.reflect()
        self.unavailable_columns = get_unavailable_columns(settings, self.database_meta)

    async def results(self):
        await self.prepare()
        root_select = Select(qb=self)
        columns, rows, query_sql = root_select.execute()

        embedded = []
        for embedded_select in root_select.embedded_selects:
            _columns, _rows, _query_sql = embedded_select.execute()
            embedded.append({
                "columns": _columns,
                "rows": _rows,
                "query_sql": _query_sql,
                "parent_join": embedded_select.get_parent_join()
            })

        count = root_select.get_count()
        self.database_conn.close()
        return columns, rows, count, query_sql, embedded
