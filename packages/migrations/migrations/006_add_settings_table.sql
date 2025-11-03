CREATE TABLE
    IF NOT EXISTS settings (
        id SERIAL PRIMARY KEY,
        field VARCHAR(255) NOT NULL,
        fieldValue VARCHAR(255) NOT NULL
    );