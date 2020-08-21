from datetime import datetime
import aioredis
import rapidjson

from utils.response import RapidJSONEncoder


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
