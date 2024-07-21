--  This table stores the emails, with only body text

CREATE TABLE email
(
    id                          INTEGER PRIMARY KEY,
    uid                         INTEGER,
    mailbox_id                  INTEGER,

    from_name                   VARCHAR(255),
    from_email                  VARCHAR(255),
    date                        INTEGER,
    subject                     VARCHAR(255),
    body_text                   TEXT,

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME,

    UNIQUE (uid) ON CONFLICT ABORT,
    FOREIGN KEY (mailbox_id) REFERENCES mailbox (id) ON DELETE CASCADE
);

-- This table stores email buckets

CREATE TABLE email_bucket
(
    id                          INTEGER PRIMARY KEY,

    root_email_id               INTEGER,
    id_list                     JSON,

    summary                     TEXT,

    are_in_a_thread             BOOLEAN,
    are_similar                 BOOLEAN,

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME,

    FOREIGN KEY (root_email_id) REFERENCES email (id) ON DELETE CASCADE
);
