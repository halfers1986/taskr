const express = require("express");
const router = express.Router();

// Import controllers
const authenticationController = require("../controllers/authenticationController");
const dashboardController = require("../controllers/dashboardController");
const taskController = require("../controllers/taskController");
const subItemController = require("../controllers/subItemController");
const settingsController = require("../controllers/settingsController");

// Authentication middleware
// (declared here so it can be used in multiple routes, but not all routes need it,
// so not declared in the main app.js file)
function ensureAuthenticated(req, res, next) {
  if (req.session.loggedIn) {
    return next();
  }
  res.redirect("/login");
}

// -- User Authentication Routes --
router.get("/login", authenticationController.getLogin);
router.get("/register", authenticationController.getRegister);
router.post("/login", authenticationController.logInUser);
router.post("/register", authenticationController.registerUser);
router.post("/logout", authenticationController.logOutUser);

// -- Dashboard Routes --
// Get route to render the dashboard
router.get("/data", ensureAuthenticated, dashboardController.getDataDashboard);
// Get route to retrieve basic dashboard data
router.get("/basic-dashboard", ensureAuthenticated, dashboardController.getBasicDashboard);
// Get route to retrieve completed tasks by type
router.get("/completed-by-type", ensureAuthenticated, dashboardController.getCompletedByType);
// Get route to retrieve average completion time
router.get("/average-completion-time", ensureAuthenticated, dashboardController.getAverageCompletionTime);
// Get route to retrieve categories by type
router.get("/categories-by-type", ensureAuthenticated, dashboardController.getCategoriesByType);

// -- Task Routes --
// Get route to retrieve all tasks
router.get("/", ensureAuthenticated, taskController.getTasks);
// Post route to add a new task
router.post("/add-task", ensureAuthenticated, taskController.addTask);
// Patch route to update a task
router.patch("/edit-task/:id", ensureAuthenticated, taskController.updateTask);
// Patch route to update the status of a task
router.patch("/task-status/:id", ensureAuthenticated, taskController.updateTaskCompletion);
// Delete route to delete a task
router.delete("/delete-task", ensureAuthenticated, taskController.deleteTask);

// -- Settings Routes --
// Get route to render the settings page
router.get("/settings", ensureAuthenticated, settingsController.getSettings);
// Patch route to update user details
router.patch("/update-user-details", ensureAuthenticated, settingsController.updateUserDetails);
// Patch route to update user password
router.patch("/update-password", ensureAuthenticated, settingsController.updatePassword);
// Post route to add a new category
router.post("/add-category", ensureAuthenticated, settingsController.addCategory);
// Delete route to delete a category
router.delete("/delete-category", ensureAuthenticated, settingsController.deleteCategory);
// Delete route to delete a user account
router.delete("/delete-account", ensureAuthenticated, settingsController.deleteAccount);

// -- Sub-Item Routes --
// Patch route to update a subtask or shopping list item
router.patch("/edit-sub-item", ensureAuthenticated, subItemController.editSubItem);
// Patch route to update the status of a subtask or shopping list item
router.patch("/:type/:id", ensureAuthenticated, subItemController.updateSubItemStatus);
// Post route to add a new subtask or shopping list item
router.post("/new-table-item", ensureAuthenticated, subItemController.addSubItem);
// Delete route to delete a subtask or shopping list item
router.delete("/delete-table-item", ensureAuthenticated, subItemController.deleteSubItem);

module.exports = router;
