/*
 * CSIT128 Internship Portal - Authentication Routes
 * 
 * These routes handle user authentication: signup, login, logout, and user info.
 * Authentication is the process of verifying who a user is.
 * 
 * Key Concepts for Students:
 * - POST Routes: Receive data from forms (like login/signup forms)
 * - GET Routes: Send data back to the client
 * - Sessions: Remember that a user is logged in across multiple requests
 * - Input Validation: Always check user input before using it
 * - SQL Injection Prevention: Use parameterized queries to stay secure
 */

const express = require('express');
const router = express.Router();
const getDatabaseConnection = require('../database/connection');
const path = require('path');
const fs = require('fs');
const {
    isValidName,
    isValidEmail,
    isValidPassword,
    isValidUserType
} = require('../utils/validation');

/*
 * UTILITY FUNCTIONS
 * Helper functions used by multiple routes
 */

// Helper function to handle database errors
function handleDatabaseError(res, error, customMessage = 'Database error occurred') {
    console.error('Database Error:', error.message);
    return res.status(500).json({ error: customMessage });
}

// Helper function to redirect with error message
function redirectWithError(res, errorType) {
    return res.redirect(`/auth?error=${errorType}`);
}

/*
 * USER SIGNUP ROUTE
 * POST /api/signup - Creates a new user account
 */
router.post('/signup', (req, res) => {
    // Get data from the signup form
    const { fullName, email, password, retypePassword, userType } = req.body;

    // Step 1: Validate all required fields are present
    if (!fullName || !email || !password || !retypePassword || !userType) {
        return redirectWithError(res, 'missing_fields');
    }

    // Step 2: Validate each field format
    if (!isValidName(fullName)) {
        return redirectWithError(res, 'invalid_name');
    }

    if (!isValidEmail(email)) {
        return redirectWithError(res, 'invalid_email');
    }

    if (!isValidPassword(password, true)) { // true = require complex password
        return redirectWithError(res, 'invalid_password');
    }

    if (!isValidUserType(userType)) {
        return redirectWithError(res, 'invalid_user_type');
    }

    if (password !== retypePassword) {
        return redirectWithError(res, 'password_mismatch');
    }

    // Step 3: Create user in database
    createNewUser(req, res, { fullName, email, password, userType });
});

function createNewUser(req, res, userData) {
    const { fullName, email, password, userType } = userData;
    
    // Read SQL query from file
    const createUserSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/users/create-user.sql'), 
        'utf-8'
    );

    // Execute query with parameters (prevents SQL injection)
    getDatabaseConnection().query(createUserSQL, [fullName, email, password, userType], (error, result) => {
        if (error) {
            console.log('❌ User creation error:', error.message);
            // Handle duplicate email error
            if (error.code === 'ER_DUP_ENTRY') {
                return redirectWithError(res, 'email_exists');
            }
            return handleDatabaseError(res, error, 'Failed to create user account');
        }

        const userId = result.insertId;
        console.log('✅ User created with ID:', userId);

        // Step 4: Create session for the new user
        req.session.userId = userId;
        req.session.userType = userType;

        // Step 5: Create profile record based on user type
        if (userType === 'student') {
            createStudentProfile(res, userId);
        } else if (userType === 'company') {
            createCompanyProfile(res, userId, fullName);
        }
    });
}

function createStudentProfile(res, userId) {
    const createStudentSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/students/create-student.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(createStudentSQL, [userId], (error, result) => {
        if (error) {
            console.log('❌ Student profile creation error:', error.message);
            return handleDatabaseError(res, error, 'Failed to create student profile');
        }
        console.log('✅ Student profile created for user ID:', userId);
        // Redirect to student profile page
        res.redirect('/student-profile');
    });
}

function createCompanyProfile(res, userId, companyName) {
    const createCompanySQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/companies/create-company.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(createCompanySQL, [userId, companyName], (error, result) => {
        if (error) {
            console.log('❌ Company profile creation error:', error.message);
            return handleDatabaseError(res, error, 'Failed to create company profile');
        }
        console.log('✅ Company profile created for user ID:', userId);
        // Redirect to company profile page
        res.redirect('/company-profile');
    });
}

/*
 * USER LOGIN ROUTE
 * POST /api/login - Logs in an existing user
 */
router.post('/login', (req, res) => {
    // Get data from the login form
    const { email, password, userType } = req.body;

    // Step 1: Validate required fields
    if (!email || !password || !userType) {
        return redirectWithError(res, 'missing_fields');
    }

    // Step 2: Validate field formats
    if (!isValidEmail(email)) {
        return redirectWithError(res, 'invalid_email');
    }

    if (!isValidPassword(password, false)) { // false = don't require complex password for login
        return redirectWithError(res, 'invalid_password');
    }

    if (!isValidUserType(userType)) {
        return redirectWithError(res, 'invalid_user_type');
    }

    // Step 3: Check credentials in database
    checkUserCredentials(req, res, { email, password, userType });
});

function checkUserCredentials(req, res, loginData) {
    const { email, password, userType } = loginData;
    
    // Read SQL query to get user credentials
    const getCredentialsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/users/get-credentials.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getCredentialsSQL, [email], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to check login credentials');
        }

        // Check if email exists
        if (results.length === 0) {
            return redirectWithError(res, 'email_not_found');
        }

        const user = results[0];

        // Check if password matches
        if (user.password !== password) {
            return redirectWithError(res, 'password_not_found');
        }

        // Check if user type matches
        if (user.user_type !== userType) {
            const errorType = userType === 'student' ? 'not_student_account' : 'not_company_account';
            return redirectWithError(res, errorType);
        }

        // Step 4: Create session and redirect to appropriate dashboard
        req.session.userId = user.id;
        req.session.userType = user.user_type;

        const redirectPage = user.user_type === 'company' ? '/company-dashboard' : '/student-dashboard';
        res.redirect(redirectPage);
    });
}

/*
 * GET USER INFORMATION ROUTE
 * GET /api/userName - Returns current user's name and type
 */
router.get('/userName', (req, res) => {
    // Check if user is logged in
    if (!req.session.userId) {
        return res.status(401).json({ error: 'You must be logged in to access this information' });
    }

    // Get user information from database
    const getUserNameSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/users/get-user-name.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getUserNameSQL, [req.session.userId], (error, results) => {
        if (error || results.length === 0) {
            return res.status(500).json({ error: 'User information not found' });
        }

        // Send user information back to client
        res.json({
            full_name: results[0].full_name,
            user_type: req.session.userType
        });
    });
});

/*
 * USER LOGOUT ROUTE
 * GET /api/logout - Logs out the current user
 */
router.get('/logout', (req, res) => {
    // Destroy the user session
    req.session.destroy((error) => {
        if (error) {
            console.error('Error destroying session:', error);
        }
        
        // Clear the session cookie
        res.clearCookie('connect.sid');
        
        // Redirect to logout confirmation page
        res.redirect('/logout');
    });
});

// Export the router so it can be used in server.js
module.exports = router;