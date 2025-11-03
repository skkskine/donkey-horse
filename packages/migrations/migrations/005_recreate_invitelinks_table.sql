DROP TABLE IF EXISTS invitelinks;

CREATE TABLE
    IF NOT EXISTS invitelinks (
        id BIGSERIAL PRIMARY KEY,
        invitationid VARCHAR(255) NOT NULL,
        isvalid BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW ()
    );