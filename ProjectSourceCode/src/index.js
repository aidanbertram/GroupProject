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

// -------------------------------------  APP CONFIG   ----------------------------------------------

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
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

// app.get("/", (req, res) => {
//     res.send("Example website");
//   });

const user = {
  username: undefined,
  email: undefined,
  password: undefined,
};
  // Serve static files - fixed css file issue
  app.use('/resources', express.static(path.join(__dirname, 'resources')));

  app.get("/login", (req, res) => {
    res.render("pages/login");
  });
  
  app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.one('SELECT * FROM users WHERE username = $1 AND password_h = $2', [username, password])
      .then(data => {
        req.session.user = {
            user_id: data.user_id,
            username: data.username,
            email: data.email
        };
        req.session.save();  // Make sure to save the session after updating it
        res.redirect('/');
      })
      .catch(err => {
        console.error(err);
        res.redirect('/login');
      });
});

  
app.get('/register', (req, res) => {
  res.render('pages/register');
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

    res.render('pages/home', { content });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).send('An error occurred while fetching content. Please try again.');
  }
});

app.get('/favorites', (req, res) => {
  res.render('pages/favorites');
});
  

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

// Post route to handle adding items to the cart
app.post('/add-to-cart', async (req, res) => {
  if (!req.session.user) {
      return res.status(403).send('You need to log in to add items to your cart.');
  }

  const contentId = parseInt(req.body.contentId, 10);
  const userId = req.session.user.user_id;  // Use the user_id stored in session

  try {
      await db.none('UPDATE users SET cart = array_append(cart, $1) WHERE user_id = $2', [contentId, userId]);
      res.redirect('back');  // Redirect user back to the page they were on
  } catch (error) {
      console.error('Database error:', error);
      res.status(500).send('Error adding item to cart');
  }
});


// -------------------------------------  ROUTES for cart.hbs   ----------------------------------------------

app.get('/cart', async (req, res) => {
  if (!req.session.user) {
      return res.redirect('/login');  // Redirect to login if the user is not logged in
  }

  const userId = req.session.user.user_id;

  try {
      const userCart = await db.one('SELECT cart FROM users WHERE user_id = $1', [userId]);
      if (userCart.cart.length > 0) {
          // Fetch content details from the content table based on IDs in the cart
          const content = await db.any('SELECT content_id, title, genre, format FROM content WHERE content_id = ANY($1)', [userCart.cart]);
          res.render('pages/cart', { content });
      } else {
          res.render('pages/cart', { content: [] });
      }
  } catch (error) {
      console.error('Error accessing the cart:', error);
      res.status(500).send('Error retrieving your cart.');
  }
});
