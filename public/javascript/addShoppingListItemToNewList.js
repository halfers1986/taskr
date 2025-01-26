const itemField = document.getElementById("add-shopping-list-item");
const countField = document.getElementById("add-shopping-list-quantity");
const storeField = document.getElementById("add-shopping-list-store");
const shoppingListItems = document.querySelector(".shopping-list-items");
const errorElement = document.getElementById("shopping-list-item-error");

export function resetShoppingListForm() {
  itemField.value = "";
  countField.value = "";
  storeField.value = "";
  errorElement.textContent = "";
  let tableRowsShoppingList = document.querySelectorAll(".shopping-list-row");
  tableRowsShoppingList.forEach((row) => {
    row.remove();
  });
}

export function addShoppingListItemToNewList(event) {
  event.preventDefault();

  // Get the values of the item, count, and store fields
  let itemValue = itemField.value;
  let countValue = countField.value;
  let storeValue = storeField.value;

  // Validate the input
  if (itemValue === "" || countValue === "") {
    errorElement.textContent = "Please complete all required fields.";
    if (itemValue === "") {
      itemField.setAttribute("aria-invalid", "true");
      itemField.addEventListener("input", () => {
        itemField.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
    }
    if (countValue === "") {
      countField.setAttribute("aria-invalid", "true");
      countField.addEventListener("input", () => {
        countField.setAttribute("aria-invalid", "false");
        errorElement.textContent = "";
      });
    }
    return;
  }

  addShoppingListItemToTable(itemValue, countValue, storeValue);

  itemField.value = "";
  countField.value = "";
  storeField.value = "";
  itemField.focus();
  countField.removeAttribute("aria-invalid");
  itemField.removeAttribute("aria-invalid");
  itemField.removeEventListener("input", () => {
    itemField.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  });
  countField.removeEventListener("input", () => {
    countField.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  });
  errorElement.textContent = "";
}

function addShoppingListItemToTable(itemValue, countValue, storeValue) {
  // Check if the table exists, if not, create it
  let table = document.querySelector(".shopping-list-table");
  if (!table) {
    table = document.createElement("table");
    table.classList.add("table");
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");
    const headers = ["Item", "Store", "Count", ""];
    headers.forEach(headerText => {
      const header = document.createElement("th");
      header.innerText = headerText;
      headerRow.appendChild(header);
    });
    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);
    const tableBody = document.createElement("tbody");
    table.appendChild(tableBody);
    shoppingListItems.appendChild(table);
  }

  const newItem = document.createElement("td");
  newItem.classList.add("column");
  newItem.innerText = itemValue;

  const newCount = document.createElement("td");
  newCount.classList.add("column");
  newCount.setAttribute("style", "text-align: right;");
  newCount.innerText = countValue;

  const newStore = document.createElement("td");
  newStore.classList.add("column");
  newStore.innerText = storeValue;

  // Create a delete button for the new item
  const deleteButton = document.createElement("button");
  const deleteColumn = document.createElement("td");
  deleteButton.textContent = "Delete";
  deleteButton.type = "button";
  deleteButton.classList.add("button-table", "outline", "primary");
  deleteButton.addEventListener("click", deleteListItem);
  deleteColumn.appendChild(deleteButton);
  deleteColumn.classList.add("column", "column-buttons");

  // Create a new table row to contain the new item, count, store, and delete button
  const row = document.createElement("tr");
  row.classList.add("modal-row");

  // Append the new item, count, and store to the fieldset
  row.appendChild(newItem);
  row.appendChild(newStore);
  row.appendChild(newCount);
  row.appendChild(deleteColumn);

  // Append the new row to the table body
  table.querySelector("tbody").appendChild(row);
}

function deleteListItem(event) {
  const row = event.target.closest("tr");
  const table = row.closest("table");
  row.remove();
  // If the table is empty, remove the table
  if (table.querySelectorAll("tbody tr").length === 0) {
    table.remove();
  }
}

