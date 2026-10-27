-- Up Migration
-- bumped on password reset, so the jwt issued before the reset stop working
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_version INTEGER NOT NULL DEFAULT 0;

-- Down Migration
ALTER TABLE users DROP COLUMN IF EXISTS token_version;
