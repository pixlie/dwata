from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime


metadata = MetaData()


subject_attributes = Table(
    "dwata_meta_subject_attributes",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("label", String(length=100), nullable=False),

    Column("created_at", DateTime, nullable=False),
)


def subject_attributes_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def subject_attributes_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
