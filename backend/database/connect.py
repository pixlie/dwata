from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

from exceptions.database import DatabaseDriverNotInstalledException


async def connect_database(db_url: str = None):
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
