import aiohttp
from services.constants import api_constants


class ResourceList(object):
    needs_auth = True
    base_url = None
    request_method = "get"
    api_reference_url = "https://mailchimp.com/developer/reference/lists/"
    help = "Your Mailchimp list, also known as your audience, is where you store and manage all of your contacts."
    response_data_type = "json"

    def __init__(self, base_url):
        self.base_url = base_url

    @property
    def url(self):
        return "{}/lists".format(self.base_url)


class Mailchimp(object):
    auth_method = api_constants.AUTH_METHOD_HTTP_BASIC
    base_url = "https://{data_center}.api.mailchimp.com/3.0/"
    response_data_type = "json"
    resources = {
        "lists": ResourceList,
    }
    resource_names = []
    _settings = {}

    def __init__(self, settings):
        self.resource_names = self.resources.keys()
        self._settings = settings
        api_key_parts = self._settings["api_key"].split("-")
        self.base_url = self.base_url.format(data_center=api_key_parts[1])

    @property
    def auth(self):
        return aiohttp.BasicAuth(
                login="dwata",
                password=self._settings["api_key"]
            )

    def client_factory(self):
        params = {}
        if self.auth_method == api_constants.AUTH_METHOD_HTTP_BASIC:
            params["auth"] = self.auth
        return aiohttp.ClientSession(**params)

    def get_resource(self, resource_name):
        return self.resources[resource_name](
            base_url=self.base_url
        )
