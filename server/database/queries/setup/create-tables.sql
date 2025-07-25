-- Users table (students and companies)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'company') NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    company_name VARCHAR(255) NOT NULL,
    description TEXT,
    website VARCHAR(255),
    location VARCHAR(255),
    phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_company_user_id UNIQUE (user_id)
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    university VARCHAR(255),
    major VARCHAR(255),
    graduation_year INT,
    skills TEXT,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_student_user_id UNIQUE (user_id)
);

-- Internships table
CREATE TABLE IF NOT EXISTS internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    salary DECIMAL(10,2),
    internship_type VARCHAR(100),
    required_skills TEXT,
    duration_months INT,
    application_deadline DATE,
    status ENUM('active', 'closed', 'draft') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    internship_id INT,
    status ENUM('pending', 'accepted', 'rejected', 'shortlisted') DEFAULT 'pending',
    cover_letter TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (student_id, internship_id)
);