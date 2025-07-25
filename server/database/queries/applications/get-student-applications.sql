SELECT 
    a.id,
    a.internship_id,
    a.status,
    a.cover_letter,
    a.applied_at,
    i.title as internship_title,
    i.location,
    i.salary,
    i.internship_type,
    i.application_deadline as deadline,
    c.company_name
FROM applications a
JOIN internships i ON a.internship_id = i.id
JOIN companies c ON i.company_id = c.id
WHERE a.student_id = ?
ORDER BY a.applied_at DESC;