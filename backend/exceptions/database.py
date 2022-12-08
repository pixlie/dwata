from .base import ExceptionBase


class DatabaseDriverNotInstalledException(ExceptionBase):
    def __init__(
        self,
        error_code: str,
        detail: str,
        status_code: int = 500,
    ):
        super().__init__(status_code=status_code, error_code=error_code, detail=detail)


class DatabaseNotFound(Exception):
    pass
