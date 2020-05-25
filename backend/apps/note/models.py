from sqlalchemy import MetaData, Table, Column, Integer, String, Text


meta = MetaData()


notes = Table(
    "admin_meta_notes",
    Column("id", Integer, primary_key=True),
    Column("path", String(length=100), nullable=False),
    Column("content", Text, nullable=False)
)
