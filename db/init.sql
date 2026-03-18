CREATE TABLE IF NOT EXISTS people (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO people (full_name, email)
VALUES
('Ali Veli', 'ali@example.com'),
('Ayse Demir', 'ayse@example.com')
ON CONFLICT (email) DO NOTHING;