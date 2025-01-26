export default async function addItemToTaskTable(event) {
  // Prevent the default behavior (form submission or page reload)
  event.preventDefault();

  // Find the closest (containing) task element
  const task = event.target.closest(".task");
  const taskID = task.dataset.taskId;
  const taskType = task.dataset.taskType;

  let element1;
  let element2;
  let element3;
  if (taskType === "1") {
    element1 = task.querySelector(".add-subtask-field").value;
    element2 = task.querySelector(".add-subtask-due-date").value;
    element3 = task.querySelector(".add-subtask-priority").value;
  } else {
    element1 = task.querySelector(".add-item-field").value;
    element2 = task.querySelector(".add-item-store").value;
    element3 = task.querySelector(".add-item-quantity").value;
  }

  if (element1 !== "") {
    try {
      // Send POST request to add subtask
      const response = await fetch("/new-table-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskID, taskType, element1, element2, element3 }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to add new subtask.");
        // TODO: Display error message to user
      }

      // Add the subtask to the DOM
      // If there is no subtask table, create one
      if (!task.querySelector("table")) {
        let container;
        if (taskType === "1") {
          container = task.querySelector(".sub-item-dropdown");
        } else {
          container = task.querySelector(".shopping-list");
        }
        const newTable = document.createElement("table");
        newTable.className = "table";

        const tableHeader = document.createElement("thead");
        const headerRow = document.createElement("tr");
        let headers;
        if (taskType === "1") {
          headers = ["Description", "Due Date", "Priority"];
        } else {
          headers = ["Item", "Store", "Quantity"];
        }
        headerRow.appendChild(document.createElement("th")); // leading empty cell for checkbox column
        for (let header of headers) {
          const th = document.createElement("th");
          th.textContent = header;
          headerRow.appendChild(th);
        }
        headerRow.appendChild(document.createElement("th")); // trailing empty cell for buttons column
        tableHeader.appendChild(headerRow);
        newTable.appendChild(tableHeader);

        const tableBody = document.createElement("tbody");
        if (taskType === "1") {
          tableBody.className = "subtask-table-body";
        } else {
          tableBody.className = "shopping-list-table-body";
        }
        newTable.appendChild(tableBody);
        container.prependChild(newTable);
      }

      // Create a new row in the subtask table
      const newRow = document.createElement("tr");
      newRow.classList.add("tile-row");
      if (taskType === "1") {
        newRow.dataset.subtaskId = data.insertId;
      } else {
        newRow.dataset.listItemId = data.insertId;
      }

      // Create cells for the new row
      const checkboxCell = document.createElement("td");
      checkboxCell.classList.add("column-checkbox");
      const cell1 = document.createElement("td");
      const cell2 = document.createElement("td");
      const cell3 = document.createElement("td");
      if (taskType === "1") {
        cell1.classList.add("subtask-description", "column");
        cell2.classList.add("subtask-due-date", "column");
        cell3.classList.add("subtask-priority", "column");
      } else {
        cell1.classList.add("list-item-name", "column");
        cell2.classList.add("list-item-store", "column");
        cell3.classList.add("list-item-quantity", "column");
      }
      const buttonsCell = document.createElement("td");
      buttonsCell.classList.add("column", "column-buttons");

      // Create a new checkbox element & add it to the checkbox cell
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("toggle-complete");
      checkboxCell.appendChild(checkbox);

      // Create button elements (edit & delete) & add them to the buttons cell
      const editButton = document.createElement("button");
      editButton.classList.add("edit-button-table", "button-table", "primary", "outline");
      editButton.textContent = "Edit";
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button-table", "button-table", "secondary", "outline");
      deleteButton.textContent = "Delete";
      buttonsCell.appendChild(editButton);
      buttonsCell.appendChild(deleteButton);

      // Add the subtask description, due date, and priority to the cells
      cell1.textContent = element1;
      if (taskType === "1") {
        let dueDate;
        if (element2 !== "") {
          dueDate = new Date(element2);
          cell2.textContent = dueDate.toLocaleDateString("en-UK", { day: "numeric", month: "short", year: "numeric" });
        } else {
          cell2.textContent = "";
        }
        const priority = element3 === 3 ? "High" : element3 === 2 ? "Medium" : "Low";
        cell3.textContent = priority;
      } else {
        cell2.textContent = element2;
        cell3.textContent = element3;
      }

      // Add the data for date and priority to the cells
      if (taskType === "1") {
        cell2.dataset.subtaskDueDate = data.subtaskDueDate;
        cell3.dataset.subtaskPriority = data.subtaskPriorityId;
      }

      // Append the checkbox, cells, and buttons to the new row
      newRow.appendChild(checkboxCell);
      newRow.appendChild(cell1);
      newRow.appendChild(cell2);
      newRow.appendChild(cell3);
      newRow.appendChild(buttonsCell);

      const table = task.querySelector("table");
      const tbody = table.querySelector("tbody");
      tbody.appendChild(newRow);

      // Clear the value of the new subtask input element
      if (taskType === "1") {
        task.querySelector(".add-subtask-field").value = "";
        task.querySelector(".add-subtask-due-date").value = "";
        task.querySelector(".add-subtask-priority").value = "0";
      } else {
        task.querySelector(".add-item-field").value = "";
        task.querySelector(".add-item-store").value = "";
        task.querySelector(".add-item-quantity").value = "";
      }
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  }
}
