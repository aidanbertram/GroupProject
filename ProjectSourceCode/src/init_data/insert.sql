-- Sample data for testing
INSERT INTO users (username, email, password_h) VALUES
('john_doe', 'john.doe@example.com', 'password1'),
('jane_smith', 'jane.smith@example.com', 'password2'),
('alice_jones', 'alice.jones@example.com', 'password3');

INSERT INTO content (content_type, title, director, release_year, genre, format) VALUES
('movie', 'Inception', 'Christopher Nolan', 2010, 'Sci-Fi', 'Blu-ray'),
('movie', 'The Matrix', 'Lana Wachowski, Lilly Wachowski', 1999, 'Action', 'DVD'),
('movie', 'The Godfather', 'Francis Ford Coppola', 1972, 'Crime', 'Blu-ray'),
('series', 'Breaking Bad', 'Vince Gilligan', 2008, 'Crime', 'Streaming'),
('series', 'Game of Thrones', 'David Benioff, D.B. Weiss', 2011, 'Fantasy', 'Streaming');
