from .models import record_pin
from utils.settings import get_source_settings
from utils.database import connect_database


async def setup_app(source_label):
    # Todo: Change source_label to source_label
    settings = get_source_settings(source_label=source_label)
    engine, conn = await connect_database(db_url=settings["db_url"])
    record_pin.create(bind=engine)
