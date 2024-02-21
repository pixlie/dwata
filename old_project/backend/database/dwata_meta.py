import databases


DWATA_META_DATABASE_URL = "sqlite:///dwata_meta.db"

dwata_meta_db = databases.Database(DWATA_META_DATABASE_URL)
