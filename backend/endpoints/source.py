from utils.response import RapidJSONResponse
from utils.source import get_all_sources


async def source_get(request):
    """Get the list of data sources that have been configured"""
    return RapidJSONResponse({
        "columns": [
            "label", "type", "provider"
        ],
        "rows": get_all_sources()
    })
