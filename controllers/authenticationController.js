
const endpointPartial = "http://localhost:3001";

// Handler for GET /login
exports.getLogin = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  res.render("login", { layout: false });
};

// Handler for GET /register
exports.getRegister = (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/");
  }
  res.render("register", { layout: false });
};

// Handler for POST /login
// Consumes POST /login endpoint from the API 
exports.logInUser = async (req, res) => {
  const { username } = req.body;

  try {
    const response = await fetch(`${endpointPartial}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // If the login failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else on successful login, set the session data
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.userID = data.userID;

    // Return the URL to redirect to the dashboard
    res.status(200).json({ url: "/" });
  } catch (err) {
    console.error("Error logging in:", err);
    return res.status(500).json({ message: "Failed to log in" });
  }
};

// Handler for POST /logout
exports.logOutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ message: "Failed to log out" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ url: "/login" });
  });
};

// Handler for POST /register
// Consumes POST /register endpoint from the API
exports.registerUser = async (req, res) => {
  const { username } = req.body;

  try {
    const response = await fetch(`${endpointPartial}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    // If the registration failed, show an error message and return
    if (!response.ok) {
      return res.status(response.status).json({ message: data.message });
    }

    // Else set the session data
    req.session.username = username;
    req.session.loggedIn = true;
    req.session.userID = data.userID;
    // console.log("Session on Register:", req.session);

    // Return the URL to redirect to the dashboard
    res.status(201).json({ url: "/" });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).json({ message: "Failed to register user" });
  }
};
