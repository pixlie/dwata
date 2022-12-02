from starlette.requests import Request
from google.auth import jwt
import orjson

from utils.config import settings
from utils.cache import get_redis
from utils.http import OrJSONResponse


async def authenticate_with_google(request: Request) -> OrJSONResponse:
    """
    In order to authenticate with Google, we check for an email address where Google is authoritative.
    We use Sign in with Google widget in the frontend, and it returns a JWT.
    https://developers.google.com/identity/gsi/web/reference/js-reference#credential

    We decode this JWT using:
    https://googleapis.dev/python/google-auth/latest/reference/google.auth.jwt.html#module-google.auth.jwt
    """
    request_payload = await request.json()
    # TODO: Validate the JWT
    decoded = jwt.decode(request_payload["credential"], verify=False)
    supported_email = False
    if decoded["email"].endswith("@gmail.com"):
        supported_email = True
    elif decoded["email_verified"] is True and decoded.get("hd", None) is not None:
        supported_email = True

    cached = {
        "is_authenticated": supported_email,
        "is_admin": decoded["email"] in settings.ADMIN_EMAILS,
        "email": decoded["email"],
    }

    if supported_email:
        redis = await get_redis()
        await redis.set(
            "auth/{}".format(request_payload["credential"]), orjson.dumps(cached)
        )

    return OrJSONResponse(cached)
