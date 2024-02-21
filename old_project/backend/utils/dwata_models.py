from sqlalchemy import MetaData, Table, Column, Integer, String, Text


metadata = MetaData()


dwata_settings = Table(
    "dwata_settings",
    metadata,

    Column("id", Integer, primary_key=True),
    Column("label", String(length=200), nullable=False, unique=True),
    Column("value", Text, nullable=False),
)
