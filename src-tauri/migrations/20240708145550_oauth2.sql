-- This table stores the OAuth2 credentials for third party services

CREATE TABLE oauth2
(
    id                          INTEGER PRIMARY KEY,

    provider                    VARCHAR(30) NOT NULL,
    client_id                   VARCHAR(255) NOT NULL,
    client_secret               VARCHAR(255),

    authorization_code          VARCHAR(255) NOT NULL,
    access_token                VARCHAR(255) NOT NULL,
    refresh_token               VARCHAR(255),
    identifier                  VARCHAR(255) NOT NULL,
    handle                      VARCHAR(255),

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME,
    UNIQUE(provider, identifier) ON CONFLICT ABORT
);
