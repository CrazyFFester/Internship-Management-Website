UPDATE internships 
SET title = ?, description = ?, location = ?, salary = ?, internship_type = ?, required_skills = ?, duration_months = ?, application_deadline = ? 
WHERE id = ? AND company_id = (SELECT id FROM companies WHERE user_id = ?);