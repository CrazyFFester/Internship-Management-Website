/*
 * CSIT128 Internship Portal - Authentication Middleware
 * 
 * Middleware functions that check if users are logged in and have the right permissions.
 * These functions run before our route handlers to ensure security.
 * 
 * Key Concepts for Students:
 * - Middleware: Functions that run between receiving a request and sending a response
 * - Authentication: Checking if a user is logged in
 * - Authorization: Checking if a user has permission to access something
 * - Sessions: How we remember that a user is logged in across requests
 */

/*
 * CHECK IF USER IS LOGGED IN
 * This middleware checks if a user has a valid session (is logged in)
 */
function requireLogin(req, res, next) {
    // Check if user has a session with a userId
    if (!req.session.userId) {
        // User is not logged in - send error response
        return res.status(401).json({ 
            error: 'You must be logged in to access this page' 
        });
    }
    
    // User is logged in - continue to the next function
    next();
}

/*
 * CHECK IF USER HAS CORRECT ROLE
 * This middleware checks if a logged-in user has the correct role (student or company)
 * 
 * @param {string} requiredRole - Either 'student' or 'company'
 * @returns {function} Middleware function that checks the role
 */
function requireRole(requiredRole) {
    return function(req, res, next) {
        // First check if user is logged in
        if (!req.session.userId) {
            return res.status(401).json({ 
                error: 'You must be logged in to access this page' 
            });
        }
        
        // Check if user has the correct role
        if (req.session.userType !== requiredRole) {
            return res.status(403).json({ 
                error: `Access denied. This page is only for ${requiredRole}s.` 
            });
        }
        
        // User has correct role - continue to the next function
        next();
    };
}

/*
 * EXPORT FUNCTIONS
 * Make these functions available to other parts of our application
 */
module.exports = {
    requireLogin,    // Check if user is logged in
    requireRole      // Check if user has specific role
};