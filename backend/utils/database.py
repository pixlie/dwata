def get_unavailable_columns(source_settings, meta):
    unavailable_columns = {}

    for name, config in source_settings.items():
        if isinstance(config, dict):
            # We have further settings, perhaps the name is a table name
            if name in meta.tables.keys():
                # OK so we have table_name: config here. Let's see if we are asked some column level configuration
                if "unavailable_columns" in config and isinstance(
                    config["unavailable_columns"], list
                ):
                    # Let's store this in a separate variable and not allow any access to these columns
                    unavailable_columns[name] = config["unavailable_columns"]
    # We build the default list of column names for all tables
    for name in meta.tables.keys():
        if name not in unavailable_columns:
            unavailable_columns[name] = ["password", "secret"]
    return unavailable_columns


def get_system_tables(source_settings):
    if "system_tables" in source_settings and len(
        source_settings.get("system_tables", [])
    ):
        return source_settings["system_tables"]
    return []
