from datetime import datetime
from sqlalchemy import MetaData

from utils.settings import get_all_sources, get_source_settings
from database.connect import connect_database
from database.dwata_meta import dwata_meta_db
from apps.data_sources.models import data_sources
from apps.tables.models import tables


async def refresh(source_label):
    all_sources = await get_all_sources()
    requested_source = [x for x in all_sources if x[0] == source_label][0]
    source_settings = await get_source_settings(source_label=source_label)

    if requested_source[1] != "database":
        return False

    data_source = await dwata_meta_db.fetch_one(data_sources.select().where(
        data_sources.c.label == source_label
    ))
    engine, conn = await connect_database(db_url=source_settings["db_url"])
    meta = MetaData(bind=engine)
    meta.reflect()

    for name, _ in meta.tables.items():
        query = tables.insert().values(
            data_source_id=data_source["id"],
            table_name=name,
            attributes_json=[],
            created_at=datetime.utcnow()
        )
        await dwata_meta_db.execute(query)

    conn.close()

    return {
        "status": "success"
    }
