import os
from dotenv import load_dotenv

load_dotenv()


class Settings(object):
    DEBUG = os.getenv("DEBUG", False)
    REQUEST_ORIGINS = [
        x for x in os.getenv("REQUEST_ORIGINS").split(",") if x != ""
    ] or None
    SECRET = os.getenv("SECRET")
    DATABASES = [x for x in os.getenv("DATABASES").split(",") if x != ""]
    DATABASE_LABELS = [x for x in os.getenv("DATABASE_LABELS").split(",") if x != ""]
    REDIS_HOST = os.getenv("REDIS_HOST")
    AUTHENTICATION_METHODS = [
        x for x in os.getenv("AUTHENTICATION_METHODS").split(",") if x != ""
    ] or None
    ADMIN_EMAILS = [x for x in os.getenv("ADMIN_EMAILS").split(",") if x != ""] or None
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


settings = Settings()
