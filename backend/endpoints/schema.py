from utils.response import RapidJSONResponse
from utils.settings import get_all_sources, get_source_settings, get_source_database
from services import all_services


async def schema_get(request):
    source_label = request.path_params["source_label"]
    requested_source = [x for x in get_all_sources() if x[0] == source_label][0]
    source_settings = get_source_settings(source_label=source_label)

    if requested_source[1] == "database":
        table_name = request.path_params.get("table_name", None)
        response = await get_source_database(
            source_settings=source_settings,
            table_name=table_name
        )
        return response
    elif requested_source[1] == "service":
        integration = all_services[requested_source[2]](**source_settings)
        return RapidJSONResponse({
            "columns": ["table_name", "columns"],
            "rows": [[x, []] for x in integration.resources.keys()]
        })
