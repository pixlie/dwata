-- Workflow table to store repeatable tasks

CREATE TABLE workflow
(
    id                      INTEGER PRIMARY KEY,

    title                   VARCHAR(120),
    summary                 TEXT,
    ai_model_id             INTEGER,

    created_by_id           INTEGER NOT NULL,
    created_at              DATETIME NOT NULL,
    FOREIGN KEY (ai_model_id) REFERENCES ai_model_used (id),
    FOREIGN KEY (created_by_id) REFERENCES user_account (id)
);

CREATE TABLE step_template
(
    id                              INTEGER PRIMARY KEY,

    workflow_id                     INTEGER,
    message                         TEXT NOT NULL,
    requested_content_format        JSONB,

    requested_ai_model_api_name     INTEGER
);
