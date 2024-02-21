from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime
from sqlalchemy.dialects.sqlite import JSON


metadata = MetaData()


users = Table(
    "dwata_meta_users",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("email", String(length=100), nullable=False),
    Column("first_name", String(length=40), nullable=True),
    Column("last_name", String(length=40), nullable=True),

    Column("attributes", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def users_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    if values["attributes"] is None:
        values["attributes"] = {}
    return values


def users_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values
