-- The directory table stores information about
-- directories that we will look for files

CREATE TABLE directory
(
    id                  INTEGER PRIMARY KEY,
    path                VARCHAR(255),
    label               VARCHAR(30),
    include_patterns    JSONB,
    exclude_patterns    JSONB,
    created_by_id       INTEGER,
    created_at          DATETIME NOT NULL,
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);

-- CREATE TABLE chat_thread
-- (
--     id            INTEGER PRIMARY KEY,
--     json_data     JSONB,
--     created_by_id INTEGER  NOT NULL,
--     created_at    DATETIME NOT NULL,
--     FOREIGN KEY (created_by_id) REFERENCES user_account (id)
-- );

-- CREATE TABLE chat_reply
-- (
--     id             INTEGER PRIMARY KEY,
--     json_data      JSONB,
--     chat_thread_id INTEGER  NOT NULL,
--     created_by_id  INTEGER  NOT NULL,
--     created_at     DATETIME NOT NULL,
--     FOREIGN KEY (created_by_id) REFERENCES user_account (id),
--     FOREIGN KEY (chat_thread_id) REFERENCES chat_thread (id) ON DELETE CASCADE
-- );
