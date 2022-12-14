from datetime import datetime
from starlette.requests import Request
from starlette.exceptions import HTTPException
from benedict import benedict
import orjson

from utils.http import OrJSONResponse
from utils.env_settings import settings
from database.connect import connect_database
from exceptions.database import DatabaseException
from .models import dwata_db_settings
from .hierarchy import hierarchy


async def settings_get(request: Request) -> OrJSONResponse:
    """
    Get all the settings by a hierarchy. A hierarchy is simply a path that tells us how to extract the settings.
    Settings starting with `dwata` are core settings, and will include information from `.env` file like list of DBs.

    Each actual DB (as in `.env`) can have its own settings (in a `dwata_db_settings` table in that DB).
    These can be accessed using the db name in the hierarchy path, like `example_db`.
    """
    settings_path = request.path_params["settings_path"]

    if settings_path == "dwata":
        response = {"databases": {}}
        for i, db_label in enumerate(settings.DATABASE_LABELS):
            try:
                connect_database(db_label=db_label)
                response["databases"][db_label] = {"status": "ok"}
            except DatabaseException as error:
                response["databases"][db_label] = error.get_dict()
        return OrJSONResponse(response)
    else:
        db_label = settings_path.split("/")[0]
        if db_label in settings.DATABASE_LABELS:
            query = dwata_db_settings.select().where(
                dwata_db_settings.c.label.like("{}%".format(settings_path))
            )
            _, db_conn = connect_database(db_label=db_label)
            db_conn.execute(query)
        return OrJSONResponse({})

    # all_settings = await dwata_meta_db.fetch_all(query=query)
    # benedict_hierarchy: benedict = benedict(hierarchy, keypath_separator="/")
    #
    # def value_type_convert(row):
    #     converted = row[2] if benedict_hierarchy[row[1]] is str else benedict_hierarchy[row[1]](row[2])
    #     return [
    #         row[0],
    #         row[1],
    #         converted,
    #     ]
    # rows = [value_type_convert(x) for x in all_settings]
    #
    # return OrJSONResponse({
    #     "columns": [
    #         "id", "label", "value",
    #     ],
    #     "rows": rows
    # })


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
            status_code=400, detail=orjson.dumps({"error": e.args[0]}).decode()
        )

    query = dwata_settings.insert().values(
        label=request_payload["path"],
        value=request_payload["value"],
        created_at=datetime.utcnow(),
    )
    last_insert_id = await dwata_meta_db.execute(query=query)
    return OrJSONResponse({"id": last_insert_id})
