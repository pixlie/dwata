from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime


metadata = MetaData()


policies = Table(
    "dwata_meta_policies",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, nullable=False),
    Column("attribute", String(length=100), nullable=False),
    Column("scope", Text, nullable=False),

    Column("created_at", DateTime, nullable=False),
)


def policies_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def policies_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
