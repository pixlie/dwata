from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware

from utils.config import settings
from utils.exceptions import exception_handlers
from middlewares.app import DwataAppMiddleware
from middlewares.setup import SetupMiddleware
from utils.auth_backend import BearerTokenAuthBackend
from utils.routes import routes

middlewares = [
    Middleware(SetupMiddleware),
    Middleware(DwataAppMiddleware),
    Middleware(
        CORSMiddleware,
        allow_origins=settings.REQUEST_ORIGINS,
        allow_methods=["OPTION", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    ),
    Middleware(AuthenticationMiddleware, backend=BearerTokenAuthBackend()),
]

app = Starlette(
    debug=settings.DEBUG,
    routes=routes,
    exception_handlers=exception_handlers,
    middleware=middlewares,
)
