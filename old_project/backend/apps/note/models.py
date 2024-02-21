from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime


metadata = MetaData()


note = Table(
    "dwata_meta_note",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("query_specification", String(length=500), nullable=False),
    Column("content", Text, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def note_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def note_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
