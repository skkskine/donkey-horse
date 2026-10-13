-- Up Migration
ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username);

CREATE UNIQUE INDEX IF NOT EXISTS invitelinks_invitationid_key ON invitelinks (invitationid);

CREATE INDEX IF NOT EXISTS events_eventdate_name_idx ON events (eventdate, name);

-- Down Migration
DROP INDEX IF EXISTS events_eventdate_name_idx;

DROP INDEX IF EXISTS invitelinks_invitationid_key;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_username_key;
