

function openSidebar() {
    document.getElementById("main-nav").setAttribute('class', 'active');
}

function closeSidebar() {
    document.getElementById("main-nav").removeAttribute('class', 'active');
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