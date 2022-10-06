from sqlalchemy import MetaData

from database.connect import connect_database
from utils.database import get_system_tables, get_unavailable_columns


def get_table_properties(source_settings, meta):
    system_tables = get_system_tables(source_settings=source_settings)
    relations_matrix = infer_relations_matrix(source_settings=source_settings, meta=meta)

    def inner(name):
        default = {
            "is_system_table": False,
            "related_tables": [],
        }
        if name in system_tables:
            default["is_system_table"] = True
        if name in relations_matrix:
            default["related_tables"] = relations_matrix[name]
        return default
    return inner


def column_definition(col, col_def):
    types_with_length = ["VARCHAR"]
    data_type = type(col_def.type).__name__

    def ui_hints():
        hints = []
        if (col_def.primary_key or
                len(col_def.foreign_keys) > 0 or
                data_type in ["INET", "TIMESTAMP", "DATE"]):
            hints.append("is_meta")
        elif col.lower()[-3:] in ["_id", "_pk", "_fk"]:
            hints.append("is_meta")
        elif "uuid" in col.lower():
            hints.append("is_meta")
        else:
            if data_type == "VARCHAR" and not col_def.nullable:
                # Todo: a good check would be to see if this is the only non-nullable VARCHAR column,
                #  then more likely to be a title
                # Perhaps and import text, like title
                hints.append("is_title")
            if data_type == "TEXT" or (data_type in types_with_length and (col_def.type.length is None or col_def.type.length > 200)):
                # Perhaps and import text, like title
                hints.append("is_text_lg")
        return hints

    return {
        "name": col,
        "type": data_type,
        "length": col_def.type.length if data_type in types_with_length else None,
        "is_primary_key": col_def.primary_key,
        "is_nullable": col_def.nullable,
        "has_foreign_keys": len(col_def.foreign_keys) > 0,
        "foreign_keys": [
            {
                "table": str(x.column.table),
                "column": str(x.column.name)
            } for x in col_def.foreign_keys
        ] if len(col_def.foreign_keys) > 0 else None,
        "ui_hints": ui_hints()
    }


def infer_relations_matrix(source_settings, meta):
    tables = {}

    for name, schema in meta.tables.items():
        if name not in tables.keys():
            tables[name] = {}

        for col, col_def in schema.columns.items():
            if len(col_def.foreign_keys) > 0:
                for fk in col_def.foreign_keys:
                    # We found a FK in `table`, we do not check if this FK is unique constrained
                    # Thus each record in `table` has a many-to-one relation to the other table
                    # Todo: Check for unique constraint here
                    tables[name][fk.column.table.name] = {
                        "cardinality": "many-to-one",
                    }

                    if fk.column.table.name not in tables.keys():
                        tables[fk.column.table.name] = {}
                    # Here the cardinality is reversed, again we are not checking uniques
                    tables[fk.column.table.name][name] = {
                        "cardinality": "one-to-many",
                    }

    return tables


async def infer_schema(source_settings, table_name=None, meta=None):
    engine, conn = connect_database(db_url=source_settings["db_url"])
    if meta is None:
        meta = MetaData(bind=engine)
        meta.reflect()
    unavailable_columns = get_unavailable_columns(source_settings=source_settings, meta=meta)
    table_properties = get_table_properties(source_settings=source_settings, meta=meta)

    if table_name and table_name in meta.tables.keys():
        columns = [
            column_definition(col, col_def) for col, col_def in meta.tables[table_name].columns.items()
            if col not in unavailable_columns.get(table_name, [])
        ]
        conn.close()
        return columns
    else:
        tables = sorted([
            (
                name, table_properties(name=name), [
                    column_definition(col, col_def) for col, col_def in schema.columns.items()
                    if col not in unavailable_columns.get(name, [])
                ]
            ) for name, schema in meta.tables.items()
        ], key=lambda x: x[0])
        conn.close()
        return {
            "columns": ["table_name", "properties", "columns"],
            "rows": tables
        }
