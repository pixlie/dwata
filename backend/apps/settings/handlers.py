from datetime import datetime
from starlette.requests import Request
from starlette.exceptions import HTTPException
from benedict import benedict
import orjson

from utils.http import OrJSONResponse
from database.dwata_meta import dwata_meta_db
from .models import settings
from .hierarchy import hierarchy


async def settings_get(request: Request) -> OrJSONResponse:
    """Get all the settings by a hierarchy"""
    label_root = request.path_params["label_root"]
    query = settings.select().where(
        settings.c.label.like("{}%".format(label_root))
    )
    all_settings = await dwata_meta_db.fetch_all(query=query)
    benedict_hierarchy: benedict = benedict(hierarchy, keypath_separator="/")

    def value_type_convert(row):
        converted = row[2] if benedict_hierarchy[row[1]] is str else benedict_hierarchy[row[1]](row[2])
        return [
            row[0],
            row[1],
            converted,
            row[3],
            row[4]
        ]
    rows = [value_type_convert(x) for x in all_settings]

    return OrJSONResponse({
        "columns": [
            "id", "label", "value", "created_at", "modified_at",
        ],
        "rows": rows
    })


def verify_hierarchy(path: str, value):
    # We go through the payload key by key and check the value
    # Depending on the value, we are either going deeper or checking value data type
    benedict_hierarchy: benedict = benedict(hierarchy, keypath_separator="/")
    # Payload can have only one path for simplicity
    if path not in benedict_hierarchy:
        raise Exception("payload path is not valid")

    value_in_hierarchy = benedict_hierarchy[path]

    if type(value) != value_in_hierarchy:
        raise Exception("payload value data type mistatch")


async def settings_set(request: Request) -> OrJSONResponse:
    """
    Set a setting by its label and value
    For simplicity we allow only one path to be set, path uses "/" as separator
    """
    request_payload = await request.json()

    try:
        verify_hierarchy(path=request_payload["path"], value=request_payload["value"])
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=orjson.dumps({
                "error": e.args[0]
            }).decode()
        )

    query = settings.insert().values(
        label=request_payload["path"],
        value=request_payload["value"],
        created_at=datetime.utcnow()
    )
    last_insert_id = await dwata_meta_db.execute(query=query)
    return OrJSONResponse({
        "id": last_insert_id
    })
