-- This table stores the contacts of the user

CREATE TABLE contact
(
    id                          INTEGER PRIMARY KEY,

    first_name                  VARCHAR(30),
    last_name                   VARCHAR(30),
    email_address_list          JSON,

    created_at                  DATETIME NOT NULL,
    modified_at                 DATETIME
);
