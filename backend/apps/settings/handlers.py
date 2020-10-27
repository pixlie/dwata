from utils.http import RapidJSONResponse

from database.dwata_meta import dwata_meta_db
from .models import settings


async def settings_get(request):
    """Get all the settings by a hierarchy"""
    label_root = request.path_params["label_root"]
    query = settings.select().where(
        settings.c.label.like("{}%".format(label_root))
    )
    all_settings = await dwata_meta_db.fetch_all(query=query)
    return RapidJSONResponse({
        "columns": [
            "id", "label", "value", "created_at", "modified_at",
        ],
        "rows": all_settings
    })


async def settings_set(request):
    """Set a setting by its label and value"""
    request_payload = await request.json()

