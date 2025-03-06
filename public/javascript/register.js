import showError from "./showError.js";

const firstnameElement = document.getElementById("firstname");
const lastnameElement = document.getElementById("lastname");
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const confirmPasswordElement = document.getElementById("confirm-password");
const dobElement = document.getElementById("DOB");
const submitButton = document.getElementById("submit-button");
const errorElement = document.getElementById("error");

// Validation functions
function isValidLength(value, min, max) {
  return value.length >= min && value.length <= max;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Field validation logic
function validateField(input, message, min, max) {
  if (!isValidLength(input.value, min, max)) {
    input.setAttribute("aria-invalid", "true");
    showError(message, errorElement);
  } else {
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = ""; // Clear error
  }
  checkFormValidity();
}

function validateEmailField(input, message) {
  if (!isValidEmail(input.value)) {
    input.setAttribute("aria-invalid", "true");
    showError(message, errorElement);
  } else {
    input.setAttribute("aria-invalid", "false");
    errorElement.textContent = ""; // Clear error
  }
  checkFormValidity();
}

function validatePasswordMatch() {
  if (confirmPasswordElement.value !== passwordElement.value) {
    confirmPasswordElement.setAttribute("aria-invalid", "true");
    showError("Passwords do not match.", errorElement);
  } else {
    confirmPasswordElement.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  }
  checkFormValidity();
}

function validateDOB() {
  if (!dobElement.value) {
    dobElement.setAttribute("aria-invalid", "true");
    showError("Date of birth is required.", errorElement);
  } else {
    dobElement.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  }
  checkFormValidity();
}

// Enable/disable submit button
function checkFormValidity() {
  submitButton.disabled = !(
    isValidLength(firstnameElement.value.trim(), 2, 50) &&
    isValidLength(lastnameElement.value.trim(), 2, 50) &&
    isValidLength(usernameElement.value.trim(), 3, 20) &&
    isValidEmail(emailElement.value.trim()) &&
    isValidLength(passwordElement.value.trim(), 6, 20) &&
    isValidLength(confirmPasswordElement.value.trim(), 6, 20) &&
    confirmPasswordElement.value.trim() === passwordElement.value.trim() &&
    dobElement.value
  );
}

// Register function
async function register() {
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: firstnameElement.value.trim(),
        lastname: lastnameElement.value.trim(),
        username: usernameElement.value.trim(),
        email: emailElement.value.trim(),
        password: passwordElement.value.trim(),
        dob: dobElement.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      showError(data.message, errorElement);
      return;
    }

    window.location.href = data.url;
  } catch (error) {
    console.error("Registration failed:", error);
  }
}

// Event listeners
firstnameElement.addEventListener("blur", () => validateField(firstnameElement, "First name must be at least 2 characters", 2, 50));
lastnameElement.addEventListener("blur", () => validateField(lastnameElement, "Last name must be at least 2 characters", 2, 50));
usernameElement.addEventListener("blur", () => validateField(usernameElement, "Username must be 3-20 characters", 3, 20));
emailElement.addEventListener("blur", () => validateEmailField(emailElement, "Enter a valid email"));
passwordElement.addEventListener("blur", () => validateField(passwordElement, "Password must be 6-20 characters", 6, 20));
confirmPasswordElement.addEventListener("blur", () => {
  if (validatePasswordMatch) {
    validateField(confirmPasswordElement, "Password must be 6-20 characters", 6, 20);
  }
});
dobElement.addEventListener("blur", validateDOB);

firstnameElement.addEventListener("input", checkFormValidity);
lastnameElement.addEventListener("input", checkFormValidity);
usernameElement.addEventListener("input", checkFormValidity);
emailElement.addEventListener("input", checkFormValidity);
passwordElement.addEventListener("input", checkFormValidity);
confirmPasswordElement.addEventListener("input", checkFormValidity);
dobElement.addEventListener("input", checkFormValidity);

submitButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (!isValidLength(firstnameElement.value, 2, 50)) {
    showError("First name must be at least 2 characters.", errorElement);
  } else if (!isValidLength(lastnameElement.value, 2, 50)) {
    showError("Last name must be at least 2 characters.", errorElement);
  } else if (!isValidLength(usernameElement.value, 3, 20)) {
    showError("Username must be 3-20 characters.", errorElement);
  } else if (!isValidEmail(emailElement.value)) {
    showError("Enter a valid email.", errorElement);
  } else if (!isValidLength(passwordElement.value, 6, 20)) {
    showError("Password must be 6-20 characters.", errorElement);
  } else if (confirmPasswordElement.value !== passwordElement.value) {
    showError("Passwords do not match.", errorElement);
  } else if (!dobElement.value) {
    showError("Date of birth is required.", errorElement);
  } else {
    errorElement.textContent = ""; // Clear error message
    register();
  }
});
