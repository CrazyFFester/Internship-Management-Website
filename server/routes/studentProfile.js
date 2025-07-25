/*
 * CSIT128 Internship Portal - Student Profile Routes
 * 
 * These routes handle student profile operations: getting and updating profile information.
 * Students can view and edit their personal information, education details, and skills.
 * 
 * Key Concepts for Students:
 * - GET Routes: Retrieve data from database and send to client
 * - PUT Routes: Update existing data in database
 * - JSON Responses: Send data back to client in JSON format
 * - Error Handling: Properly handle and report errors
 */

const express = require('express');
const router = express.Router();
const { requireLogin, requireRole } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const getDatabaseConnection = require('../database/connection');
const {
    isValidName,
    isValidEmail,
    isValidPassword,
    isValidUniversity,
    isValidMajor,
    isValidGraduationYear,
    isValidSkills,
    isValidDescription
} = require('../utils/validation');

/*
 * UTILITY FUNCTIONS
 */

// Helper function to handle database errors
function handleDatabaseError(res, error, customMessage = 'Database error occurred') {
    console.error('Database Error:', error.message);
    return res.status(500).json({ error: customMessage });
}

// Helper function to clean optional fields (convert empty strings to null)
function cleanOptionalField(value) {
    return (value && value.trim() !== '') ? value.trim() : null;
}

/*
 * GET STUDENT PROFILE
 * GET /api/student-profile - Retrieve student's profile information
 */
router.get('/student-profile', requireLogin, requireRole('student'), (req, res) => {
    const userId = req.session.userId;
    
    // Read SQL query to get student details
    const getStudentDetailsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/students/get-student-details.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getStudentDetailsSQL, [userId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to load student profile');
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const profile = results[0];

        // Send profile data back to client
        res.json({
            full_name: profile.full_name,
            email: profile.email,
            university: profile.university || null,
            major: profile.major || null,
            graduation_year: profile.graduation_year || null,
            skills: profile.skills || null,
            description: profile.description || null
        });
    });
});

/*
 * UPDATE STUDENT PROFILE
 * PUT /api/student-profile - Update student's profile information
 */
router.put('/student-profile', requireLogin, requireRole('student'), (req, res) => {
    const userId = req.session.userId;
    const {
        full_name,
        email,
        university,
        major,
        graduation_year,
        skills,
        description,
        current_password,
        new_password,
        confirm_password
    } = req.body;

    // Step 1: Validate required fields
    if (!full_name || !email) {
        return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Step 2: Validate field formats
    if (!isValidName(full_name)) {
        return res.status(400).json({
            error: 'Full name should contain only letters and spaces (2-50 characters)'
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            error: 'Please enter a valid email address'
        });
    }

    if (!isValidUniversity(university)) {
        return res.status(400).json({
            error: 'University name should contain only letters, spaces, dots, and hyphens (2-100 characters)'
        });
    }

    if (!isValidMajor(major)) {
        return res.status(400).json({
            error: 'Major should contain only letters, spaces, ampersands, and hyphens (2-100 characters)'
        });
    }

    if (!isValidGraduationYear(graduation_year)) {
        return res.status(400).json({
            error: 'Graduation year must be between 2020 and 2035'
        });
    }

    if (!isValidSkills(skills)) {
        return res.status(400).json({
            error: 'Skills should contain only letters, numbers, spaces, commas, dots, plus signs, hashes, and hyphens (2-500 characters)'
        });
    }

    if (!isValidDescription(description)) {
        return res.status(400).json({
            error: 'Description should not exceed 1000 characters'
        });
    }

    // Step 3: Handle password change if requested
    const isPasswordChange = current_password || new_password || confirm_password;
    if (isPasswordChange) {
        if (!current_password || !new_password || !confirm_password) {
            return res.status(400).json({
                error: 'All password fields are required when changing password'
            });
        }

        if (!isValidPassword(new_password, true)) {
            return res.status(400).json({
                error: 'New password must be at least 8 characters long with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
            });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({
                error: 'New passwords do not match'
            });
        }
    }

    // Step 4: Process the data and update database
    const profileData = {
        full_name,
        email,
        university: cleanOptionalField(university),
        major: cleanOptionalField(major),
        graduation_year: graduation_year && graduation_year !== '' ? parseInt(graduation_year) : null,
        skills: cleanOptionalField(skills),
        description: cleanOptionalField(description)
    };

    if (isPasswordChange) {
        verifyCurrentPasswordAndUpdate(req, res, profileData, current_password, new_password);
    } else {
        updateStudentProfile(req, res, profileData, false);
    }
});

/*
 * VERIFY CURRENT PASSWORD AND UPDATE
 * Helper function to check current password before updating
 */
function verifyCurrentPasswordAndUpdate(req, res, profileData, currentPassword, newPassword) {
    const userId = req.session.userId;

    const verifyPasswordSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/users/verify-password.sql'),
        'utf-8'
    );

    getDatabaseConnection().query(verifyPasswordSQL, [userId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to verify current password');
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (results[0].password !== currentPassword) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Current password is correct, proceed with update including new password
        profileData.new_password = newPassword;
        updateStudentProfile(req, res, profileData, true);
    });
}

/*
 * UPDATE STUDENT PROFILE IN DATABASE
 * Helper function to update user and student information
 */
function updateStudentProfile(req, res, profileData, includePassword) {
    const userId = req.session.userId;
    
    // Step 1: Update user table (name, email, optionally password)
    let updateUserSQL, userParams;
    
    if (includePassword) {
        const updateUserWithPasswordSQL = fs.readFileSync(
            path.join(__dirname, '../database/queries/users/update-user-with-password.sql'),
            'utf-8'
        );
        updateUserSQL = updateUserWithPasswordSQL;
        userParams = [profileData.full_name, profileData.email, profileData.new_password, userId];
    } else {
        const updateUserInfoSQL = fs.readFileSync(
            path.join(__dirname, '../database/queries/users/update-user-info.sql'), 
            'utf-8'
        );
        updateUserSQL = updateUserInfoSQL;
        userParams = [profileData.full_name, profileData.email, userId];
    }

    getDatabaseConnection().query(updateUserSQL, userParams, (error, result) => {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Email already exists' });
            }
            return handleDatabaseError(res, error, 'Failed to update user information');
        }

        // Step 2: Update student table (education and profile details)
        updateStudentDetails(req, res, profileData);
    });
}

/*
 * UPDATE STUDENT DETAILS
 * Helper function to update student-specific information
 */
function updateStudentDetails(req, res, profileData) {
    const userId = req.session.userId;

    // Check if student record exists
    const checkStudentExistsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/students/check-student-exists.sql'),
        'utf-8'
    );

    getDatabaseConnection().query(checkStudentExistsSQL, [userId], (error, existingStudent) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to check student profile');
        }

        let query, params;

        if (existingStudent.length > 0) {
            // Update existing student record
            const updateStudentProfileSQL = fs.readFileSync(
                path.join(__dirname, '../database/queries/students/update-student-profile.sql'),
                'utf-8'
            );
            query = updateStudentProfileSQL;
            params = [
                profileData.university,
                profileData.major,
                profileData.graduation_year,
                profileData.skills,
                profileData.description,
                userId
            ];
        } else {
            // Create new student record
            const insertStudentProfileSQL = fs.readFileSync(
                path.join(__dirname, '../database/queries/students/insert-student-profile.sql'),
                'utf-8'
            );
            query = insertStudentProfileSQL;
            params = [
                userId,
                profileData.university,
                profileData.major,
                profileData.graduation_year,
                profileData.skills,
                profileData.description
            ];
        }

        getDatabaseConnection().query(query, params, (error, result) => {
            if (error) {
                return handleDatabaseError(res, error, 'Failed to update student profile');
            }

            // Success! Send confirmation back to client
            res.json({ message: 'Profile updated successfully' });
        });
    });
}

// Export the router so it can be used in server.js
module.exports = router;