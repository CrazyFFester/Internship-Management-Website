DELETE FROM internships 
WHERE id = ? AND company_id = (SELECT id FROM companies WHERE user_id = ?);