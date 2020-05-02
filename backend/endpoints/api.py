from starlette.exceptions import HTTPException

from utils.response import RapidJSONResponse
from utils.source import get_all_sources
from integrations import all_integrations


async def api_fetch(request):
    all_sources = get_all_sources()
    source_index = request.path_params["source_index"]
    resource_name = request.path_params["resource_name"]
    requested_source = all_sources[source_index]
    integration = all_integrations[requested_source[1]]()

    async with integration.client_factory() as session:
        async with session.get("{}/v1/charges".format(integration.base_url)) as resp:
            if integration.response_data_type == "json":
                payload = await resp.json()
                columns = list(payload["data"][0].keys())
                rows = [list(row.values()) for row in payload["data"]]
                return RapidJSONResponse({
                    "columns": columns,
                    "rows": rows
                })
            else:
                HTTPException(
                    status_code=500
                )
