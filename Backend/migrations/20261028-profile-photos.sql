-- Run once in the Neon SQL Editor before starting the updated backend.
-- Compact JPEG data is stored with the account, never on Render's filesystem.
ALTER TABLE students ADD COLUMN IF NOT EXISTS profile_photo TEXT;
ALTER TABLE faculty ADD COLUMN IF NOT EXISTS profile_photo TEXT;
