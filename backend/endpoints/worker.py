import importlib
from starlette.exceptions import HTTPException
from starlette.background import BackgroundTask

from utils.http import RapidJSONResponse


STATUS_QUEUED = "status_queued"


async def worker_background(request):
    app_name = request.path_params["app_name"]
    worker_name = request.path_params["worker_name"]

    try:
        worker = importlib.import_module("apps.{}.workers".format(app_name))
    except ImportError:
        raise HTTPException(status_code=404)

    if not hasattr(worker, worker_name):
        raise HTTPException(status_code=404)

    payload = await request.json()
    task = BackgroundTask(getattr(worker, worker_name), **payload)
    return RapidJSONResponse({
        "status": STATUS_QUEUED,
    }, background=task)


async def worker_execute(request):
    app_name = request.path_params["app_name"]
    worker_name = request.path_params["worker_name"]

    try:
        worker = importlib.import_module("apps.{}.workers".format(app_name))
    except ImportError:
        raise HTTPException(status_code=404)

    if not hasattr(worker, worker_name):
        raise HTTPException(status_code=404)

    payload = await request.json()
    response = await getattr(worker, worker_name)(**payload)
    return RapidJSONResponse(response)
