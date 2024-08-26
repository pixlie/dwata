-- Add a UNIQUE constraint to the email table over uid and mailbox_id

CREATE UNIQUE INDEX email_uid_mailbox_id_index ON email (uid, mailbox_id);
