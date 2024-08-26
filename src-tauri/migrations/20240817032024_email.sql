-- This table stores emails after they are parsed from the local storage

CREATE TABLE email
(
    id                          INTEGER PRIMARY KEY,

    uid                         INTEGER NOT NULL,
    mailbox_id                  INTEGER NOT NULL,

    from_email_address          VARCHAR(255) NOT NULL,
    from_contact_id             INTEGER,

    date                        INTEGER NOT NULL,
    subject                     VARCHAR(255) NOT NULL,
    body_text                   TEXT,

    message_id                  VARCHAR(255),
    in_reply_to                 JSON,

    parent_email_id             INTEGER,

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME,

    FOREIGN KEY (mailbox_id) REFERENCES mailbox (id) ON DELETE CASCADE,
    FOREIGN KEY (from_contact_id) REFERENCES contact (id) ON DELETE CASCADE,
    FOREIGN KEY (parent_email_id) REFERENCES email (id) ON DELETE CASCADE
);
