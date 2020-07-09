from .models import note
from utils.settings import get_source_settings
from utils.database import connect_database


def required_setup_params():
    # Todo: Change source_label to source_label
    return [
        "source_label",
    ]


async def setup_app(source_label):
    # Todo: Change source_label to source_label
    settings = get_source_settings(source_label=source_label)
    engine, conn = await connect_database(db_url=settings["db_url"])
    note.create(bind=engine)
