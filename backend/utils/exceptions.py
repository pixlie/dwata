from .response import RapidJSONResponse
from exceptions.base import DwataException


# Exception handling for our base Exception class
# Refer: https://www.starlette.io/exceptions/
async def handle_dwata_exception(request, exc):
    return RapidJSONResponse({
        "error_code": exc.error_code,
        "message": exc.message
    })


web_exception_handlers = {
    DwataException: handle_dwata_exception
}
