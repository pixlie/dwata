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

-- Copy the data from the old table to the new table
INSERT INTO chat_temp (id, root_chat_id, role, message, requested_ai_model, process_status, created_at)
SELECT id, root_chat_id, role, message, requested_ai_model, process_status, created_at
FROM chat;

-- Drop the old table
DROP TABLE chat;

-- Rename the new table to chat
ALTER TABLE chat_temp RENAME TO chat;
