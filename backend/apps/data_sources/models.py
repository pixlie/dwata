from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime
from sqlalchemy.dialects.sqlite import JSON


metadata = MetaData()


data_sources = Table(
    "dwata_meta_data_sources",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("source_type", String(length=20), nullable=False),
    Column("label", String(length=40), nullable=False, unique=True),
    Column("configuration_json", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def data_sources_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def data_sources_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
