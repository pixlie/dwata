import sys
from decouple import config


class Settings(object):
    _instance = None

    def __init__(self):
        config.search_path = sys.path[0]

        # Settings for running the server on localhost with port number
        self.SERVER_HOST = config("SERVER_HOST", cast=str, default="127.0.0.1")
        self.SERVER_PORT = config("SERVER_PORT", cast=int, default=12121)

        self.DATABASES = config(
            "DATABASES",
            cast=lambda v: [s.strip() for s in v.split(',')],
            default="postgresql://username:password@localhost/sample_db"
        )

        self.ALLOWED_ORIGINS = config(
            "ALLOWED_ORIGINS",
            cast=lambda v: [s.strip() for s in v.split(',')],
            default="http://localhost:12122,"
        )


settings = Settings()
