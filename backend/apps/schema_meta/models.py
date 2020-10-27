from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime
from sqlalchemy.dialects.sqlite import JSON


metadata = MetaData()


schema_meta = Table(
    "dwata_meta_schema_meta",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("data_source_id", Integer, nullable=False),
    Column("table_id", Integer, nullable=False),
    # Column("column_name", )

    Column("attributes", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def schema_meta_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    if values["attributes"] is None:
        values["attributes"] = []
    return values


def schema_meta_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
