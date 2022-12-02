from .base import ExceptionBase


class AuthenticationException(ExceptionBase):
    def __init__(
        self,
        detail: str,
        status_code: int = 401,
        error_code: str = "authentication_failure",
    ):
        super().__init__(status_code=status_code, error_code=error_code, detail=detail)
