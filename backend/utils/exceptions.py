from starlette.requests import Request

from exceptions.base import ExceptionBase


# Exception handling for our base Exception class
# Refer: https://www.starlette.io/exceptions/
async def handle_exception(request: Request, exc: ExceptionBase):
    return exc.json_response()


exception_handlers = {ExceptionBase: handle_exception, 500: handle_exception}
