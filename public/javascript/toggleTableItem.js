export default async function toggleTableItem(event) {
  const row = event.target.closest("tr");
  const checkbox = event.target.closest("input[type='checkbox']");
  const rowElements = Array.from(row.children);
  const table = row.closest("table");
  const newStatus = checkbox.checked ? 1 : 0;
  let route;
  let itemID;
  if (row.closest("tbody").classList.contains("subtask-table-body")) {
    itemID = row.dataset.subtaskId;
    route = `/toggle-subtask/`;
  } else {
    itemID = row.dataset.listItemId;
    route = `/toggle-shopping-list/`;
  }

  if (!itemID) {
    console.error("No item ID found");
    checkbox.checked = checkbox.checked ? false : true;
    return;
  }

  try {
    // Send PUT request to update item
    const response = await fetch(route + itemID, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newStatus }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update item.");
    }
    console.log(rowElements);
    rowElements.forEach((element) => {
      if (element.classList.contains("column")) {
        element.classList.toggle("checked-item");
      }
      // Find buttons inside the final column and toggle disabled state
      if (element.classList.contains("column-buttons")) {
        element.querySelectorAll("button").forEach((button) => {
          button.disabled = !button.disabled;
        });
      }
    });
  } catch (error) {
    console.error("Error updating item:", error);
    // Revert the checkbox state
    checkbox.checked = checkbox.checked ? false : true;
  }
}
