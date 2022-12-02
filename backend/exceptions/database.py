from .base import ExceptionBase


class DatabaseDriverNotInstalledException(ExceptionBase):
    pass


class DatabaseNotFound(Exception):
    pass
