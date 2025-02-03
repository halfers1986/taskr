const express = require("express");
const router = express.Router();

// Import controllers
const authenticationController = require("../controllers/authenticationController");
const dashboardController = require("../controllers/dashboardController");
const taskController = require("../controllers/taskController");
const subItemController = require("../controllers/subItemController");

// Authentication middleware
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
router.get("/data", ensureAuthenticated, dashboardController.getDataDashboard);
router.get("/basic-dashboard", ensureAuthenticated, dashboardController.getBasicDashboard);

// -- Task Routes --
router.get("/", ensureAuthenticated, taskController.getTasks);
router.post("/add-task", ensureAuthenticated, taskController.addTask);
router.patch("/edit-task/:id", ensureAuthenticated, taskController.updateTask);
router.patch("/task-status/:id", ensureAuthenticated, taskController.updateTaskCompletion);
router.delete("/delete-task", ensureAuthenticated, taskController.deleteTask);
// router.get("/filter-tasks", dashboardController.filterTasks); -- Handling this in the front-end instead
// router.get("/sort-tasks", dashboardController.sortTasks); -- Handling this in the front-end instead

// -- Sub-Item Routes --
// Patch route to update the status of a subtask or shopping list item
router.post("/update-subtask", ensureAuthenticated, subItemController.updateSubItem);
router.post("/new-table-item", ensureAuthenticated, subItemController.addSubItem);
router.patch("/:type/:id", ensureAuthenticated, subItemController.updateSubItemStatus);
router.delete("/delete-table-item", ensureAuthenticated, subItemController.deleteSubItem);



module.exports = router;
