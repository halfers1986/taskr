const conn = require("../utils/dbconn");

exports.getDashboard = async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }
  const userID = req.session.userID;
  try {
    // Fetch tasks
    const sql = "SELECT * FROM task WHERE task_user_id = ? ORDER BY task_created_timestamp DESC";
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

    // Format due dates on the tasks
    results.forEach((task) => {
      if (task.task_due_date !== null) {
        const date = new Date(task.task_due_date);
        task.task_due_date_formatted = date.toLocaleDateString("en-GB"); // Format to DD/MM/YYYY
      } else {
        task.task_due_date_formatted = null;
      }
      console.log(task);
    });
    // Render the template with the combined data
    res.render("main", { tasks: results, categories, layout: false });
  } catch (err) {
    console.error("Error fetching tasks or subtasks:", err);
    res.status(500).send("An error occurred");
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

