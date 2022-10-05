from typing import Any
from starlette.responses import JSONResponse
import orjson
from loguru import logger


class OrJSONResponse(JSONResponse):
    media_type = "application/json"

    def render(self, content: Any) -> bytes:
        return orjson.dumps(content)


def web_error(error_code: str, message: str) -> OrJSONResponse:
    logger.error("({}) {}".format(error_code, message))
    return OrJSONResponse({
        "error_code": error_code,
        "message": message,
    }, status_code=500)
