from utils.response import RapidJSONResponse


async def capability_get(_):
    """Get the list of dwata provided capabilities that have been configured"""
    # Todo: this is a hack, please update in [ch162]
    return RapidJSONResponse({
        "columns": [
            "label", "is_enabled", "properties"
        ],
        "rows": [
            ["notes", True, {
                "in_use": True,
                "source_id": 0,
                "table_name": "admin_meta_notes",
            }]
        ]
    })
