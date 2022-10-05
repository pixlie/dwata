import os
from dotenv import load_dotenv

from database.dwata_meta import dwata_meta_db
from apps.data_sources.models import data_sources


load_dotenv()


class DatabaseSettings(object):
    __results = None

    async def initialize(self):
        self.__results = await dwata_meta_db.fetch_all(
            data_sources.select().where(data_sources.c.source_type == "database")
        )

    def __getitem__(self, item):
        searched = next((x for x in self.__results if x[2] == item), None)
        if searched is None:
            raise KeyError
        return searched[3]

    def items(self):
        for x in self.__results:
            yield x[2], x[3]


class Settings(object):
    DEBUG = os.getenv("DEBUG", False)
    REQUEST_ORIGINS = [os.getenv("REQUEST_ORIGINS").split(",")]
    SECRET = os.getenv("SECRET")
    DATABASES = None

    def _set_services_settings(self):
        from services import all_services

        for name in all_services.keys():
            # For each supported service
            if name in self._settings.keys():
                # If that service has been configure by this business
                setattr(self, name.upper(), self._settings[name])

    async def initialize_databases(self):
        if self.DATABASES is None:
            db_settings = DatabaseSettings()
            await db_settings.initialize()
        self.DATABASES = db_settings


settings = Settings()
