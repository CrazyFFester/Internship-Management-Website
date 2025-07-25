/*
 * CSIT128 Internship Portal - Company Profile Routes
 * 
 * These routes handle company profile operations: getting and updating profile information.
 * Companies can view and edit their business information, contact details, and description.
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
    isValidCompanyName,
    isValidPhone,
    isValidWebsite,
    isValidLocation,
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
 * GET COMPANY PROFILE
 * GET /api/company-profile - Retrieve company's profile information
 */
router.get('/company-profile', requireLogin, requireRole('company'), (req, res) => {
    const userId = req.session.userId;
    
    // Read SQL query to get company details
    const getCompanyDetailsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/companies/get-company-details.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getCompanyDetailsSQL, [userId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to load company profile');
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Company profile not found' });
        }

        const profile = results[0];

        // Send profile data back to client
        res.json({
            full_name: profile.full_name,
            email: profile.email,
            company_name: profile.company_name || null,
            phone: profile.phone || null,
            website: profile.website || null,
            location: profile.location || null,
            description: profile.description || null
        });
    });
});

/*
 * UPDATE COMPANY PROFILE
 * PUT /api/company-profile - Update company's profile information
 */
router.put('/company-profile', requireLogin, requireRole('company'), (req, res) => {
    const userId = req.session.userId;
    const {
        full_name,
        email,
        company_name,
        phone,
        website,
        location,
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

    if (!isValidCompanyName(company_name)) {
        return res.status(400).json({
            error: 'Company name should contain only letters, numbers, spaces, ampersands, dots, and hyphens (2-100 characters)'
        });
    }

    if (!isValidPhone(phone)) {
        return res.status(400).json({
            error: 'Phone number should contain only numbers, spaces, hyphens, parentheses, and plus sign (7-20 characters)'
        });
    }

    if (!isValidWebsite(website)) {
        return res.status(400).json({
            error: 'Please enter a valid website URL starting with http:// or https://'
        });
    }

    if (!isValidLocation(location)) {
        return res.status(400).json({
            error: 'Location should contain only letters, spaces, commas, dots, and hyphens (2-100 characters)'
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
        company_name: cleanOptionalField(company_name),
        phone: cleanOptionalField(phone),
        website: cleanOptionalField(website),
        location: cleanOptionalField(location),
        description: cleanOptionalField(description)
    };

    if (isPasswordChange) {
        verifyCurrentPasswordAndUpdate(req, res, profileData, current_password, new_password);
    } else {
        updateCompanyProfile(req, res, profileData, false);
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
        updateCompanyProfile(req, res, profileData, true);
    });
}

/*
 * UPDATE COMPANY PROFILE IN DATABASE
 * Helper function to update user and company information
 */
function updateCompanyProfile(req, res, profileData, includePassword) {
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

        // Step 2: Update company table (business details)
        updateCompanyDetails(req, res, profileData);
    });
}

/*
 * UPDATE COMPANY DETAILS
 * Helper function to update company-specific information
 */
function updateCompanyDetails(req, res, profileData) {
    const userId = req.session.userId;

    // Check if company record exists
    const checkCompanyExistsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/companies/check-company-exists.sql'),
        'utf-8'
    );

    getDatabaseConnection().query(checkCompanyExistsSQL, [userId], (error, existingCompany) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to check company profile');
        }

        let query, params;

        if (existingCompany.length > 0) {
            // Update existing company record
            const updateCompanyProfileSQL = fs.readFileSync(
                path.join(__dirname, '../database/queries/companies/update-company-profile.sql'),
                'utf-8'
            );
            query = updateCompanyProfileSQL;
            params = [
                profileData.company_name,
                profileData.phone,
                profileData.website,
                profileData.location,
                profileData.description,
                userId
            ];
        } else {
            // Create new company record
            const insertCompanyProfileSQL = fs.readFileSync(
                path.join(__dirname, '../database/queries/companies/insert-company-profile.sql'),
                'utf-8'
            );
            query = insertCompanyProfileSQL;
            params = [
                userId,
                profileData.company_name,
                profileData.phone,
                profileData.website,
                profileData.location,
                profileData.description
            ];
        }

        getDatabaseConnection().query(query, params, (error, result) => {
            if (error) {
                return handleDatabaseError(res, error, 'Failed to update company profile');
            }

            // Success! Send confirmation back to client
            res.json({ message: 'Profile updated successfully' });
        });
    });
}

// Export the router so it can be used in server.js
module.exports = router;