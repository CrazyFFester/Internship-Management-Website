// Form Switcher - Authentication Page
// This file handles switching between login and signup forms

// Switch between login and signup forms
function switchForm(form) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (form === 'login') {
        showLoginForm(loginForm, signupForm, loginBtn, signupBtn);
    } else {
        showSignupForm(loginForm, signupForm, loginBtn, signupBtn);
    }
}

// Show the login form and hide signup form
function showLoginForm(loginForm, signupForm, loginBtn, signupBtn) {
    // Show login form, hide signup form
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    
    // Update button styling
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
}

// Show the signup form and hide login form
function showSignupForm(loginForm, signupForm, loginBtn, signupBtn) {
    // Show signup form, hide login form
    signupForm.style.display = 'flex';
    loginForm.style.display = 'none';
    
    // Update button styling
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
}