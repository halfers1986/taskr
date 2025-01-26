"task-title";
"task-description";
"task-due-date";
"task-priority";

const classArray = ["task-title", "task-description", "task-due-date", "task-priority"]; // MORE TO ADD
const textClasses = ["task-title", "task-description"];
const dateClasses = ["task-due-date"];
const priorityClasses = ["task-priority"];

export default function inlineEdit(event) {
  let className;
  // Check if the target element has any of the classes in the classArray - if not, return
  if (!classArray.some((className) => targetElement.classList.contains(className))) {
    return;
  } else {
    className = classArray.find((className) => targetElement.classList.contains(className));
  }
  const targetElement = event.target;
  const target = targetElement.classList;
  const task = event.target.closest(".task");
  const taskID = task.dataset.taskId;
  const taskType = task.dataset.taskType;
  let subItemID;

  // Check if the target element is a sub-element
  if (targetElement.parentElement.classList.contains("tile-row")) {
    if (taskType === "1") {
      subItemID = targetElement.parentElement.dataset.subtaskId;
    } else if (taskType === "2") {
      subItemID = targetElement.parentElement.dataset.listItemId;
    }
  }
}
