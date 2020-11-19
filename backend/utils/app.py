from starlette.requests import Request
from starlette.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint


class DwataAppMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        request.app.state.IS_DWATA_APP = False
        request.app.state.DWATA_APP_NAME = None

        if (len(request.url.path) > len("/api/item/dwata_meta/dwata_meta") and
                request.url.path.startswith("/api/item/dwata_meta/dwata_meta")):
            request.app.state.IS_DWATA_APP = True
            request.app.state.DWATA_APP_NAME = request.url.path[len("/api/item/dwata_meta/dwata_meta_"):]

        return await call_next(request)
