-- Run once in the Neon SQL Editor before deploying the updated backend.
-- Existing student rows and bookings are retained.
ALTER TABLE students ADD COLUMN IF NOT EXISTS section TEXT;
