const subtaskDescriptionField = document.getElementById("add-subtask-field");
const addSubtaskDueDateField = document.getElementById("add-subtask-due-date");
const addSubtaskPriorityField = document.getElementById("add-subtask-priority");
const errorElement = document.getElementById("add-subtask-error-message");
const subtaskContainer = document.getElementById("subtask-container-modal");

export function resetSubtaskForm() {
  subtaskDescriptionField.value = "";
  addSubtaskDueDateField.value = "";
  addSubtaskPriorityField.value = "0";
  errorElement.textContent = "";
  let tableRowsSubtasks = document.querySelectorAll(".subtask-row");
  tableRowsSubtasks.forEach((row) => {
    row.remove();
  });
}

export function addSubtaskToNewTask(event) {
  event.preventDefault();

  // Get the values of the subtask name, due date, and priority fields
  let subtaskDescription = subtaskDescriptionField.value;
  let subtaskDueDate = addSubtaskDueDateField.value;
  let subtaskDueDateFormatted = subtaskDueDate.split("-").reverse().join("/");
  let subtaskPriority = addSubtaskPriorityField.value;

  // Validate the input
  if (subtaskDescription === "") {
    errorElement.textContent = "Please provide a subtask name.";
    subtaskDescriptionField.setAttribute("aria-invalid", "true");
    subtaskDescriptionField.addEventListener("input", () => {
      subtaskDescriptionField.setAttribute("aria-invalid", "false");
      errorElement.textContent = "";
    });
    return;
  }

  // Map the priority value to a string
  const priorityMap = {
    0: null,
    1: "Low",
    2: "Medium",
    3: "High",
  };
  // Convert the priority value to the string from the map
  const subtaskPriorityText = priorityMap[subtaskPriority];

  // Create new input fields for the subtask name, due date, and priority
  const newSubtask = document.createElement("td");
  newSubtask.classList.add("subtask-description");
  newSubtask.innerText = subtaskDescription;

  const newDueDate = document.createElement("td");
  newDueDate.classList.add("subtask-due-date");
  newDueDate.innerText = subtaskDueDateFormatted;
  newDueDate.dataset.date = subtaskDueDate;

  const newPriority = document.createElement("td");
  newPriority.classList.add("subtask-priority");
  newPriority.dataset.priority = subtaskPriority;
  newPriority.innerText = subtaskPriorityText;

  // Create a delete button for the new subtask
  const deleteButton = document.createElement("button");
  const deleteColumn = document.createElement("td");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("button-table", "outline", "primary");
  deleteColumn.appendChild(deleteButton);

  // Create a new table row to contain the new subtask, due date, priority, and delete button
  const row = document.createElement("tr");
  row.classList.add("subtask-row");
  row.appendChild(newSubtask);
  row.appendChild(newDueDate);
  row.appendChild(newPriority);
  row.appendChild(deleteColumn);

  // Check if the table exists, if not, create it
  let table= subtaskContainer.querySelector(".subtask-table");
  if (!table) {
    table = document.createElement("table");
    table.classList.add("table");
    table.classList.add("subtask-table");
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Description", "Date", "Priority", ""];
    headers.forEach(headerText => {
      const header = document.createElement("th");
      header.innerText = headerText;
      headerRow.appendChild(header);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    subtaskContainer.appendChild(table);
  }

  const tableBody = table.querySelector("tbody");
  tableBody.appendChild(row);

  // Clear the input fields and focus on the subtask name field
  subtaskDescriptionField.value = "";
  addSubtaskDueDateField.value = "";
  addSubtaskPriorityField.value = "0";
  errorElement.textContent = "";
  subtaskDescriptionField.focus();
  subtaskDescriptionField.removeAttribute("aria-invalid");

  // Enable the delete button for the new subtask
  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    deleteButton.parentElement.parentElement.remove();
  });
}
