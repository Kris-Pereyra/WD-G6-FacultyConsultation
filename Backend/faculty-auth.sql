BEGIN;
-- Existing students remain students. No faculty or student records are deleted.
ALTER TABLE students ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student';
UPDATE students SET role='student' WHERE role IS NULL;
ALTER TABLE students ALTER COLUMN role SET DEFAULT 'student';
ALTER TABLE students ALTER COLUMN role SET NOT NULL;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='students_student_role_only' AND conrelid='students'::regclass) THEN
    ALTER TABLE students ADD CONSTRAINT students_student_role_only CHECK (role='student');
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS students_login_email_unique ON students (LOWER(email));
CREATE TABLE IF NOT EXISTS faculty_accounts (
  id SERIAL PRIMARY KEY,
  faculty_id INTEGER NOT NULL UNIQUE REFERENCES faculty(id),
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'faculty' CHECK (role='faculty'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT faculty_account_email_domain CHECK (email ~ '^[a-z0-9._%+-]+@faculty\.edu\.ph$')
);
CREATE UNIQUE INDEX IF NOT EXISTS faculty_accounts_login_email_unique ON faculty_accounts (LOWER(email));
COMMIT;
