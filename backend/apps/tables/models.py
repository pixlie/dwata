from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime
from sqlalchemy.dialects.sqlite import JSON


metadata = MetaData()


tables = Table(
    "dwata_meta_tables",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("data_source_id", Integer, nullable=False),
    Column("table_name", String(length=100), nullable=False),

    Column("attributes", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def tables_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    if values["attributes"] is None:
        values["attributes"] = []
    return values


def tables_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
