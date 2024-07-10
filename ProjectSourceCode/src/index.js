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

  // Serve static files - fixed css file issue
  app.use('/resources', express.static(path.join(__dirname, 'resources')));

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

  app.get("/login", (req, res) => {
    res.render("pages/login");
  });
  
  app.get("/register", (req, res) => {
    res.render("pages/register");
  });
  

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });