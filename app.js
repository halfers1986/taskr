const express = require("express");
const { engine } = require("express-handlebars");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const PORT = 3000;
const app = express();
const path = require("path");
const router = require("./routes/routes");
const rootPath = path.join(__dirname);

// Register Handlebars as the view engine
// Declare helpers for Handlebars
app.engine('hbs', engine({
  extname: 'hbs',
  // defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'), // Register partials directory
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    length: (arr) => arr.length,
    gt: (a, b) => a > b,
    var: (name, value, options) => {
      options.data.root[name] = value;
    },
    formatDate: (date) => {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Serve partials from the 'views/partials' directory
app.get('/views/partials/:partial', (req, res) => {
  const partialName = req.params.partial;
  const partialPath = path.join(__dirname, 'views', 'partials', `${partialName}`);
  
  res.sendFile(partialPath);
});

// Middleware to log requests
app.use(morgan("tiny"));

// Middleware to block caching, so that protected pages are inaccessible after logout
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Serve static files from the public directory
app.use(express.static(rootPath + "/public"));

// Middleware to parse incoming JSON data
app.use(express.json());

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

module.exports = app;
