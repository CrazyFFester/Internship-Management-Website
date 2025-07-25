// Logout Functionality
// This file clears user session data when the logout page loads

// Clear all stored user session data
function clearUserSession() {
    // Clear localStorage (persistent storage)
    localStorage.clear();
    
    // Clear sessionStorage (temporary storage)
    sessionStorage.clear();
}

// Clear session data when the page loads
document.addEventListener('DOMContentLoaded', clearUserSession);