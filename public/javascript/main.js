import deleteTask from "./deleteTask.js";
import addItemToTaskTable from "./addItemToTaskTable.js";
import toggleTableItem from "./toggleTableItem.js";
import addTask from "./addTask.js";
import editTask from "./editTask.js";
import { reopenTask, setTaskComplete } from "./setTaskComplete.js";
import deleteTableItem from "./deleteTableItem.js";

// Logout function
async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to log out.");
    }
    const data = await response.json();
    window.location.href = data.url;
  } catch (err) {
    console.error("Error logging out:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Add event listeners to all task elements
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.addEventListener("click", (event) => {
      if (event.target.classList.contains("toggle-complete")) {
        toggleTableItem(event);
      }
      if (event.target.classList.contains("delete-button")) {
        deleteTask(event);
      }
      if (event.target.classList.contains("edit-button")) {
        // TODO: Implement editTask(event);
        editTask(event);
      }
      if (event.target.classList.contains("delete-button-table")) {
        deleteTableItem(event);
      }
      if (event.target.classList.contains("edit-button-table")) {
        // TODO: Implement editTableItem(event);
        // editTableItem(event);
      }
      if (event.target.classList.contains("add-subtask-button") || event.target.classList.contains("add-list-item-button")) {
        event.preventDefault();
        addItemToTaskTable(event);
      }
      if (event.target.classList.contains("mark-complete-button")) {
        setTaskComplete(event);
      }
      if (event.target.classList.contains("reopen-task-button")) {
        reopenTask(event);
      }
    });

    // TODO: Implement inlineEdit(event);
    // task.addEventListener("doubleclick", (event) => {
    //   if (event.target.classList.contains("inline-editable")) {
    //     inlineEdit(event);
    //   }
    // });
  });

  // Add event listener to the add task button
  const addTaskLinks = Array.from(document.getElementsByClassName("add-task"));
  for (let addTaskLink of addTaskLinks) {
    addTaskLink.addEventListener("click", addTask);
  }

   // Add event listener to the logout button
   const logoutButton = document.getElementById("logout");
   if (logoutButton) {
     logoutButton.addEventListener("click", (event) => {
       event.preventDefault();
       console.log("Logging out...");
       logout();
     });
   }

   const filterElement = document.getElementById("filter-tasks");
   filterElement.addEventListener("change", (event) => {
     const filterValue = event.target.value;
     const url = `/filter-tasks?filter=${filterValue}`;
     window.location.href
    });
});
