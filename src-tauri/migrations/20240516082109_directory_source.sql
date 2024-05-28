-- This table stores all the directories that we will look for files

CREATE TABLE directory_source
(
    id                  INTEGER PRIMARY KEY,
    path                VARCHAR(255),
    label               VARCHAR(30),

    include_patterns    JSONB,
    exclude_patterns    JSONB,

    created_at          DATETIME NOT NULL,
    modified_at         DATETIME
);
