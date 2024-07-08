DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;

-- Users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_h VARCHAR(255) NOT NULL
);

-- Movies 
CREATE TABLE content (
    movie_id SERIAL PRIMARY KEY,
    content_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(50),
    format VARCHAR(50) NOT NULL
);



