

function openSidebar() {
    document.getElementById("sidebar").setAttribute('class', 'active');
}

function closeSidebar() {
    document.getElementById("sidebar").removeAttribute('class', 'active');
}

document.addEventListener('DOMContentLoaded', () => {
    const openSidebarIcon = document.getElementById('open-sidebar');
    const closeSidebarIcon = document.getElementById('close-sidebar');
    if (openSidebarIcon) {
        openSidebarIcon.addEventListener('click', openSidebar);
    }
    if (closeSidebarIcon) {
        closeSidebarIcon.addEventListener('click', closeSidebar);
    }
});