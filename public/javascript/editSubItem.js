

export function editSubItem(event) {

    // Get the key elements
    const subItem = event.target.closest(".tile-row");
    const task = subItem.closest(".task");
    let subItemColumn1;
    let subItemColumn2;
    let subItemColumn3;
    const taskType = task.dataset.taskType;
    if (taskType === "1") {
        subItemColumn1 = subItem.querySelector(".subtask-description");
        subItemColumn2 = subItem.querySelector(".subtask-due-date");
        subItemColumn3 = subItem.querySelector(".subtask-priority");
    } else if (taskType === "2") {
        subItemColumn1 = subItem.querySelector(".list-item-name");
        subItemColumn2 = subItem.querySelector(".list-item-store");
        subItemColumn3 = subItem.querySelector(".list-item-quantity");
    }
    const editButton = subItem.querySelector(".edit-button-table");
    const deleteButton = subItem.querySelector(".delete-button-table");

    // Get the values
    const taskId = task.dataset.taskId;
    let subItemId;
    if (taskType === "1") {
        subItemId = subItem.dataset.subtaskId;
    } else if (taskType === "2") {
        subItemId = subItem.dataset.listItemId;
    }
    const column1Value = subItemColumn1.textContent;
    let column2Value;
    let column3Value;
    if (taskType === "1") {
        column2Value = subItemColumn2.dataset.subtaskDueDate.split('T')[0];
        subItemColumn3.dataset.subtaskPriority === null || subItemColumn3.dataset.subtaskPriority === "" ? column3Value = "0" : column3Value = subItemColumn3.dataset.subtaskPriority;
    } else if (taskType === "2") {
        column2Value = subItemColumn2.textContent;
        column3Value = subItemColumn3.textContent;
    }

    // Create input elements
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.value = column1Value;
    const input2 = document.createElement("input");
    let input3;
    if (taskType === "1") {
        input2.type = "date";
        input3 = document.createElement("select");
        console.log("About to set default value for priority as: ", column3Value);
        input3.innerHTML = `<option value="0" ${column3Value === "0" ? "selected " : ""}disabled>Priority (optional)</option>
                            <option value="1" ${column3Value === "1" ? "selected" : ""}>Low</option>
                            <option value="2" ${column3Value === "2" ? "selected" : ""}>Medium</option>
                            <option value="3" ${column3Value === "3" ? "selected" : ""}>High</option>`;
    } else if (taskType === "2") {
        input2.type = "text";
        input3 = document.createElement("input")
        input3.type = "text";
    }
    input2.value = column2Value;
    input3.value = column3Value;

    // Create save and cancel buttons
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    saveButton.classList.add("save-button");
    saveButton.classList.add("button-table");
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.classList.add("cancel-button");
    cancelButton.classList.add("button-table");
    cancelButton.classList.add("secondary");

    // Replace the text with the input elements
    subItemColumn1.replaceWith(input1);
    subItemColumn2.replaceWith(input2);
    subItemColumn3.replaceWith(input3);

    // Replace the edit button with the save button
    editButton.replaceWith(saveButton);
    // Replace the delete button with the cancel button
    deleteButton.replaceWith(cancelButton);

    async function saveSubItem() {
        // Get the new values
        const newColumn1Value = input1.value;
        const newColumn2Value = input2.value;
        const newColumn3Value = input3.value;

        // Create the data object
        const data = {
            taskId: taskId,
            subItemId: subItemId,
            taskType: taskType
        };

        // Only include the new values if they aren't equal to the old values
        if (newColumn1Value !== column1Value) {
            data.column1Value = newColumn1Value;
        }
        if (newColumn2Value !== column2Value) {
            data.column2Value = newColumn2Value;
        }
        if (newColumn3Value !== column3Value) {
            data.column3Value = newColumn3Value;
        }

        // Send the data to the server
        try {

            console.log("Sending to web-app");
            const response = await fetch("/edit-sub-item", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Error saving sub-item:", result.message);
                return;
            }

            // Else, success. Replace the input elements with the new values
            input1.replaceWith(subItemColumn1);
            input2.replaceWith(subItemColumn2);
            input3.replaceWith(subItemColumn3);
            subItemColumn1.textContent = newColumn1Value;
            if (taskType === "1") {
                subItemColumn2.textContent = newColumn2Value ? new Date(newColumn2Value).toLocaleDateString("en-GB") : "";
                switch (newColumn3Value) {
                    case "1":
                        subItemColumn3.textContent = "Low";
                        break;
                    case "2":
                        subItemColumn3.textContent = "Medium";
                        break;
                    case "3":
                        subItemColumn3.textContent = "High";
                        break;
                    default:
                        subItemColumn3.textContent = "None";
                }
            } else if (taskType === "2") {
                subItemColumn2.textContent = newColumn2Value;
                subItemColumn3.textContent = newColumn3Value;
            }


            // Replace the save button with the edit button
            saveButton.replaceWith(editButton);
            // Replace the cancel button with the delete button
            cancelButton.replaceWith(deleteButton);

        } catch (error) {
            console.error("Error saving sub-item:", error);
        }
    }

    function cancelEditSubItem() {
        // Replace the input elements with the original values
        input1.replaceWith(subItemColumn1);
        input2.replaceWith(subItemColumn2);
        input3.replaceWith(subItemColumn3);

        // Replace the save button with the edit button
        saveButton.replaceWith(editButton);
        // Replace the cancel button with the delete button
        cancelButton.replaceWith(deleteButton);
    }

    // Add event listeners to the save and cancel buttons
    saveButton.addEventListener("click", () => {
        saveSubItem();
    });
    cancelButton.addEventListener("click", () => {
        cancelEditSubItem();
    });

}

export default editSubItem;