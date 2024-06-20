-- The chat table stores chats between humans and AI models
CREATE TABLE chat
(
    id                          INTEGER PRIMARY KEY,

    root_chat_id                INTEGER,
    role                        VARCHAR(60),
    message                     TEXT,

    requested_ai_model          VARCHAR(60),
    process_status              JSON,

    created_by_id               INTEGER,
    created_at                  DATETIME NOT NULL,
    FOREIGN KEY (root_chat_id) REFERENCES chat (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);
