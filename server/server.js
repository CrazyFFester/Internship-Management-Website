/*
 * CSIT128 Internship Portal - Main Server File
 * 
 * This is the main entry point for our Express.js server.
 * It sets up the web server, middleware, routes, and starts listening for requests.
 * 
 * Key Concepts for Students:
 * - Express.js: A web framework for Node.js that makes building web servers easier
 * - Middleware: Functions that run between receiving a request and sending a response
 * - Routes: Define what happens when users visit different URLs
 * - Sessions: Keep track of logged-in users across multiple requests
 */

// Import required modules
const express = require('express');        // Web framework for building the server
const path = require('path');             // Node.js module for working with file paths
const session = require('express-session'); // For handling user sessions (login state)

// Create Express application
const app = express();
const PORT = 8080; // Port number where our server will listen for requests

// Import database connection (we'll use this in routes)
const getPool = require('./database/connection.js');

/*
 * MIDDLEWARE SETUP
 * Middleware functions execute in order and prepare requests before they reach our routes
 */

// 1. Session middleware - tracks logged-in users
app.use(session({
    secret: 'your-secret-key',        // Used to encrypt session data (should be changed in production)
    resave: false,                    // Don't save session if unchanged
    saveUninitialized: false,         // Don't create session until something is stored
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // Session expires after 24 hours (in milliseconds)
        httpOnly: true                // Cookie only accessible via HTTP (not JavaScript) for security
    }
}));

// 2. Static file middleware - serves HTML, CSS, JS files from client folder
app.use(express.static(path.join(__dirname, '../client')));

// 3. Body parsing middleware - allows us to read data from forms and AJAX requests
app.use(express.json());                          // Parse JSON data
app.use(express.urlencoded({ extended: true }));  // Parse form data

/*
 * ROUTE SETUP
 * Routes define what happens when users visit different URLs
 * We organize routes into separate files to keep code organized
 */

// Import route handlers from separate files
const pageRoutes = require('./routes/pageRoutes');           // Handles page requests (HTML)
const authRoutes = require('./routes/authentication');       // Handles login/signup
const studentProfileRoutes = require('./routes/studentProfile'); // Student profile management
const companyProfileRoutes = require('./routes/companyProfile'); // Company profile management
const internshipRoutes = require('./routes/internships');        // Internship CRUD operations
const applicationRoutes = require('./routes/applications');      // Application management

// Register routes with the Express app
app.use('/', pageRoutes);                    // Main pages (home, login, etc.)
app.use('/api', authRoutes);                 // Authentication endpoints (/api/login, /api/signup)
app.use('/api', studentProfileRoutes);       // Student profile endpoints
app.use('/api', companyProfileRoutes);       // Company profile endpoints
app.use('/api/internships', internshipRoutes); // Internship endpoints
app.use('/api/applications', applicationRoutes); // Application endpoints

/*
 * START THE SERVER
 * Tell Express to start listening for requests on the specified port
 */
app.listen(PORT, () => {
    console.log(`🚀 Internship Portal Server is running!`);
    console.log(`📱 Visit: http://localhost:${PORT}`);
    console.log(`🛑 Press Ctrl+C to stop the server`);
});