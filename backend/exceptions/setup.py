from .base import ExceptionBase


class SetupIsIncomplete(ExceptionBase):
    def __init__(self, error_code: str = "setup_is_incomplete", detail: str = None):
        super().__init__(error_code=error_code, detail=detail)
