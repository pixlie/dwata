import os
import toml


class Settings(object):
    _settings = {}  # settings.toml parsed as Python dictionary
    SERVER_HOST = None
    SERVER_PORT = None
    ALLOWED_ORIGINS = []
    DATABASES = {}

    # All supported services will be initialized like:
    # MAILCHIMP = {}
    # STRIPE = {}

    def _database_settings(self):
        return self._settings.get("database", {})

    def _set_services_settings(self):
        from services import all_services
        for name in all_services.keys():
            # For each supported service
            if name in self._settings.keys():
                # If that service has been configure by this business
                setattr(self, name.upper(), self._settings[name])

    def __init__(self, settings_raw=None):
        # All supported services, initialized to an empty dictionary
        from services import all_services
        for name in all_services.keys():
            setattr(self, name.upper(), {})

        if settings_raw is None:
            settings_raw = open(os.path.abspath(os.path.join(os.path.curdir, "settings.toml"))).read()
        self._settings = toml.loads(settings_raw)

        # Settings for running the server on localhost with port number
        self.SERVER_HOST = self._settings.get("server_host", "127.0.0.1")
        self.SERVER_PORT = self._settings.get("dwata", {}).get("server_port", 12121)
        self.DATABASES = self._database_settings()
        self.ALLOWED_ORIGINS = self._settings.get("allowed_origins", [
            "http://localhost:12122"
        ])
        self._set_services_settings()


settings = Settings()
