from starlette.applications import Starlette
from starlette.middleware import Middleware
# from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

from database.dwata_meta import dwata_meta_db
from utils.exceptions import web_exception_handlers
from utils.app import DwataAppMiddleware
from endpoints.source import source_get
from endpoints.schema import schema_get
from endpoints.data import data_post
from endpoints.item import item_get, item_post, item_put
from endpoints.service import service_fetch
from endpoints.worker import worker_background, worker_execute
from apps.settings.handlers import settings_get


handlers = [
    # Get a list of settings (labels, values) given the label path
    Route(r"/api/settings/{label_root}", settings_get, methods=["GET"]),

    # Finding out what data sources exist
    Route(r"/api/source", source_get, methods=["GET"]),

    # Asking for the schema of databases/tables
    Route(r"/api/schema/{source_label:str}/{table_name:str}", schema_get, methods=["GET"]),
    Route(r"/api/schema/{source_label:str}", schema_get, methods=["GET"]),

    # Requesting actual data, this is POST request since the request payload is JSON object
    Route(r"/api/data", data_post, methods=["GET", "POST"]),

    # Handlers to work on single items, usually accesses using a PK
    Route(r"/api/item/{source_label:str}/{table_name:str}/{item_pk:int}", item_get, methods=["GET"]),
    Route(r"/api/item/{source_label:str}/{table_name:str}/{item_pk:str}", item_get, methods=["GET"]),
    Route(r"/api/item/{source_label:str}/{table_name:str}/{item_pk:int}", item_put, methods=["PUT"]),
    Route(r"/api/item/{source_label:str}/{table_name:str}/{item_pk:str}", item_put, methods=["PUT"]),
    Route(r"/api/item/{source_label:str}/{table_name:str}", item_get, methods=["GET"]),
    Route(r"/api/item/{source_label:str}/{table_name:str}", item_post, methods=["POST"]),

    # Handlers for working with external services through async HTTP requests
    Route(r"/api/service/{source_label:str}/{resource_name:str}", service_fetch, methods=["GET", "POST"]),

    # Call a worker in a background job that executes after HTTP response is sent out
    Route(r"/api/background/{app_name:str}/{worker_name:str}", worker_background, methods=["POST"]),
    # `await` a worker in the HTTP request, thus returning the response of the worker
    Route(r"/api/execute/{app_name:str}/{worker_name:str}", worker_execute, methods=["POST"]),
]


middlewares = [
    Middleware(DwataAppMiddleware),
]
"""
Middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["OPTIONS", "GET", "POST", "PUT"],
    allow_headers="Authorization,Access-Control-Allow-Headers,Origin,Accept,X-Requested-With"
                  ",Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers"
),
"""

app = Starlette(
    debug=True,
    on_startup=[dwata_meta_db.connect],
    on_shutdown=[dwata_meta_db.disconnect],
    routes=handlers,
    middleware=middlewares,
    exception_handlers=web_exception_handlers
)
