// Error Handler - Authentication Page
// This file handles displaying error messages passed via URL parameters

// Initialize error handling when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters to check for error messages
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    // Show error message if one exists
    if (error) {
        const errorMessage = getErrorMessage(error);
        showErrorMessage(errorMessage);
        
        // Clear error parameter from URL to keep it clean
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

// Get appropriate error message based on error type
function getErrorMessage(errorType) {
    switch(errorType) {
        case 'email_exists':
            return 'This email is already registered. Please use a different email or try logging in.';
        case 'password_mismatch':
            return 'Passwords do not match. Please check your passwords and try again.';
        case 'missing_fields':
            return 'Please fill in all required fields.';
        case 'invalid_name':
            return 'Full name should contain only letters and spaces (2-50 characters).';
        case 'invalid_email':
            return 'Please enter a valid email address.';
        case 'invalid_password':
            return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.';
        case 'invalid_user_type':
            return 'Please select a valid account type (Student or Company).';
        case 'email_not_found':
            return 'Email does not exist. Please check your email or sign up.';
        case 'password_not_found':
            return 'Incorrect password. Please check your password and try again.';
        case 'not_student_account':
            return 'This email is registered as a Company account. Please switch to Company login or use a different email.';
        case 'not_company_account':
            return 'This email is registered as a Student account. Please switch to Student login or use a different email.';
        default:
            return 'An error occurred during authentication. Please try again.';
    }
}

// Display error message on the page
function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error'; // Using CSS class instead of inline styles
    errorDiv.textContent = message;
    
    // Find the appropriate form to display the error above
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const targetForm = signupForm || loginForm;
    
    if (targetForm) {
        // Insert error message before the form
        targetForm.parentNode.insertBefore(errorDiv, targetForm);
        
        // Auto-remove the error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}