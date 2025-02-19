// Logout function
async function logout() {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to log out.");
      }
      const data = await response.json();
      window.location.href = data.url;
    } catch (err) {
      console.error("Error logging out:", err);
    }
  }

// Add event listener to the logout button
const logoutButton = document.getElementById("logout");
if (logoutButton) {
  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Logging out...");
    logout();
  });
}