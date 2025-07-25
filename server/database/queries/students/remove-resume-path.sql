-- Remove unused resume_path column from students table
ALTER TABLE students DROP COLUMN IF EXISTS resume_path;