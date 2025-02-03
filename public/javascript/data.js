document.addEventListener('DOMContentLoaded', async function () {
    const typeChartElement = document.getElementById('type-chart');
    const categoryChartElement = document.getElementById('category-chart');
    const priorityChartElement = document.getElementById('priority-chart');
    var charts = [];
    const results = await fetch('/basic-dashboard', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const basicData = await results.json();
    console.log(basicData);
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


    // Update chart colors when theme changes
    const updateChartColors = () => {
        const newTextColor = getComputedStyle(document.documentElement).getPropertyValue('--pico-color');
        charts.forEach((chart) => {
            chart.options.plugins.title.color = newTextColor;
            chart.options.plugins.legend.labels.color = newTextColor;
            chart.update();
        });

    };

    // Listen for theme changes (custom event defined in theme-switcher.js)
    document.addEventListener('themeChange', updateChartColors);

});