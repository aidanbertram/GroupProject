-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_h VARCHAR(255) NOT NULL,
    cart INT[] DEFAULT '{}',
    selling INT[] DEFAULT '{}'
);

-- Create Content Table
CREATE TABLE IF NOT EXISTS content (
    content_id SERIAL PRIMARY KEY,
    content_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    director VARCHAR(255),
    release_year INT,
    genre VARCHAR(50),
    format VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2)
);
--insert users
INSERT INTO users (username, email, password_h) VALUES
('user1', 'user1@example.com', 'password1'),
('user2', 'user2@example.com', 'password2');
--insert content
INSERT INTO content (content_type, title, director, release_year, genre, format, price) VALUES
('Movie', 'Inception', 'Christopher Nolan', 2010, 'Sci-Fi', 'DVD', 19.99),
('Movie', 'The Matrix', 'Wachowskis', 1999, 'Sci-Fi', 'Blu-Ray', 14.99),
('Book', 'The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy', 'Hardcover', 25.99),
('Game', 'The Legend of Zelda', 'Nintendo', 1986, 'Adventure', 'Cartridge', 49.99);

-- FUNCTIONS

--add content to a user's cart
CREATE OR REPLACE FUNCTION add_to_cart(user_id INT, content_id INT) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET cart = array_append(cart, content_id)
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

--remove content from a user's cart
CREATE OR REPLACE FUNCTION remove_from_cart(user_id INT, content_id INT) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET cart = array_remove(cart, content_id)
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- get the content of a user's cart
CREATE OR REPLACE FUNCTION get_cart(user_id INT) RETURNS INT[] AS $$
DECLARE
    cart_contents INT[];
BEGIN
    SELECT cart INTO cart_contents FROM users WHERE user_id = user_id;
    RETURN cart_contents;
END;
$$ LANGUAGE plpgsql;

--  add content to a user's selling list
CREATE OR REPLACE FUNCTION add_to_selling(user_id INT, content_id INT) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET selling = array_append(selling, content_id)
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

-- remove content from a user's selling list
CREATE OR REPLACE FUNCTION remove_from_selling(user_id INT, content_id INT) RETURNS VOID AS $$
BEGIN
    UPDATE users
    SET selling = array_remove(selling, content_id)
    WHERE user_id = user_id;
END;
$$ LANGUAGE plpgsql;

--  get the content of a user's selling list
CREATE OR REPLACE FUNCTION get_selling(user_id INT) RETURNS INT[] AS $$
DECLARE
    selling_contents INT[];
BEGIN
    SELECT selling INTO selling_contents FROM users WHERE user_id = user_id;
    RETURN selling_contents;
END;
$$ LANGUAGE plpgsql;