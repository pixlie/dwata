from datetime import datetime, timezone
from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime


metadata = MetaData()


dwata_db_settings = Table(
    "dwata_db_settings",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("label", String(length=40), nullable=False, unique=True),
    Column("value", String(length=255), nullable=False),
    Column(
        "created_at",
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    ),
    Column("modified_at", DateTime, nullable=True),
)


def settings_pre_insert(values):
    values["created_at"] = datetime.now(timezone.utc)
    return values


def settings_pre_update(values):
    values["modified_at"] = datetime.now(timezone.utc)
    return values
