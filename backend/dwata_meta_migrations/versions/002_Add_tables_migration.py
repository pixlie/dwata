from sqlalchemy import MetaData, Table, Column, Integer, String, DateTime
from sqlalchemy.dialects.sqlite import JSON


metadata = MetaData()


tables = Table(
    "dwata_meta_tables",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("data_source_id", Integer, nullable=False),
    Column("table_name", String(length=100), nullable=False),

    Column("attributes_json", JSON, nullable=False),

    Column("created_at", DateTime, nullable=False),
    Column("modified_at", DateTime, nullable=True)
)


def upgrade(migrate_engine):
    metadata.bind = migrate_engine
    tables.create()


def downgrade(migrate_engine):
    metadata.bind = migrate_engine
    tables.drop()
