// -- Declare global variables --
// Find the closest (containing) task element
let task;

// Get the task type
let taskType;

// Get the elements to edit
let taskTitleElement;
let taskDescriptionElement;
let taskDueDateElement;
let taskPriorityElement;
let taskCategoryElement;

// Store the current elements so they can be restored if the user cancels the edit
let taskElements;
// Store the current values of the task elements so they can be restored if the user cancels the edit
let initialTaskValues = {};

// Store the edit and delete buttons so they can be restored once edit view is closed
let editButton;
let deleteButton;
let markCompleteButton;

// Store the input fields once they are created
let inputFields = {};
// Store the category options so they can be used in the category select element
let categoryOptions;

// Store the save and cancel buttons so they can be removed once edit view is closed
let saveButton;
let cancelButton;



function initializeVariables(task) {
  taskType = task.dataset.taskType;
  taskTitleElement = task.querySelector(".task-title");
  taskDescriptionElement = task.querySelector(".task-description");
  taskDueDateElement = task.querySelector(".task-due-date");
  taskPriorityElement = task.querySelector(".task-priority");
  taskCategoryElement = task.querySelector(".task-category");
  taskElements = { taskTitleElement, taskDescriptionElement, taskDueDateElement, taskPriorityElement, taskCategoryElement };
  editButton = task.querySelector(".edit-button");
  deleteButton = task.querySelector(".delete-button");
}

function getAndStoreInitialValues() {
  let taskTitleText = taskTitleElement.textContent;
  let taskDueDateValue;
  if (taskType !== "2") {
    // Shopping list does not have a due date
    taskDueDateValue = taskDueDateElement.dataset.taskDueDate.split('T')[0];
  }
  let taskDescriptionText;
  if (taskDescriptionElement) {
    taskDescriptionText = taskDescriptionElement.textContent;
  }

  let taskPriorityValue;
  if (!taskPriorityElement.dataset.taskPriority) {
    taskPriorityValue = "";
  } else {
    taskPriorityValue = taskPriorityElement.dataset.taskPriority;
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

  let taskCategoryValue;
  if (taskCategoryElement.dataset.taskCategory) {
    taskCategoryValue = taskCategoryElement.dataset.taskCategory;
  } else {
    taskCategoryValue = null;
  }
  // Store the initial values of the task elements in global array variable
  initialTaskValues = { taskTitleText, taskDueDateValue, taskDescriptionText, taskPriorityValue, taskCategoryValue };
}

function makeTitleInput() {
  const taskTitleInput = document.createElement("input");
  taskTitleInput.setAttribute("type", "text");
  taskTitleInput.setAttribute("value", initialTaskValues.taskTitleText);
  taskTitleInput.classList.add("task-title-input");
  return taskTitleInput;
}

function makeDescriptionInput() {
  const taskDescriptionInput = document.createElement("textarea");
  taskDescriptionInput.setAttribute("type", "text");
  taskDescriptionInput.textContent = initialTaskValues.taskDescriptionText;
  taskDescriptionInput.classList.add("task-description-input");
  return taskDescriptionInput;
}

function makeDueDateInput() {
  const taskDueDateInput = document.createElement("input");
  taskDueDateInput.setAttribute("type", "date");
  taskDueDateInput.setAttribute("value", initialTaskValues.taskDueDateValue);
  taskDueDateInput.classList.add("task-due-date-input");
  return taskDueDateInput;
}

function makePriorityInput() {
  const taskPriorityInput = document.createElement("select");
  taskPriorityInput.classList.add("task-priority-input");
  taskPriorityInput.setAttribute("value", initialTaskValues.taskPriorityValue);
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
    if (priorityOption.value === initialTaskValues.taskPriorityValue) {
      priorityOption.selected = true;
    }
    taskPriorityInput.appendChild(priorityOption);
  });
  return taskPriorityInput;
}

function makeCategoryInput() {
  const taskCategoryInput = document.createElement("select");
  taskCategoryInput.classList.add("task-category-input");
  taskCategoryInput.setAttribute("value", initialTaskValues.taskCategoryValue);
  // Standard category options
  categoryOptions = [
    { id: null, name: "" },  // Blank option
    { id: "1", name: "Work" },
    { id: "2", name: "Personal" },
    { id: "3", name: "Urgent" },
    { id: "4", name: "Home" },
    { id: "5", name: "Health" },
    { id: "6", name: "Shopping" },
    { id: "7", name: "Study" },
    { id: "8", name: "Hobby" }
  ];
  // User-defined category options - get from DOM where they exist in filter checkboxes (avoids another fetch)
  const userDefinedCategories = [];
  document.querySelectorAll("input[type='checkbox'][name='userCategoryFilter']").forEach((checkbox) => {
    categoryOptions.push({
      id: checkbox.value,          // The value attribute (category ID)
      name: checkbox.parentNode.textContent.trim() // The text content (category name)
    });
  });

  // Function to add a category option to the select element
  categoryOptions.forEach(category => {
    const categoryOption = document.createElement("option");
    categoryOption.textContent = category.name;
    categoryOption.value = category.id;
    if (categoryOption.value == initialTaskValues.taskCategoryValue) { // Ensure correct selection
      categoryOption.selected = true;
    }
    taskCategoryInput.appendChild(categoryOption);
  });

  return taskCategoryInput;
}

// Function to save the changes to the task
async function saveChanges() {
  // Get the variables to send in the PUT request
  let newTitle;
  let newDescription;
  let newDueDate;
  let newPriority;
  let newCategory;

  if (inputFields.titleInput.value !== initialTaskValues.taskTitleText) {
    newTitle = inputFields.titleInput.value;
  }

  if (inputFields.descriptionInput.value !== initialTaskValues.taskDescriptionText) {
    newDescription = inputFields.descriptionInput.value;
  }

  if (inputFields.dueDateInput.value !== initialTaskValues.taskDueDateValue) {
    newDueDate = inputFields.dueDateInput.value;
  }

  if (inputFields.priorityInput.value !== initialTaskValues.taskPriorityValue) {
    newPriority = inputFields.priorityInput.value;
  }
  if (inputFields.categoryInput.value !== initialTaskValues.taskCategoryValue) {
    newCategory = inputFields.categoryInput.value;
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
  if (newCategory) {
    requestData.category = newCategory;
  }

  const taskID = task.dataset.taskId;

  // Send PATCH request to update task
  const response = await fetch("/edit-task/" + taskID, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  const responseData = await response.json();

  if (!response.ok) {
    console.log(responseData.message || "Failed to edit task.");
    cancelChanges();
    return;
  }

  // Replace the input fields with the original task elements, with the updated values
  inputFields.titleInput.replaceWith(taskTitleElement);
  if (newTitle) {
    taskTitleElement.textContent = newTitle;
  }
  inputFields.descriptionInput.replaceWith(taskDescriptionElement);
  if (newDescription) {
    taskDescriptionElement.textContent = newDescription;
  }
  inputFields.dueDateInput.replaceWith(taskDueDateElement);
  if (newDueDate) {
    taskDueDateElement.innerHTML = "<u>Due Date:</u> " + newDueDate.split("-").reverse().join("/");
  }
  inputFields.priorityInput.replaceWith(taskPriorityElement);
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
    taskPriorityElement.innerHTML = "<u>Priority:</u> " + priorityText;
  }
  inputFields.categoryInput.replaceWith(taskCategoryElement);
  if (newCategory) {
    const categoryId = parseInt(newCategory);
    let categoryText;
    categoryOptions.forEach((category) => {
      if (parseInt(category.id) === categoryId) {
        categoryText = category.name;
      }
    });
    taskCategoryElement.innerHTML = "<u>Category:</u> " + categoryText;
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
  inputFields.titleInput.replaceWith(taskElements.taskTitleElement);
  inputFields.descriptionInput.replaceWith(taskElements.taskDescriptionElement);
  inputFields.dueDateInput.replaceWith(taskElements.taskDueDateElement);
  inputFields.priorityInput.replaceWith(taskElements.taskPriorityElement);
  inputFields.categoryInput.replaceWith(taskElements.taskCategoryElement);

  // Replace the save and cancel buttons with the edit and delete buttons
  saveButton.replaceWith(editButton);
  cancelButton.replaceWith(deleteButton);

  // Enable the mark complete button
  markCompleteButton.disabled = false;
}


export default function editTask(event) {

  task = event.target.closest(".task");
  initializeVariables(task);

  getAndStoreInitialValues();

  // Create the new input fields
  const titleInput = makeTitleInput();
  const descriptionInput = makeDescriptionInput();
  const dueDateInput = makeDueDateInput();
  const priorityInput = makePriorityInput();
  const categoryInput = makeCategoryInput();

  inputFields = { titleInput, descriptionInput, dueDateInput, priorityInput, categoryInput };

  // Replace the task elements with the input fields
  taskTitleElement.replaceWith(titleInput);
  if (taskType !== "2") {
    // Shopping list does not have a due date or description
    taskDescriptionElement.replaceWith(descriptionInput);
    taskDueDateElement.replaceWith(dueDateInput);
  }
  taskPriorityElement.replaceWith(priorityInput);
  taskCategoryElement.replaceWith(categoryInput);

  // Create save and cancel buttons
  saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save-button", "primary");
  cancelButton = document.createElement("button");
  cancelButton.textContent = "Cancel";
  cancelButton.classList.add("cancel-button", "secondary");

  // Replace the current buttons with the save and cancel buttons
  editButton.replaceWith(saveButton);
  deleteButton.replaceWith(cancelButton);

  // Make the task complete button inactive while editing
  markCompleteButton = task.querySelector(".mark-complete-button");
  markCompleteButton.disabled = true;

  titleInput.focus();

  // Add event listeners to the save and cancel buttons
  saveButton.addEventListener("click", async () => {
    saveChanges();
  });
  cancelButton.addEventListener("click", () => {
    cancelChanges();
  });
}
