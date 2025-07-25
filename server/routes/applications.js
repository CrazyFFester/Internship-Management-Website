/*
 * CSIT128 Internship Portal - Applications Routes
 * 
 * These routes handle application operations: students applying for internships,
 * viewing application status, and companies managing received applications.
 * 
 * Key Concepts for Students:
 * - POST Routes: Create new applications
 * - GET Routes: Retrieve application data
 * - PUT Routes: Update application status
 * - Relational Data: Working with multiple connected database tables
 */

const express = require('express');
const router = express.Router();
const getDatabaseConnection = require('../database/connection');
const path = require('path');
const fs = require('fs');
const { requireLogin, requireRole } = require('../middleware/auth');

/*
 * UTILITY FUNCTIONS
 */

// Helper function to handle database errors
function handleDatabaseError(res, error, customMessage = 'Database error occurred') {
    console.error('Database Error:', error.message);
    return res.status(500).json({ error: customMessage });
}

/*
 * SUBMIT APPLICATION (FOR STUDENTS)
 * POST /api/applications - Student applies for an internship
 */
router.post('/', requireLogin, requireRole('student'), (req, res) => {
    const { internship_id, cover_letter } = req.body;
    const userId = req.session.userId;

    // Step 1: Validate required data
    if (!internship_id) {
        return res.status(400).json({ error: 'Internship ID is required' });
    }

    // Step 2: Get student ID from user session
    const getStudentIdSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/students/get-student-id.sql'), 
        'utf-8'
    );
    
    getDatabaseConnection().query(getStudentIdSQL, [userId], (error, studentResults) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to find student profile');
        }

        if (studentResults.length === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const studentId = studentResults[0].id;

        // Step 3: Check if student has already applied to this internship
        checkExistingApplication(res, studentId, internship_id, cover_letter);
    });
});

function checkExistingApplication(res, studentId, internshipId, coverLetter) {
    const checkExistingSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/applications/check-existing-application.sql'), 
        'utf-8'
    );
    
    getDatabaseConnection().query(
        checkExistingSQL, 
        [studentId, internshipId], 
        (error, existingApplications) => {
            if (error) {
                return handleDatabaseError(res, error, 'Failed to check existing applications');
            }

            // If application already exists, don't allow duplicate
            if (existingApplications.length > 0) {
                return res.status(400).json({ error: 'You have already applied to this internship' });
            }

            // Step 4: Create new application
            createNewApplication(res, studentId, internshipId, coverLetter);
        }
    );
}

function createNewApplication(res, studentId, internshipId, coverLetter) {
    // SQL query to create new application
    const createApplicationSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/applications/create-application.sql'), 
        'utf-8'
    );

    const queryParams = [studentId, internshipId, coverLetter || ''];

    getDatabaseConnection().query(createApplicationSQL, queryParams, (error, result) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to submit application');
        }

        // Success! Send confirmation back to student
        res.status(201).json({ 
            message: 'Application submitted successfully',
            application_id: result.insertId
        });
    });
}

/*
 * GET STUDENT'S APPLICATIONS
 * GET /api/applications/student - Student views their application history
 */
router.get('/student', requireLogin, requireRole('student'), (req, res) => {
    const userId = req.session.userId;

    // Step 1: Get student ID from user session
    const getStudentIdSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/students/get-student-id.sql'), 
        'utf-8'
    );
    
    getDatabaseConnection().query(getStudentIdSQL, [userId], (error, studentResults) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to find student profile');
        }

        if (studentResults.length === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }

        const studentId = studentResults[0].id;

        // Step 2: Get all applications for this student with related information
        getStudentApplications(res, studentId);
    });
});

function getStudentApplications(res, studentId) {
    // SQL query to get applications with internship and company details
    const getApplicationsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/applications/get-student-applications.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getApplicationsSQL, [studentId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to fetch your applications');
        }

        // Send applications back to student
        res.json(results);
    });
}

/*
 * GET COMPANY'S RECEIVED APPLICATIONS
 * GET /api/applications/company - Company views applications for their internships
 */
router.get('/company', requireLogin, requireRole('company'), (req, res) => {
    const userId = req.session.userId;

    // Step 1: Get company ID from user session
    const getCompanyIdSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/companies/get-company-id.sql'), 
        'utf-8'
    );
    
    getDatabaseConnection().query(getCompanyIdSQL, [userId], (error, companyResults) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to find company profile');
        }

        if (companyResults.length === 0) {
            return res.status(404).json({ error: 'Company profile not found' });
        }

        const companyId = companyResults[0].id;

        // Step 2: Get all applications for this company's internships
        getCompanyApplications(res, companyId);
    });
});

function getCompanyApplications(res, companyId) {
    // SQL query to get applications with student and internship details
    const getApplicationsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/applications/get-company-applications.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getApplicationsSQL, [companyId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to fetch applications for your internships');
        }

        // Send applications back to company
        res.json(results);
    });
}

/*
 * UPDATE APPLICATION STATUS (FOR COMPANIES)
 * PUT /api/applications/:id/status - Company updates the status of an application
 */
router.put('/:id/status', requireLogin, requireRole('company'), (req, res) => {
    const applicationId = req.params.id;
    const { status } = req.body;
    const userId = req.session.userId;

    // Step 1: Validate the status value
    const validStatuses = ['pending', 'accepted', 'rejected', 'shortlisted'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
        });
    }

    // Step 2: Update the application status (only if company owns the internship)
    updateApplicationStatus(res, applicationId, status, userId);
});

function updateApplicationStatus(res, applicationId, status, userId) {
    // SQL query that updates status only if the company owns the internship
    const updateStatusSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/applications/update-application-status.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(updateStatusSQL, [status, applicationId, userId], (error, result) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to update application status');
        }

        // Check if any rows were updated (means application exists and company owns it)
        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                error: 'Application not found or you do not have permission to update it' 
            });
        }

        // Success!
        res.json({ message: 'Application status updated successfully' });
    });
}

// Export the router so it can be used in server.js
module.exports = router;