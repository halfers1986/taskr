const firstnameElement = document.getElementById("firstname");
const lastnameElement = document.getElementById("lastname");
const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const passwordElement = document.getElementById("password");
const confirmPasswordElement = document.getElementById("confirm-password");
const dobElement = document.getElementById("DOB");
const submitButton = document.getElementById("submit-button");
const errorElement = document.getElementById("error");

// Error checker
var nameError = false;
var usernameError = false;
var emailError = false;
var dobError = false;
var passwordError = false;




function validateName() {
  if (firstnameElement.value === "" || lastnameElement.value === "") {
    if (firstnameElement.value === "") {
      firstnameElement.setAttribute("aria-invalid", "true");
    }
    if (lastnameElement.value === "") {
      lastnameElement.setAttribute("aria-invalid", "true");
    }
    errorElement.textContent = "Please complete all fields.";
    nameError = true;
    return false;
  } else {
    firstnameElement.setAttribute("aria-invalid", "false");
    lastnameElement.setAttribute("aria-invalid", "false");
    nameError = false;
    if (nameError === false && usernameError === false && emailError === false && dobError === false && passwordError === false) {
      errorElement.textContent = "";
    }
    return true;
  }
}

function validateUsername() {
  if (usernameElement.value === "") {
    usernameElement.setAttribute("aria-invalid", "true");
    errorElement.textContent = "Please complete all fields.";
    usernameError = true;
    return false;
  } else {
    usernameElement.setAttribute("aria-invalid", "false");
    usernameError = false;
    if (nameError === false && usernameError === false && emailError === false && dobError === false && passwordError === false) {
      errorElement.textContent = "";
    }
    return true;
  }
}

function validateEmail() {
  if (emailElement.value === "") {
    emailElement.setAttribute("aria-invalid", "true");
    errorElement.textContent = "Please complete all fields.";
    emailError = true;
    return false;
  } else if (validator.isEmail(emailElement.value) === false) {
    emailElement.setAttribute("aria-invalid", "true");
    errorElement.textContent = "Invalid email address.";
    emailError = true;
    return false;
  } else {
    emailElement.setAttribute("aria-invalid", "false");
    emailError = false;
    if (nameError === false && usernameError === false && emailError === false && dobError === false && passwordError === false) {
      errorElement.textContent = "";
    }
    return true;
  }
}

function validateDOB() {
  if (dobElement.value === "") {
    dobElement.setAttribute("aria-invalid", "true");
    errorElement.textContent = "Please complete all fields.";
    dobError = true;
    return false;
  } else {
    dobElement.setAttribute("aria-invalid", "false");
    dobError = false;
    if (nameError === false && usernameError === false && emailError === false && dobError === false && passwordError === false) {
      errorElement.textContent = "";
    }
    return true;
  }
}

function validatePassword() {
  if (passwordElement.value === "" || confirmPasswordElement.value === "") {
    if (passwordElement.value === "") {
      passwordElement.setAttribute("aria-invalid", "true");
    }
    if (confirmPasswordElement.value === "") {
      confirmPasswordElement.setAttribute("aria-invalid", "true");
    }
    errorElement.textContent = "Please complete all fields.";
    passwordError = true;
    return false;
  } else if (passwordElement.value !== confirmPasswordElement.value) {
    passwordElement.setAttribute("aria-invalid", "true");
    confirmPasswordElement.setAttribute("aria-invalid", "true");
    passwordError = true;
    errorElement.textContent = "Passwords do not match.";
  } else if (passwordElement.value.length < 8) {
    passwordElement.setAttribute("aria-invalid", "true");
    confirmPasswordElement.setAttribute("aria-invalid", "true");
    passwordError = true;
    errorElement.textContent = "Password must be at least 8 characters long.";
    return false;
  } else {
    passwordElement.setAttribute("aria-invalid", "false");
    confirmPasswordElement.setAttribute("aria-invalid", "false");
    passwordError = false;
    if (nameError === false && usernameError === false && emailError === false && dobError === false && passwordError === false) {
      errorElement.textContent = "";
    }
    return true;
  }
}

function validateForm() {
  if (validateName() && validateEmail() && validateDOB() && validatePassword() && validateUsername()) {
    return true;
  } else {
    return false;
  }
}

async function register() {
  // Register the user
  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: firstnameElement.value,
        lastName: lastnameElement.value,
        username: usernameElement.value,
        email: emailElement.value,
        password: passwordElement.value,
        dob: dobElement.value
      }),
    });
    if (!response.ok) {
      errorElement.textContent = "Failed to login. (Error: " + results.status + ")";
      return;
    }

    // Parse the JSON response
    const data = await response.json();

    // Redirect the user to the dashboard
    window.location.href = data.url;
  } catch (error) {
    console.error("Failed to register user:", error.message);
    console.log("Error" + error.message);
    errorElement.textContent = error.message;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // firstnameElement.onblur = validateName;
  lastnameElement.onblur = validateName;
  emailElement.onblur = validateEmail;
  dobElement.onblur = validateDOB;
  // passwordElement.onblur = validatePassword;
  confirmPasswordElement.onblur = validatePassword;
  usernameElement.onblur = validateUsername;

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    } else {
      register();
    }
  });
});
