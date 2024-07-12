-- This table stores the email account details

CREATE TABLE email_account
(
    id                          INTEGER PRIMARY KEY,

    provider                    VARCHAR(30) NOT NULL,
    email_address               VARCHAR(255) NOT NULL,
    password                    VARCHAR(255),
    oauth2_id                   INTEGER,

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME,

    FOREIGN KEY (oauth2_id) REFERENCES oauth2 (id) ON DELETE SET NULL,
    UNIQUE(provider, email_address) ON CONFLICT ABORT
);
