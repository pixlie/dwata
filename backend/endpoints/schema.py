from starlette.background import BackgroundTask
from starlette.authentication import requires

from utils.http import OrJSONResponse
from utils.settings import get_all_sources, get_source_settings
from database.schema import infer_schema
from services import all_services
from utils.cache import read_from_redis, cache_to_redis


@requires("authenticated")
async def schema_get(request):
    source_label = request.path_params["source_label"]
    all_sources = await get_all_sources()
    requested_source = [x for x in all_sources if x[0] == source_label][0]
    source_settings = await get_source_settings(source_label=source_label)

    if requested_source[1] == "database":
        table_name = request.path_params.get("table_name", None)
        cache_key = "schema.{}".format(source_label)
        cache_value = await read_from_redis(cache_key=cache_key)
        if cache_value:
            return OrJSONResponse(cache_value)
        response = await infer_schema(
            source_settings=source_settings, table_name=table_name
        )
        task = BackgroundTask(cache_to_redis, cache_key=cache_key, cache_value=response)
        return OrJSONResponse(response, background=task)
    elif requested_source[1] == "service":
        integration = all_services[requested_source[2]](**source_settings)
        return OrJSONResponse(
            {
                "columns": ["table_name", "columns"],
                "rows": [[x, []] for x in integration.resources.keys()],
            }
        )
