import typing
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, Connection
from sqlalchemy.exc import OperationalError

from exceptions.database import DatabaseException
from utils.env_settings import settings


def connect_database(db_label: str) -> (Engine, Connection):
    db_url: typing.Optional[str] = None
    if db_label in settings.DATABASE_LABELS:
        db_url = settings.DATABASES[settings.DATABASE_LABELS.index(db_label)]

    if not db_url:
        raise DatabaseException(
            error_code="db.not_found",
            detail=f"The database with label {db_label} is not in the file `backend/.env`",
        )

    try:
        engine = create_engine(db_url)
    except ModuleNotFoundError as e:
        if hasattr(e, "name") and e.name == "psycopg2":
            raise DatabaseException(
                error_code="db.driver_not_installed",
                detail="Please install psycopg2 in the backend folder `poetry add psycopg2`",
            )
        raise DatabaseException(
            error_code="db.unknown",
            detail="We encountered an unknown error with the database",
        )
    try:
        conn = engine.connect()
    except OperationalError as e:
        if e.code == "e3q8":
            raise DatabaseException(
                error_code="db.not_running",
                detail="It seems that we can not connect to the PostgreSQL DB, can you please double check?",
            )
        raise DatabaseException(
            error_code="db.unknown",
            detail="We encountered an unknown error with the database",
        )
    return engine, conn
