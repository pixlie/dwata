from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime


metadata = MetaData()


users = Table(
    "dwata_meta_users",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("email", String(length=100), nullable=False),
    Column("username", String(length=40), nullable=True),
    Column("first_name", String(length=40), nullable=True),
    Column("last_name", String(length=40), nullable=True),
    Column("title", String(length=60), nullable=True),
    Column("department", String(length=40), nullable=True),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


users_attributes = Table(
    "dwata_meta_users_attributes",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, nullable=False),
    Column("attribute", String(length=100), nullable=False),

    Column("created_at", DateTime, nullable=False),
)


def users_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values


def users_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values


def users_attributes_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    return values
