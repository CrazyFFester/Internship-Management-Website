SELECT 
    a.id,
    a.status,
    a.cover_letter,
    a.applied_at,
    i.title as internship_title,
    s.university,
    s.major,
    s.graduation_year,
    s.skills,
    u.full_name as student_name,
    u.email as student_email
FROM applications a
JOIN internships i ON a.internship_id = i.id
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
WHERE i.company_id = ?
ORDER BY a.applied_at DESC;