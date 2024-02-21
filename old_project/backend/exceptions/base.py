import typing
from starlette.exceptions import HTTPException
import orjson

from utils.http import OrJSONResponse


class ExceptionBase(HTTPException):
    status_code: int = 500
    error_code: str = None
    detail: str = None

    def __init__(self, error_code: str, detail: str = None, status_code: int = 500):
        self.status_code = status_code
        self.error_code = error_code
        self.detail = detail
        super().__init__(status_code=status_code, detail=detail)

    def json_response(self, headers: typing.Optional[dict] = None):
        return OrJSONResponse(
            {"error": {"error_code": self.error_code, "detail": self.detail}},
            status_code=self.status_code,
            headers=self.headers,
        )

    def get_dict(self):
        return {
            "status": "error",
            "error": {"error_code": self.error_code, "detail": self.detail},
        }
