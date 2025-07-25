// Form Validation - Authentication Forms
// This file handles real-time validation for login and registration forms

// Initialize validation when page loads
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        setupLoginFormValidation();
    }
    
    if (signupForm) {
        setupSignupFormValidation();
    }
});

// Set up validation for the login form
function setupLoginFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    
    // Add validation when user leaves a field (blur event)
    emailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
    
    passwordInput.addEventListener('blur', function() {
        validateLoginPassword(this);
    });
    
    // Validate entire form when submitted
    loginForm.addEventListener('submit', function(event) {
        const isFormValid = validateLoginForm(emailInput, passwordInput);
        
        if (!isFormValid) {
            event.preventDefault(); // Stop form from submitting
            showFormError('Please fix the errors before submitting.');
        }
    });
}

// Set up validation for the signup form
function setupSignupFormValidation() {
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const retypePasswordInput = document.getElementById('signup-retype-password');
    
    // Add validation when user leaves each field
    nameInput.addEventListener('blur', function() {
        validateName(this);
    });
    
    emailInput.addEventListener('blur', function() {
        validateEmail(this);
    });
    
    passwordInput.addEventListener('blur', function() {
        validateSignupPassword(this);
    });
    
    retypePasswordInput.addEventListener('blur', function() {
        validatePasswordMatch(passwordInput, this);
    });
    
    // Re-check password match when main password changes
    passwordInput.addEventListener('input', function() {
        if (retypePasswordInput.value) {
            validatePasswordMatch(this, retypePasswordInput);
        }
    });
    
    // Validate entire form when submitted
    signupForm.addEventListener('submit', function(event) {
        const isFormValid = validateSignupForm(nameInput, emailInput, passwordInput, retypePasswordInput);
        
        if (!isFormValid) {
            event.preventDefault(); // Stop form from submitting
            showFormError('Please fix the errors before submitting.');
        }
    });
}

// Validate the entire login form
function validateLoginForm(emailInput, passwordInput) {
    let isValid = true;
    
    if (!validateEmail(emailInput)) isValid = false;
    if (!validateLoginPassword(passwordInput)) isValid = false;
    
    return isValid;
}

// Validate the entire signup form
function validateSignupForm(nameInput, emailInput, passwordInput, retypePasswordInput) {
    let isValid = true;
    
    if (!validateName(nameInput)) isValid = false;
    if (!validateEmail(emailInput)) isValid = false;
    if (!validateSignupPassword(passwordInput)) isValid = false;
    if (!validatePasswordMatch(passwordInput, retypePasswordInput)) isValid = false;
    
    return isValid;
}

// Validate a name field
function validateName(input) {
    const name = input.value.trim();
    
    // Clear any previous errors
    clearFieldError(input);
    
    // Check if name is empty
    if (!name) {
        showFieldError(input, 'Full name is required');
        return false;
    }
    
    // Check if name contains only letters and spaces (2-50 characters)
    const namePattern = /^[a-zA-Z\s]{2,50}$/;
    if (!namePattern.test(name)) {
        showFieldError(input, 'Full name should contain only letters and spaces (2-50 characters)');
        return false;
    }
    
    return true;
}

// Validate an email field
function validateEmail(input) {
    const email = input.value.trim();
    
    // Clear any previous errors
    clearFieldError(input);
    
    // Check if email is empty
    if (!email) {
        showFieldError(input, 'Email is required');
        return false;
    }
    
    // Check if email format is valid
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailPattern.test(email)) {
        showFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Validate password for login (simpler requirements)
function validateLoginPassword(input) {
    const password = input.value;
    
    // Clear any previous errors
    clearFieldError(input);
    
    // Check if password is empty
    if (!password) {
        showFieldError(input, 'Password is required');
        return false;
    }
    
    // Check minimum length for login
    if (password.length < 6) {
        showFieldError(input, 'Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

// Validate password for signup (stronger requirements)
function validateSignupPassword(input) {
    const password = input.value;
    
    // Clear any previous errors
    clearFieldError(input);
    
    // Check if password is empty
    if (!password) {
        showFieldError(input, 'Password is required');
        return false;
    }
    
    // Check minimum length
    if (password.length < 8) {
        showFieldError(input, 'Password must be at least 8 characters long');
        return false;
    }
    
    // Check password complexity (uppercase, lowercase, number, special character)
    if (!isPasswordComplex(password)) {
        showFieldError(input, 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character');
        return false;
    }
    
    return true;
}

// Check if password meets complexity requirements
function isPasswordComplex(password) {
    const complexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return complexityPattern.test(password);
}

// Validate that passwords match
function validatePasswordMatch(passwordInput, retypeInput) {
    const password = passwordInput.value;
    const retypePassword = retypeInput.value;
    
    // Clear any previous errors
    clearFieldError(retypeInput);
    
    // Check if retype password is empty
    if (!retypePassword) {
        showFieldError(retypeInput, 'Please retype your password');
        return false;
    }
    
    // Check if passwords match
    if (password !== retypePassword) {
        showFieldError(retypeInput, 'Passwords do not match');
        return false;
    }
    
    return true;
}

// Show an error message for a specific field
function showFieldError(input, message) {
    // Remove any existing error first
    clearFieldError(input);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    
    // Style the input field to show it has an error
    input.classList.add('error');
    
    // Add error message after the input field
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

// Clear error styling and message from a field
function clearFieldError(input) {
    // Remove error styling from input
    input.classList.remove('error');
    
    // Remove error message
    const errorDiv = input.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Show a general form error message
function showFormError(message) {
    // Remove any existing form errors
    const existingError = document.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    // Find the currently visible form and add error message above it
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    if (activeForm) {
        activeForm.parentNode.insertBefore(errorDiv, activeForm);
        
        // Auto-remove the error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Show a success message
function showSuccessMessage(message) {
    // Remove any existing success messages
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Find the currently visible form and add success message above it
    const activeForm = document.querySelector('.auth-form:not([style*="display: none"])');
    if (activeForm) {
        activeForm.parentNode.insertBefore(successDiv, activeForm);
        
        // Auto-remove the success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
}