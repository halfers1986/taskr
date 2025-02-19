import { closeModal, openModal } from "./modal.js";
import { addShoppingListItemToNewList, resetShoppingListForm } from "./addShoppingListItemToNewList.js";
import { addSubtaskToNewTask, resetSubtaskForm } from "./addSubtaskToNewTask.js";
import deleteTask from "./deleteTask.js";
import editTask from "./editTask.js";

// -- CONFIG --
// modal
let visibleModal = null;
const modal = document.querySelector(".add-task-dialog");
const modalCloseButton = modal.querySelector("#cancel-add-task-button");

// form
const addTaskButton = modal.querySelector("#confirm-add-task-button");
const errorElement = document.getElementById("add-task-error-message");
const taskType = document.getElementById("task-type");
const form = document.getElementById("add-task-form");
const title = document.getElementById("task-title");

// To-do task
const hasSubtasksCheckbox = document.getElementById("has-subtasks");
const hasSubtasksFieldset = document.getElementById("has-subtasks-fieldset");
const addSubtaskButton = document.getElementById("add-subtask-button-modal");
const subtaskContainer = document.getElementById("subtask-container-modal");

// Shopping list
const shoppingListContainer = document.getElementById("shopping-list-container-modal");
const addItemButton = document.getElementById("add-shopping-list-item-button");

// Description, date, priority
const descDatePriority = document.getElementById("description-due-date-priority");
const dueDate = document.getElementById("task-due-date");
const priority = document.getElementById("task-priority");
const description = document.getElementById("task-description");

function validateForm() {
  if (title.value === "") {
    errorElement.textContent = "Please provide a title.";
    title.setAttribute("aria-invalid", "true");
    title.addEventListener("input", () => {
      title.setAttribute("aria-invalid", "false");
      errorElement.textContent = "";
    });
    return false;
  }
  // Validate to-do & note forms
  if ((taskType.value === "1" || taskType.value === "3") && (description.value === "" || title.value === "")) {
    if (description.value === "" && title.value === "") {
      errorElement.textContent = "Please complete required fields.";
      description.setAttribute("aria-invalid", "true");
      title.setAttribute("aria-invalid", "true");
      description.addEventListener("input", () => {
        description.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
      title.addEventListener("input", () => {
        title.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
      return false;
    } else if (title.value === "") {
      errorElement.textContent = "Please provide a title.";
      title.setAttribute("aria-invalid", "true");
      title.addEventListener("input", () => {
        title.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
      return false;
    } else if (description.value === "") {
      errorElement.textContent = "Please provide a description.";
      description.setAttribute("aria-invalid", "true");
      description.addEventListener("input", () => {
        description.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
      return false;
    }
  }
  // Validate shopping list form
  if (taskType.value === "2" && title.value === "") {
    errorElement.textContent = "Please provide a title.";
    title.setAttribute("aria-invalid", "true");
    title.addEventListener("input", () => {
      title.setAttribute("aria-invalid", "false");
      errorElement.textContent = "";
    });
    return false;
  }
  return true;
}

async function confirmAddAction(event) {
  // Prevent the form from submitting
  //   event.preventDefault();

  // Change the button text to show loading state
  addTaskButton.setAttribute("aria-busy", "true");
  addTaskButton.setAttribute("aria-label", "Adding task...");
  addTaskButton.textContent = "";

  // Validate the form
  if (!validateForm()) {
    // Change the button text back to normal
    addTaskButton.removeAttribute("aria-busy");
    addTaskButton.removeAttribute("aria-label");
    addTaskButton.textContent = "Add Task";
    return;
  }

  // Get the form values
  let formTitle = title.value;
  let formDescription = description.value;
  let formPriority = priority.value;
  let formDueDate;
  let formSubtasks = [];
  let formShoppingListItems = [];

  // Ensure the due date is in the correct format
  if (dueDate.value === "") {
    formDueDate = null;
  } else {
    formDueDate = dueDate.value;
  }

  // Convert the priority value to a number
  formPriority = formPriority === "High" ? 3 : formPriority === "Medium" ? 2 : formPriority === "Low" ? 1 : null;

  // Get the sub-form values
  if (taskType.value === "2") {
    shoppingListContainer.querySelectorAll(".modal-row").forEach((row) => {
      // Create the shopping list item object
      let item = {
        name: row.children[0].textContent,
        store: row.children[1].textContent,
        count: row.children[2].textContent,
      };
      formShoppingListItems.push(item);
    });
  }
  if (taskType.value === "1") {
    subtaskContainer.querySelectorAll(".subtask-row").forEach((row) => {
      // Convert the priority value to a number
      let priorityID = row.children[2].textContent === "High" ? 3 : row.children[2].textContent === "Medium" ? 2 : 1;
      // Ensure the due date is in the correct format
      let dueDateValue = row.children[1].dataset.date ? row.children[1].dataset.date : null;

      // Create the subtask object
      let subtask = {
        name: row.children[0].textContent,
        dueDate: dueDateValue,
        priority: priorityID,
      };
      formSubtasks.push(subtask);
    });
  }

  // Create the data object
  const data = {
    type: taskType.value,
    title: formTitle,
    description: formDescription,
    priority: formPriority,
    dueDate: formDueDate,
  };

  // Only add subtasks or shopping list items if they exist
  if (formSubtasks.length > 0) {
    data.subtasks = formSubtasks;
  }
  if (formShoppingListItems.length > 0) {
    data.shoppingListItems = formShoppingListItems;
  }

  // Send the form data to the server
  const response = await fetch("/add-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  // Change the button text back to normal
  addTaskButton.removeAttribute("aria-busy");
  addTaskButton.removeAttribute("aria-label");
  addTaskButton.textContent = "Add Task";

  if (!response.ok) {
    console.log(responseData.message || "Failed to add task.");
    if (response.status === 400) {
      errorElement.textContent = "Invalid input";
    } else if (response.status === 404) {
      errorElement.textContent = "Could not add task. Please try again.";
    } else {
      errorElement.textContent = "Failed to add task. This one's our fault, not yours.";
    }
    return;
  }
  // Add the new task to the DOM
  addTaskToDOM(responseData.task);

  // Remove the "No tasks" message if it exists
  if (document.querySelector(".no-tasks")) {
    document.querySelector(".no-tasks").remove();
  }

  // Close the modal
  closeAction();

}

// Add the new task to the DOM using a Handlebars template
function addTaskToDOM(task) {
  // Get the Handlebars task template from the DOM
  const source = document.getElementById("task-template").innerHTML;

  // Compile the Handlebars template
  const taskTemplate = Handlebars.compile(document.getElementById("task-template").innerHTML);

  // Render the task into the template
  const taskHTML = taskTemplate(task);

  // Add the task to the DOM
  const taskContainer = document.getElementById("task-list");
  taskContainer.insertAdjacentHTML('afterbegin', taskHTML);

  // Get the newly added task
  const newTask = document.querySelector(".primary-content").firstElementChild;
  const deleteButton = newTask.querySelector(".delete-button");
  const editButton = newTask.querySelector(".edit-button");

  // Add event listeners to the new task
  deleteButton.addEventListener("click", deleteTask);
  editButton.addEventListener("click", editTask);
}

// Close the modal
function closeAction() {
  // Close the modal
  closeModal(visibleModal);

  // Remove error messages
  errorElement.textContent = "";

  // Reset classes and attributes
  hasSubtasksFieldset.classList.remove("show");
  hasSubtasksFieldset.classList.add("hide");
  descDatePriority.classList.remove("show");
  descDatePriority.classList.add("hide");
  shoppingListContainer.classList.add("hide");
  shoppingListContainer.classList.remove("show");
  subtaskContainer.classList.remove("show");
  subtaskContainer.classList.add("hide");
  title.removeAttribute("aria-invalid");
  description.removeAttribute("aria-invalid");

  // Reset form fields
  resetSubtaskForm();
  resetShoppingListForm();
  form.reset();
  addTaskButton.setAttribute("disabled", "true");
}

// SHOW/HIDE FORMS
// Show to-do form
function showToDo() {
  // Hide the shopping list & note form
  descDatePriority.classList.remove("hide");
  descDatePriority.classList.add("show");
  shoppingListContainer.classList.add("hide");
  shoppingListContainer.classList.remove("show");
  // Show the subtask form
  setTimeout(() => {
    hasSubtasksFieldset.classList.remove("hide");
    hasSubtasksFieldset.classList.add("show");
  }, 200);
}

// Show the shopping list form
function showShoppingList() {
  // Hide the to-do & note form
  hasSubtasksFieldset.classList.remove("show");
  hasSubtasksFieldset.classList.add("hide");
  descDatePriority.classList.remove("show");
  descDatePriority.classList.add("hide");
  // Show the shopping list form
  setTimeout(() => {
    shoppingListContainer.classList.remove("hide");
    shoppingListContainer.classList.add("show");
  }, 200);
}

// Show the note form
function showNote() {
  // Hide the to-do & shopping list form
  hasSubtasksFieldset.classList.remove("show");
  hasSubtasksFieldset.classList.add("hide");
  shoppingListContainer.classList.add("hide");
  shoppingListContainer.classList.remove("show");
  // Show the note form
  setTimeout(() => {
    descDatePriority.classList.remove("hide");
    descDatePriority.classList.add("show");
  }, 200);
}

// ACTION EVENT LISTENERS
addTaskButton.addEventListener("click", () => confirmAddAction());
modalCloseButton.addEventListener("click", () => closeAction());
if (taskType) {
  taskType.addEventListener("change", () => {
    if (taskType.value === "1") {
      showToDo();
    } else if (taskType.value === "2") {
      showShoppingList();
    } else if (taskType.value === "3") {
      showNote();
    }
  });
}
if (hasSubtasksCheckbox) {
  hasSubtasksCheckbox.addEventListener("change", () => {
    if (hasSubtasksCheckbox.checked) {
      subtaskContainer.classList.remove("hide");
      subtaskContainer.classList.add("show");
    } else {
      subtaskContainer.classList.remove("show");
      subtaskContainer.classList.add("hide");
    }
  });
}
if (addItemButton) {
  addItemButton.addEventListener("click", (event) => {
    addShoppingListItemToNewList(event);
  });
}
if (addSubtaskButton) {
  addSubtaskButton.closest("#subtask-container-modal").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addSubtaskToNewTask(event);
    }
  });
  addSubtaskButton.addEventListener("click", (event) => {
    addSubtaskToNewTask(event);
  });
}
taskType.addEventListener("change", () => {
  if (taskType.value !== "0") {
    addTaskButton.removeAttribute("disabled");
  }
  if (taskType.value === "1") {
    showToDo();
  } else if (taskType.value === "2") {
    showShoppingList();
  } else if (taskType.value === "3") {
    showNote();
  }
});

// Exported function
export default function addTask(event) {
  event.preventDefault();
  visibleModal = modal;
  openModal(modal);
}
