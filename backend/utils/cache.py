from datetime import datetime
import aioredis
import orjson

from utils.env_settings import settings


async def cache_to_redis(cache_key, cache_value):
    redis = await aioredis.Redis.from_url("redis://localhost")
    await redis.set("result-{}".format(cache_key), orjson.dumps(cache_value))


async def read_from_redis(cache_key, fresh_within=600, raw_value=False):
    redis = await aioredis.Redis.from_url("redis://localhost")
    cache_value = await redis.get("result-{}".format(cache_key))
    if cache_value is None:
        return cache_value
    if raw_value:
        return cache_value
    else:
        cache_value = orjson.loads(cache_value)
        if (
            datetime.utcnow() - datetime.fromisoformat(cache_value[1])
        ).total_seconds() < fresh_within:
            return cache_value[0]


async def get_redis() -> aioredis.Redis:
    redis = await aioredis.Redis.from_url(settings.REDIS_HOST)
    return redis
