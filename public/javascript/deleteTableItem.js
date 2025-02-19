export default async function deleteTableItem(event) {
    const tableRow = event.target.closest("tr");
    const parentTask = event.target.closest(".task");
    const parentTaskTypeID = parentTask.dataset.taskType;
    let lineItemID;
    if (parentTaskTypeID === "1") {
        lineItemID = tableRow.dataset.subtaskId;
    } else {
        lineItemID = tableRow.dataset.listItemId;
    }

    try {
        const response = await fetch("/delete-table-item", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ lineItemID, parentTaskTypeID }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to delete item.");
        }

        // If the table row is the last one, remove the entire table
        const parentTable = tableRow.closest("table");
        if (parentTable.querySelectorAll("tr").length === 2) {
            parentTable.remove();
        } else { // Else, remove the row
           tableRow.remove(); 
        }
        
        
    } catch (error) {
        console.error(error);
    }
}