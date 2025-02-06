const express = require("express");
const { engine } = require("express-handlebars");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const app = express();
const path = require("path");
const router = require("./routes/routes");
const rootPath = path.join(__dirname);


// -- HANDLEBARS CONFIGURATION -- //
// Register Handlebars as the view engine
// Declare helpers for Handlebars
app.engine('hbs', engine({
  extname: 'hbs',
  // layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'), // Register partials directory
  helpers: {
    eq: (a, b) => a === b, // Helper to compare two values (EQUAL)
    or: (a, b) => a || b, // Helper to compare two values (OR)
    length: (arr) => arr.length, // Helper to get the length of an array
    gt: (a, b) => a > b, // Helper to compare two values (GREATER THAN)
    var: (name, value, options) => { // Helper to set a variable in Handlebars
      options.data.root[name] = value;
    },
    formatDate: (date) => { // Helper to format a date as YYYY-MM-DD (for input[type="date"])
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


// -- OTHER MIDDLEWARE -- //
// Middleware to block caching, so that protected pages are inaccessible after logout
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Serve static files from the public directory
app.use(express.static(rootPath + "/public"));

// Serve partials as static files
app.use('/partials', express.static(path.join(__dirname, 'views/partials')));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to manage sessions
app.use(
  session({
    secret: "supersecretpassword", // Secret password here
    resave: false, // Prevents session from being saved every time a request is made
    saveUninitialized: false, // GDPR compliance (only save cookies when user logs in)
    cookie: {
      secure: false, // if implemented with HTTPS, set secure: true
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware to log incoming requests -- used for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use("/", router);

// Middleware to log session data -- used for debugging
// app.use((req, res, next) => {
//   console.log("Session data:", req.session);
//   next();
// });

// Middleware to log incoming requests -- used for debugging
// app.use((req, res, next) => {
//   console.log("Incoming request:", req.method, req.url);
//   next();
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;
