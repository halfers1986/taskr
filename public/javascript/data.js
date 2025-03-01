//-- Declare global variables
var charts = [];
var timePeriod = 'allTime';

// Update chart colors when theme changes
function updateChartColors() {
    const newTextColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');
    charts.forEach((chart) => {
        chart.options.plugins.title.color = newTextColor;
        chart.options.plugins.legend.labels.color = newTextColor;
        chart.update();
    });
}

function renderBasicStats(basicData) {
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const openTasksElement = document.getElementById('open-tasks');
    const totalSubtasksElement = document.getElementById('total-subtasks');
    const completedSubtasksElement = document.getElementById('completed-subtasks');
    const openSubtasksElement = document.getElementById('open-subtasks');
    const totalListItemsElement = document.getElementById('total-list-items');
    const completedListItemsElement = document.getElementById('completed-list-items');
    const openListItemsElement = document.getElementById('open-list-items');

    let totalTasks = 0;
    let completedTasks = 0;
    let totalSubtasks = 0;
    let totalCompletedSubtasks = 0;
    let totalListItems = 0;
    let totalCompletedListItems = 0;
    basicData.results.forEach((task) => {
        totalTasks++;
        completedTasks += task.task_complete;
        if (task.subtasks) {
            totalSubtasks += task.subtasks.subtask_count;
            totalCompletedSubtasks += parseInt(task.subtasks.subtasks_completed);
        }
        if (task.listItems) {
            totalListItems += task.listItems.list_item_count;
            totalCompletedListItems += parseInt(task.listItems.list_items_completed);
        }
    });

    totalTasksElement.textContent = totalTasks;
    completedTasksElement.textContent = completedTasks;
    openTasksElement.textContent = totalTasks - completedTasks;
    totalSubtasksElement.textContent = totalSubtasks;
    completedSubtasksElement.textContent = totalCompletedSubtasks;
    openSubtasksElement.textContent = totalSubtasks - totalCompletedSubtasks;
    totalListItemsElement.textContent = totalListItems;
    completedListItemsElement.textContent = totalCompletedListItems;
    openListItemsElement.textContent = totalListItems - totalCompletedListItems;
}

function renderBasicCharts(basicData) {
    const typeChartElement = document.getElementById('type-chart');
    const categoryChartElement = document.getElementById('category-chart');
    const priorityChartElement = document.getElementById('priority-chart');
    const taskTypes = [];
    const taskCategories = [];
    const taskPriorities = [];
    basicData.results.forEach((task) => {
        taskTypes.push(task.type_name);
        taskCategories.push(task.category_name);
        taskPriorities.push(task.priority_name);
    });
    const typeData = {};
    const categoryData = {};
    const priorityData = {};
    taskTypes.forEach((type) => {
        if (!typeData[type]) {
            typeData[type] = 1;
        } else {
            typeData[type]++;
        }
    });
    taskCategories.forEach((category) => {
        if (!categoryData[category]) {
            categoryData[category] = 1;
        } else {
            categoryData[category]++;
        }
    });
    taskPriorities.forEach((priority) => {
        if (!priorityData[priority]) {
            priorityData[priority] = 1;
        } else {
            priorityData[priority]++;
        }
    });
    const typeLabels = Object.keys(typeData);
    const categoryLabels = Object.keys(categoryData);
    const priorityLabels = Object.keys(priorityData);
    const typeValues = Object.values(typeData);
    const categoryValues = Object.values(categoryData);
    const priorityValues = Object.values(priorityData);

    // Get the custom font size from the CSS that applies to the current theme
    const pElement = document.querySelector('p');
    const fontSize = getComputedStyle(pElement).fontSize;

    // Get the text color from the CSS that applies to the current theme
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');

    // Set the options for the pie charts
    const pieChartOptions = (chartTitle) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: chartTitle,
                color: textColor,
                font: {
                    size: parseInt(fontSize),
                    weight: 'bold'
                },
                position: 'bottom'
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        }
    });

    // Create the pie charts
    const typeChart = new Chart(typeChartElement, {
        type: 'doughnut',
        data: {
            labels: typeLabels,
            datasets: [{
                label: 'Task Types',
                data: typeValues,
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: pieChartOptions("Tasks by Type")
    });
    charts.push(typeChart);

    const categoryChart = new Chart(categoryChartElement, {
        type: 'doughnut',
        data: {
            labels: categoryLabels,
            datasets: [{
                label: 'Task Categories',
                data: categoryValues,
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: pieChartOptions("Tasks by Category")
    });
    charts.push(categoryChart);

    const priorityChart = new Chart(priorityChartElement, {
        type: 'doughnut',
        data: {
            labels: priorityLabels,
            datasets: [{
                label: 'Task Priorities',
                data: priorityValues,
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: pieChartOptions("Tasks by Priority")
    });
    charts.push(priorityChart);
}

async function getBasicDashboard() {

    const results = await fetch(`/basic-dashboard?timePeriod=${timePeriod}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const basicData = await results.json();

    // If the request failed, log the error and return
    if (!results.ok) {
        console.error("Failed to get basic dashboard data:", basicData.message);
        typeChartElement.innerHTML = `<p>Error fetching data</p>`;
        categoryChartElement.innerHTML = `<p>Error fetching data</p>`;
        priorityChartElement.innerHTML = `<p>Error fetching data</p>`;
        return;
    }

    // If there are no tasks, display a message and return
    if (basicData.results.length === 0) {
        // TODO: Add a message to the page
    }

    renderBasicStats(basicData);
    renderBasicCharts(basicData);
}

function renderCompletedByTypeChart(data) {
    const completedByTypeElement = document.getElementById('completion-%-type-chart');
    const labels = data.map((task) => task.type_name);
    const totalTaskCounts = data.map((task) => task.task_count);
    const completedTaskCounts = data.map((task) => task.completed_tasks);

    // Get the custom font size from the CSS that applies to the current theme
    const pElement = document.querySelector('p');
    const fontSize = getComputedStyle(pElement).fontSize;

    // Get the text color from the CSS that applies to the current theme
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');

    // Set the options for the bar chart
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Completed Tasks by Type',
                color: textColor,
                font: {
                    size: parseInt(fontSize),
                    weight: 'bold'
                },
                position: 'bottom'
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    }
                }
            },
            x: {
                grid: {
                    lineWidth: 3
                }
            }
        }
    };

    // Create the bar chart
    const completedByTypeChart = new Chart(completedByTypeElement, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completed Tasks',
                data: completedTaskCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Total Tasks',
                data: totalTaskCounts,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: barChartOptions
    });
    charts.push(completedByTypeChart);
}

function renderAverageCompletionTimeChart(data) {
    const averageCompletionTimeElement = document.getElementById('average-completion-time');
    const labels = data.map((task) => task.type_name);
    const averageCompletionTimes = data.map((task) => task.avg_completion_time_hours);

    // Get the custom font size from the CSS that applies to the current theme
    const pElement = document.querySelector('p');
    const fontSize = getComputedStyle(pElement).fontSize;

    // Get the text color from the CSS that applies to the current theme
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');

    // Set the options for the bar chart
    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Average Completion Time by Type',
                color: textColor,
                font: {
                    size: parseInt(fontSize),
                    weight: 'bold'
                },
                position: 'bottom'
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
    };

    // Create the bar chart
    const averageCompletionTimeChart = new Chart(averageCompletionTimeElement, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Completion Time',
                data: averageCompletionTimes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: barChartOptions
    });
    charts.push(averageCompletionTimeChart);
}

async function getAverageCompletionTime() {
    const results = await fetch(`/average-completion-time/?timePeriod=${timePeriod}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const averageCompletionTimeData = await results.json();

    // If the request failed, log the error and return
    if (!results.ok) {
        console.error("Failed to get average completion time data:", averageCompletionTimeData.message);
        return;
    }

    // If there are no tasks, display a message and return
    if (averageCompletionTimeData.results.length === 0) {
        // TODO: Add a message to the page
    }

    renderAverageCompletionTimeChart(averageCompletionTimeData.results);
}

async function getCompletedByType() {
    const results = await fetch(`/completed-by-type/?timePeriod=${timePeriod}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const completedByTypeData = await results.json();

    // If the request failed, log the error and return
    if (!results.ok) {
        console.error("Failed to get completed by type data:", completedByTypeData.message);
        return;
    }

    // If there are no tasks, display a message and return
    if (completedByTypeData.results.length === 0) {
        // TODO: Add a message to the page
    }

    renderCompletedByTypeChart(completedByTypeData.results);
}

function renderCategoriesByType(data) {
    const categoriesByTypeElement = document.getElementById('categories-by-type');
    // Get the unique category names
    const categoryLabels = new Set(data.map((entry) => entry.category_name));

    // Create a map where each type is a key and the value is an array of counts for each category
    const categoryCountsByType = new Map();
    data.forEach((entry) => {
        if (!categoryCountsByType.has(entry.type_name)) {
            categoryCountsByType.set(entry.type_name, []);
        }
        // Add the category count to the array for the type - count will be in the same order as the category names
        categoryCountsByType.get(entry.type_name).push(entry.category_count);
    });

    const datasets = [];
    // Iterate over the map to create the datasets
    for (const [type, counts] of categoryCountsByType) {
        datasets.push({
            label: type,
            data: counts,
            // backgroundColor: 'rgba(255, 99, 132, 0.2)',
            // borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        });
    }

    // Get the custom font size from the CSS that applies to the current theme
    const pElement = document.querySelector('p');
    const fontSize = getComputedStyle(pElement).fontSize;

    // Get the text color from the CSS that applies to the current theme
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');

    // Set the options for the radar chart
    const radarChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Categories by Type',
                color: textColor,
                font: {
                    size: parseInt(fontSize),
                    weight: 'bold'
                },
                position: 'bottom'
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            r: {
                beginAtZero: true
            }
        }
    };

    // Create the radar chart
    const categoriesByTypeChart = new Chart(categoriesByTypeElement, {
        type: 'radar',
        data: {
            labels: [...categoryLabels],
            datasets: datasets
        },
        options: radarChartOptions
    });
    charts.push(categoriesByTypeChart);
}


async function getCategoriesByType() {
    const results = await fetch(`/categories-by-type/?timePeriod=${timePeriod}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    const categoriesByTypeData = await results.json();

    // If the request failed, log the error and return
    if (!results.ok) {
        console.error("Failed to get categories by type data:", categoriesByTypeData.message);
        return;
    }

    // If there are no tasks, display a message and return
    if (categoriesByTypeData.results.length === 0) {
        //TODO: Add a message to the page
    }

    // Render the data
    renderCategoriesByType(categoriesByTypeData.results);
}




document.addEventListener('DOMContentLoaded', async function () {

    await getBasicDashboard();
    await getCompletedByType();
    await getAverageCompletionTime();
    await getCategoriesByType();

    // Listen for theme changes (custom event defined in theme-switcher.js)
    document.addEventListener('themeChange', updateChartColors);

    // Listen for time period changes
    const timePeriodSelectors = document.querySelectorAll(".time-period-selector");
    timePeriodSelectors.forEach((selector) => {
        selector.addEventListener('change', async (event) => {
            timePeriod = event.target.value;
            charts.forEach((chart) => chart.destroy());
            charts = [];
            await getBasicDashboard();
            await getCompletedByType();
            await getAverageCompletionTime();
            await getCategoriesByType();
        });
    });

});