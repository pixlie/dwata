from sqlalchemy import create_engine
from sqlalchemy.exc import OperationalError

from exceptions.database import DatabaseDriverNotInstalledException


def connect_database(db_url=None):
    try:
        engine = create_engine(db_url)
    except ModuleNotFoundError as e:
        if hasattr(e, "name") and e.name == "psycopg2":
            raise DatabaseDriverNotInstalledException(
                error_code="db.psycopg2",
                detail="Please install psycopg2 in the backend folder `pipenv install psycopg2`",
            )
        raise DatabaseDriverNotInstalledException(
            error_code="db.unknown",
            detail="We encountered an unknown error with the database",
        )
    try:
        conn = engine.connect()
    except OperationalError as e:
        if e.code == "e3q8":
            raise DatabaseDriverNotInstalledException(
                error_code="db.not_running",
                detail="It seems that we can not connect to the PostgreSQL DB, can you please double check?",
            )
        raise DatabaseDriverNotInstalledException(
            error_code="db.unknown",
            detail="We encountered an unknown error with the database",
        )
    return engine, conn
