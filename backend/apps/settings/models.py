from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime


metadata = MetaData()


settings = Table(
    "dwata_meta_settings",
    metadata,

    Column("id", Integer, primary_key=True),

    Column("label", String(length=40), nullable=False, unique=True),
    Column("value", String(length=255), nullable=False),

    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
    Column("modified_at", DateTime, nullable=True)
)


def settings_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def settings_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
