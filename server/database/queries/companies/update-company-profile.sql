UPDATE companies SET 
    company_name = ?, 
    phone = ?, 
    website = ?, 
    location = ?, 
    description = ? 
WHERE user_id = ?;