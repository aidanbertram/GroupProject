// ----------------------------------   DEPENDENCIES  ----------------------------------------------
const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const path = require("path");
console.log("Public directory:", path.join(__dirname, "public"));
app.use(express.static("public"));
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
app.use("/resources", express.static(path.join(__dirname, "resources")));
const bcrypt = require("bcrypt");


// -------------------------------------  APP CONFIG   ----------------------------------------------

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: "hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
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
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
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
  host: "db",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
const db = pgp(dbConfig);

// db test
db.connect()
  .then((obj) => {
    // Can check the server version here (pg-promise v10.1.0+):
    console.log("Database connection successful");
    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    console.log("ERROR", error.message || error);
  });


// -------------------------------------  ROUTES   ---------------------------------------
app.get("/welcome", (req, res) => {
  res.json({ status: "success", message: "Welcome!" });
});

var user = {
  username: undefined,
  email: undefined,
  password: undefined,
};
app.get("/login", (req, res) => {
  res.render("pages/login");
});

// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const query = 'select * from users where users.username = $1 AND users.password_h = $2 LIMIT 1';
//   const values = [username, password];
//   // get the student_id based on the emailid
//   db.one(query, values)
//     .then(data => {
//       user.email = data.email
//       user.username = username;
//       user.password = data.password;
//       req.session.user = user;
//       req.session.save();

//       res.redirect('/');
//     })
//     .catch(err => {
//       console.log(err);
//       res.redirect('/login');
//     });
// });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [username]);

    

    if (user && await bcrypt.compare(password, user.password_h)) {
      // Password matches
      req.session.user = user;
      console.log("User session set:", req.session.user);
      
      // Optional: Log user info
      console.log("User details:", user);
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
          return res.status(500).send("Internal Server Error");
        }
        res.redirect("/");
      });
    } else {
      // Password doesn't match
      res.render("pages/login", { message: "Incorrect username or password." });
      // res.status(401).send("Incorrect username or password.");
    }
  } catch (err) {
    console.error(err);
    res.render("pages/register", {
      message: "It looks like you don't have an account.",
    });
    // res.redirect('/register', {message: "Look like you don't an account."});
  }
});

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
res.render('pages/register', {username: req.session.user});
});

app.post("/register", async function (req, res) {
   const { username, email, password } = req.body;
   const query = "INSERT INTO users (username, email, password_h) VALUES ($1, $2, $3) RETURNING *";

   try {
     // Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);
    
     // Insert the new user into the database
     const New_user = await db.one(query, [username, email, hashedPassword]);

     // Redirect to login page upon successful registration
    res.status(200).redirect("/login");
   } catch (err) {
     console.log(err);
     res.status(500).send("An error occurred during registration.");
   }
});

app.post('/add_user', function (req, res) {
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
      res.redirect('pages.login')
    })
    // if query execution fails
    // send error message
    .catch(function (err) {
      console.log(err);
      res.status(400).json({
        status: 'error',
        message: 'An account with this information already exists!',
      });
    });
});


app.get('/welcome', (req, res) => {
  res.json({status: 'success', message: 'Welcome!'});
});



// Authentication middleware.
const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

app.use(auth);

// -------------------------------------  ROUTES for home.hbs   ----------------------------------------------
app.get("/", async (req, res) => {
  user = req.session.user;
try {
  // Fetch content from the database
  const content = await db.any('SELECT * FROM content');

  const favorites = await db.any('SELECT title FROM favorites'); // to handle greying out the favorite button once favorited
  const favoriteTitles = favorites.map(fav => fav.title);

  res.render('pages/home', { content, favoriteTitles, user });
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

// app.get("/cart", (req, res) => {
//   const cartItems = [
//     { name: "Item 1", quantity: 2, price: 10.0 },
//     { name: "Item 2", quantity: 1, price: 20.0 },
//     { name: "Item 3", quantity: 3, price: 5.0 },
//   ];
//   res.render("pages/cart", { cartItems });
// });

// Mock login and logout routes for demonstration purposes
// app.post("/login", (req, res) => {
//   // Authentication logic here
//   req.session.username = { username }; // Set user session variable
//   res.redirect("/");
// });

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/login");
    }
  });
  res.render("pages/logout", { message: "Logged out Successfully" });
});
  
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('pages/logout');
});

module.exports = app.listen(3000, () => {
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


app.get("/search", async (req, res) => {
  const user = req.session.user || {};
  const { query } = req.query;
  let sqlQuery = "SELECT * FROM content WHERE 1=1";
  let queryParams = [];
  

  if (query) {
    sqlQuery += " AND (title ILIKE $1 OR director ILIKE $1)";
    queryParams.push(`${query}`);
  }

  console.log("The query params are: ", queryParams);
  try {
    const content = await db.any(sqlQuery, queryParams);
    console.log("This is the content: ", content);
    // if (req.xhr) {
    //   // If the request is AJAX, send JSON
    //   res.json(content);
    // } else {
    //   // Otherwise, render the search results page
    //   res.render("pages/searchResults", { content, user });
    // }
    res.render("pages/searchResults", { content, user });
  } catch (error) {
    console.error("Error fetching content:", error);
    if (req.xhr) {
      res.status(500).json({ error: "An error occurred while fetching content. Please try again." });
    } else {
      res.status(500).send("An error occurred while fetching content. Please try again.");
    }
  }
});


app.post("/filter", async (req, res) => {
  const user = req.session.user || {};
  const { genre, format, year } = req.body;
  let sqlQuery = "SELECT * FROM content WHERE 1=1";
  let queryParams = [];

  if (genre) {
    sqlQuery += ` AND genre = $${queryParams.length + 1}`;
    queryParams.push(genre);
  }

  if (format) {
    sqlQuery += ` AND format = $${queryParams.length + 1}`;
    queryParams.push(format);
  }

  if (year) {
    sqlQuery += ` AND release_year = $${queryParams.length + 1}`;
    queryParams.push(year);
  }
  console.log("The query params are: ", queryParams);

  try{
    console.log("The query: ", sqlQuery);
    const content = await db.any(sqlQuery, queryParams);
    console.log("This is the content: ", content);
    res.render("pages/searchResults", { content, user });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).send("An error occurred while fetching content. Please try again.");
  }
});

//module.exports = {app, db};