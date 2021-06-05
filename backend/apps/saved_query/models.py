from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, JSON, DateTime


metadata = MetaData()


saved_query = Table(
    "dwata_meta_saved_query",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("label", String(length=100), nullable=False, unique=True),
    Column("query_specification", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def saved_query_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def saved_query_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
