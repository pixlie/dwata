from starlette.exceptions import HTTPException
from starlette.background import BackgroundTask

from utils.response import RapidJSONResponse
from utils.settings import get_all_sources, get_source_settings
from utils.cache import read_from_redis, cache_to_redis
from services import all_services


async def service_fetch(request):
    source_label = request.path_params["source_label"]
    resource_name = request.path_params["resource_name"]
    requested_source = [x for x in get_all_sources() if x[0] == source_label][0]
    source_settings = get_source_settings(source_label=source_label)
    service = all_services[requested_source[2]](**source_settings)

    async with service.client_factory() as session:
        resource = service.get_resource(resource_name=resource_name)
        cache_key = "{}.{}.{}".format(source_label, resource_name, resource.url)
        cache_value = await read_from_redis(cache_key=cache_key)
        if cache_value:
            return RapidJSONResponse(cache_value)

        async with session.get(resource.url) as resp:
            if resource.response_data_type == "json":
                payload = await resp.json()
                columns = list(payload["lists"][0].keys())
                rows = [list(row.values()) for row in payload["lists"]]
                task = BackgroundTask(
                    cache_to_redis,
                    cache_key=cache_key,
                    cache_value={
                        "columns": columns,
                        "rows": rows
                    }
                )
                return RapidJSONResponse({
                    "columns": columns,
                    "rows": rows
                }, background=task)
            else:
                HTTPException(
                    status_code=500
                )
