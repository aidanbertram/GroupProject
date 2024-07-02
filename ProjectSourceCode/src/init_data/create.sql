DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS users;

-- Create Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_h VARCHAR(255) NOT NULL
);

-- Create Movies Table
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(50),
    format VARCHAR(50) NOT NULL
);