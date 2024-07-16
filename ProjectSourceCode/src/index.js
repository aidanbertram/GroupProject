// ----------------------------------   DEPENDENCIES  ----------------------------------------------
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
console.log("Public directory:", path.join(__dirname, "public"));
app.use(express.static("public"));
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const session = require('express-session');
app.use('/resources', express.static(path.join(__dirname, 'resources')));

// -------------------------------------  APP CONFIG   ----------------------------------------------

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: 'hbs',
  layoutsDir: __dirname + '/views/layouts',
  partialsDir: __dirname + '/views/partials',
  helpers: {
    multiply: (a, b) => a * b,
    calculateTotal: (cartItems) => {
      return cartItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
    },
    includes: (array, value) => {
      console.log('includes helper called');
      console.log('Array:', array);
      console.log('Value:', value);
      if (!Array.isArray(array)) return false;
      return array.includes(value);
    }
  }
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
// set Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// -------------------------------------  DB CONFIG AND CONNECT   ---------------------------------------
const dbConfig = {
  host: 'db',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
const db = pgp(dbConfig);

// db test
db.connect()
  .then(obj => {
    // Can check the server version here (pg-promise v10.1.0+):
    console.log('Database connection successful');
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    console.log('ERROR', error.message || error);
  });

// -------------------------------------  ROUTES   ---------------------------------------
app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});

const user = {
  username: undefined,
  email: undefined,
  password: undefined,
};
app.get("/login", (req, res) => {
  res.render("pages/login", { username: req.session.user });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const query = 'select * from users where users.username = $1 AND users.password_h = $2 LIMIT 1';
  const values = [username, password];
  // get the student_id based on the emailid
  db.one(query, values)
    .then(data => {
      user.email = data.email
      user.username = username;
      user.password = data.password;
      req.session.user = user;
      req.session.save();

      res.redirect('/');
    })
    .catch(err => {
      console.log(err);
      res.redirect('/login');
    });
});

app.get('/register', (req, res) => {
res.render('pages/register', {username: req.session.user});
});

app.post('/register', function (req, res) {
const query =
  'insert into users (username, email, password_h) values ($1, $2, $3)  returning * ;';
db.any(query, [
  req.body.username,
  req.body.email,
  req.body.password,
])
  // if query execution succeeds
  // send success message
  .then(function (data) {
    res.status(200);
    res.redirect('/login');
  })
  // if query execution fails
  // send error message
  .catch(function (err) {
    return console.log(err);
  });
});

// Authentication middleware.
const auth = (req, res, next) => {
if (!req.session.user) {
  return res.redirect('/login');
}
next();
};

app.use(auth);

// -------------------------------------  ROUTES for home.hbs   ----------------------------------------------
app.get("/", async (req, res) => {
try {
  // Fetch content from the database
  const content = await db.any('SELECT * FROM content');

  const favorites = await db.any('SELECT title FROM favorites'); // to handle greying out the favorite button once favorited
  const favoriteTitles = favorites.map(fav => fav.title);

  res.render('pages/home', { content, favoriteTitles });
} catch (error) {
  console.error('Error fetching content:', error);
  res.status(500).send('An error occurred while fetching content. Please try again.');
}
});

app.get('/favorites', async (req, res) => {
  try {
    // Fetch content from the database
    const content = await db.any('SELECT * FROM favorites');
  
    res.render('pages/favorites', { content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('An error occurred while fetching content. Please try again.');
  }
  });

// add to favorites
app.post('/add-to-favorites', async (req, res) => {
  try {
      const { content_type, title, director, release_year, genre, format, price } = req.body;

      // Insert data into the favorites table
      await db.none('INSERT INTO favorites (content_type, title, director, release_year, genre, format, price) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
      [content_type, title, director, release_year, genre, format, price]);

      res.redirect('/'); // Redirect to home page
  } catch (error) {
      console.error('Error adding to favorites:', error);
      res.status(500).send('An error occurred while adding to favorites. Please try again.');
  }
});
// remove from favorites
app.post('/remove-from-favorites', async (req, res) => {
  try {
      const { title } = req.body;

      // Delete data from the favorites table
      await db.none('DELETE FROM favorites WHERE title = $1', [title]);

      res.redirect('/favorites'); // Redirect to favorites page or any other page
  } catch (error) {
      console.error('Error removing from favorites:', error);
      res.status(500).send('An error occurred while removing from favorites. Please try again.');
  }
});

app.get("/cart", (req, res) => {
  const cartItems = [
    { name: 'Item 1', quantity: 2, price: 10.00 },
    { name: 'Item 2', quantity: 1, price: 20.00 },
    { name: 'Item 3', quantity: 3, price: 5.00 }
  ];
  res.render("pages/cart", { cartItems });
});

// Mock login and logout routes for demonstration purposes
app.post("/login", (req, res) => {
  // Authentication logic here
  req.session.username = { username }; // Set user session variable
  res.redirect("/");
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.redirect('/');
    }
    res.render('pages/logout', { message: 'Logged out Successfully' });
  });
});

module.exports = app.listen(3000);
