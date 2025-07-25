INSERT INTO students (user_id, university, major, graduation_year, skills, description)
VALUES (?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE
university = VALUES(university),
major = VALUES(major),
graduation_year = VALUES(graduation_year),
skills = VALUES(skills),
description = VALUES(description)