INSERT INTO companies (user_id, company_name, phone, website, location, description) 
VALUES (?, ?, ?, ?, ?, ?) 
ON DUPLICATE KEY UPDATE 
    company_name = VALUES(company_name), 
    phone = VALUES(phone), 
    website = VALUES(website), 
    location = VALUES(location), 
    description = VALUES(description)