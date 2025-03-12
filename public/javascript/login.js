import showError from "./showError.js";

const loginButton = document.getElementById("login-button");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorElement = document.getElementById("error");

// Function to validate input length
function isValidLength(value) {
  if (value.length >= 3 && value.length <= 20) {
    return true;
  }
  return false;
}

// Function to handle field validation
function validateLength(input, message) {
  if (!isValidLength(input.value)) {
    input.setAttribute("aria-invalid", "true");
    showError(message, errorElement);
  } else {
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = ""; // Clear error message
  }
  checkFormValidity();
}

// Function to handle field validation
function validateIncluded(input, message) {
  if (!input.value) {
    input.setAttribute("aria-invalid", "true");
    showError(message, errorElement);
  } else {
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = ""; // Clear error message
  }
  checkFormValidity();
}

// Function to enable/disable login button
function checkFormValidity() {
  loginButton.disabled = !(isValidLength(usernameInput.value) && passwordInput.value);
}

async function login() {
  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.value.trim(),
        password: passwordInput.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message, errorElement);
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Event listeners
usernameInput.addEventListener("blur", () => validateLength(usernameInput, "Username must be 3-20 characters."));
passwordInput.addEventListener("blur", () => validateIncluded(passwordInput, "Password is required."));
usernameInput.addEventListener("input", checkFormValidity);
passwordInput.addEventListener("input", checkFormValidity);
loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (!isValidLength(usernameInput.value)) {
    showError("Username must be 3-20 characters.", errorElement);
    return;
  } else if (!passwordInput.value) {
    showError("Password is required.", errorElement);
    return;
  } else {
    errorElement.textContent = ""; // Clear error message
    login();
  }
});