-- We change the mailbox table to add two new columns

ALTER TABLE mailbox
    ADD COLUMN last_saved_email_uid INTEGER;
ALTER TABLE mailbox
    ADD COLUMN last_indexed_email_uid INTEGER;
