from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime


metadata = MetaData()


permissions = Table(
    "dwata_meta_permissions",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, nullable=False),
    Column("attribute", String(length=100), nullable=False),
    Column("scope", Text, nullable=False),

    Column("created_at", DateTime, nullable=False),
)


def permissions_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def permissions_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
