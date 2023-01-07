from starlette.requests import Request
from starlette.responses import JSONResponse

from utils.settings import get_all_sources


async def source_get(request: Request):
    """Get the list of data sources that have been configured"""
    all_sources = await get_all_sources()
    return JSONResponse(
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
