from datetime import datetime
from sqlalchemy import MetaData, Table, Column, Integer, String, Text, DateTime

from utils.response import RapidJSONEncoder


metadata = MetaData()


# Todo: Change source_id to source_label
saved_query = Table(
    "admin_meta_saved_query",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("label", String(length=100), nullable=False, unique=True),
    Column("source_id", String(length=4), nullable=False),
    Column("table_name", String(length=100), nullable=False),
    Column("query_specification", Text, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def saved_query_pre_insert(values):
    values["created_at"] = datetime.utcnow()
    values["source_id"] = int(values["source_id"])
    values["query_specification"] = RapidJSONEncoder().encode(values["query_specification"]).encode("utf-8")
    return values


def saved_query_pre_update(values):
    values["modified_at"] = datetime.utcnow()
    return values


def saved_query_post_read(data):
    pass


def saved_query_post_list():
    pass
