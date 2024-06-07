-- The chat table stores chats between humans and AI models
CREATE TABLE chat
(
    id                          INTEGER PRIMARY KEY,

    root_chat_id                INTEGER,
    role                        VARCHAR(60),
    message                     TEXT,
    requested_content_format    JSONB,
    tool_response               JSONB,
    is_system_chat              BOOL NOT NULL,
    requested_ai_model          VARCHAR(60),
    is_processed_by_ai          BOOL,
    api_error_response          TEXT,

    created_by_id               INTEGER,
    created_at                  DATETIME NOT NULL,
    FOREIGN KEY (root_chat_id) REFERENCES chat (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);
