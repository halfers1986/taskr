import { closeModal, openModal } from "./modal.js";

// Config
let visibleModal = null;
const modal = document.querySelector(".delete-task-dialog");
const modalClose = modal.querySelector("#cancel-delete");
const confirmDelete = modal.querySelector("#confirm-delete");

// Handle confirm delete action
async function confirmDeleteAction() {
  const task = visibleModal.task; // Store the task reference

  try {
    const taskID = task.dataset.taskId;
    const taskType = task.dataset.taskType;

    // Remove the task from the database
    const response = await fetch("/delete-task", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskID, taskType }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete task.");
      // Implement error handling
    }

    // Remove the task from the DOM

    // Create placeholder element
    const placeholder = document.createElement("article");
    placeholder.classList.add("placeholder-tile");
    placeholder.textContent = "Task Deleted";

    // Replace the task with the placeholder
    task.replaceWith(placeholder);

    // Apply fade-out effect
    setTimeout(() => {
      placeholder.style.transition = "opacity 4s";
      placeholder.style.opacity = "0";
    }, 1000); // Start transition after 1s

    // Remove the placeholder after fade-out completes
    setTimeout(() => {
      placeholder.remove();
    }, 5000); // Matches the 4s fade duration + 1s delay

    if (document.querySelectorAll(".task").length === 0) {
      // If no tasks remain, show the empty state

      // Create the empty state element
      const div = document.createElement("div");
      div.classList.add("no-tasks");

      // Create the hgroup element & children
      const hgroup = document.createElement("hgroup");
      const h1 = document.createElement("h1");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      h1.textContent = "Welcome to Taskr!";
      h3.textContent = "Uh-oh! Looks like you don't have any tasks.";
      p.textContent = "Let's get you started.";
      hgroup.append(h1, h3, p);

      // Create the button element
      const button = document.createElement("button");
      button.classList.add("add-task");
      button.textContent = "Add Task";

      // Append the hgroup and button to the div
      div.append(hgroup, button);

      // Add the empty state to the task list
      document.getElementById("task-list").append(div);
    }
    // Close the modal
    closeModal(visibleModal);
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// Action event listeners
confirmDelete.addEventListener("click", () => confirmDeleteAction());
modalClose.addEventListener("click", () => closeModal(visibleModal));

export default function deleteTask(event) {
  // Find the closest (containing) task element
  const task = event.target.closest(".task");

  // Store the task reference in the visibleModal object
  visibleModal = modal;
  visibleModal.task = task;

  // Open the modal
  openModal(modal);
}
