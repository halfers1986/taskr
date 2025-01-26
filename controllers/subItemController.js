const conn = require("../utils/dbconn");

exports.updateSubItemStatus = async (req, res) => {
  const { type, id } = req.params;
  const { newStatus } = req.body;
  const sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
  let table;
  let column;
  let idColumn;

  try {
    // Validate the input and set the correct table and column names
    switch (type) {
      case "toggle-subtask":
        {
          table = "subtask";
          column = "subtask_complete";
          idColumn = "subtask_id";
        }
        break;
      case "toggle-shopping-list":
        {
          table = "list_item";
          column = "list_item_complete";
          idColumn = "list_item_id";
        }
        break;
      default:
        return res.status(404).json({ message: "Invalid route" });
    }

    const [results] = await conn.query(sql, [table, column, newStatus, idColumn, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Return success message
    res.json({ message: "Item updated successfully" });
  } catch (err) {
    console.error("Error updating item:", err);
    res.status(500).json({ message: "Failed to update item" });
  }
};

exports.updateSubItem = async (req, res) => {
  const { taskID, subtaskID, newStatus } = req.body;

  try {
    // Validate the input
    if (!taskID || !subtaskID || newStatus === undefined) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Update database
    const sql = "UPDATE subtask SET subtask_complete = ? WHERE subtask_id = ? AND subtask_task_id = ?";

    const [results] = await conn.query(sql, [newStatus, subtaskID, taskID]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Subtask not found." });
    }

    res.json({ message: "Subtask updated successfully" });
  } catch (err) {
    console.error("Error updating subtask:", err);
    res.status(500).json({ message: "Failed to update subtask" });
  }
};

exports.addSubItem = async (req, res) => {
  const { taskID, taskType, element1: item1, element2: item2, element3: item3 } = req.body;
  let date;
  let priority;
  let quantity;
  if (taskType === "1") {
    date = item2 === "" ? null : item2;
    priority = item3 === "0" ? null : item3;
  }

  try {
    // Validate the input
    if (!taskID || !item1) {
      if (!taskID) {
        return res.status(400).json({ message: "Invalid input (taskID not found)" });
      } else {
        return res.status(400).json({ message: "Invalid input (description not found)" });
      }
    }

    // Insert new subtask into database
    let sql;
    let results;
    if (taskType === "1") {
      sql = "INSERT INTO subtask (subtask_task_id, subtask_description, subtask_due_date, subtask_priority_id ) VALUES (?, ?, ?, ?)";
      [results] = await conn.query(sql, [taskID, item1, date, priority]);
    } else {
      sql = "INSERT INTO list_item (list_item_task_id, list_item_name, list_item_store, list_item_quantity) VALUES (?, ?, ?, ?)";
      [results] = await conn.query(sql, [taskID, item1, item2, item3]);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Could not add item: containing task not found." });
    }

    // Return success message and ID of new subtask
    res.json({ message: "Item added successfully", insertID: results.insertId });
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ message: "Failed to add item" });
  }
};

exports.deleteSubItem = async (req, res) => {
  const { lineItemID, parentTaskTypeID } = req.body;

  let sql;
  let results;
  if (parentTaskTypeID === "1") {
    sql = "DELETE FROM subtask WHERE subtask_id = ?";
  } else {
    sql = "DELETE FROM list_item WHERE list_item_id = ?";
  }

  try {
    [results] = await conn.query(sql, [lineItemID]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).json({ message: "Failed to delete item" });
  }
};
