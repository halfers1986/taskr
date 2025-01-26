const express = require("express");
const router = express.Router();

// Import controllers
const authenticationController = require("../controllers/authenticationController");
const dashboardController = require("../controllers/dashboardController");
const taskController = require("../controllers/taskController");
const subItemController = require("../controllers/subItemController");

// -- User Authentication Routes --
router.get("/login", authenticationController.getLogin);
router.get("/register", authenticationController.getRegister);
router.post("/login", authenticationController.logInUser);
router.post("/register", authenticationController.registerUser);
router.post("/logout", authenticationController.logOutUser);

// -- Dashboard Routes --
router.get("/", dashboardController.getDashboard);
// router.get("/filter-tasks", dashboardController.filterTasks); -- Handling this in the front-end instead
// router.get("/sort-tasks", dashboardController.sortTasks); -- Handling this in the front-end instead

// -- Task Routes --
router.post("/add-task", taskController.addTask);
router.patch("/edit-task/:id", taskController.updateTask);
router.patch("/task-status/:id", taskController.updateTaskCompletion);
router.delete("/delete-task", taskController.deleteTask);

// -- Sub-Item Routes --
// Patch route to update the status of a subtask or shopping list item
router.post("/update-subtask", subItemController.updateSubItem);
router.post("/new-table-item", subItemController.addSubItem);
router.patch("/:type/:id", subItemController.updateSubItemStatus);
router.delete("/delete-table-item", subItemController.deleteSubItem);

module.exports = router;
