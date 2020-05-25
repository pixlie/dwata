from utils.response import RapidJSONResponse


async def capability_get():
    """Get the list of dwata provided capabilities that have been configured"""
    # Todo: this is a hack, please update in [ch162]
    return RapidJSONResponse({
        "columns": [
            "label", "is_enabled", "status"
        ],
        "rows": [
            ["notes", True, "in_use"]
        ]
    })
