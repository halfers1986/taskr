// Purpose: Contains functions to filter and order tasks based on user input
// Declare elements
const tasks = document.querySelectorAll(".task");
const taskControls = document.getElementById("task-controls");
const filters = taskControls.querySelectorAll("input[type='checkbox']");
const sortSelect = taskControls.querySelectorAll("input[type='radio']");

function getFilterValues() {
    const filterValues = [];
    filters.forEach((filter) => {
        if (filter.checked) {
            var filterType = filter.closest("summary").getValue;
            var filterValue = filter.value;
            filterValues.push( { filterType, filterValue } );
        }
    });
    return filterValues;
}

// Filter tasks based on the selected filters
function filterTasks() {
    
    // Get the selected filter values
    const filters = getFilterValues();

    tasks.forEach((task) => {
        const taskType = task.getAttribute("data-task-type");
        const taskStatus = task.getAttribute("data-task-status");
        const taskPriority = task.getAttribute("data-task-priority");
        const taskDueDate = task.getAttribute("data-task-due-date");
        const taskDueTime = task.getAttribute("data-task-due-time");
        const taskCompletionDate = task.getAttribute("data-task-completion-date");
        const taskCompletionTime = task.getAttribute("data-task-completion-time");
    
        if (filters.filterType === "By Type") {
            if (taskType === filters.filterValue) {
                task.classList.remove("hidden");
            } else {
                task.classList.add("hidden");
            }
        }
    });

}