const loginButton = document.getElementById("login-button");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorElement = document.getElementById("error");

function showError(errorType) {
  if (errorType === "invalid") {
    errorElement.textContent = "Invalid username or password.";
    usernameInput.setAttribute("aria-invalid", "true");
    passwordInput.setAttribute("aria-invalid", "true");
  } else if (errorType === "empty") {
    errorElement.textContent = "Please enter your username and password.";
    usernameInput.setAttribute("aria-invalid", "true");
    passwordInput.setAttribute("aria-invalid", "true");
  } else if (errorType === "empty-email") {
    errorElement.textContent = "Please enter your email.";
    usernameInput.setAttribute("aria-invalid", "true");
  } else if (errorType === "empty-password") {
    errorElement.textContent = "Please enter your password.";
    passwordInput.setAttribute("aria-invalid", "true");
  } else if (errorType === "server") {
    errorElement.textContent = "Server error. Please try again later.";
  } else {
    errorElement.textContent = "Unknown error. Please try again.";
  }
}

async function tryLogin(event) {
  event.preventDefault();

  // Reset error messages
  usernameInput.setAttribute("aria-valid", "true");
  passwordInput.setAttribute("aria-valid", "true");

  // Get the email and password values
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Validate the email and password
  if (username === "" && password === "") {
    showError("empty");
    return;
  } else if (username === "") {
    showError("empty-email");
    return;
  } else if (password === "") {
    showError("empty-password");
    return;
  } else {
    // Send the login request to the server
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include" // Send session cookies
      });

      // Parse the JSON response
      const data = await response.json();

      // If the login failed, show an error message and return
      if (!response.ok) {
        showError(data.message || "An unexpected error occurred. Please try again.");
        return;
      }

      // Else redirect the user to the dashboard
      window.location.href = data.url;

    } catch (error) {
      console.error("Failed to login user:", error.message);
      showError("An unexpected error occurred. Please try again.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  usernameInput.onblur = function () {
    if (JSON.stringify(usernameInput.value).includes("@") === false) {
      usernameInput.setAttribute("aria-invalid", "true");
    } else if (usernameInput.value === "") {
      usernameInput.setAttribute("aria-invalid", "true");
    } else {
      usernameInput.setAttribute("aria-invalid", "false");
    }
  };

  passwordInput.onblur = function () {
    if (passwordInput.value === "") {
      passwordInput.setAttribute("aria-invalid", "true");
    } else {
      passwordInput.setAttribute("aria-invalid", "false");
    }
  };

  if (loginButton) {
    loginButton.addEventListener("click", tryLogin);
  }
});
