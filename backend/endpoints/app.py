from importlib import import_module
from json.decoder import JSONDecodeError

from utils.response import RapidJSONResponse, web_error


async def app_get(_):
    """
    Get the list of dwata provided capabilities that have been configured
    """
    # Todo: this is a hack, please update in [ch162]
    return RapidJSONResponse({
        "columns": [
            "label", "is_enabled", "config"
        ],
        "rows": [
            ["note", True, {
                "in_use": True,
                "source_id": 0,
                "table_name": "admin_meta_note",
            }],
            ["record_pin", True, {
                "in_use": True,
                "source_id": 0,
                "table_name": "admin_record_pin",
            }],
            ["saved_query_specification", True, {
                "in_use": True,
                "source_id": 0,
                "table_name": "admin_meta_saved_query_specification",
            }],
        ]
    })


async def app_setup(request):
    """
    This method is used to setup an app, usually by creating the table(s) that the app needs
    """
    app_name = request.path_params["app_name"]
    module = import_module("apps.{}.setup".format(app_name))
    setup_params = {}
    if hasattr(module, "required_setup_params"):
        required_setup_params = getattr(module, "required_setup_params")()
        try:
            setup_params = await request.json()
        except JSONDecodeError:
            return web_error(
                error_code="request.json_decode_error",
                message="We could not handle that request, perhaps something is wrong with the server."
            )
        if len([x for x in required_setup_params if x not in setup_params.keys()]) > 0:
            return web_error(
                error_code="request.params_mismatch",
                message="Setting up {} app needs parameters that have not been specified".format(app_name)
            )

    await getattr(module, "setup_app")(**setup_params)
    return RapidJSONResponse({
        "status": "success"
    })


async def app_uninstall(request):
    """
    This method is used to setup an app, usually by creating the table(s) that the app needs
    """
    app_name = request.path_params["app_name"]
    module = import_module("apps.{}.setup".format(app_name))
    uninstall_params = {}
    if hasattr(module, "required_uninstall_params"):
        required_uninstall_params = getattr(module, "required_uninstall_params")()
        try:
            uninstall_params = await request.json()
        except JSONDecodeError:
            return web_error(
                error_code="request.json_decode_error",
                message="We could not handle that request, perhaps something is wrong with the server."
            )
        if len([x for x in required_uninstall_params if x not in uninstall_params.keys()]) > 0:
            return web_error(
                error_code="request.params_mismatch",
                message="Setting up {} app needs parameters that have not been specified".format(app_name)
            )

    await getattr(module, "uninstall_app")(**uninstall_params)
    return RapidJSONResponse({
        "status": "success"
    })
