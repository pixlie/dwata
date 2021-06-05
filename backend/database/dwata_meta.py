import databases

from utils.config import settings


dwata_meta_db = databases.Database(
    settings.DWATA_META_DATABASE_URL,
    force_rollback=True if settings.TESTING else False
)
