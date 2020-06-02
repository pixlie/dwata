from .models import record_pin
from utils.settings import get_source_settings
from utils.database import connect_database


def required_setup_params():
    # Todo: Change source_index to source_label
    return [
        "source_index",
    ]


async def setup_app(source_index):
    # Todo: Change source_index to source_label
    settings = get_source_settings(source_index=source_index)
    engine, conn = await connect_database(db_url=settings["db_url"])
    record_pin.create(bind=engine)
