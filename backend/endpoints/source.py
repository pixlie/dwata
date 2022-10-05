from starlette.requests import Request
from starlette.authentication import requires

from utils.http import RapidJSONResponse
from utils.settings import get_all_sources


@requires("authenticated")
async def source_get(request: Request):
    """Get the list of data sources that have been configured"""
    all_sources = await get_all_sources()
    return RapidJSONResponse(
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
