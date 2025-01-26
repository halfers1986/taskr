export default function editTask(event) {
  // Find the closest (containing) task element
  const task = event.target.closest(".task");

  // Get the task type
  const taskType = task.dataset.taskType;

  // Get the elements to edit
  const taskTitle = task.querySelector(".task-title");
  const taskDescription = task.querySelector(".task-description");
  const taskDueDate = task.querySelector(".task-due-date");
  const taskPriority = task.querySelector(".task-priority");

  // Store the current elements so they can be restored if the user cancels the edit
  const taskElements = [taskTitle, taskDescription, taskDueDate, taskPriority];

  // Get the current values of the task elements
  let taskTitleText = taskTitle.textContent;
  let taskDueDateValue;
  if (taskType !== "2") {
    // Shopping list does not have a due date
    taskDueDateValue = taskDueDate.dataset.date;
  }
  let taskDescriptionText;
  if (taskDescription) {
    taskDescriptionText = taskDescription.textContent;
  }

  let taskPriorityValue;
  if (!taskPriority.dataset.taskPriority) {
    taskPriorityValue = "";
  } else {
    taskPriorityValue = taskPriority.dataset.taskPriority;
  }
  let taskPriorityText;
  switch (taskPriorityValue) {
    case "1":
      taskPriorityText = "Low";
      break;
    case "2":
      taskPriorityText = "Medium";
      break;
    case "3":
      taskPriorityText = "High";
      break;
    default:
      taskPriorityText = "";
  }

  // Create input fields for the task title, description, due date, and priority
  // Title input element
  const taskTitleInput = document.createElement("input");
  taskTitleInput.setAttribute("type", "text");
  taskTitleInput.setAttribute("value", taskTitleText);
  taskTitleInput.classList.add("task-title-input");
  // Description input element
  const taskDescriptionInput = document.createElement("textarea");
  taskDescriptionInput.setAttribute("type", "text");
  taskDescriptionInput.textContent = taskDescriptionText;
  taskDescriptionInput.classList.add("task-description-input");
  // Due date input element
  const taskDueDateInput = document.createElement("input");
  taskDueDateInput.setAttribute("type", "date");
  taskDueDateInput.setAttribute("value", taskDueDateValue);
  taskDueDateInput.classList.add("task-due-date-input");
  // Priority input element
  const taskPriorityInput = document.createElement("select");
  taskPriorityInput.classList.add("task-priority-input");
  taskPriorityInput.setAttribute("value", taskPriorityValue);
  const priorityOptions = ["Low", "Medium", "High"];
  priorityOptions.forEach((option) => {
    const priorityOption = document.createElement("option");
    priorityOption.textContent = option;
    switch (option) {
      case "Low":
        priorityOption.value = "1";
        break;
      case "Medium":
        priorityOption.value = "2";
        break;
      case "High":
        priorityOption.value = "3";
        break;
      default:
        priorityOption.value = "0";
    }
    if (priorityOption.value === taskPriorityValue) {
      priorityOption.selected = "true";
    }
    taskPriorityInput.appendChild(priorityOption);
  });

  // Replace the task elements with the input fields
  taskTitle.replaceWith(taskTitleInput);
  if (taskType !== "2") {
    // Shopping list does not have a due date or description
    taskDescription.replaceWith(taskDescriptionInput);
    taskDueDate.replaceWith(taskDueDateInput);
  }
  taskPriority.replaceWith(taskPriorityInput);

  // Insert the priority element before the date element
  //   const parentElement = taskDueDateInput.parentElement;
  //   parentElement.insertBefore(taskPriorityInput, taskDueDateInput);

  // Create save and cancel buttons
  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save-button", "primary");
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button", "secondary");

  // Replace the current buttons with the save and cancel buttons
  const editButton = task.querySelector(".edit-button");
  const deleteButton = task.querySelector(".delete-button");
  editButton.replaceWith(saveButton);
  deleteButton.replaceWith(cancelButton);

  // Make the task complete button inactive while editing
  const markCompleteButton = task.querySelector(".mark-complete-button");
  markCompleteButton.disabled = true;

  taskTitleInput.focus();

  // Add event listeners to the save and cancel buttons
  saveButton.addEventListener("click", async () => {
    saveChanges();
  });
  cancelButton.addEventListener("click", () => {
    cancelChanges();
  });

  // Function to save the changes to the task
  async function saveChanges() {
    // Get the variables to send in the PUT request
    let newTitle;
    let newDescription;
    let newDueDate;
    let newPriority;

    if (taskTitleInput.value !== taskTitleText) {
      newTitle = taskTitleInput.value;
    }

    if (taskDescriptionInput.value !== taskDescriptionText) {
      newDescription = taskDescriptionInput.value;
    }

    if (taskDueDateInput.value !== taskDueDateValue) {
      newDueDate = taskDueDateInput.value;
    }

    if (taskPriorityInput.value !== taskPriorityValue) {
      newPriority = taskPriorityInput.value;
    }

    let requestData = {};
    if (newTitle) {
      requestData.title = newTitle;
    }
    if (newDescription) {
      requestData.description = newDescription;
    }
    if (newDueDate) {
      requestData.dueDate = newDueDate;
    }
    if (newPriority) {
      requestData.priority = newPriority;
    }

    const taskID = task.dataset.taskId;

    // Send PATCH request to update task title
    const response = await fetch("/edit-task/" + taskID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskID, newTitle, newDescription, newDueDate, newPriority }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData.message || "Failed to edit task.");
      cancelChanges();
      return;
    }

    // Replace the input fields with the original task elements, with the updated values
    taskTitleInput.replaceWith(taskTitle);
    if (newTitle) {
      taskTitle.textContent = newTitle;
    }
    taskDescriptionInput.replaceWith(taskDescription);
    if (newDescription) {
      taskDescription.textContent = newDescription;
    }
    taskDueDateInput.replaceWith(taskDueDate);
    if (newDueDate) {
      taskDueDate.innerHTML = "<u>Due Date:</u> " + newDueDate.split("-").reverse().join("/");
    }
    taskPriorityInput.replaceWith(taskPriority);
    if (newPriority) {
      let priorityText;
      switch (newPriority) {
        case "1":
          priorityText = "Low";
          break;
        case "2":
          priorityText = "Medium";
          break;
        case "3":
          priorityText = "High";
          break;
        default:
          priorityText = "";
      }
      taskPriority.innerHTML = "<u>Priority:</u> " + priorityText;
    }

    // Replace the save and cancel buttons with the edit and delete buttons
    saveButton.replaceWith(editButton);
    cancelButton.replaceWith(deleteButton);

    // Enable the mark complete button
    markCompleteButton.disabled = false;
  }

  // Function to cancel the changes to the task
  function cancelChanges() {
    // Replace the input fields with the original task elements
    taskTitleInput.replaceWith(taskTitle);
    taskDescriptionInput.replaceWith(taskDescription);
    taskDueDateInput.replaceWith(taskDueDate);
    taskPriorityInput.replaceWith(taskPriority);

    // Replace the save and cancel buttons with the edit and delete buttons
    saveButton.replaceWith(editButton);
    cancelButton.replaceWith(deleteButton);

    // Enable the mark complete button
    markCompleteButton.disabled = false;
  }
}
