const conn = require("../utils/dbconn");

// GET /  (tasks)
exports.getTasks = async (req, res) => {
  // if (!req.session.loggedIn) {
  //   return res.redirect("/login");
  // } // This is now handled by the ensureAuthenticated middleware
  const userID = req.session.userID;
  try {
    // Fetch tasks
    const sql = `
      SELECT task.*, category.category_name 
      FROM task 
      LEFT JOIN category ON task.task_category_id = category.category_id 
      WHERE task.task_user_id = ? 
      ORDER BY task_created_timestamp DESC
    `;
    const [results] = await conn.query(sql, [userID]); // Fetch all tasks

    // Fetch subtasks for each task in parallel
    await Promise.all(
      results.map(async (task) => {
        const taskID = task.task_id;
        const taskType = task.task_type_id;
        if (taskType === 1) {
          const subtaskSQL = `SELECT * FROM subtask WHERE subtask_task_id = ${taskID}`;
          const [subtasks] = await conn.query(subtaskSQL); // Fetch subtasks
          subtasks.forEach((subtask) => {
            if (subtask.subtask_due_date !== null) {
              const date = new Date(subtask.subtask_due_date);
              subtask.subtask_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
            } else {
              subtask.subtask_due_date_formatted = null;
            }
            const priorityText = ["None", "Low", "Medium", "High"];
            subtask.subtask_priority_text = priorityText[subtask.subtask_priority_id];
          });
          task.subtasks = subtasks; // Attach subtasks to task
        } else if (taskType === 2) {
          const listSQL = `SELECT * FROM list_item WHERE list_item_task_id = ${taskID}`;
          const [listItems] = await conn.query(listSQL); // Fetch list items
          task.listItems = listItems; // Attach list items to task
        }
      })
    );
    
    // Fetch user categories
    const settingsSQL = "SELECT * FROM category WHERE category_user_id = ?";
    const [settings] = await conn.query(settingsSQL, [userID]);
    // Not all users will have categories set up so don't throw an error if none are found
    // Instead, just send an empty array to the client
    const categories = settings.length > 0 ? settings : [];
    // console.log(categories);

    // Format due dates on the tasks
    results.forEach((task) => {
      if (task.task_due_date !== null) {
        const date = new Date(task.task_due_date);
        task.task_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
      } else {
        task.task_due_date_formatted = null;
      }
      // console.log(task);
    });
    // Render the template with the combined data
    res.render("main", { tasks: results, categories, layout: false }); // layout: false prevents the default layout from being used (Handlebars) as we don't have one
  } catch (err) {
    console.error("Error fetching tasks or subtasks:", err);
    res.status(500).send("An error occurred");
  }
};

// POST /add-task
exports.addTask = async (req, res) => {
  console.log("Session on addTask:", req.session);
  const user_id = req.session.userID;
  const { type, title, description, priority, dueDate, subtasks, shoppingListItems } = req.body;
  console.log("Task data:", req.body);

  // Validate the input
  if (!type || !title) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // Start a transaction to ensure that all queries succeed or fail together
  let connection; // Connection object for transaction
  try {
    // Get a connection from the pool
    connection = await conn.getConnection();

    // Start a transaction
    await connection.beginTransaction();

    // Insert new task into database
    const taskSQL = "INSERT INTO task (task_type_id, task_title, task_description, task_priority_id, task_due_date, task_user_id) VALUES (?, ?, ?, ?, ?, ?)";
    const [taskResults] = await connection.query(taskSQL, [type, title, description, priority, dueDate, user_id]);

    if (taskResults.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Could not add task." });
    }

    let taskID = taskResults.insertId;

    // -- Insert new subtasks into database --
    if (subtasks) {
      const subtaskSQL = "INSERT INTO subtask (subtask_task_id, subtask_description, subtask_due_date, subtask_priority_id) VALUES ?";
      const subtaskData = subtasks.map((subtask) => [taskID, subtask.name, subtask.dueDate, subtask.priority]);
      const [subtaskResults] = await connection.query(subtaskSQL, [subtaskData]);
      if (subtaskResults.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Could not add subtask." });
      }
    }
    if (shoppingListItems) {
      const shoppingListSQL = "INSERT INTO list_item (list_item_task_id, list_item_name, list_item_quantity, list_item_store) VALUES ?";
      const shoppingListData = shoppingListItems.map((item) => [taskID, item.name, item.count, item.store]);
      const [shoppingListResults] = await connection.query(shoppingListSQL, [shoppingListData]);
      if (shoppingListResults.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ message: "Could not add shopping list item." });
      }
    }

    // Commit the transaction
    await connection.commit();

    // Fetch the newly added task
    const sql = `SELECT * FROM task WHERE task_id = ${taskID}`;
    const [results] = await conn.query(sql);
    const task = results[0];

    // Fetch any subtasks or list items for the new task
    const taskType = task.task_type_id;
    if (taskType === 1) {
      const subtaskSQL = `SELECT * FROM subtask WHERE subtask_task_id = ${taskID}`;
      const [subtasks] = await conn.query(subtaskSQL); // Fetch subtasks
      subtasks.forEach((subtask) => {
        if (subtask.subtask_due_date !== null) {
          const date = new Date(subtask.subtask_due_date);
          subtask.subtask_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
        } else {
          subtask.subtask_due_date_formatted = null;
        }
        const priorityText = ["None", "Low", "Medium", "High"];
        subtask.subtask_priority_text = priorityText[subtask.subtask_priority_id];
      });
      task.subtasks = subtasks; // Attach subtasks to task
    } else if (taskType === 2) {
      const listSQL = `SELECT * FROM list_item WHERE list_item_task_id = ${taskID}`;
      const [listItems] = await conn.query(listSQL); // Fetch list items
      task.listItems = listItems; // Attach list items to task
    }

    // Format due dates on the task
    if (task.task_due_date !== null) {
      const date = new Date(task.task_due_date);
      task.task_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
    } else {
      task.task_due_date_formatted = null;
    }


    // Return success message
    res.status(201).json({ message: "Task added successfully", task });
  } catch (err) {
    if (connection) {
      // Rollback the transaction if an error occurred
      await connection.rollback();
    }
    console.error("Error adding task:", err);
    res.status(500).json({ message: "Failed to add task" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

// PATCH /edit-task/:id
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { newTitle, newDescription, newDueDate, newPriority } = req.body;

  const connection = await conn.getConnection();
  try {
    // Validate the input
    const updates = [];
    const values = [];

    if (newTitle) {
      updates.push("task_title = ?");
      values.push(newTitle);
    }
    if (newDescription) {
      updates.push("task_description = ?");
      values.push(newDescription);
    }
    if (newDueDate) {
      updates.push("task_due_date = ?");
      values.push(newDueDate);
    }
    if (newPriority) {
      updates.push("task_priority_id = ?");
      values.push(newPriority);
    }

    // Check if there's anything to update
    if (updates.length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    // Begin transaction
    await connection.beginTransaction();

    // Construct query dynamically
    const sql = `UPDATE task SET ${updates.join(", ")} WHERE task_id = ?`;
    values.push(id);

    const [results] = await connection.query(sql, values);

    if (results.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Task not found." });
    }

    // Commit the transaction
    await connection.commit();

    // Return success message
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

// PATCH /task-status/:id
exports.updateTaskCompletion = async (req, res) => {
  const taskID = req.params.id;
  const { completed } = req.body;

  try {
    // Validate the input
    if (completed === undefined) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Update database
    let sql;
    let results;

    if (completed === true) {
      // Mark task as complete
      sql = "UPDATE task SET task_complete = ?, task_completed_timestamp = NOW() WHERE task_id = ?";
      [results] = await conn.query(sql, [completed, taskID]);
    } else {
      // Mark task as incomplete
      sql = "UPDATE task SET task_complete = ?, task_completed_timestamp = NULL WHERE task_id = ?";
      [results] = await conn.query(sql, [completed, taskID]);
    }
    console.log(sql, results);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    // If task set to complete, get the timestamp
    if (completed) {
      sql = "SELECT task_completed_timestamp FROM task WHERE task_id = ?";
      [results] = await conn.query(sql, [taskID]);
    }

    if (completed) {
      if (results.length > 0) {
        return res.json({ message: "Task updated successfully", taskCompletedTimestamp: results[0].task_completed_timestamp });
      } else {
        return res.status(404).json({ message: "Task not found." });
      }
    } else {
      return res.json({ message: "Task updated successfully" });
    }
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE /delete-task
exports.deleteTask = async (req, res) => {
  const { taskID, taskType } = req.body;

  // Validate the input
  if (!taskID) {
    return res.status(400).json({ message: "Invalid input - no task ID" });
  }
  if (!taskType) {
    return res.status(400).json({ message: "Invalid input - no task type" });
  }

  let connection; // Connection object for transaction
  try {
    // Get a connection from the pool
    connection = await conn.getConnection();

    // Start a transaction to ensure that both queries succeed or fail together
    await connection.beginTransaction();

    // Delete subtasks from database
    let sqlSubItems;
    let subItemResults;

    if (taskType === "1") {
      sqlSubItems = "DELETE FROM subtask WHERE subtask_task_id = ?";
      [subItemResults] = await connection.query(sqlSubItems, [taskID]);
    } else if (taskType === "2") {
      sqlSubItems = "DELETE FROM list_item WHERE list_item_task_id = ?";
      [subItemResults] = await connection.query(sqlSubItems, [taskID]);
    } // taskType 3 has no subitems

    // Delete task from database
    const sqlTask = "DELETE FROM task WHERE task_id = ?";
    const [taskResults] = await connection.query(sqlTask, [taskID]);
    console.log(taskResults);

    // Check if no rows were deleted
    if (taskType === "1" || taskType === "2") {
      if (subItemResults.affectedRows + taskResults.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found." });
      }
    } else {
      if (taskResults.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found." });
      }
    }

    // Commit the transaction
    await connection.commit();

    // Return success message
    return res.json({message: "Task deleted successfully"});
  } catch (err) {
    if (connection) {
      // Rollback the transaction if an error occurred
      await connection.rollback();
    }
    console.error("Error deleting task:", err);
    return res.status(500).json({ message: "Failed to delete task" });
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

// Decided to handle filtering and sorting on the front-end instead
// exports.filterTasks = async (req, res) => {
  // const userID = req.session.userID;
  // const { filterType, filterValue, orderBy } = req.body;

  // let orderBySQL = "";
  // switch (orderBy) {
  //   case "dueDateSoonest": orderBySQL = "task_due_date "; break;
  //   case "dueDateLatest": orderBySQL = "task_due_date DESC"; break;
  //   case "priorityHighest": orderBySQL = "task_priority_id"; break;
  //   case "priorityLowest": orderBySQL = "task_priority_id DESC"; break;
  //   case "createdFirst": orderBySQL = "task_created_timestamp"; break;
  //   case "createdLast": orderBySQL = "task_created_timestamp DESC"; break;
  //   default: orderBySQL = "task_created_timestamp"; break;
  // }

  // try {
  //   const sql = `SELECT * FROM task WHERE task_user_id = ? AND ?? = ? ORDER BY ?`;
  //   const [results] = await conn.query(sql, [userID, filterType, filterValue, orderBySQL]);

  //   // Fetch subtasks for each task in parallel
  //   await Promise.all(
  //     results.map(async (task) => {
  //       const taskID = task.task_id;
  //       const taskType = task.task_type_id;
  //       if (taskType === 1) {
  //         const subtaskSQL = `SELECT * FROM subtask WHERE subtask_task_id = ${taskID}`;
  //         const [subtasks] = await conn.query(subtaskSQL); // Fetch subtasks
  //         // Format due dates for the subtasks
  //         subtasks.forEach((subtask) => {
  //           if (subtask.subtask_due_date !== null) {
  //             const date = new Date(subtask.subtask_due_date);
  //             subtask.subtask_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
  //           } else {
  //             subtask.subtask_due_date_formatted = null;
  //           }
  //           // Convert priority ID to text
  //           const priorityText = ["None", "Low", "Medium", "High"];
  //           subtask.subtask_priority_text = priorityText[subtask.subtask_priority_id];
  //         });
  //         task.subtasks = subtasks; // Attach subtasks to task
  //       } else if (taskType === 2) {
  //         const listSQL = `SELECT * FROM list_item WHERE list_item_task_id = ${taskID}`;
  //         const [listItems] = await conn.query(listSQL); // Fetch list items
  //         task.listItems = listItems; // Attach list items to task
  //       }
  //     })
  //   );

  //   // Format due dates on the tasks
  //   results.forEach((task) => {
  //     if (task.task_due_date !== null) {
  //       const date = new Date(task.task_due_date);
  //       task.task_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
  //     } else {
  //       task.task_due_date_formatted = null;
  //     }
  //   });

  //   // Send the filtered tasks to the client
  //   res.json({ tasks: results });
  // } catch (err) {
  //   console.error("Error fetching tasks or subtasks:", err);
  //   res.status(500).send("An error occurred");
  // }
// }
