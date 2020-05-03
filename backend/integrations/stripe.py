import aiohttp
from integrations.constants import api_constants


class ResourceCharges(object):
    needs_auth = True
    base_url = None
    request_method = "get"
    api_reference_url = "https://stripe.com/docs/api/charges"
    help = "Returns a list of charges you’ve previously created. The charges are returned in sorted order, with the" \
           " most recent charges appearing first."
    response_data_type = "json"

    def __init__(self, base_url):
        self.base_url = base_url

    @property
    def url(self):
        return "{}/v1/charges".format(self.base_url)


class Stripe(object):
    auth_method = api_constants.AUTH_METHOD_HTTP_BASIC
    base_url = "https://api.stripe.com"
    # base_path = ""
    resources = {
        "charges": ResourceCharges,
    }
    resource_names = []

    def __init__(self):
        self.resource_names = self.resources.keys()

    def get_http_login(self):
        return "sk_test_4eC39HqLyjWDarjtT1zdp7dc"

    def client_factory(self):
        params = {}
        if self.auth_method == api_constants.AUTH_METHOD_HTTP_BASIC:
            params["auth"] = aiohttp.BasicAuth(
                login=self.get_http_login()
            )
        return aiohttp.ClientSession(**params)

    def get_resource(self, resource_name):
        return self.resources[resource_name](
            base_url=self.base_url
        )
