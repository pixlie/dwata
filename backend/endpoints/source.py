from utils.response import RapidJSONResponse
from utils.settings import get_all_sources


async def source_get(request):
    """Get the list of data sources that have been configured"""
    all_sources = await get_all_sources()
    return RapidJSONResponse({
        "columns": [
            "label", "type", "provider", "properties",
        ],
        "rows": all_sources
    })
