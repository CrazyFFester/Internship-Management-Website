SELECT i.id, i.company_id, i.title, i.description, i.location, i.salary, 
       i.internship_type as type, i.required_skills as skills, 
       i.duration_months as duration, i.application_deadline as deadline,
       i.status, i.created_at, c.company_name 
FROM internships i 
JOIN companies c ON i.company_id = c.id 
WHERE c.user_id = ? 
ORDER BY i.created_at DESC;