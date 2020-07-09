from datetime import datetime
from starlette.exceptions import HTTPException
from starlette.background import BackgroundTask
import aioredis
import rapidjson

from utils.response import RapidJSONResponse, RapidJSONEncoder
from utils.settings import get_all_sources, get_source_settings
from services import all_services


async def cache_to_redis(cache_key, cache_value):
    redis = await aioredis.create_redis_pool("redis://localhost")
    await redis.set("result-{}".format(cache_key), RapidJSONEncoder().encode((
        cache_value,
        datetime.utcnow()
    )).encode("utf-8"))


async def read_from_redis(cache_key, fresh_within=600, raw_value=False):
    redis = await aioredis.create_redis_pool("redis://localhost")
    cache_value = await redis.get("result-{}".format(cache_key), encoding="utf-8")
    if cache_value is None:
        return cache_value
    if raw_value:
        return cache_value
    else:
        cache_value = rapidjson.loads(cache_value)
        if (datetime.utcnow() - datetime.fromisoformat(cache_value[1])).total_seconds() < fresh_within:
            return cache_value[0]


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
