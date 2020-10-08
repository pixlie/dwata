from starlette.exceptions import HTTPException
from starlette.background import BackgroundTask

from utils.response import RapidJSONResponse
from utils.settings import get_all_sources, get_source_settings
from utils.cache import read_from_redis, cache_to_redis
from services import all_services


async def worker_dispatch(request):
    worker_name = request.path_params["worker_name"]

    return RapidJSONResponse({
        "columns": columns,
        "rows": rows
    }, background=task)
