/*
 * CSIT128 Internship Portal - Validation Utilities
 * 
 * This file contains helper functions to validate user input.
 * Instead of copying the same validation code in multiple files,
 * we put it here and import it where needed.
 * 
 * Key Concepts for Students:
 * - Input Validation: Always check user input before using it
 * - Regular Expressions: Patterns used to match text
 * - DRY Principle: Don't Repeat Yourself - reuse code instead of copying
 */

/*
 * VALIDATE NAME
 * Checks if a name is valid (contains only letters and spaces, reasonable length)
 */
function isValidName(name) {
    // Check if name exists and is a string
    if (!name || typeof name !== 'string') {
        return false;
    }
    
    // Remove extra spaces and check length
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 50) {
        return false;
    }
    
    // Check if name contains only letters and spaces
    const namePattern = /^[a-zA-Z\s]+$/;
    return namePattern.test(trimmedName);
}

/*
 * VALIDATE EMAIL
 * Checks if an email address has a valid format
 */
function isValidEmail(email) {
    // Check if email exists and is a string
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    // Email pattern: something@something.domain
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    return emailPattern.test(email.trim());
}

/*
 * VALIDATE PASSWORD
 * Checks if a password meets our requirements
 * 
 * @param {string} password - The password to validate
 * @param {boolean} requireComplex - Whether to require complex password rules
 */
function isValidPassword(password, requireComplex = false) {
    // Check if password exists and is a string
    if (!password || typeof password !== 'string') {
        return false;
    }
    
    // If complex password is required (for new passwords)
    if (requireComplex) {
        // Must be at least 8 characters with uppercase, lowercase, number, and special character
        if (password.length < 8) {
            return false;
        }
        const complexPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return complexPattern.test(password);
    }
    
    // For simple validation (like login), just check minimum length
    return password.length >= 6;
}

/*
 * VALIDATE USER TYPE
 * Checks if user type is either 'student' or 'company'
 */
function isValidUserType(userType) {
    return userType === 'student' || userType === 'company';
}

/*
 * VALIDATE UNIVERSITY NAME
 * Checks if university name is valid (optional field)
 */
function isValidUniversity(university) {
    // University is optional - empty values are okay
    if (!university) {
        return true;
    }
    
    if (typeof university !== 'string') {
        return false;
    }
    
    const trimmed = university.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
        return false;
    }
    
    // University names can have letters, spaces, dots, and hyphens
    const universityPattern = /^[a-zA-Z\s.-]+$/;
    return universityPattern.test(trimmed);
}

/*
 * VALIDATE MAJOR/FIELD OF STUDY
 * Checks if major is valid (optional field)
 */
function isValidMajor(major) {
    // Major is optional
    if (!major) {
        return true;
    }
    
    if (typeof major !== 'string') {
        return false;
    }
    
    const trimmed = major.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
        return false;
    }
    
    // Majors can have letters, spaces, ampersands, and hyphens
    const majorPattern = /^[a-zA-Z\s&-]+$/;
    return majorPattern.test(trimmed);
}

/*
 * VALIDATE GRADUATION YEAR
 * Checks if graduation year is reasonable (optional field)
 */
function isValidGraduationYear(year) {
    // Graduation year is optional
    if (!year && year !== 0) {
        return true;
    }
    
    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
        return false;
    }
    
    // Should be between 2020 and 2035 (reasonable range)
    return yearNum >= 2020 && yearNum <= 2035;
}

/*
 * VALIDATE SKILLS
 * Checks if skills string is valid (optional field)
 */
function isValidSkills(skills) {
    // Skills is optional
    if (!skills) {
        return true;
    }
    
    if (typeof skills !== 'string') {
        return false;
    }
    
    const trimmed = skills.trim();
    if (trimmed.length < 2 || trimmed.length > 500) {
        return false;
    }
    
    // Skills can have letters, numbers, spaces, commas, dots, plus signs, hashes, and hyphens
    const skillsPattern = /^[a-zA-Z0-9\s,.+#-]+$/;
    return skillsPattern.test(trimmed);
}

/*
 * VALIDATE DESCRIPTION
 * Checks if description is valid (optional field)
 */
function isValidDescription(description) {
    // Description is optional
    if (!description) {
        return true;
    }
    
    if (typeof description !== 'string') {
        return false;
    }
    
    // Description should not be too long
    return description.trim().length <= 1000;
}

/*
 * VALIDATE COMPANY NAME
 * Checks if company name is valid (optional field)
 */
function isValidCompanyName(companyName) {
    // Company name is optional
    if (!companyName) {
        return true;
    }
    
    if (typeof companyName !== 'string') {
        return false;
    }
    
    const trimmed = companyName.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
        return false;
    }
    
    // Company names can have letters, numbers, spaces, ampersands, dots, and hyphens
    const companyPattern = /^[a-zA-Z0-9\s&.-]+$/;
    return companyPattern.test(trimmed);
}

/*
 * VALIDATE PHONE NUMBER
 * Checks if phone number is valid (optional field)
 */
function isValidPhone(phone) {
    // Phone is optional
    if (!phone) {
        return true;
    }
    
    if (typeof phone !== 'string') {
        return false;
    }
    
    const trimmed = phone.trim();
    if (trimmed.length < 7 || trimmed.length > 20) {
        return false;
    }
    
    // Phone numbers can have digits, spaces, hyphens, parentheses, and plus sign
    const phonePattern = /^[\+]?[0-9\s\-\(\)]+$/;
    return phonePattern.test(trimmed);
}

/*
 * VALIDATE WEBSITE URL
 * Checks if website URL is valid (optional field)
 */
function isValidWebsite(website) {
    // Website is optional
    if (!website) {
        return true;
    }
    
    if (typeof website !== 'string') {
        return false;
    }
    
    // Must start with http:// or https://
    const websitePattern = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return websitePattern.test(website.trim());
}

/*
 * VALIDATE LOCATION
 * Checks if location is valid (optional field)
 */
function isValidLocation(location) {
    // Location is optional
    if (!location) {
        return true;
    }
    
    if (typeof location !== 'string') {
        return false;
    }
    
    const trimmed = location.trim();
    if (trimmed.length < 2 || trimmed.length > 100) {
        return false;
    }
    
    // Locations can have letters, spaces, commas, dots, and hyphens
    const locationPattern = /^[a-zA-Z\s,.-]+$/;
    return locationPattern.test(trimmed);
}

/*
 * EXPORT ALL VALIDATION FUNCTIONS
 * Make these functions available to other parts of our application
 */
module.exports = {
    isValidName,
    isValidEmail,
    isValidPassword,
    isValidUserType,
    isValidUniversity,
    isValidMajor,
    isValidGraduationYear,
    isValidSkills,
    isValidDescription,
    isValidCompanyName,
    isValidPhone,
    isValidWebsite,
    isValidLocation
};