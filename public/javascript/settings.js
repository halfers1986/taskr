import { closeModal, openModal } from "./modal.js";

// Get the button elements
const editDetailsButton = document.getElementById('edit-details');
const changePasswordButton = document.getElementById('change-password-button');
const addCategoryButton = document.getElementById('add-category');
const deleteCategoryButtons = document.querySelectorAll('.custom-categories-delete');
const deleteAccountButton = document.getElementById('delete-account-button');

// Delete account modal config
let visibleModal = null;
const modal = document.querySelector(".delete-account-dialog");
const modalClose = modal.querySelector("#cancel-delete-account");
const confirmDeleteButton = modal.querySelector("#confirm-delete-account");

function editDetails() {
    // Get the elements to replace
    const usernameElement = document.getElementById('username');
    const nameContainer = document.getElementById('name-container');
    const firstNameElement = document.getElementById('firstName');
    const lastNameElement = document.getElementById('lastName');
    const emailElement = document.getElementById('email');
    const editButton = document.getElementById('edit-details');

    // Get the current values
    let currentUsername = usernameElement.textContent;
    let currentFirstName = firstNameElement.textContent;
    let currentLastName = lastNameElement.textContent;
    let currentEmail = emailElement.textContent;

    // Create the form elements
    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.value = usernameElement.textContent;
    const nameDiv = document.createElement('div');
    const firstNameInput = document.createElement('input');
    const lastNameInput = document.createElement('input');
    firstNameInput.type = 'text';
    firstNameInput.value = currentFirstName;
    lastNameInput.type = 'text';
    lastNameInput.value = currentLastName;
    nameDiv.appendChild(firstNameInput);
    nameDiv.appendChild(lastNameInput);
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.value = emailElement.textContent;
    const buttonDiv = document.createElement('div');
    buttonDiv.style.display = 'grid';
    buttonDiv.style.gridTemplateColumns = '1fr 1fr 1fr 1fr';
    buttonDiv.style.gap = '0.8rem';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.className = 'secondary';
    buttonDiv.appendChild(saveButton);
    buttonDiv.appendChild(cancelButton);

    // Replace the elements
    usernameElement.replaceWith(usernameInput);
    nameContainer.replaceWith(nameDiv);
    emailElement.replaceWith(emailInput);
    editButton.replaceWith(buttonDiv);

    function cancelEdit() {
        usernameInput.replaceWith(usernameElement);
        nameDiv.replaceWith(nameContainer);
        emailInput.replaceWith(emailElement);
        buttonDiv.replaceWith(editButton);
    }

    async function saveDetails() {

        // Get the input values
        const newUsername = usernameInput.value.trim();
        const newFirstName = firstNameInput.value.trim();
        const newLastName = lastNameInput.value.trim();
        const newEmail = emailInput.value.trim();

        const toChange = {};

        if (newUsername !== currentUsername) {
            toChange.username = newUsername;
        }
        if (newFirstName !== currentFirstName) {
            toChange.firstName = newFirstName;
        }
        if (newLastName !== currentLastName) {
            toChange.lastName = newLastName;
        }
        if (newEmail !== currentEmail) {
            toChange.email = newEmail;
        }


        try {
            const response = await fetch("/update-user-details", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toChange)
            });
            const data = await response.json();

            // If the request failed, log the error and return
            if (!response.ok) {
                console.error("settings.js: Failed to update user details:", data.message);
                cancelEdit();
                return;
            }

            // Else, update the elements and replace the form elements
            if (newUsername !== currentUsername) {
                usernameElement.textContent = newUsername;
            }
            if (newFirstName !== currentFirstName) {
                firstNameElement.textContent = newFirstName;
            }
            if (newLastName !== currentLastName) {
                lastNameElement.textContent = newLastName;
            }
            if (newEmail !== currentEmail) {
                emailElement.textContent = newEmail;
            }
            usernameInput.replaceWith(usernameElement);
            nameDiv.replaceWith(nameContainer);
            emailInput.replaceWith(emailElement);
            buttonDiv.replaceWith(editButton);

        } catch (err) {
            console.error("Error updating user details:", err);
            cancelEdit();
        }
    }

    // Add event listeners to the buttons
    saveButton.addEventListener('click', () => saveDetails());
    cancelButton.addEventListener('click', () => cancelEdit());
}

function changePassword() {
    document.getElementById('update-password-success').style.display = 'none';
    const changePasswordForm = document.getElementById('change-password-form');
    changePasswordButton.style.display = 'none'; // Hide the button when showing the form
    changePasswordForm.style.display = 'block'; // Show the form

    // Get the input elements and the buttons
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const saveButton = document.getElementById('confirm-password-change');
    const cancelButton = document.getElementById('cancel-password-change');

    // Get the error message elements
    const passwordMatchError = document.getElementById('password-match-error');
    const passwordChangeErrorFailure = document.getElementById('password-change-error-failure');
    const passwordLengthError = document.getElementById('password-length-error');
    const currentPasswordError = document.getElementById('current-password-error');

    function cancelPasswordChange() {
        changePasswordForm.style.display = 'none';
        changePasswordButton.style.display = 'block';
        changePasswordForm.reset();
    }

    async function savePasswordChange(event) {
        event.preventDefault();
        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        // Hide the error messages from previous attempts
        passwordMatchError.style.display = 'none';
        passwordChangeErrorFailure.style.display = 'none';

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            passwordMatchError.style.display = 'block';
            newPasswordInput.setAttribute('aria-invalid', 'true');
            confirmPasswordInput.setAttribute('aria-invalid', 'true');
            function clearError() {
                newPasswordInput.removeAttribute('aria-invalid');
                confirmPasswordInput.removeAttribute('aria-invalid');
                passwordMatchError.style.display = 'none';
            }
            newPasswordInput.addEventListener('input', () => clearError());
            confirmPasswordInput.addEventListener('input', () => clearError());
            return;
        }

        // Check if the new password is at least 8 characters long
        if (newPassword.length < 8) {
            passwordLengthError.style.display = 'block';
            newPasswordInput.setAttribute('aria-invalid', 'true');
            confirmPasswordInput.setAttribute('aria-invalid', 'true');
            function clearError() {
                newPasswordInput.removeAttribute('aria-invalid');
                confirmPasswordInput.removeAttribute('aria-invalid');
                passwordLengthError.style.display = 'none';
            }
            newPasswordInput.addEventListener('input', () => clearError());
            confirmPasswordInput.addEventListener('input', () => clearError());
            return;
        }

        // Else, send the request to the server
        try {
            const response = await fetch("/update-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            console.log("settings.js: Response from server:", data);

            // If the request failed, log the error and return
            if (!response.ok) {
                // If the status is 401, show an error message for the current password
                if (response.status === 401) {
                    currentPasswordError.style.display = 'block';
                    currentPasswordInput.setAttribute('aria-invalid', 'true');
                    function clearError() {
                        currentPasswordInput.removeAttribute('aria-invalid');
                        currentPasswordError.style.display = 'none';
                    }
                    currentPasswordInput.addEventListener('input', () => clearError());
                } else { // Else, show a general error message
                    console.error("settings.js: Failed to update user details:", data.message);
                    document.getElementById("password-change-error-failure").style.display = "block";
                }
                return;
            }

            console.log("Password updated successfully - UI should now update.");

            // Else, update the elements and replace the form elements
            changePasswordForm.style.display = 'none';
            changePasswordButton.style.display = 'block';
            changePasswordForm.reset();
            document.getElementById('update-password-success').style.display = 'block';
            setTimeout(() => {
                document.getElementById('update-password-success').style.display = 'none';
            }, 5000);


        } catch (err) {
            console.error("Error updating user details:", err);
        }

    }

    // Add event listeners to the buttons
    saveButton.addEventListener('click', (event) => {
        console.log('save button clicked');
        savePasswordChange(event)
    });
    cancelButton.addEventListener('click', () => {
        console.log('cancel button clicked');
        cancelPasswordChange()
    });

}

async function addCategory(event) {
    event.preventDefault();
    const newCategoryValue = document.getElementById('new-category').value;

    // If the input is empty, return
    if (!newCategoryValue) {
        return;
    }

    // Else send the request to the server
    try {
        const response = await fetch("/add-category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newCategory: newCategoryValue })
        });

        const data = await response.json();

        // If the request failed, log the error and return
        if (!response.ok) {
            console.error("settings.js: Failed to add category:", data.message);
            return;
        }

        // Else, update the elements and replace the form elements
        document.getElementById('new-category').value = '';
        const categoryList = document.getElementById('custom-categories-list');
        const newCategory = document.createElement('li');
        newCategory.className = "category-list-item";
        newCategory.setAttribute('data-category-id', data.categoryID);
        newCategory.textContent = newCategoryValue;
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.className = 'custom-categories-delete';
        deleteButton.addEventListener('click', deleteCategory);
        newCategory.appendChild(deleteButton);
        categoryList.appendChild(newCategory);
    } catch (err) {
        console.error("Error adding category:", err);
    }
}

async function deleteCategory(event) {
    const categoryID = event.target.parentElement.getAttribute('data-category-id');

    // Send the request to the server
    try {
        const response = await fetch("/delete-category/", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ categoryID })
        });

        const data = await response.json();

        // If the request failed, log the error and return
        if (!response.ok) {
            if (response.status === 409) { // Status 409: Conflict - category is in use
                // Show an error message
                document.getElementById("category-delete-conflict").style.display = "block";
            }
            console.error("settings.js: Failed to delete category:", data.message);
            return;
        }

        // Else, remove the element from the list
        event.target.parentElement.remove();
    } catch (err) {
        console.error("Error deleting category:", err);
    }
}

function deleteAccount() {

    visibleModal = modal;
    openModal(modal);

    const passwordInput = document.getElementById('confirm-password-delete-account');
    const deleteInput = document.getElementById('delete-account-input');
    let password;
    let deleteText;

    confirmDeleteButton.disabled = true;

    deleteInput.addEventListener('input', () => {
        deleteText = deleteInput.value;
        password = passwordInput.value;
        if (deleteText === 'DELETE' && password !== '') {
            confirmDeleteButton.disabled = false;
        } else {
            confirmDeleteButton.disabled = true;
        }
    });

    const message = confirmDeleteButton.addEventListener('click', () => confirmDelete(password));
    modalClose.addEventListener('click', () => closeModal(visibleModal));
};


async function confirmDelete(password) {
    try {
        const response = await fetch("/delete-account", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        // If the request failed, log the error and return
        if (!response.ok) {
            if (response.status === 401) {
                console.error("settings.js: Failed to delete account:", data.message);
                return "Incorrect password";
            }
            console.error("settings.js: Failed to delete account:", data.message);
            return "Failed to delete account";
        }

        console.log(data.message);

        // Else, clear session and redirect to the login page
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "Failed to log out" });
            }
            res.clearCookie("connect.sid");
            window.location.href = "/login";
        });


    } catch (error) {
        console.error("Error deleting account:", error);
    }
};


// Add event listeners to the buttons
document.addEventListener('DOMContentLoaded', async function () {
    // Add event listeners to the buttons
    editDetailsButton.addEventListener('click', editDetails);
    changePasswordButton.addEventListener('click', (event) => changePassword(event));
    addCategoryButton.addEventListener('click', (event) => addCategory(event));
    deleteCategoryButtons.forEach((button) => {
        button.addEventListener('click', deleteCategory);
    });
    deleteAccountButton.addEventListener('click', deleteAccount);
});