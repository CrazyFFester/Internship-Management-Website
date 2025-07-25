// Profile form validation for student and company profiles
document.addEventListener('DOMContentLoaded', function() {
    const studentProfileForm = document.getElementById('profileForm');
    const companyProfileForm = document.querySelector('#profileForm');
    
    if (studentProfileForm && window.location.pathname.includes('student')) {
        setupStudentProfileValidation();
    } else if (companyProfileForm && window.location.pathname.includes('company')) {
        setupCompanyProfileValidation();
    }
});

function setupStudentProfileValidation() {
    const nameInput = document.getElementById('editName');
    const emailInput = document.getElementById('editEmail');
    const universityInput = document.getElementById('editUniversity');
    const majorInput = document.getElementById('editMajor');
    const gradYearInput = document.getElementById('editGradYear');
    const skillsInput = document.getElementById('editSkills');
    const descriptionInput = document.getElementById('editDescription');
    const currentPasswordInput = document.getElementById('editCurrentPassword');
    const newPasswordInput = document.getElementById('editNewPassword');
    const confirmPasswordInput = document.getElementById('editConfirmPassword');
    
    // Add real-time validation
    nameInput.addEventListener('blur', function() {
        validateProfileName(this);
    });
    
    emailInput.addEventListener('blur', function() {
        validateProfileEmail(this);
    });
    
    universityInput.addEventListener('blur', function() {
        validateUniversity(this);
    });
    
    majorInput.addEventListener('blur', function() {
        validateMajor(this);
    });
    
    gradYearInput.addEventListener('blur', function() {
        validateGradYear(this);
    });
    
    skillsInput.addEventListener('blur', function() {
        validateSkills(this);
    });
    
    descriptionInput.addEventListener('blur', function() {
        validateDescription(this);
    });
    
    // Add password validation
    if (currentPasswordInput) {
        currentPasswordInput.addEventListener('blur', function() {
            validateCurrentPassword(this);
        });
    }
    
    if (newPasswordInput) {
        newPasswordInput.addEventListener('blur', function() {
            validateNewPassword(this);
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validatePasswordMatch(newPasswordInput, this);
        });
        
        // Re-validate confirm password when new password changes
        newPasswordInput.addEventListener('input', function() {
            if (confirmPasswordInput.value) {
                validatePasswordMatch(this, confirmPasswordInput);
            }
        });
    }
    
    // Enhance form submission validation
    const originalSubmitHandler = document.getElementById('profileForm').onsubmit;
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        let isValid = true;
        
        if (!validateProfileName(nameInput)) isValid = false;
        if (!validateProfileEmail(emailInput)) isValid = false;
        if (universityInput.value && !validateUniversity(universityInput)) isValid = false;
        if (majorInput.value && !validateMajor(majorInput)) isValid = false;
        if (gradYearInput.value && !validateGradYear(gradYearInput)) isValid = false;
        if (skillsInput.value && !validateSkills(skillsInput)) isValid = false;
        if (descriptionInput.value && !validateDescription(descriptionInput)) isValid = false;
        
        if (!isValid) {
            e.preventDefault();
            showProfileError('Please fix the errors before submitting.');
            return false;
        }
    });
}

function setupCompanyProfileValidation() {
    const companyNameInput = document.getElementById('editCompanyName');
    const emailInput = document.getElementById('editEmail');
    const phoneInput = document.getElementById('editPhone');
    const websiteInput = document.getElementById('editWebsite');
    const locationInput = document.getElementById('editLocation');
    const descriptionInput = document.getElementById('editDescription');
    
    // Add real-time validation
    companyNameInput.addEventListener('blur', function() {
        validateCompanyName(this);
    });
    
    emailInput.addEventListener('blur', function() {
        validateProfileEmail(this);
    });
    
    phoneInput.addEventListener('blur', function() {
        validatePhone(this);
    });
    
    websiteInput.addEventListener('blur', function() {
        validateWebsite(this);
    });
    
    locationInput.addEventListener('blur', function() {
        validateLocation(this);
    });
    
    descriptionInput.addEventListener('blur', function() {
        validateDescription(this);
    });
    
    // Enhance form submission validation
    document.getElementById('profileForm').addEventListener('submit', function(e) {
        let isValid = true;
        
        if (!validateCompanyName(companyNameInput)) isValid = false;
        if (!validateProfileEmail(emailInput)) isValid = false;
        if (phoneInput.value && !validatePhone(phoneInput)) isValid = false;
        if (websiteInput.value && !validateWebsite(websiteInput)) isValid = false;
        if (locationInput.value && !validateLocation(locationInput)) isValid = false;
        if (descriptionInput.value && !validateDescription(descriptionInput)) isValid = false;
        
        if (!isValid) {
            e.preventDefault();
            showProfileError('Please fix the errors before submitting.');
            return false;
        }
    });
}

// Validation functions
function validateProfileName(input) {
    const name = input.value.trim();
    const namePattern = /^[a-zA-Z\s]{2,50}$/;
    
    clearProfileFieldError(input);
    
    if (!name) {
        showProfileFieldError(input, 'Full name is required');
        return false;
    }
    
    if (!namePattern.test(name)) {
        showProfileFieldError(input, 'Full name should contain only letters and spaces (2-50 characters)');
        return false;
    }
    
    return true;
}

function validateCompanyName(input) {
    const name = input.value.trim();
    const namePattern = /^[a-zA-Z0-9\s&.-]{2,100}$/;
    
    clearProfileFieldError(input);
    
    if (!name) {
        showProfileFieldError(input, 'Company name is required');
        return false;
    }
    
    if (!namePattern.test(name)) {
        showProfileFieldError(input, 'Company name should contain only letters, numbers, spaces, ampersands, dots, and hyphens (2-100 characters)');
        return false;
    }
    
    return true;
}

function validateProfileEmail(input) {
    const email = input.value.trim();
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    
    clearProfileFieldError(input);
    
    if (!email) {
        showProfileFieldError(input, 'Email is required');
        return false;
    }
    
    if (!emailPattern.test(email)) {
        showProfileFieldError(input, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validateUniversity(input) {
    const university = input.value.trim();
    const universityPattern = /^[a-zA-Z\s.-]{2,100}$/;
    
    clearProfileFieldError(input);
    
    if (university && !universityPattern.test(university)) {
        showProfileFieldError(input, 'University name should contain only letters, spaces, dots, and hyphens (2-100 characters)');
        return false;
    }
    
    return true;
}

function validateMajor(input) {
    const major = input.value.trim();
    const majorPattern = /^[a-zA-Z\s&-]{2,100}$/;
    
    clearProfileFieldError(input);
    
    if (major && !majorPattern.test(major)) {
        showProfileFieldError(input, 'Major should contain only letters, spaces, ampersands, and hyphens (2-100 characters)');
        return false;
    }
    
    return true;
}

function validateGradYear(input) {
    const year = parseInt(input.value);
    const currentYear = new Date().getFullYear();
    
    clearProfileFieldError(input);
    
    if (input.value && (isNaN(year) || year < 2020 || year > 2035)) {
        showProfileFieldError(input, 'Graduation year must be between 2020 and 2035');
        return false;
    }
    
    return true;
}

function validateSkills(input) {
    const skills = input.value.trim();
    const skillsPattern = /^[a-zA-Z0-9\s,.+#-]{2,500}$/;
    
    clearProfileFieldError(input);
    
    if (skills && !skillsPattern.test(skills)) {
        showProfileFieldError(input, 'Skills should contain only letters, numbers, spaces, commas, dots, plus signs, hashes, and hyphens (2-500 characters)');
        return false;
    }
    
    return true;
}

function validatePhone(input) {
    const phone = input.value.trim();
    const phonePattern = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
    
    clearProfileFieldError(input);
    
    if (phone && !phonePattern.test(phone)) {
        showProfileFieldError(input, 'Phone number should contain only numbers, spaces, hyphens, parentheses, and plus sign (7-20 characters)');
        return false;
    }
    
    return true;
}

function validateWebsite(input) {
    const website = input.value.trim();
    const websitePattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    
    clearProfileFieldError(input);
    
    if (website && !websitePattern.test(website)) {
        showProfileFieldError(input, 'Please enter a valid website URL starting with http:// or https://');
        return false;
    }
    
    return true;
}

function validateLocation(input) {
    const location = input.value.trim();
    const locationPattern = /^[a-zA-Z\s,.-]{2,100}$/;
    
    clearProfileFieldError(input);
    
    if (location && !locationPattern.test(location)) {
        showProfileFieldError(input, 'Location should contain only letters, spaces, commas, dots, and hyphens (2-100 characters)');
        return false;
    }
    
    return true;
}

function validateDescription(input) {
    const description = input.value.trim();
    
    clearProfileFieldError(input);
    
    if (description && description.length > 1000) {
        showProfileFieldError(input, 'Description should not exceed 1000 characters');
        return false;
    }
    
    return true;
}

function validateCurrentPassword(input) {
    const password = input.value;
    
    clearProfileFieldError(input);
    
    if (password && password.length < 6) {
        showProfileFieldError(input, 'Current password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

function validateNewPassword(input) {
    const password = input.value;
    
    clearProfileFieldError(input);
    
    if (password) {
        if (password.length < 8) {
            showProfileFieldError(input, 'New password must be at least 8 characters long');
            return false;
        }
        
        const complexityPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!complexityPattern.test(password)) {
            showProfileFieldError(input, 'New password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character');
            return false;
        }
    }
    
    return true;
}

function validatePasswordMatch(passwordInput, confirmInput) {
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    
    clearProfileFieldError(confirmInput);
    
    if (confirmPassword && password !== confirmPassword) {
        showProfileFieldError(confirmInput, 'Passwords do not match');
        return false;
    }
    
    return true;
}

function showProfileFieldError(input, message) {
    // Remove existing error
    clearProfileFieldError(input);
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'profile-field-error';
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    errorDiv.textContent = message;
    
    // Add error class to input
    input.classList.add('error');
    input.style.borderColor = '#dc3545';
    input.style.boxShadow = '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    
    // Insert error message after input
    input.parentNode.insertBefore(errorDiv, input.nextSibling);
}

function clearProfileFieldError(input) {
    // Remove error class and styling
    input.classList.remove('error');
    input.style.borderColor = '';
    input.style.boxShadow = '';
    
    // Remove error message
    const errorDiv = input.parentNode.querySelector('.profile-field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showProfileError(message) {
    // Remove existing form errors
    const existingError = document.querySelector('.profile-form-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'profile-form-error';
    errorDiv.style.cssText = `
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 0.75rem 1rem;
        margin: 1rem 0;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    // Find the profile edit form and insert message at the top
    const profileEdit = document.getElementById('profileEdit');
    if (profileEdit) {
        profileEdit.insertBefore(errorDiv, profileEdit.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Enhanced success message function for profiles
function showProfileSuccess(message) {
    // Remove existing messages
    const existingSuccess = document.querySelector('.profile-success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success element
    const successDiv = document.createElement('div');
    successDiv.className = 'profile-success-message';
    successDiv.style.cssText = `
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 0.75rem 1rem;
        margin: 1rem 0;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
    `;
    successDiv.textContent = message;
    
    // Find the profile edit form and insert message at the top
    const profileEdit = document.getElementById('profileEdit');
    if (profileEdit) {
        profileEdit.insertBefore(successDiv, profileEdit.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
}