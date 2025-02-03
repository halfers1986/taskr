const conn = require("../utils/dbconn");

// GET /data
exports.getDataDashboard = async (req, res) => {
  res.render("data", { layout: false });
};

exports.getBasicDashboard = async (req, res) => {
  const userID = req.session.userID;

  try {
    const sql = `SELECT task.task_type_id, type.type_name, task.task_category_id, category.category_name,
    task.task_priority_id, priority.priority_name, subtask.subtask_id, subtask.subtask_complete, list_item.list_item_id,
    list_item.list_item_complete
    FROM task
    LEFT JOIN type ON task.task_type_id = type.type_id
    LEFT JOIN category ON task.task_category_id = category.category_id
    LEFT JOIN priority ON task.task_priority_id = priority.priority_id
    LEFT JOIN subtask ON task.task_id = subtask.subtask_task_id
    LEFT JOIN list_item ON task.task_id = list_item.list_item_task_id
    WHERE task.task_user_id = ${userID}`;
    const [results] = await conn.query(sql);

    if (results.length === 0) {
      return res.json({ results: [] });
    }

    return res.json({ results });

  } catch (err) {
    console.error("Error getting basic dashboard:", err);
    res.status(500).json({ message: "Failed to get basic dashboard" });
  }
};

