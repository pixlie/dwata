from urllib.parse import urlparse

from utils.config import settings
from utils.response import RapidJSONResponse


async def source_get(request):
    """Get the list of data sources that have been configured"""
    sources = [urlparse(db) for db in settings.DATABASES]
    return RapidJSONResponse({
        "columns": [
            "label", "engine"
        ],
        "rows": [
            [db.path[1:], db.scheme] for db in sources
        ]
    })
