let isEditMode = false;

// Load profile data on page load
window.addEventListener('DOMContentLoaded', function() {
  loadProfileData();
});

function loadProfileData() {
  // Load student profile from API
  fetch('/api/student-profile')
    .then(response => response.json())
    .then(profile => {
      document.getElementById('displayName').textContent = profile.full_name;
      document.getElementById('displayEmail').textContent = profile.email || 'Not specified';
      document.getElementById('displayUniversity').textContent = profile.university || 'Not specified';
      document.getElementById('displayMajor').textContent = profile.major || 'Not specified';
      document.getElementById('displayGradYear').textContent = profile.graduation_year || 'Not specified';
      document.getElementById('displaySkills').textContent = profile.skills || 'Not specified';
      
      // Handle description display
      const description = (profile.description && profile.description.trim()) ? profile.description.trim() : 'No description provided';
      const descPreview = document.getElementById('desc-preview');
      const descFull = document.getElementById('desc-full');
      const descBtn = document.getElementById('desc-btn');
      
      if (description.length > 150) {
        descPreview.textContent = description.substring(0, 150) + '...';
        descFull.textContent = description;
        descBtn.style.display = 'inline-block';
      } else {
        descPreview.textContent = description;
        descFull.textContent = description;
        descBtn.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error loading profile data:', error);
      document.getElementById('displayName').textContent = 'Error loading data';
      document.getElementById('displayEmail').textContent = 'Error loading data';
      document.getElementById('displayUniversity').textContent = 'Error loading data';
      document.getElementById('displayMajor').textContent = 'Error loading data';
      document.getElementById('displayGradYear').textContent = 'Error loading data';
      document.getElementById('displaySkills').textContent = 'Error loading data';
      document.getElementById('desc-preview').textContent = 'Error loading data';
      document.getElementById('desc-full').textContent = 'Error loading data';
    });
}

function toggleEditMode() {
  const displayDiv = document.getElementById('profileDisplay');
  const editDiv = document.getElementById('profileEdit');
  const editButton = document.getElementById('editButton');

  if (!isEditMode) {
    // Switch to edit mode
    displayDiv.style.display = 'none';
    editDiv.style.display = 'flex';
    editButton.style.display = 'none';
    isEditMode = true;

    // Populate edit form with current data
    populateEditForm();
  } else {
    // Switch to display mode
    displayDiv.style.display = 'flex';
    editDiv.style.display = 'none';
    editButton.style.display = 'block';
    isEditMode = false;
  }
}

function populateEditForm() {
  // Get current display values and populate edit form
  const displayName = document.getElementById('displayName').textContent;
  const displayEmail = document.getElementById('displayEmail').textContent;
  const displayUniversity = document.getElementById('displayUniversity').textContent;
  const displayMajor = document.getElementById('displayMajor').textContent;
  const displayGradYear = document.getElementById('displayGradYear').textContent;
  const displaySkills = document.getElementById('displaySkills').textContent;
  const displayDescription = document.getElementById('desc-full').textContent;

  if (displayName !== 'Loading...' && displayName !== 'Error loading data') {
    document.getElementById('editName').value = displayName;
  }
  if (displayEmail !== 'Not specified' && displayEmail !== 'Error loading data') {
    document.getElementById('editEmail').value = displayEmail;
  }
  
  document.getElementById('editUniversity').value = displayUniversity !== 'Not specified' ? displayUniversity : '';
  document.getElementById('editMajor').value = displayMajor !== 'Not specified' ? displayMajor : '';
  document.getElementById('editGradYear').value = displayGradYear !== 'Not specified' ? displayGradYear : '';
  document.getElementById('editSkills').value = displaySkills !== 'Not specified' ? displaySkills : '';
  document.getElementById('editDescription').value = displayDescription !== 'No description provided' ? displayDescription : '';
}

function cancelEdit() {
  // Clear password fields when canceling
  document.getElementById('editCurrentPassword').value = '';
  document.getElementById('editNewPassword').value = '';
  document.getElementById('editConfirmPassword').value = '';
  toggleEditMode();
}

function showErrorMessage(message) {
  // Create error element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
      background-color: #fee;
      border: 1px solid #fcc;
      color: #c66;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: var(--radius);
      font-size: 1rem;
      text-align: center;
  `;
  errorDiv.textContent = message;
  
  // Find the edit form and insert message at the top
  const editForm = document.getElementById('profileEdit');
  
  if (editForm) {
      // Remove any existing error messages
      const existingError = editForm.querySelector('.error-message');
      if (existingError) {
          existingError.remove();
      }
      
      // Insert error message at the top of the form
      editForm.insertBefore(errorDiv, editForm.firstChild);
      
      // Remove message after 5 seconds
      setTimeout(() => {
          if (errorDiv.parentNode) {
              errorDiv.parentNode.removeChild(errorDiv);
          }
      }, 5000);
  }
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const profileData = {
      full_name: document.getElementById('editName').value,
      email: document.getElementById('editEmail').value,
      university: document.getElementById('editUniversity').value,
      major: document.getElementById('editMajor').value,
      graduation_year: document.getElementById('editGradYear').value,
      skills: document.getElementById('editSkills').value,
      description: document.getElementById('editDescription').value
    };

    // Handle password change if any password field is filled
    const currentPassword = document.getElementById('editCurrentPassword').value;
    const newPassword = document.getElementById('editNewPassword').value;
    const confirmPassword = document.getElementById('editConfirmPassword').value;

    if (currentPassword || newPassword || confirmPassword) {
      // Validate password fields
      if (!currentPassword || !newPassword || !confirmPassword) {
        showErrorMessage('All password fields are required when changing password');
        return;
      }

      // Validate new password strength
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordPattern.test(newPassword)) {
        showErrorMessage('New password must be at least 8 characters long with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character');
        return;
      }

      if (newPassword !== confirmPassword) {
        showErrorMessage('New passwords do not match');
        return;
      }

      // Add password fields to profile data
      profileData.current_password = currentPassword;
      profileData.new_password = newPassword;
      profileData.confirm_password = confirmPassword;
    }

    // Save to API
    fetch('/api/student-profile', {
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
        // Update display with new data
        document.getElementById('displayName').textContent = profileData.full_name;
        document.getElementById('displayEmail').textContent = profileData.email;
        document.getElementById('displayUniversity').textContent = profileData.university || 'Not specified';
        document.getElementById('displayMajor').textContent = profileData.major || 'Not specified';
        document.getElementById('displayGradYear').textContent = profileData.graduation_year || 'Not specified';
        document.getElementById('displaySkills').textContent = profileData.skills || 'Not specified';
        
        // Update description display
        const description = (profileData.description && profileData.description.trim()) ? profileData.description.trim() : 'No description provided';
        const descPreview = document.getElementById('desc-preview');
        const descFull = document.getElementById('desc-full');
        const descBtn = document.getElementById('desc-btn');
        
        if (description.length > 150) {
          descPreview.textContent = description.substring(0, 150) + '...';
          descFull.textContent = description;
          descBtn.style.display = 'inline-block';
        } else {
          descPreview.textContent = description;
          descFull.textContent = description;
          descBtn.style.display = 'none';
        }

        // Clear password fields
        document.getElementById('editCurrentPassword').value = '';
        document.getElementById('editNewPassword').value = '';
        document.getElementById('editConfirmPassword').value = '';

        // Switch back to display mode
        toggleEditMode();
        
        const successMessage = profileData.current_password ? 
          'Profile and password updated successfully!' : 
          'Profile updated successfully!';
        alert(successMessage);
      } else {
        alert('Failed to update profile');
      }
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      let errorMessage = '';
      
      if (error.error === 'Email already exists') {
        errorMessage = 'This email is already registered. Please use a different email.';
      } else if (error.error) {
        errorMessage = 'Error: ' + error.error;
      } else {
        errorMessage = 'An error occurred while updating profile. Please try again.';
      }
      
      showErrorMessage(errorMessage);
    });
  });
});

// Toggle description display
function toggleDescription() {
  const preview = document.getElementById('desc-preview');
  const full = document.getElementById('desc-full');
  const btn = document.getElementById('desc-btn');
  
  if (full.style.display === 'none') {
    preview.style.display = 'none';
    full.style.display = 'block';
    btn.textContent = 'Show Less';
  } else {
    preview.style.display = 'block';
    full.style.display = 'none';
    btn.textContent = 'Show More';
  }
}