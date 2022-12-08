import base64
import binascii
from starlette.authentication import (
    AuthenticationBackend,
    AuthCredentials,
)
from starlette.requests import Request
import jwt

from utils.env_settings import settings
from apps.auth.user import AuthenticatedUser


class BearerTokenAuthBackend(AuthenticationBackend):
    async def authenticate(self, request: Request):
        if "Authorization" not in request.headers:
            return

        auth = request.headers["Authorization"]
        try:
            scheme, credentials = auth.split()
            if scheme.lower() != "bearer":
                return
            decoded = base64.b64decode(credentials).decode("ascii")
        except (ValueError, UnicodeDecodeError, binascii.Error):
            return

        payload = jwt.decode(decoded, settings.SECRET, algorithms=["HS256"])
        return AuthCredentials(["authenticated"]), AuthenticatedUser(id=payload["id"])
