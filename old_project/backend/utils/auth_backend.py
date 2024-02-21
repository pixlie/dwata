from starlette.authentication import (
    AuthenticationBackend,
    AuthCredentials,
)
from starlette.requests import Request
from google.auth import jwt

from utils.env_settings import settings
from apps.auth.user import AuthenticatedUser


class BearerTokenAuthenticationBackend(AuthenticationBackend):
    async def authenticate(self, request: Request):
        if "Authorization" not in request.headers:
            return

        auth = request.headers["Authorization"]
        scheme, credentials = auth.split()
        if scheme.lower() != "bearer":
            return
        decoded = jwt.decode(credentials, verify=False)

        return AuthCredentials(["authenticated"]), AuthenticatedUser(
            identity=decoded["email"]
        )
