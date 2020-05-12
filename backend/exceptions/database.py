from .base import DwataException


class DatabaseDriverNotInstalledException(DwataException):
    error_code = None
    message_code = None  # Todo: This allows us to generate l18n messages depending on user's locale
    message = None

    def __init__(self, error_code, message_code=None, message=None):
        self.error_code = error_code
        self.message = message
