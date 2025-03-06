export async function setTaskComplete(event) {
  const task = event.target.closest(".task");
  const taskID = task.dataset.taskId;
  const taskTitle = task.querySelector(".task-title").textContent;

  // Send PATCH request to update task as complete
  const response = await fetch(`/task-status/${taskID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: true }),
  });

  const data = await response.json();
  if (!response.ok) {
    return console.error(data.message || "Failed to update task as complete.");
  }

  // Update the task element in the DOM
  task.classList.add("completed");
  task.dataset.taskComplete = true;
  task.dataset.taskCompletedTimestamp = data.taskCompletedTimestamp;

  // Create an overlay to blur the task
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  task.appendChild(overlay);

  // Create a div to contain the task name, completion timestamp & reopen button
  const reopenTaskContainer = document.createElement("div");
  reopenTaskContainer.classList.add("completed-task-label");
  const formattedDate = new Date(data.taskCompletedTimestamp).toLocaleDateString("en-GB");
  reopenTaskContainer.innerHTML = `<h2>Task "${taskTitle}" completed on ${formattedDate}</h2>`;
  task.appendChild(reopenTaskContainer);

  // Create a button to reopen the task
  const reopenButton = document.createElement("button");
  reopenButton.classList.add("reopen-task-button");
  reopenButton.textContent = "Reopen Task";
  reopenTaskContainer.appendChild(reopenButton);
  reopenButton.addEventListener("click", reopenTask);
}

export async function reopenTask(event) {
  const task = event.target.closest(".task");
  const taskID = task.dataset.taskId;

  // Send PATCH request to update task as incomplete
  const response = await fetch(`/task-status/${taskID}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: false }),
  });

  const data = await response.json();
  if (!response.ok) {
    return console.error(data.message || "Failed to update task as incomplete.");
  }
  console.log("Task reopened");
  console.log(data);

  // Update the task element in the DOM
  task.classList.remove("completed");
  task.querySelector(".overlay").remove();
  task.querySelector(".completed-task-label").remove();
  task.dataset.taskComplete = false;
  task.dataset.taskCompletedTimestamp = null;
};
