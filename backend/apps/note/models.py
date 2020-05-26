from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime


metadata = MetaData()


note = Table(
    "admin_meta_note",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("path", String(length=100), nullable=False, unique=True),
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
