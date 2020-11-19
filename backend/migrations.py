#!/usr/bin/env python
from migrate.versioning.shell import main

if __name__ == '__main__':
    main(repository='dwata_meta_migrations', url='sqlite:///dwata_meta.db', debug='False')
