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
      return cartItems
        .reduce((total, item) => total + item.quantity * item.price, 0)
        .toFixed(2);
    },
  },
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

app.get("/register", (req, res) => {
  res.render("pages/register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const query = "INSERT INTO users (username, email, password_h) VALUES ($1, $2, $3) RETURNING *";

  try {
    // Check if the username or email already exists
    const existingUser = await db.oneOrNone("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);

    if (existingUser) {
      return res.render("pages/register", { message: "Username or email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the new user into the database
    const newUser = await db.one(query, [username, email, hashedPassword]);

    // Redirect to login page upon successful registration
    res.status(200).redirect("/login");
  } catch (err) {
    console.log("Error during registration:", err);
    res.status(500).send("An error occurred during registration.");
  }
});


// app.post("/register", async function (req, res) {
//   const { username, email, password } = req.body;
//   const query = "INSERT INTO users (username, email, password_h) VALUES ($1, $2, $3) RETURNING *";

//   try {
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);
    
//     // Insert the new user into the database
//     const New_user = await db.one(query, [username, email, hashedPassword]);

//     // Redirect to login page upon successful registration
//     res.status(200).redirect("/login");
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("An error occurred during registration.");
//   }
// });

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
    const content = await db.any("SELECT * FROM content");
    console.log("The user is: ", user)
    res.render("pages/home", { content, user});
  } catch (error) {
    console.error("Error fetching content:", error);
    res
      .status(500)
      .send("An error occurred while fetching content. Please try again.");
  }
});

app.get("/favorites", (req, res) => {
  console.log("User on favourites page:", user)
  res.render("pages/favorites", { username: req.body.user });
});

app.get("/cart", (req, res) => {
  const cartItems = [
    { name: "Item 1", quantity: 2, price: 10.0 },
    { name: "Item 2", quantity: 1, price: 20.0 },
    { name: "Item 3", quantity: 3, price: 5.0 },
  ];
  res.render("pages/cart", { cartItems });
});

// Mock login and logout routes for demonstration purposes
app.post("/login", (req, res) => {
  // Authentication logic here
  req.session.username = { username }; // Set user session variable
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect("/login");
    }
  });
  res.render("pages/logout", { message: "Logged out Successfully" });
});

module.exports = app.listen(3000);
