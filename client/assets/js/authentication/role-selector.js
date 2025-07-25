// Role Switch Buttons - Authentication Page
// This file handles switching between student and company login/registration

// Wait for the page to load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to the important elements
    const studentBtn = document.getElementById('studentRole');
    const companyBtn = document.getElementById('companyRole');
    const userTypeField = document.getElementById('userTypeField');
    const loginUserTypeField = document.getElementById('loginUserTypeField');
    
    // Initialize with student role selected by default
    activateStudentRole();
    
    // Function to switch between student and company roles
    function switchRole(selectedRole) {
        if (selectedRole === 'student') {
            activateStudentRole();
        } else if (selectedRole === 'company') {
            activateCompanyRole();
        }
    }
    
    // Activate student role appearance and form settings
    function activateStudentRole() {
        // Update button appearance
        studentBtn.classList.add('active');
        companyBtn.classList.remove('active');
        
        // Update page title
        document.title = 'Student Authentication';
        
        // Update form labels and placeholders for student
        updateFormLabels('student');
        
        // Set hidden form fields to 'student'
        setUserTypeFields('student');
    }
    
    // Activate company role appearance and form settings
    function activateCompanyRole() {
        // Update button appearance
        companyBtn.classList.add('active');
        studentBtn.classList.remove('active');
        
        // Update page title
        document.title = 'Company Authentication';
        
        // Update form labels and placeholders for company
        updateFormLabels('company');
        
        // Set hidden form fields to 'company'
        setUserTypeFields('company');
    }
    
    // Update form labels and placeholders based on user type
    function updateFormLabels(userType) {
        const nameLabel = document.getElementById('signup-name-label');
        const nameInput = document.getElementById('signup-name');
        
        if (nameLabel && nameInput) {
            if (userType === 'company') {
                nameLabel.textContent = 'Company Name';
                nameInput.placeholder = 'Your company name';
                nameInput.title = 'Company name should contain only letters and spaces (2-50 characters)';
            } else {
                nameLabel.textContent = 'Full Name';
                nameInput.placeholder = 'Your full name';
                nameInput.title = 'Full name should contain only letters and spaces (2-50 characters)';
            }
        }
    }
    
    // Set the user type in both forms (login and registration)
    function setUserTypeFields(userType) {
        if (userTypeField) {
            userTypeField.value = userType;
        }
        if (loginUserTypeField) {
            loginUserTypeField.value = userType;
        }
    }
    
    // Add click event listeners to the buttons
    studentBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchRole('student');
        addClickEffect(e.currentTarget);
    });
    
    companyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchRole('company');
        addClickEffect(e.currentTarget);
    });
    
    // Add visual click effect
    function addClickEffect(button) {
        button.style.transform = 'translateY(0) scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
});