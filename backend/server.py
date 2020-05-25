import uvicorn
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

from utils.config import settings
from utils.exceptions import web_exception_handlers
from endpoints.source import source_get
from endpoints.schema import schema_get
from endpoints.data import data_post
from endpoints.item import item_get
from endpoints.service import service_fetch
from endpoints.capability import capability_get


handlers = [
    Route(r"/api/source", source_get, methods=["GET"]),
    Route(r"/api/schema/{source_index:int}/{table_name:str}", schema_get, methods=["GET"]),
    Route(r"/api/schema/{source_index:int}", schema_get, methods=["GET"]),
    Route(r"/api/data/{source_index:int}/{table_name:str}", data_post, methods=["GET", "POST"]),
    Route(r"/api/item/{source_index:int}/{table_name:str}/{item_pk:int}", item_get, methods=["GET"]),
    Route(r"/api/service/{source_index:int}/{resource_name:str}", service_fetch, methods=["GET", "POST"]),
    Route(r"/api/capability", capability_get, methods=["GET"]),
]


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_methods=["OPTIONS", "GET", "POST"],
        allow_headers="Authorization,Access-Control-Allow-Headers,Origin,Accept,X-Requested-With"
                      ",Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers"
    )
]


# app = Starlette(debug=True, routes=handlers, exception_handlers=exception_handlers)
app = Starlette(debug=True, routes=handlers, middleware=middleware, exception_handlers=web_exception_handlers)


if __name__ == "__main__":
    uvicorn.run(app=app, host=settings.SERVER_HOST, port=settings.SERVER_PORT)
