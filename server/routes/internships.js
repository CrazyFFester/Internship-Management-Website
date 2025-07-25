/*
 * CSIT128 Internship Portal - Internships Routes
 * 
 * These routes handle internship operations: creating, reading, updating, and deleting internships.
 * Companies can manage their internship postings, and students can search for available internships.
 * 
 * Key Concepts for Students:
 * - CRUD Operations: Create, Read, Update, Delete
 * - GET Routes: Retrieve data from database
 * - POST Routes: Create new data in database
 * - PUT Routes: Update existing data in database
 * - DELETE Routes: Remove data from database
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

// Helper function to validate internship fields
function validateInternshipData(data) {
    const { title, description, location, salary, type, skills, duration, deadline } = data;
    
    if (!title || !description || !location || !salary || !type || !skills || !duration || !deadline) {
        return 'All fields are required for internship posting';
    }
    
    return null; // No validation errors
}

/*
 * SEARCH INTERNSHIPS (FOR STUDENTS)
 * GET /api/internships/search - Get all active internships for students to browse
 */
router.get('/search', requireLogin, (req, res) => {
    // SQL query to get all active internships with company information
    const searchInternshipsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/internships/get-all-active-internships.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(searchInternshipsSQL, (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to fetch internships');
        }
        
        // Send list of internships back to client
        res.json(results);
    });
});

/*
 * GET COMPANY INTERNSHIPS
 * GET /api/internships - Get all internships created by the logged-in company
 */
router.get('/', requireRole('company'), (req, res) => {
    // Read SQL query from file
    const getCompanyInternshipsSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/internships/get-company-internships.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(getCompanyInternshipsSQL, [req.session.userId], (error, results) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to fetch your internships');
        }
        
        // Send company's internships back to client
        res.json(results);
    });
});

/*
 * CREATE NEW INTERNSHIP
 * POST /api/internships - Create a new internship posting
 */
router.post('/', requireRole('company'), (req, res) => {
    const { title, description, location, salary, type, skills, duration, deadline } = req.body;

    // Step 1: Validate input data
    const validationError = validateInternshipData(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Step 2: Get company ID from user session
    const getCompanyIdSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/companies/get-company-id.sql'), 
        'utf-8'
    );
    
    getDatabaseConnection().query(getCompanyIdSQL, [req.session.userId], (error, companyResults) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to find your company information');
        }

        if (companyResults.length === 0) {
            return res.status(404).json({ error: 'Company profile not found' });
        }

        // Step 3: Create the internship
        const companyId = companyResults[0].id;
        createInternshipRecord(res, companyId, { title, description, location, salary, type, skills, duration, deadline });
    });
});

function createInternshipRecord(res, companyId, internshipData) {
    const { title, description, location, salary, type, skills, duration, deadline } = internshipData;
    
    // Read SQL query from file
    const createInternshipSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/internships/create-internship.sql'), 
        'utf-8'
    );

    const queryParams = [companyId, title, description, location, salary, type, skills, duration, deadline];

    getDatabaseConnection().query(createInternshipSQL, queryParams, (error, result) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to create internship posting');
        }

        // Success! Send confirmation with new internship ID
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Internship created successfully' 
        });
    });
}

/*
 * UPDATE INTERNSHIP
 * PUT /api/internships/:id - Update an existing internship posting
 */
router.put('/:id', requireRole('company'), (req, res) => {
    const internshipId = req.params.id;
    const { title, description, location, salary, type, skills, duration, deadline } = req.body;

    // Step 1: Validate input data
    const validationError = validateInternshipData(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Step 2: Update the internship (only if it belongs to this company)
    const updateInternshipSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/internships/update-internship.sql'), 
        'utf-8'
    );

    const queryParams = [title, description, location, salary, type, skills, duration, deadline, internshipId, req.session.userId];

    getDatabaseConnection().query(updateInternshipSQL, queryParams, (error, result) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to update internship');
        }

        // Check if any rows were updated (means internship exists and belongs to this user)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Internship not found or you do not have permission to edit it' });
        }

        // Success!
        res.json({ message: 'Internship updated successfully' });
    });
});

/*
 * DELETE INTERNSHIP
 * DELETE /api/internships/:id - Delete an internship posting
 */
router.delete('/:id', requireRole('company'), (req, res) => {
    const internshipId = req.params.id;

    // Read SQL query from file
    const deleteInternshipSQL = fs.readFileSync(
        path.join(__dirname, '../database/queries/internships/delete-internship.sql'), 
        'utf-8'
    );

    getDatabaseConnection().query(deleteInternshipSQL, [internshipId, req.session.userId], (error, result) => {
        if (error) {
            return handleDatabaseError(res, error, 'Failed to delete internship');
        }

        // Check if any rows were deleted (means internship exists and belongs to this user)
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Internship not found or you do not have permission to delete it' });
        }

        // Success!
        res.json({ message: 'Internship deleted successfully' });
    });
});

// Export the router so it can be used in server.js
module.exports = router;