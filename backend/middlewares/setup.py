from starlette.requests import Request
from starlette.types import ASGIApp, Receive, Scope, Send, Message
from starlette.datastructures import MutableHeaders
import orjson
import functools

from utils.env_settings import settings


required_dwata_backend_env_settings = [
    "DATABASES",
    "REQUEST_ORIGINS",
    "AUTHENTICATION_METHODS",
    "ADMIN_EMAILS",
]


class CheckSetupMiddleware:
    """
    This middleware checks if dwata is set up properly (at least minimally) on every request.
    Generally this means that there is at least:
     - an authentication method
     - request origin
     - one database
     - admin email
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        request = Request(scope=scope)

        if request.method == "OPTIONS":
            # We allow HTTPS OPTIONS requests to go ahead even if setup is incomplete
            await self.app(scope, receive, send)
            return

        is_complete = True
        for key in required_dwata_backend_env_settings:
            if (
                not hasattr(settings, key)
                or getattr(settings, key) is None
                or getattr(settings, key) == ""
            ):
                # await SetupIsIncomplete().json_response()(scope, receive, send)
                is_complete = False

        if settings.AUTHENTICATION_METHODS == ["sign_in_with_google"] and (
            not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET
        ):
            is_complete = False

        if is_complete:
            await self.app(scope, receive, send)
        else:
            await self.send_error_response(scope, receive, send)

    async def send_error_response(self, scope: Scope, receive: Receive, send: Send):
        modified_send = functools.partial(self.send, send=send)
        await self.app(scope, receive, modified_send)

    async def send(self, message: Message, send: Send):
        """
        We have this inner send method to modify the response body but keep the headers from CORS, else browsers
        will have an error.
        """
        body = orjson.dumps(
            {
                "status": "error",
                "detail": {
                    "error_code": "setup_is_incomplete",
                    "message": "Please finish the setup of dwata",
                },
            },
        )
        if message["type"] == "http.response.start":
            message["status"] = 400
            headers = MutableHeaders(scope=message)
            headers["Content-Length"] = str(len(body))

        if message["type"] == "http.response.body":
            message["body"] = body

        await send(message)
