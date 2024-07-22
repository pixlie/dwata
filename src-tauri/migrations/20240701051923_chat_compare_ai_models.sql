-- Add a column to the chat table to store the ID of the chat that was compared to

CREATE TABLE chat_temp
(
    id                          INTEGER PRIMARY KEY,

    root_chat_id                INTEGER,
    compared_to_root_chat_id    INTEGER,
    role                        VARCHAR(60),
    message                     TEXT,

    requested_ai_model          VARCHAR(60),
    process_status              JSON,

    created_at                  DATETIME NOT NULL,

    FOREIGN KEY (root_chat_id) REFERENCES chat_temp (id) ON DELETE CASCADE
    FOREIGN KEY (compared_to_root_chat_id) REFERENCES chat_temp (id) ON DELETE CASCADE
);
