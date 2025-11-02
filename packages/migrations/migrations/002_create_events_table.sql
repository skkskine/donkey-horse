CREATE TABLE IF NOT EXISTS events (
    id BIGINT PRIMARY KEY DEFAULT (floor(random() * 1000000000000)::BIGINT),
    name VARCHAR(255) NOT NULL,
    venue TEXT NOT NULL,
    eventdate DATE NOT NULL,
    eventtime TIME,
    link TEXT,
    city TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);