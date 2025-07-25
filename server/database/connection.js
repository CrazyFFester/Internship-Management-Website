/*
 * CSIT128 Internship Portal - Database Connection
 * 
 * This file handles connecting to our MySQL database.
 * It automatically sets up the database and tables when the server starts.
 * 
 * Key Concepts for Students:
 * - MySQL: A popular database system for storing data
 * - Connection Pool: Manages multiple database connections efficiently
 * - SQL Files: We store our database setup commands in separate .sql files
 */

const mysql = require('mysql2');  // MySQL database driver for Node.js
const fs = require('fs');         // File system module to read SQL files
const path = require('path');     // Path module for file paths

// Store our connection pool globally so all parts of the app can use it
let connectionPool = null;

/*
 * DATABASE CONFIGURATION
 * These are the settings for connecting to our MySQL database
 * In a real production app, these would come from environment variables
 */
const DB_CONFIG = {
    host: 'localhost',        // Database server location
    user: 'root',            // Database username
    password: 'admin',       // Database password
    database: 'internship_db' // Name of our database
};

/*
 * INITIALIZE DATABASE
 * This function sets up the database and tables when the server starts
 */
function setupDatabase() {
    console.log('🔧 Setting up database...');
    
    // Step 1: Create database if it doesn't exist
    createDatabaseIfNeeded();
}

function createDatabaseIfNeeded() {
    // Connect to MySQL without specifying a database (to create the database)
    const connection = mysql.createConnection({
        host: DB_CONFIG.host,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password
    });

    // Read the SQL command to create the database
    const createDatabaseSQL = fs.readFileSync(
        path.join(__dirname, 'queries/setup/create-database.sql'), 
        'utf-8'
    );

    // Execute the SQL command
    connection.query(createDatabaseSQL, (error) => {
        if (error) {
            console.error('❌ Failed to create database:', error.message);
            process.exit(1); // Stop the server if database setup fails
        }
        
        console.log('✅ Database ready');
        connection.end(); // Close this connection
        
        // Step 2: Now create the tables
        createTablesIfNeeded();
    });
}

function createTablesIfNeeded() {
    // Connect to our specific database
    const connection = mysql.createConnection({
        ...DB_CONFIG,
        multipleStatements: true // Allow multiple SQL statements in one query
    });

    // Read the SQL commands to create tables
    const createTablesSQL = fs.readFileSync(
        path.join(__dirname, 'queries/setup/create-tables.sql'), 
        'utf-8'
    );

    // Execute the SQL commands
    connection.query(createTablesSQL, (error) => {
        if (error) {
            console.error('❌ Failed to create tables:', error.message);
            process.exit(1);
        }
        
        console.log('✅ Database tables ready');
        connection.end();
        
        // Step 3: Create the connection pool for the application
        createConnectionPool();
    });
}


function createConnectionPool() {
    /*
     * CONNECTION POOL
     * Instead of creating a new connection for each database query,
     * we create a pool of connections that can be reused.
     * This is more efficient and handles multiple users better.
     */
    connectionPool = mysql.createPool({
        ...DB_CONFIG,
        waitForConnections: true,  // Wait if all connections are busy
        connectionLimit: 10,       // Maximum number of connections
        queueLimit: 0             // No limit on queued requests
    });

    // Test that our connection pool works
    connectionPool.getConnection((error, connection) => {
        if (error) {
            console.error('❌ Database connection failed:', error.message);
            process.exit(1);
        }
        
        console.log('✅ Connected to MySQL database');
        console.log('🎯 Database setup complete!');
        connection.release(); // Return connection to the pool
    });
}

// Start the database setup when this file is imported
setupDatabase();

/*
 * EXPORT THE CONNECTION FUNCTION
 * Other parts of our application will use this function to get database connections
 */
module.exports = function getDatabaseConnection() {
    if (!connectionPool) {
        // If the pool isn't ready yet, create a temporary one
        console.log('⚠️  Creating temporary database connection...');
        return mysql.createPool(DB_CONFIG);
    }
    return connectionPool;
};