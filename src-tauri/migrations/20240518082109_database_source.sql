-- This table stores database sources that are connected to Dwata

CREATE TABLE database_source
(
    id                          INTEGER PRIMARY KEY,

    label                       VARCHAR(30),
    database_type               VARCHAR(30) NOT NULL,
    database_name               VARCHAR(255),
    path_to_local_database      TEXT,

    database_host               TEXT,
    database_port               INTEGER,
    database_username           VARCHAR(255),
    database_password           VARCHAR(255),
    database_api_key            TEXT,

    ssh_host                    TEXT,
    ssh_port                    INTEGER,
    ssh_username                VARCHAR(255),
    ssh_password                VARCHAR(255),
    ssh_key_path                VARCHAR(255),

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME
);
