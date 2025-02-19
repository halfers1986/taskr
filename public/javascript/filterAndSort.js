// Purpose: Contains functions to filter and order tasks based on user input
// Declare elements
const tasks = document.querySelectorAll(".task");
const taskControls = document.getElementById("task-controls");
const filters = taskControls.querySelectorAll("input[type='checkbox']");
const sortSelect = taskControls.querySelectorAll("input[type='radio']");

document.addEventListener("DOMContentLoaded", () => {
    filters.forEach((filter) => {
        filter.addEventListener("change", filterTasks);
    });
    sortSelect.forEach((sort) => {
        sort.addEventListener("change", sortTasks);
    });
    document.getElementById("clear-filters").addEventListener("click", clearFilters);
});

// Helper function to get the week number of a date
function getWeekNumber(date) {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + 1) / 7);
}

// Get all of the currently selected filter values
function getFilterValues() {
    const filterValues = [];
    filters.forEach((filter) => {
        if (filter.checked) {
            var filterType = filter.closest("details").querySelector("summary").textContent.trim();
            switch (filterType) {
                case "By Type":
                    filterType = "taskType";
                    break;
                case "By Status":
                    filterType = "taskStatus";
                    break;
                case "By Priority":
                    filterType = "taskPriority";
                    break;
                case "By Due Date":
                    filterType = "taskDueDate";
                    break;
                case "By Category":
                    filterType = "taskCategory";
                    break;
                default:
                    throw new Error("Invalid filter type");
            }
            var filterValue = filter.value;
            filterValues.push({ filterType, filterValue });
        }
    });
    return filterValues;
}

// Filter tasks based on the selected filters
function filterTasks() {

    // Get the selected filter values
    const filters = getFilterValues();
    // console.log("Filters: ", filters); // Debugging log

    // Group filters by type
    let groupedFilters = {};
    filters.forEach((filter) => {
        if (!groupedFilters[filter.filterType]) {
            groupedFilters[filter.filterType] = [];
        }
        groupedFilters[filter.filterType].push(filter.filterValue);
    });


    tasks.forEach((task) => {
        const taskType = task.getAttribute("data-task-type");
        const taskPriority = task.querySelector(".task-priority").getAttribute("data-task-priority");
        const taskCategory = task.querySelector(".task-category").getAttribute("data-task-category");
        const taskDueDate = task.querySelector(".task-due-date").getAttribute("data-task-due-date");
        var taskStatus = getStatusValue(task);

        const taskDetails = {
            taskType,
            taskStatus,
            taskPriority,
            taskDueDate,
            taskCategory
        };

        // Variable to check if the task matches all categories
        let matchesAllCategories = true;

        for (const filterType in groupedFilters) {
            const filterValues = groupedFilters[filterType];
            let matchesCategory = false;

            if (filterType === "taskDueDate") {
                const formattedTaskDueDate = new Date(taskDueDate);
                const currentDate = new Date();
                filterValues.forEach((filterValue) => {
                    switch (filterValue) {
                        case "Overdue":
                            if (formattedTaskDueDate < currentDate && taskStatus !== "Completed") {
                                matchesCategory = true;
                            }
                            break;
                        case "Today":
                            if (formattedTaskDueDate.getDate() === currentDate.getDate() &&
                                formattedTaskDueDate.getMonth() === currentDate.getMonth() &&
                                formattedTaskDueDate.getFullYear() === currentDate.getFullYear()) {
                                matchesCategory = true;
                            }
                            break;
                        case "Tomorrow":
                            currentDate.setDate(currentDate.getDate() + 1);
                            if (formattedTaskDueDate.getDate() === currentDate.getDate() &&
                                formattedTaskDueDate.getMonth() === currentDate.getMonth() &&
                                formattedTaskDueDate.getFullYear() === currentDate.getFullYear()) {
                                matchesCategory = true;
                            }
                            break;
                        case "This Week":
                            const currentWeek = getWeekNumber(currentDate);
                            const taskWeek = getWeekNumber(formattedTaskDueDate);
                            if (taskWeek === currentWeek) {
                                matchesCategory = true;
                            }
                            break;
                        case "Next Week":
                            const nextWeek = getWeekNumber(currentDate) + 1;
                            const taskNextWeek = getWeekNumber(formattedTaskDueDate);
                            if (taskNextWeek === nextWeek) {
                                matchesCategory = true;
                            }
                            break;
                        case "This Month":
                            if (formattedTaskDueDate.getMonth() === currentDate.getMonth() &&
                                formattedTaskDueDate.getFullYear() === currentDate.getFullYear()) {
                                matchesCategory = true;
                            }
                            break;
                        case "Next Month":
                            if (formattedTaskDueDate.getMonth() === currentDate.getMonth() + 1 &&
                                formattedTaskDueDate.getFullYear() === currentDate.getFullYear()) {
                                matchesCategory = true;
                            }
                            break;
                        case "This Year":
                            if (formattedTaskDueDate.getFullYear() === currentDate.getFullYear()) {
                                matchesCategory = true;
                            }
                            break;
                        default:
                            matchesCategory = false;
                            break;
                    }
                });
            } else {
                filterValues.forEach((filterValue) => {
                    if (taskDetails[filterType] === filterValue) {
                        matchesCategory = true;
                    }
                });
            }

            if (!matchesCategory) {
                matchesAllCategories = false;
                break;
            }
        }

        if (matchesAllCategories) {
            // Show the task if it matches any filter values
            task.classList.remove("hidden");
        } else {
            // Hide the task if it doesn't match any filter values
            task.classList.add("hidden");
        }
    });
}

// Sort tasks based on the selected sort option
function sortTasks() {

    const sortValue = document.querySelector("input[name='sort']:checked").value;
    console.log("Sort value: ", sortValue); // Debugging log

    var sortedTasks;

    if (sortValue === "dueDateSoonest") {
        sortedTasks = sortTasksByDueDate("asc");
    } else if (sortValue === "dueDateLatest") {
        sortedTasks = sortTasksByDueDate("desc");
    } else if (sortValue === "priorityHighest") {
        sortedTasks = sortTasksByPriority("asc");
    } else if (sortValue === "priorityLowest") {
        sortedTasks = sortTasksByPriority("desc");
    } else if (sortValue === "createdFirst") {
        sortedTasks = sortTasksByCreated("asc");
    } else if (sortValue === "createdLast") {
        sortedTasks = sortTasksByCreated("desc");
    } else if (sortValue === "updatedRecent") {
        sortedTasks = sortTasksByUpdated("desc");
    } else if (sortValue === "updatedOldest") {
        sortedTasks = sortTasksByUpdated("asc");
    } else if (sortValue === "category") {
        sortedTasks = sortTasksByCategory();
    } else if (sortValue === "status") {
        sortedTasks = sortTasksByStatus();
    } else if (sortValue === "type") {
        sortedTasks = sortTasksByType();
    } else if (sortValue === "alphabetical") {
        sortedTasks = sortTasksAlphabetically();
    }

    // Remove all tasks from the task list
    tasks.forEach((task) => {
        task.remove();
    });

    // Add the sorted tasks back to the task list
    sortedTasks.forEach((task) => {
        document.getElementById("task-list").appendChild(task);
    });

}

// Sort tasks by due date
function sortTasksByDueDate(order) {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aDueDate = new Date(a.querySelector(".task-due-date").getAttribute("data-task-due-date"));
        const bDueDate = new Date(b.querySelector(".task-due-date").getAttribute("data-task-due-date"));
        if (order === "asc") {
            return aDueDate - bDueDate;
        } else {
            return bDueDate - aDueDate;
        }
    });
    return sortedTasks;
}

// Sort tasks by priority
function sortTasksByPriority(order) {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aPriority = a.querySelector(".task-priority").getAttribute("data-task-priority");
        const bPriority = b.querySelector(".task-priority").getAttribute("data-task-priority");
        if (order === "asc") {
            return aPriority - bPriority;
        } else {
            return bPriority - aPriority;
        }
    });
    return sortedTasks;
}

// Sort tasks by created date
function sortTasksByCreated(order) {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aCreated = new Date(a.getAttribute("data-task-created"));
        const bCreated = new Date(b.getAttribute("data-task-created"));
        if (order === "asc") {
            return aCreated - bCreated;
        } else {
            return bCreated - aCreated;
        }
    });
    return sortedTasks;
}

// Sort tasks by updated date
function sortTasksByUpdated(order) {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aUpdated = new Date(a.getAttribute("data-task-updated"));
        const bUpdated = new Date(b.getAttribute("data-task-updated"));
        if (order === "asc") {
            return aUpdated - bUpdated;
        } else {
            return bUpdated - aUpdated;
        }
    });
    return sortedTasks;
}

// Sort tasks by category
function sortTasksByCategory() {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aCategory = a.querySelector(".task-category").getAttribute("data-task-category");
        const bCategory = b.querySelector(".task-category").getAttribute("data-task-category");
        return aCategory - bCategory;
    });
    return sortedTasks;
}

// Sort tasks by status
function sortTasksByStatus() {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aStatus = getStatusValue(a);
        const bStatus = getStatusValue(a);
        return bStatus.localeCompare(aStatus);
    });
    return sortedTasks;
}

// Sort tasks by type
function sortTasksByType() {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aType = a.getAttribute("data-task-type");
        const bType = b.getAttribute("data-task-type");
        return aType - bType;
    });
    return sortedTasks;
}

// Sort tasks alphabetically
function sortTasksAlphabetically() {
    const sortedTasks = Array.from(tasks).sort((a, b) => {
        const aTitle = a.querySelector(".task-title").textContent;
        const bTitle = b.querySelector(".task-title").textContent;
        return aTitle.localeCompare(bTitle);
    });
    return sortedTasks;
}

// Helper function to get the status of a task
getStatusValue = (task) => {
    taskType = task.getAttribute("data-task-type");
    if (task.getAttribute("data-task-complete") === "true" || task.getAttribute("data-task-complete") === "1") {
        taskStatus = "Completed"; // If task is complete, set status to "Completed"
    } else {
        if (taskType === "3") {
            taskStatus = "Not Started"; // If task is a note and not complete, set status to "Not Started"
        }
        // If a task is a task or shopping list and not complete, check if any subtasks are complete
        if ((taskType === "1" && task.getElementsByClassName("subtasks").length > 0) || (taskType === "2" && task.getElementsByClassName("shopping-list").length > 0)) {
            const subItems = Array.from(task.getElementsByClassName("toggle-complete"));
            var completeSubItems = 0;
            subItems.forEach(subItem => {
                if (subItem.checked) {
                    completeSubItems++;
                }
            });
            console.log("Complete subitems: ", completeSubItems); // Debugging log
            if (completeSubItems > 0) {
                taskStatus = "In Progress"; // If any subtasks are complete, set status to "In Progress"
            } else {
                taskStatus = "Not Started"; // If no subtasks are complete, set status to "Not Started"
            }
        } else {
            taskStatus = "Not Started"; // If task is a task or shopping list and has no subtasks, set status to "Not Started"
        }
    }
    return taskStatus;
}

function clearFilters() {
    filters.forEach((filter) => {
        filter.checked = false;
    });
    filterTasks();
}


