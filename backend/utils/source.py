from urllib.parse import urlparse

from utils.config import settings


def get_all_sources():
    sources = [urlparse(db) for db in settings.DATABASES]
    integrations = [
        ["Stripe Primary", "stripe", "integration"],
        ["MailChimp @tshirts.de", "mailchimp", "integration"],
    ]
    return [[db.path[1:], db.scheme, "database"] for db in sources] + integrations
