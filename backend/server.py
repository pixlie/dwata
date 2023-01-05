from starlette.applications import Starlette
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.authentication import AuthenticationMiddleware

from utils.env_settings import settings
from utils.exceptions import exception_handlers
from middlewares.app import DwataAppMiddleware
from middlewares.setup import CheckSetupMiddleware
from utils.auth_backend import BearerTokenAuthenticationBackend
from utils.routes import routes

middlewares = [
    Middleware(CheckSetupMiddleware),
    Middleware(DwataAppMiddleware),
    Middleware(
        CORSMiddleware,
        allow_origins=settings.REQUEST_ORIGINS,
        allow_methods=["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allow_headers=["*"],
    ),
    Middleware(AuthenticationMiddleware, backend=BearerTokenAuthenticationBackend()),
]

app = Starlette(
    debug=settings.DEBUG,
    routes=routes,
    exception_handlers=exception_handlers,
    middleware=middlewares,
)
