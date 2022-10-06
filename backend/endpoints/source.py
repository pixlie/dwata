from starlette.requests import Request

from utils.http import OrJSONResponse
from utils.settings import get_all_sources


async def source_get(request: Request):
    """Get the list of data sources that have been configured"""
    all_sources = await get_all_sources()
    return OrJSONResponse(
        {
            "columns": [
                "label",
                "type",
                "provider",
                "properties",
            ],
            "rows": all_sources,
        }
    )
