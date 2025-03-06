export default function showError(message, element) {
    element.innerText = message;
    element.style.display = "block";
}