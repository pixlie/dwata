-- The chat table stores chats between humans and AI models
CREATE TABLE chat
(
    id                          INTEGER PRIMARY KEY,

    previous_chat_id            INTEGER,
    message                     TEXT,
    requested_content_format    JSONB,
    tool_response               JSONB,
    is_system_chat              BOOL NOT NULL,
    requested_ai_model_id       INTEGER,
    is_processed_by_ai          BOOL,
    api_error_response          TEXT,

    created_by_id               INTEGER NOT NULL,
    created_at                  DATETIME NOT NULL,
    FOREIGN KEY (previous_chat_id) REFERENCES chat (id) ON DELETE CASCADE,
    FOREIGN KEY (requested_ai_model_id) REFERENCES ai_model_used (id),
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);
