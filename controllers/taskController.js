const endpointPartial = "http://localhost:3001";

// Handles the GET / route
// Consumes the GET /tasks/:userid endpoint from the API
exports.getTasks = async (req, res) => {
  const userID = req.session.userID;
  // console.log("UserID: ",userID);
  try {

    const response = await fetch(`${endpointPartial}/tasks/${userID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();

    // console.log(data);

    // Render the template with the returned data
    // layout: false prevents the default layout from being used (Handlebars) as we don't have one
    res.render("main", { tasks: data.tasks, categories: data.categories, layout: false });
  } catch (err) {
    console.error("Error fetching tasks or subtasks:", err);
    res.status(500).send("An error occurred");
  }
};

// Handles the  POST /add-task route
// Consumes the POST /add-task endpoint from the API
exports.addTask = async (req, res) => {
  const userID = req.session.userID;

  console.log("UserID: ",userID);

  try {
    const response = await fetch(`${endpointPartial}/add-task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to add task:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Return success message
    res.status(201).json({ message: "Task added successfully", task: data.task });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Failed to add task" });
  }
};

// Handles the PATCH /edit-task/:id route
// Consumes the PATCH /edit-task/:id endpoint from the API
exports.updateTask = async (req, res) => {
  const userID = req.session.userID;
  const { id } = req.params;

  try {
    const response = await fetch(`${endpointPartial}/edit-task/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to update task:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.json({ message: data.message });

  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Handles the PATCH /task-status/:id route
// Consumes the PATCH /task-status/:id endpoint from the API
exports.updateTaskCompletion = async (req, res) => {
  const userID = req.session.userID;
  const taskID = req.params.id;

  try {
    const response = await fetch(`${endpointPartial}/task-status/${taskID}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...req.body, userID })
    });

    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to update task status:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.json({ message: data.message });

  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Handles the DELETE /delete-task route
// Consumes the DELETE /delete-task endpoint from the API
exports.deleteTask = async (req, res) => {
  const userID = req.session.userID;
  const { taskID, taskType } = req.body;

  try {
    const response = await fetch(`${endpointPartial}/delete-task/${taskID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskType, userID })
    });

    const data = await response.json();

    // If the request failed, log the error and return
    if (!response.ok) {
      console.error("Failed to delete task:", data.message);
      return res.status(response.status).json({ message: data.message });
    }

    // Else return success message
    res.status(response.status).json({ message: data.message });
    
  } catch (err) {
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  }
};
