UPDATE applications a
JOIN internships i ON a.internship_id = i.id
JOIN companies c ON i.company_id = c.id
SET a.status = ?
WHERE a.id = ? AND c.user_id = ?;