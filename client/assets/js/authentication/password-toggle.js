// Password Visibility Toggle
// This file handles showing/hiding password fields with eye icon buttons

// Toggle password visibility for a specific input field
function togglePasswordVisibility(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.parentNode.querySelector('.password-toggle');
    
    // Check if both elements exist
    if (!passwordInput || !toggleButton) {
        console.error('Password input or toggle button not found for:', inputId);
        return;
    }
    
    // Toggle between password and text input types
    if (passwordInput.type === 'password') {
        showPassword(passwordInput, toggleButton);
    } else {
        hidePassword(passwordInput, toggleButton);
    }
}

// Show the password (change to text input)
function showPassword(passwordInput, toggleButton) {
    passwordInput.type = 'text';
    toggleButton.textContent = '🙈'; // Hide icon (eye with hand)
    toggleButton.style.color = '#3b82f6'; // Blue color when showing
}

// Hide the password (change to password input)
function hidePassword(passwordInput, toggleButton) {
    passwordInput.type = 'password';
    toggleButton.textContent = '👁️'; // Show icon (eye)
    toggleButton.style.color = '#6b7280'; // Gray color when hiding
}