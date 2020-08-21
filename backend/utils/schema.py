from utils.database import get_system_tables, get_relations_matrix


def get_table_properties(source_settings, meta):
    system_tables = get_system_tables(source_settings=source_settings)
    relations_matrix = get_relations_matrix(source_settings=source_settings, meta=meta)

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
    _type = type(col_def.type).__name__

    def ui_hints():
        hints = []
        if (col_def.primary_key or
                len(col_def.foreign_keys) > 0 or
                _type in ["INET", "TIMESTAMP", "DATE", "JSONB", "JSON"]):
            hints.append("is_meta")
        elif col.lower()[-3:] in ["_id", "_pk", "_fk"]:
            hints.append("is_meta")
        elif "uuid" in col.lower():
            hints.append("is_meta")
        else:
            if _type == "VARCHAR" and not col_def.nullable:
                # Todo: a good check would be to see if this is the only non-nullable VARCHAR column,
                #  then more likely to be a title
                # Perhaps and import text, like title
                hints.append("is_title")
            if _type == "TEXT" or (_type in types_with_length and col_def.type.length > 200):
                # Perhaps and import text, like title
                hints.append("is_text_lg")
        return hints

    return {
        "name": col,
        "type": type(col_def.type).__name__,
        "length": col_def.type.length if _type in types_with_length else None,
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