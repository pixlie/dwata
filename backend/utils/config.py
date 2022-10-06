import os
from dotenv import load_dotenv

load_dotenv()


class Settings(object):
    DEBUG = os.getenv("DEBUG", False)
    REQUEST_ORIGINS = [x for x in os.getenv("REQUEST_ORIGINS").split(",") if x != ""]
    SECRET = os.getenv("SECRET")
    DATABASES = [x for x in os.getenv("DATABASES").split(",") if x != ""]
    AUTHENTICATION_METHODS = [x for x in os.getenv("AUTHENTICATION_METHODS").split(",") if x != ""]


settings = Settings()
