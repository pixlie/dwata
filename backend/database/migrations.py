from migrate.versioning.api import upgrade


def run_migrations():
    upgrade("sqlite://dwata_meta.db", "dwata_meta_migrations")
