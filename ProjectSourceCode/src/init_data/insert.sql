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
-- Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
    favorite_id SERIAL PRIMARY KEY,
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
('user2', 'user2@example.com', 'password2'),
('john_doe', 'john.doe@example.com', 'password123'),
('jane_smith', 'jane.smith@example.com', 'mypassword'),
('sam_jones', 'sam.jones@example.com', 'securepass'),
('lisa_brown', 'lisa.brown@example.com', 'passw0rd'),
('michael_clark', 'michael.clark@example.com', 'password!'),
('emily_white', 'emily.white@example.com', 'mysecurepassword'),
('daniel_green', 'daniel.green@example.com', 'pa$$word'),
('sarah_black', 'sarah.black@example.com', '12345password'),
('chris_blue', 'chris.blue@example.com', 'password@2024'),
('natalie_gray', 'natalie.gray@example.com', 'mynewpassword');

-- Insert into content table
INSERT INTO content (content_type, title, director, release_year, genre, format, price) VALUES
('Movie', 'Inception', 'Christopher Nolan', 2010, 'Sci-Fi', 'DVD', 19.99),
('Movie', 'The Matrix', 'Wachowskis', 1999, 'Sci-Fi', 'Blu-Ray', 14.99),
('Book', 'The Hobbit', 'J.R.R. Tolkien', 1937, 'Fantasy', 'Hardcover', 25.99),
('Movie', 'Interstellar', 'Christopher Nolan', 2014, 'Sci-Fi', 'Blu-Ray', 22.99),
('Movie', 'The Dark Knight', 'Christopher Nolan', 2008, 'Action', 'DVD', 17.99),
('Movie', 'Forrest Gump', 'Robert Zemeckis', 1994, 'Drama', 'Blu-Ray', 15.99),
('Movie', 'Fight Club', 'David Fincher', 1999, 'Drama', 'DVD', 14.99),
('Movie', 'The Shawshank Redemption', 'Frank Darabont', 1994, 'Drama', 'Blu-Ray', 16.99),
('Movie', 'Gladiator', 'Ridley Scott', 2000, 'Action', 'DVD', 18.99),
('Movie', 'Titanic', 'James Cameron', 1997, 'Romance', 'DVD', 14.99),
('Movie', 'The Avengers', 'Joss Whedon', 2012, 'Action', 'Blu-Ray', 19.99),
('Movie', 'Jurassic Park', 'Steven Spielberg', 1993, 'Adventure', 'DVD', 12.99),
('Movie', 'Avatar', 'James Cameron', 2009, 'Sci-Fi', 'Blu-Ray', 21.99),
('Movie', 'The Lion King', 'Roger Allers, Rob Minkoff', 1994, 'Animation', 'DVD', 14.99),
('Movie', 'Star Wars: Episode IV - A New Hope', 'George Lucas', 1977, 'Sci-Fi', 'DVD', 19.99),
('Movie', 'The Lord of the Rings: The Fellowship of the Ring', 'Peter Jackson', 2001, 'Fantasy', 'DVD', 15.99),
('Movie', 'Back to the Future', 'Robert Zemeckis', 1985, 'Sci-Fi', 'Blu-Ray', 13.99),
('Movie', 'The Silence of the Lambs', 'Jonathan Demme', 1991, 'Thriller', 'DVD', 14.99),
('Movie', 'Saving Private Ryan', 'Steven Spielberg', 1998, 'War', 'Blu-Ray', 17.99),
('TV Show', 'Breaking Bad', 'Vince Gilligan', 2008, 'Crime', 'Blu-Ray', 69.99),
('TV Show', 'Game of Thrones', 'David Benioff, D.B. Weiss', 2011, 'Fantasy', 'Blu-Ray', 79.99),
('TV Show', 'Friends', 'David Crane, Marta Kauffman', 1994, 'Comedy', 'DVD', 49.99),
('TV Show', 'The Office', 'Greg Daniels', 2005, 'Comedy', 'DVD', 44.99),
('TV Show', 'Stranger Things', 'The Duffer Brothers', 2016, 'Sci-Fi', 'Blu-Ray', 39.99),
('TV Show', 'The Crown', 'Peter Morgan', 2016, 'Drama', 'Blu-Ray', 59.99),
('TV Show', 'The Mandalorian', 'Jon Favreau', 2019, 'Sci-Fi', 'Blu-Ray', 34.99),
('TV Show', 'Sherlock', 'Mark Gatiss, Steven Moffat', 2010, 'Crime', 'DVD', 29.99),
('TV Show', 'The Simpsons', 'Matt Groening', 1989, 'Animation', 'DVD', 59.99),
('TV Show', 'The Big Bang Theory', 'Chuck Lorre, Bill Prady', 2007, 'Comedy', 'DVD', 49.99),
('Movie', 'Pulp Fiction', 'Quentin Tarantino', 1994, 'Crime', 'Blu-Ray', 19.99),
('Movie', 'The Godfather', 'Francis Ford Coppola', 1972, 'Crime', 'Blu-Ray', 24.99),
('Movie', 'The Godfather: Part II', 'Francis Ford Coppola', 1974, 'Crime', 'Blu-Ray', 24.99),
('Movie', 'Schindlers List', 'Steven Spielberg', 1993, 'History', 'Blu-Ray', 22.99),
('Movie', 'The Green Mile', 'Frank Darabont', 1999, 'Drama', 'DVD', 14.99),
('Movie', 'Goodfellas', 'Martin Scorsese', 1990, 'Crime', 'Blu-Ray', 18.99),
('Movie', 'Braveheart', 'Mel Gibson', 1995, 'History', 'DVD', 16.99),
('Movie', 'The Departed', 'Martin Scorsese', 2006, 'Crime', 'Blu-Ray', 19.99),
('Movie', 'The Prestige', 'Christopher Nolan', 2006, 'Drama', 'DVD', 14.99),
('Movie', 'The Grand Budapest Hotel', 'Wes Anderson', 2014, 'Comedy', 'Blu-Ray', 17.99),
('Movie', 'Whiplash', 'Damien Chazelle', 2014, 'Drama', 'Blu-Ray', 16.99),
('Movie', 'La La Land', 'Damien Chazelle', 2016, 'Musical', 'Blu-Ray', 19.99),
('Movie', 'Mad Max: Fury Road', 'George Miller', 2015, 'Action', 'Blu-Ray', 21.99),
('Movie', 'Django Unchained', 'Quentin Tarantino', 2012, 'Western', 'Blu-Ray', 17.99),
('Movie', 'Inglourious Basterds', 'Quentin Tarantino', 2009, 'War', 'Blu-Ray', 19.99),
('Movie', 'The Wolf of Wall Street', 'Martin Scorsese', 2013, 'Drama', 'Blu-Ray', 18.99),
('Movie', 'A Beautiful Mind', 'Ron Howard', 2001, 'Biography', 'DVD', 14.99),
('Movie', 'The Social Network', 'David Fincher', 2010, 'Drama', 'Blu-Ray', 16.99),
('Movie', 'Black Panther', 'Ryan Coogler', 2018, 'Superhero', 'Blu-Ray', 24.99),
('Movie', 'Guardians of the Galaxy', 'James Gunn', 2014, 'Superhero', 'Blu-Ray', 19.99),
('TV Show', 'Westworld', 'Jonathan Nolan, Lisa Joy', 2016, 'Sci-Fi', 'Blu-Ray', 39.99),
('TV Show', 'The Sopranos', 'David Chase', 1999, 'Crime', 'Blu-Ray', 69.99),
('TV Show', 'Lost', 'J.J. Abrams, Damon Lindelof, Jeffrey Lieber', 2004, 'Adventure', 'DVD', 49.99),
('TV Show', 'The Wire', 'David Simon', 2002, 'Crime', 'DVD', 59.99),
('TV Show', 'House of Cards', 'Beau Willimon', 2013, 'Drama', 'Blu-Ray', 44.99),
('TV Show', 'True Detective', 'Nic Pizzolatto', 2014, 'Crime', 'Blu-Ray', 34.99),
('TV Show', 'West Wing', 'Aaron Sorkin', 1999, 'Drama', 'DVD', 39.99),
('TV Show', 'Dexter', 'James Manos Jr.', 2006, 'Crime', 'Blu-Ray', 49.99),
('TV Show', 'The Walking Dead', 'Frank Darabont', 2010, 'Horror', 'Blu-Ray', 59.99),
('TV Show', 'Better Call Saul', 'Vince Gilligan, Peter Gould', 2015, 'Crime', 'Blu-Ray', 44.99),
('TV Show', 'Fargo', 'Noah Hawley', 2014, 'Crime', 'Blu-Ray', 34.99);

--INSERT INTO favorites (content_type, title, director, release_year, genre, format, price) VALUES
--('Movie', 'Inception', 'Christopher Nolan', 2010, 'Sci-Fi', 'DVD', 19.99);

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


