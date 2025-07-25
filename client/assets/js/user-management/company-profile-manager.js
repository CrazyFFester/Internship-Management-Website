// Company Profile Management
// This file handles loading, displaying, and editing company profile information

// Global variables
let isEditMode = false;

// Initialize the page when it loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('Company profile page loaded');
    loadProfileData();
    setupFormSubmission();
});

// Load company profile data from the server
function loadProfileData() {
    console.log('Loading company profile data...');
    
    fetch('/api/company-profile')
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(profile => {
            console.log('Profile data received:', profile);
            displayProfileData(profile);
            showProfileDisplay();
        })
        .catch(error => {
            console.error('Error loading profile data:', error);
            showProfileError();
        });
}

// Display the profile data on the page
function displayProfileData(profile) {
    // Update basic information fields
    updateTextField('displayCompanyName', profile.company_name || profile.full_name);
    updateTextField('displayEmail', profile.email);
    updateTextField('displayPhone', profile.phone);
    updateTextField('displayWebsite', profile.website);
    updateTextField('displayLocation', profile.location);
    
    // Handle description with show more/less functionality
    setupDescriptionDisplay(profile.description);
}

// Update a text field with the provided value or "Not specified"
function updateTextField(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value || 'Not specified';
    }
}

// Set up the description display with show more/less functionality
function setupDescriptionDisplay(description) {
    const descriptionText = (description && description.trim()) ? description.trim() : 'No description provided';
    
    const descPreview = document.getElementById('desc-preview');
    const descFull = document.getElementById('desc-full');
    const descBtn = document.getElementById('desc-btn');
    
    if (descPreview && descFull && descBtn) {
        if (descriptionText.length > 150) {
            // Long description - show preview with "Show More" button
            descPreview.textContent = descriptionText.substring(0, 150) + '...';
            descFull.textContent = descriptionText;
            descBtn.style.display = 'inline-block';
        } else {
            // Short description - show full text without button
            descPreview.textContent = descriptionText;
            descFull.textContent = descriptionText;
            descBtn.style.display = 'none';
        }
    }
}

// Show the profile display section
function showProfileDisplay() {
    const profileDisplay = document.getElementById('profileDisplay');
    if (profileDisplay) {
        profileDisplay.style.display = 'flex';
        profileDisplay.style.visibility = 'visible';
        profileDisplay.style.opacity = '1';
        console.log('Profile display made visible');
    }
}

// Show error message when profile data fails to load
function showProfileError() {
    const errorFields = [
        'displayCompanyName', 'displayEmail', 'displayPhone', 
        'displayWebsite', 'displayDescription'
    ];
    
    errorFields.forEach(fieldId => {
        updateTextField(fieldId, 'Error loading data');
    });
}

// Toggle between display and edit modes
function toggleEditMode() {
    console.log('Toggle edit mode called, current mode:', isEditMode);
    
    if (!isEditMode) {
        switchToEditMode();
    } else {
        switchToDisplayMode();
    }
}

// Switch to edit mode
function switchToEditMode() {
    console.log('Switching to edit mode');
    
    // Hide display elements
    const displayDiv = document.getElementById('profileDisplay');
    const editButton = document.getElementById('editButton');
    
    if (displayDiv) displayDiv.style.display = 'none';
    if (editButton) editButton.style.display = 'none';
    
    // Show edit elements
    const editDiv = document.getElementById('profileEdit');
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) profileForm.style.display = 'block';
    if (editDiv) {
        editDiv.style.display = 'flex';
        editDiv.style.visibility = 'visible';
        editDiv.style.opacity = '1';
    }
    
    isEditMode = true;
    loadDataForEditing();
}

// Switch to display mode
function switchToDisplayMode() {
    console.log('Switching to display mode');
    
    // Show display elements
    const displayDiv = document.getElementById('profileDisplay');
    const editButton = document.getElementById('editButton');
    
    if (displayDiv) displayDiv.style.display = 'flex';
    if (editButton) editButton.style.display = 'block';
    
    // Hide edit elements
    const editDiv = document.getElementById('profileEdit');
    const profileForm = document.getElementById('profileForm');
    
    if (profileForm) profileForm.style.display = 'none';
    if (editDiv) editDiv.style.display = 'none';
    
    isEditMode = false;
}

// Load current data into the edit form
function loadDataForEditing() {
    fetch('/api/company-profile')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(profile => {
            // Fill form fields with current data
            fillEditField('editCompanyName', profile.company_name);
            fillEditField('editEmail', profile.email);
            fillEditField('editPhone', profile.phone);
            fillEditField('editWebsite', profile.website);
            fillEditField('editLocation', profile.location);
            fillEditField('editDescription', profile.description);
        })
        .catch(error => {
            console.error('Error loading profile data for edit:', error);
            loadDataFromDisplay();
        });
}

// Fill an edit form field with data
function fillEditField(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.value = value || '';
    }
}

// Fallback: Load data from display elements if API fails
function loadDataFromDisplay() {
    const displayElements = [
        { editId: 'editCompanyName', displayId: 'displayCompanyName' },
        { editId: 'editEmail', displayId: 'displayEmail' },
        { editId: 'editPhone', displayId: 'displayPhone' },
        { editId: 'editWebsite', displayId: 'displayWebsite' },
        { editId: 'editLocation', displayId: 'displayLocation' }
    ];
    
    displayElements.forEach(({ editId, displayId }) => {
        const displayElement = document.getElementById(displayId);
        const editElement = document.getElementById(editId);
        
        if (displayElement && editElement) {
            const displayText = displayElement.textContent;
            const isValidData = displayText !== 'Not specified' && 
                               displayText !== 'Loading...' && 
                               displayText !== 'Error loading data';
            
            editElement.value = isValidData ? displayText : '';
        }
    });
    
    // Handle description separately (get full text, not truncated)
    const descFull = document.getElementById('desc-full');
    const editDescription = document.getElementById('editDescription');
    
    if (descFull && editDescription) {
        const descText = descFull.textContent;
        const isValidDesc = descText !== 'Loading...' && descText !== 'No description provided';
        editDescription.value = isValidDesc ? descText : '';
    }
}

// Cancel editing and return to display mode
function cancelEdit() {
    clearPasswordFields();
    toggleEditMode();
}

// Clear all password input fields
function clearPasswordFields() {
    const passwordFields = [
        'editCurrentPassword', 
        'editNewPassword', 
        'editConfirmPassword'
    ];
    
    passwordFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
}

// Show error message in the edit form
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const editForm = document.getElementById('profileEdit');
    
    if (editForm) {
        // Remove any existing error messages
        removeExistingErrorMessages(editForm);
        
        // Add new error message at the top
        editForm.insertBefore(errorDiv, editForm.firstChild);
        
        // Auto-remove message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Remove existing error messages from the form
function removeExistingErrorMessages(form) {
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// Set up form submission handling
function setupFormSubmission() {
    const form = document.getElementById('profileForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmission);
    }
}

// Handle profile form submission
function handleFormSubmission(event) {
    event.preventDefault();
    
    // Collect profile data from form
    const profileData = collectProfileData();
    
    // Handle password change if any password field is filled
    const passwordValidation = validatePasswordChange();
    if (passwordValidation.hasError) {
        showErrorMessage(passwordValidation.errorMessage);
        return;
    }
    
    // Add password data if changing password
    if (passwordValidation.isChangingPassword) {
        profileData.current_password = passwordValidation.currentPassword;
        profileData.new_password = passwordValidation.newPassword;
        profileData.confirm_password = passwordValidation.confirmPassword;
    }
    
    // Send data to server
    saveProfileData(profileData, passwordValidation.isChangingPassword);
}

// Collect profile data from form fields
function collectProfileData() {
    return {
        full_name: document.getElementById('editCompanyName').value,
        email: document.getElementById('editEmail').value,
        company_name: document.getElementById('editCompanyName').value,
        phone: document.getElementById('editPhone').value,
        website: document.getElementById('editWebsite').value,
        location: document.getElementById('editLocation').value,
        description: document.getElementById('editDescription').value
    };
}

// Validate password change fields
function validatePasswordChange() {
    const currentPassword = document.getElementById('editCurrentPassword').value;
    const newPassword = document.getElementById('editNewPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;
    
    const isChangingPassword = currentPassword || newPassword || confirmPassword;
    
    if (!isChangingPassword) {
        return { hasError: false, isChangingPassword: false };
    }
    
    // Check if all password fields are filled
    if (!currentPassword || !newPassword || !confirmPassword) {
        return {
            hasError: true,
            errorMessage: 'All password fields are required when changing password'
        };
    }
    
    // Validate new password strength
    if (!isValidPassword(newPassword)) {
        return {
            hasError: true,
            errorMessage: 'New password must be at least 8 characters long with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
        };
    }
    
    // Check if passwords match
    if (newPassword !== confirmPassword) {
        return {
            hasError: true,
            errorMessage: 'New passwords do not match'
        };
    }
    
    return {
        hasError: false,
        isChangingPassword: true,
        currentPassword,
        newPassword,
        confirmPassword
    };
}

// Check if password meets requirements
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

// Save profile data to the server
function saveProfileData(profileData, isChangingPassword) {
    fetch('/api/company-profile', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    })
    .then(result => {
        if (result.message) {
            handleSuccessfulSave(isChangingPassword);
        } else {
            alert('Failed to update profile');
        }
    })
    .catch(error => {
        console.error('Error updating profile:', error);
        handleSaveError(error);
    });
}

// Handle successful profile save
function handleSuccessfulSave(isChangingPassword) {
    clearPasswordFields();
    loadProfileData(); // Reload fresh data from server
    toggleEditMode(); // Switch back to display mode
    
    const successMessage = isChangingPassword ? 
        'Profile and password updated successfully!' : 
        'Profile updated successfully!';
    alert(successMessage);
}

// Handle profile save error
function handleSaveError(error) {
    let errorMessage = 'An error occurred while updating profile. Please try again.';
    
    if (error.error === 'Email already exists') {
        errorMessage = 'This email is already registered. Please use a different email.';
    } else if (error.error) {
        errorMessage = 'Error: ' + error.error;
    }
    
    showErrorMessage(errorMessage);
}

// Toggle description display between preview and full text
function toggleDescription() {
    const descPreview = document.getElementById('desc-preview');
    const descFull = document.getElementById('desc-full');
    const descBtn = document.getElementById('desc-btn');
    
    if (descPreview && descFull && descBtn) {
        if (descFull.style.display === 'none') {
            // Currently showing preview, switch to full
            descPreview.style.display = 'none';
            descFull.style.display = 'block';
            descBtn.textContent = 'Show Less';
        } else {
            // Currently showing full, switch to preview
            descPreview.style.display = 'block';
            descFull.style.display = 'none';
            descBtn.textContent = 'Show More';
        }
    }
}