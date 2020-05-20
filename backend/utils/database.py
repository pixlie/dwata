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
