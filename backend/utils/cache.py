import aioredis
import json

from utils.env_settings import settings


async def cache_to_redis(cache_key, cache_value):
    redis = await aioredis.Redis.from_url(settings.REDIS_HOST)
    await redis.set(f"result-{cache_key}", json.dumps(cache_value))


async def read_from_redis(cache_key):
    redis = await aioredis.Redis.from_url(settings.REDIS_HOST)
    cache_value = await redis.get(f"result-{cache_key}")
    return json.loads(cache_value)


async def get_redis() -> aioredis.Redis:
    redis = await aioredis.Redis.from_url(settings.REDIS_HOST)
    return redis
