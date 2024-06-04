-- The user_account table stores basic information about
-- the first (and other) user(s) and AI agents (mentions is chat)
CREATE TABLE user_account
(
    id                  INTEGER PRIMARY KEY,

    first_name          VARCHAR(60),
    last_name           VARCHAR(60),
    email               VARCHAR(255),
    username            VARCHAR(30) UNIQUE,
    is_system_user      BOOL,

    created_at          DATETIME NOT NULL,
    modified_at         DATETIME
);
