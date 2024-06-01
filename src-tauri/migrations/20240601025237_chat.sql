-- Add migration script here

CREATE TABLE chat_thread
(
    id                      INTEGER PRIMARY KEY,

    title                   VARCHAR(120) NOT NULL,
    summary                 TEXT,
    labels                  JSONB,
    ai_model_id             INTEGER,

    created_by_id           INTEGER NOT NULL,
    created_at              DATETIME NOT NULL,
    FOREIGN KEY (ai_model_id) REFERENCES ai_model_used (id),
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);

CREATE TABLE chat_reply
(
    id                          INTEGER PRIMARY KEY,

    chat_thread_id              INTEGER NOT NULL,
    message                     TEXT,
    requested_content_format    JSONB,
    tool_response               JSONB,
    is_system_chat              BOOL,
    ai_model_id                 INTEGER,
    is_processed_by_ai          BOOL,
    api_error_response          TEXT,

    created_by_id               INTEGER NOT NULL,
    created_at                  DATETIME NOT NULL,
    FOREIGN KEY (chat_thread_id) REFERENCES chat_thread (id) ON DELETE CASCADE,
    FOREIGN KEY (ai_model_id) REFERENCES ai_model_used (id),
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);
