SELECT u.full_name, u.email, c.company_name, c.phone, c.website, c.location, c.description 
FROM users u 
LEFT JOIN companies c ON c.user_id = u.id 
WHERE u.id = ?