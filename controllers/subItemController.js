const endpointPartial = "http://localhost:3001";

// Handles POST /:type/:id route
// Consumes the POST /:type/:id endpoint from the API
exports.updateSubItemStatus = async (req, res) => {
  const userID = req.session.userID;
  const { type, id } = req.params;

  try {
    const response = await fetch(`${endpointPartial}/${type}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to update item:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.json({ message: data.message });

  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
};

// Handles POST /update-subitem route
// Consumes the POST /update-subitem endpoint from the API
exports.updateSubItem = async (req, res) => {
  //TODO: Implement this function
};

// Handles POST /new-table-item route
// Consumes the POST /new-table-item endpoint from the API
exports.addSubItem = async (req, res) => {
  const userID = req.session.userID;

  try {
    const response = await fetch(`${endpointPartial}/new-table-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    // Parse the JSON response
    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to add item:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.json({ message: data.message, insertId: data.insertId });

    } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Failed to add item" });
  }
};

// Handles DELETE /delete-table-item route
// Consumes the DELETE /delete-table-item endpoint from the API
exports.deleteSubItem = async (req, res) => {
  const userID = req.session.userID;

  try {
    const response = await fetch(`${endpointPartial}/delete-table-item`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    // Parse the JSON response
    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to delete item:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.json({ message: data.message });
    
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};
