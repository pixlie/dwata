from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from utils.config import settings
from exceptions.setup import SetupIsIncomplete


required_dwata_backend_env_settings = [
    "DATABASES",
    "REQUEST_ORIGINS",
    "AUTHENTICATION_METHODS",
    "ADMIN_EMAILS",
]


class SetupMiddleware(BaseHTTPMiddleware):
    """
    This middleware checks if dwata is set up properly (at least minimally) on every request.
    Generally this means that there is at least:
     - an authentication method
     - request origin
     - one database
     - admin email
    """

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        for key in required_dwata_backend_env_settings:
            if not hasattr(settings, key) or getattr(settings, key) is None:
                return SetupIsIncomplete().http_response()

        if settings.AUTHENTICATION_METHODS == ["sign_in_with_google"] and (
            not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET
        ):
            return SetupIsIncomplete().http_response()

        return await call_next(request)
