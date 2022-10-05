from .http import OrJSONResponse
from exceptions.base import DwataException


# Exception handling for our base Exception class
# Refer: https://www.starlette.io/exceptions/
async def handle_dwata_exception(request, exc):
    return OrJSONResponse({
        "error_code": exc.error_code,
        "message": exc.message
    })


web_exception_handlers = {
    DwataException: handle_dwata_exception
}
