from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime, UniqueConstraint


metadata = MetaData()


record_pin = Table(
    "admin_meta_record_pin",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("path", String(length=100), nullable=False),
    Column("record_id", String(length=100), nullable=False),

    Column("created_at", DateTime, nullable=False),

    UniqueConstraint("path", "record_id", name="path_record_id_unique")
)


def record_pin_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values
