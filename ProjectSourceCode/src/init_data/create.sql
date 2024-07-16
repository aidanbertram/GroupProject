DROP TABLE IF EXISTS content;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorites;

-- Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_h VARCHAR(255) NOT NULL,
    cart INT[] DEFAULT '{}',
    selling INT[] DEFAULT '{}'
);

-- Content Table 
CREATE TABLE content (
    content_id SERIAL PRIMARY KEY,
    content_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(50),
    format VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2)
);
<<<<<<< HEAD

-- Favorites Table 
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    content_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(50),
    format VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2)
);
=======
>>>>>>> c8edbefafde262e23b6946cc4ca6668b5c1972e4
