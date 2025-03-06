const endpointPartial = "http://localhost:3001";

// Handler for GET /settings
exports.getSettings = async (req, res) => {
  const userID = req.session.userID;

  try {
    const response = await fetch(`${endpointPartial}/settings/${userID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` }
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      console.error("Failed to get settings:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    console.log(data);

    res.render("settings", { settings: data.settings, categories: data.categories, layout: false });

  } catch (err) {
    console.error("Error getting settings:", err);
    res.status(500).json({ message: "Failed to get settings" });
  }
};

// Handler for PATCH /update-user-details
exports.updateUserDetails = async (req, res) => {
  const userID = req.session.userID;
  const changes = req.body;

  console.log("Settings controller: updateUserDetails called with userID:", userID, "and changes:", changes);

  try {
    const response = await fetch(`${endpointPartial}/update-user-details/${userID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` },
      body: JSON.stringify(changes)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Settings controller: Failed to update user details: Message returned from API:", data.message);
      return res.status(response.status).json({ message: data.message });
    }
    6
    res.status(200).json({ message: "User details updated" });

  } catch (err) {
    console.error("Error updating user details:", err);
    res.status(500).json({ message: "Failed to update user details" });
  }
};

// Handler for PATCH /update-password
exports.updatePassword = async (req, res) => {
  const userID = req.session.userID;
  const changes = req.body;

  try {
    const response = await fetch(`${endpointPartial}/update-password/${userID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` },
      body: JSON.stringify(changes)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(response.status, "Settings controller: Failed to update password: Message returned from API:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    console.log("Server returned okay - returning to settings.js");
    res.status(200).json({ message: "Password updated" });

  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
};

// Handler for POST /add-category
exports.addCategory = async (req, res) => {
  const userID = req.session.userID;
  const newCategory = req.body;

  try {
    const response = await fetch(`${endpointPartial}/add-category/${userID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` },
      body: JSON.stringify(newCategory)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Settings controller: Failed to add category: Message returned from API:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    res.status(201).json({ message: "Category added successfully", categoryID: data.categoryID });

  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: "Failed to add category" });
  }
};

// Handler for DELETE /delete-category
exports.deleteCategory = async (req, res) => {
  const userID = req.session.userID;
  const categoryID = req.body.categoryID;

  try {
    const response = await fetch(`${endpointPartial}/delete-category/${userID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` },
      body: JSON.stringify({ categoryID })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Settings controller: Failed to delete category: Message returned from API:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    res.status(200).json({ message: "Category deleted" });

  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
};

// Handler for DELETE /delete-account
exports.deleteAccount = async (req, res) => {
  const userID = req.session.userID;
  const password = req.body.password;

  try {
    const response = await fetch(`${endpointPartial}/delete-account/${userID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${req.session.token}` },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (!response.ok) {
      if (err.status === 409) {
        return res.status(409).json({ message: data.message });
      }
      console.error("Settings controller: Failed to delete account: Message returned from API:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    res.status(200).json({ message: "Account deleted" });

  } catch (err) {
    console.error("Error deleting account:", err);
    res.status(500).json({ message: "Failed to delete account" });
  }
};