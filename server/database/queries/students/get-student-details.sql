SELECT u.full_name, u.email, s.university, s.major, s.graduation_year, s.skills, s.description
FROM users u
LEFT JOIN students s ON s.user_id = u.id
WHERE u.id = ?