import uvicorn
from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.routing import Route

from utils.config import settings
from endpoints.source import source_get
from endpoints.schema import schema_get


handlers = [
    Route(r"/api/source/", source_get),
    Route(r"/api/schema/{source_index:int}/{table_name:str}", schema_get),
    Route(r"/api/schema/{source_index:int}", schema_get),
    # Route(r"/api/data/", CategorySolutionEndpoint),
]


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS,
        allow_methods=["OPTIONS", "GET"],
        allow_headers="Authorization,Access-Control-Allow-Headers,Origin,Accept,X-Requested-With"
                      ",Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers"
    )
]


# app = Starlette(debug=True, routes=handlers, exception_handlers=exception_handlers)
app = Starlette(debug=True, routes=handlers, middleware=middleware)


if __name__ == "__main__":
    uvicorn.run(app=app, host=settings.SERVER_HOST, port=settings.SERVER_PORT)
