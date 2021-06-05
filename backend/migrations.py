#!/usr/bin/env python
from migrate.versioning.shell import main

from utils.config import settings


if __name__ == '__main__':
    main(
        repository="dwata_meta_migrations",
        url=settings.DWATA_META_DATABASE_URL,
        debug=True if settings.TESTING else False
    )
