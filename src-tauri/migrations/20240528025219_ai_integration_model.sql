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

-- This table stores all the AI models that are or have been used so as to be able to refer to them
CREATE TABLE ai_model_used
(
    id                  INTEGER PRIMARY KEY,
    label               VARCHAR(30),
    ai_provider         VARCHAR(30) NOT NULL,
    ai_integration_id   INTEGER NOT NULL,
    api_name            VARCHAR(60),

    created_at          DATETIME NOT NULL,
    FOREIGN KEY (ai_integration_id) REFERENCES ai_integration (id)
);
