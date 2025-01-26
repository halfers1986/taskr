const conn = require("../utils/dbconn");
var bcrypt = require("bcryptjs");


exports.getLogin = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  res.render("login", { layout: false });
};

exports.getRegister = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  res.render("register", { layout: false });
};

exports.logInUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate the input
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Check the database for the user & get the hashed password
    const sql = "SELECT user_password, user_id FROM user WHERE user_username = ?";
    const [results] = await conn.query(sql, [username]);

    // Check if the user exists and the password matches
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    } else if (!bcrypt.compareSync(password, results[0].user_password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Set the session data
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.userID = results[0].user_id;
    console.log("Session on Login:", req.session);
    res.status(200).json({ message: "Logged in successfully", url: "/" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Failed to log in" });
  }
};

exports.logOutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "Logged out successfully", url: "/login" });
  });
};

exports.registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password, dob } = req.body;

  // Validate the input
  if (!firstName || !lastName || !username || !email || !password || !dob) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    // Check the database for an existing user with the same username
    const sql = "SELECT * FROM user WHERE user_username = ?";
    const [results] = await conn.query(sql, [username]);
    if (results.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Insert the new user into the database
    // Salt and hash the password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const insertSQL = "INSERT INTO user (user_first_name, user_last_name, user_username, user_email, user_password, user_dob) VALUES (?, ?, ?, ?, ?, ?)";
    const [insertResults] = await conn.query(insertSQL, [firstName, lastName, username, email, hash, dob]);

    if (insertResults.affectedRows === 0) {
      return res.status(500).json({ message: "Failed to register user" });
    }

    // Set the session data
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.userID = insertResults.insertId;
    console.log("User ID: " + req.session.userID);
    console.log("About to redirect to main");

    // Redirect to the main page
    res.status(201).json({ message: "Registered successfully", url: "/" });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Failed to register user" });
  }
};
