/*
 * CSIT128 Internship Portal - Page Routes
 * 
 * These routes serve HTML pages to users when they visit different URLs.
 * Each route sends a specific HTML file from our client folder.
 * 
 * Key Concepts for Students:
 * - Static Routes: URLs that serve files (like HTML pages)
 * - Path Module: Node.js module for working with file paths
 * - Middleware: Functions that run before our route handlers (like authentication)
 */

const express = require('express');
const path = require('path');
const { requireLogin, requireRole } = require('../middleware/auth');

const router = express.Router();

/*
 * PUBLIC PAGES
 * These pages can be accessed by anyone (no login required)
 */

// Home page - the first page users see
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/shared/index.html'));
});

// Authentication page - where users login or signup
router.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/auth/login.html'));
});

// Logout page - confirmation page after logging out
router.get('/logout', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/shared/logout.html'));
});

/*
 * STUDENT PAGES
 * These pages require user to be logged in as a student
 */

// Student dashboard - main page for students after login
router.get('/student-dashboard', requireRole('student'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/student/student_dashboard.html'));
});

// Student profile page - where students edit their information
router.get('/student-profile', requireRole('student'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/student/student_profile.html'));
});

// Search internships page - where students look for internships
router.get('/search-internship', requireRole('student'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/student/search_internship.html'));
});

// Track applications page - where students see their application status
router.get('/track-applications', requireRole('student'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/student/track_applications.html'));
});

/*
 * COMPANY PAGES
 * These pages require user to be logged in as a company
 */

// Company dashboard - main page for companies after login
router.get('/company-dashboard', requireRole('company'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/company/company_dashboard.html'));
});

// Company profile page - where companies edit their information
router.get('/company-profile', requireRole('company'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/company/company_profile.html'));
});

// Manage internships page - where companies create and edit internship posts
router.get('/manage-internships', requireRole('company'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/company/manage_internships.html'));
});

// View and manage applications page - where companies review student applications
router.get('/view-manage', requireRole('company'), (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/pages/company/view_and_manage_applications.html'));
});

// Export the router so it can be used in server.js
module.exports = router;