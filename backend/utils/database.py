from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

from exceptions.database import DatabaseDriverNotInstalledException


async def connect_database(db_url):
    try:
        engine = create_engine(db_url)
    except ModuleNotFoundError as e:
        if hasattr(e, "name") and e.name == "psycopg2":
            raise DatabaseDriverNotInstalledException(
                error_code="db.psycopg2",
                message="Please install psycopg2 in the backend folder `pipenv install psycopg2`"
            )
        raise DatabaseDriverNotInstalledException(
            error_code="db.unknown",
            message="We encountered an unknown error with the database"
        )
    try:
        conn = engine.connect()
    except OperationalError as e:
        if e.code == "e3q8":
            raise DatabaseDriverNotInstalledException(
                error_code="db.not_running",
                message="It seems that we can not connect to the PostgreSQL DB, can you please double check?",
            )
        raise DatabaseDriverNotInstalledException(
            error_code="db.unknown",
            message="We encountered an unknown error with the database"
        )
    return engine, conn


async def connect_dwata_meta_database(db_url):
    engine = create_engine(db_url)
    conn = engine.connect()
    return engine, conn


def get_unavailable_columns(source_settings, meta):
    unavailable_columns = {}

    for name, config in source_settings.items():
        if isinstance(config, dict):
            # We have further settings, perhaps the name is a table name
            if name in meta.tables.keys():
                # OK so we have table_name: config here. Lets see if we are asked some column level configuration
                if "unavailable_columns" in config and isinstance(config["unavailable_columns"], list):
                    # Lets store this in a separate variable and not allow any access to these columns
                    unavailable_columns[name] = config["unavailable_columns"]
    # We build the default list of column names for all tables
    for name in meta.tables.keys():
        if name not in unavailable_columns:
            unavailable_columns[name] = ["password", "secret"]
    return unavailable_columns


def get_system_tables(source_settings):
    if "system_tables" in source_settings and len(source_settings.get("system_tables", [])):
        return source_settings["system_tables"]
    return []


def get_relations_matrix(source_settings, meta):
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


def run_migrations():
    from migrate.versioning.api import upgrade
    upgrade("sqlite://dwata_meta.db", "dwata_meta_migrations")
