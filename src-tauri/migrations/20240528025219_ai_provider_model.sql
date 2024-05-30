-- This table stores the AI providers

CREATE TABLE ai_integration
(
    id                  INTEGER PRIMARY KEY,
    label               VARCHAR(30),
    ai_provider         VARCHAR(30) NOT NULL,
    api_key             VARCHAR(255),
    endpoint_url        VARCHAR(255),

    created_at          DATETIME NOT NULL,
    modified_at         DATETIME
);
