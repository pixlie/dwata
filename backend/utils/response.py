import json
import typing
from starlette.responses import JSONResponse
import rapidjson


class CustomJSONEncoder(json.JSONEncoder):
    encode = rapidjson.Encoder(
        skip_invalid_keys=False,
        ensure_ascii=False,
        indent=None,
        sort_keys=False,
        number_mode=rapidjson.NM_NATIVE,
        datetime_mode=rapidjson.DM_ISO8601,
        uuid_mode=rapidjson.UM_CANONICAL)


class RapidJSONResponse(JSONResponse):
    media_type = "application/json"

    def render(self, content: typing.Any) -> bytes:
        return CustomJSONEncoder().encode(content).encode("utf-8")
