-- The user_account table stores basic information about
-- the first user (desktop user) and AI agents (mentions is chat)

CREATE TABLE user_account
(
    id                  INTEGER PRIMARY KEY,
    first_name          VARCHAR(60),
    last_name           VARCHAR(60),
    email               VARCHAR(255),
    is_system_user      BOOL,
    created_at          DATETIME NOT NULL
);
