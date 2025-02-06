// Switch theme based on user's preference or saved theme

// Function to get the user's default theme
function getDefaultTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Function to apply the theme
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeLabel = document.querySelector('label[for="theme-switcher"]');
    if (themeLabel) {
        themeLabel.innerHTML = theme === 'dark' ? '<small>Switch to Light Mode</small>' : '<small>Switch to Dark Mode</small>';
    }
    // Custom event to notify other components of theme change (needed to re-render Chart.js charts)
    document.dispatchEvent(new Event('themeChange'));
}

// Function to toggle the theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Set the initial theme based on user's preference or saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme ? savedTheme : getDefaultTheme();
    applyTheme(theme);

    // Set the switch state based on the theme
    const themeSwitch = document.getElementById('theme-switcher');
    if (themeSwitch) {
        themeSwitch.checked = theme === 'dark';
        themeSwitch.addEventListener('change', toggleTheme);
    }
});