require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { registerAuth } = require("./auth.cjs");

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: { rejectUnauthorized: false },
});

// Test connection
pool
  .query("SELECT NOW()")
  .then(() => console.log("✅ PostgreSQL connected successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err.message));

const { requireAuth, requireRole } = registerAuth(app, pool, JWT_SECRET);

// ====================== FACULTY ======================

// Get all faculty
app.get("/api/faculty", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM faculty ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch faculty." });
  }
});

// Save the logged-in faculty member's consultation hours.
app.put(
  "/api/faculty/availability",
  requireAuth,
  requireRole("faculty"),
  async (req, res) => {
    const { available_days, start_minutes, end_minutes } = req.body || {};

    if (
      !Array.isArray(available_days) ||
      available_days.length === 0 ||
      !available_days.every(
        (day) => Number.isInteger(day) && day >= 0 && day <= 6,
      ) ||
      !Number.isInteger(start_minutes) ||
      !Number.isInteger(end_minutes) ||
      start_minutes < 0 ||
      end_minutes > 1440 ||
      end_minutes - start_minutes < 30
    ) {
      return res.status(400).json({
        message:
          "Choose consultation days and hours covering at least 30 minutes.",
      });
    }

    try {
      const result = await pool.query(
        `UPDATE faculty
         SET available_days = $1, start_minutes = $2, end_minutes = $3
         WHERE id = $4
         RETURNING id, name, department, room,
                   available_days, start_minutes, end_minutes`,
        [
          [...new Set(available_days)].sort((a, b) => a - b),
          start_minutes,
          end_minutes,
          req.user.facultyId,
        ],
      );

      if (!result.rows.length) {
        return res.status(404).json({ message: "Faculty record not found." });
      }

      res.json({
        message: "Availability saved successfully.",
        faculty: result.rows[0],
      });
    } catch (error) {
      console.error("Availability save failed:", error.code || error.message);
      res.status(500).json({ message: "Failed to save availability." });
    }
  },
);

// Show occupied slots without exposing student details.
app.get(
  "/api/faculty/:facultyId/occupied-slots",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    const facultyId = Number(req.params.facultyId);

    if (!Number.isSafeInteger(facultyId) || facultyId < 1) {
      return res.status(400).json({ message: "Invalid faculty ID." });
    }

    try {
      const result = await pool.query(
        `SELECT
           to_char(date_key::date, 'YYYY-MM-DD') AS date_key,
           time_slot
         FROM bookings
         WHERE faculty_id = $1
           AND status IN ('Pending', 'Confirmed')
           AND date_key::date >=
               (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date
         ORDER BY date_key, time_slot`,
        [facultyId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error(
        "Occupied slots lookup failed:",
        error.code || error.message,
      );
      res.status(500).json({ message: "Failed to load occupied slots." });
    }
  },
);

// ====================== BOOKINGS ======================

// Create a booking
app.post(
  "/api/bookings",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    try {
      const { facultyId, dateKey, timeSlot, subject } = req.body || {};
      const studentId = req.user.id;

      if (!Number.isSafeInteger(facultyId) || facultyId < 1) {
        return res.status(400).json({ message: "Invalid faculty ID." });
      }

      const date =
        typeof dateKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateKey)
          ? new Date(`${dateKey}T00:00:00Z`)
          : null;

      if (
        !date ||
        !Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== dateKey
      ) {
        return res.status(400).json({ message: "Choose a valid date." });
      }

      if (
        typeof subject !== "string" ||
        subject.trim().length < 5 ||
        subject.trim().length > 300
      ) {
        return res.status(400).json({
          message: "Enter a consultation topic between 5 and 300 characters.",
        });
      }

      const timeMatch =
        typeof timeSlot === "string"
          ? timeSlot.match(
              /^([1-9]|1[0-2]):([0-5]\d) (AM|PM) - ([1-9]|1[0-2]):([0-5]\d) (AM|PM)$/,
            )
          : null;

      if (!timeMatch) {
        return res.status(400).json({ message: "Choose a valid time slot." });
      }

      const startMinute =
        ((Number(timeMatch[1]) % 12) + (timeMatch[3] === "PM" ? 12 : 0)) * 60 +
        Number(timeMatch[2]);

      const endMinute = startMinute + 30;

      const formatTime = (minutes) => {
        const hour = Math.floor(minutes / 60) % 24;
        return (
          (hour % 12 || 12) +
          ":" +
          String(minutes % 60).padStart(2, "0") +
          (hour < 12 ? " AM" : " PM")
        );
      };

      if (
        endMinute > 1440 ||
        timeSlot !== `${formatTime(startMinute)} - ${formatTime(endMinute)}`
      ) {
        return res.status(400).json({
          message: "Choose a valid 30-minute consultation slot.",
        });
      }

      const startsAt = Date.parse(
        `${dateKey}T${String(Math.floor(startMinute / 60)).padStart(2, "0")}:${String(
          startMinute % 60,
        ).padStart(2, "0")}:00+08:00`,
      );

      if (!Number.isFinite(startsAt) || startsAt <= Date.now()) {
        return res.status(400).json({
          message: "This consultation time has already passed.",
        });
      }

      const result = await pool.query(
        `INSERT INTO bookings
           (student_id, faculty_id, date_key, time_slot, subject, status)
         SELECT $1, f.id, $3, $4, $5, 'Pending'
         FROM faculty f
         WHERE f.id = $2
           AND $8::integer = ANY(f.available_days)
           AND $6::integer >= f.start_minutes
           AND $7::integer <= f.end_minutes
           AND MOD($6::integer - f.start_minutes, 30) = 0
         RETURNING *`,
        [
          studentId,
          facultyId,
          dateKey,
          timeSlot,
          subject.trim(),
          startMinute,
          endMinute,
          date.getUTCDay(),
        ],
      );

      if (!result.rows.length) {
        return res.status(409).json({
          message:
            "This time is outside the faculty's current consultation schedule. Reopen availability and choose another slot.",
        });
      }

      res.status(201).json({
        message: "Booking created successfully!",
        booking: result.rows[0],
      });
    } catch (error) {
      if (
        error.code === "23505" &&
        error.constraint === "bookings_active_faculty_slot_unique"
      ) {
        return res.status(409).json({
          message:
            "This consultation slot is already reserved. Please choose another time.",
        });
      }

      console.error(error);
      res.status(500).json({ message: "Failed to create booking." });
    }
  },
);

// Get bookings of a student
app.get(
  "/api/bookings/student/:studentId",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    try {
      const studentId = req.user.id;
      if (String(studentId) !== req.params.studentId)
        return res
          .status(403)
          .json({ message: "You can only view your own bookings." });

      const result = await pool.query(
        `SELECT b.*, f.name AS faculty_name, f.department, f.room
       FROM bookings b
       JOIN faculty f ON b.faculty_id = f.id
       WHERE b.student_id = $1
       ORDER BY b.date_key, b.time_slot`,
        [studentId],
      );

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch bookings." });
    }
  },
);

// Students can cancel their own upcoming active bookings.
app.patch(
  "/api/bookings/:id/cancel",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    const bookingId = Number(req.params.id);

    if (!Number.isSafeInteger(bookingId) || bookingId < 1) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    try {
      const result = await pool.query(
        `UPDATE bookings
         SET status = 'Cancelled'
         WHERE id = $1
           AND student_id = $2
           AND status IN ('Pending', 'Confirmed')
           AND (
             (
               date_key::date +
               to_timestamp(
                 split_part(time_slot, ' - ', 1),
                 'HH12:MI AM'
               )::time
             ) AT TIME ZONE 'Asia/Manila'
           ) > CURRENT_TIMESTAMP
         RETURNING *`,
        [bookingId, req.user.id],
      );

      if (!result.rows.length) {
        return res.status(409).json({
          message:
            "This booking cannot be cancelled. It may have started, changed status, or belong to another account.",
        });
      }

      res.json({
        message: "Booking cancelled successfully.",
        booking: result.rows[0],
      });
    } catch (error) {
      console.error("Cancellation failed:", error.code || error.message);
      res.status(500).json({ message: "Failed to cancel booking." });
    }
  },
);

// Faculty decisions are scoped to the authenticated faculty record.
app.patch(
  "/api/bookings/:id/status",
  requireAuth,
  requireRole("faculty"),
  async (req, res) => {
    const { status } = req.body || {};
    const previous = status === "Completed" ? "Confirmed" : "Pending";
    if (!["Confirmed", "Declined", "Completed"].includes(status))
      return res
        .status(400)
        .json({ message: "Choose Confirmed, Declined, or Completed." });
    try {
      const result = await pool.query(
        "UPDATE bookings SET status=$1 WHERE id=$2 AND faculty_id=$3 AND status=$4 RETURNING *",
        [status, req.params.id, req.user.facultyId, previous],
      );
      if (!result.rows.length)
        return res.status(404).json({
          message:
            "Booking not found, not assigned to you, or its status has changed.",
        });
      res.json({ message: "Status updated!", booking: result.rows[0] });
    } catch (error) {
      console.error(error.code || error.message);
      res.status(500).json({ message: "Failed to update status." });
    }
  },
);

// Get all bookings (for Faculty Dashboard)
app.get(
  "/api/bookings",
  requireAuth,
  requireRole("faculty"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `
      SELECT b.*, 
             s.full_name AS student_name, 
             s.student_id, 
             s.email AS student_email,
             f.name AS faculty_name
      FROM bookings b
      JOIN students s ON b.student_id = s.id
      JOIN faculty f ON b.faculty_id = f.id
      WHERE b.faculty_id = $1
      ORDER BY b.date_key, b.time_slot
    `,
        [req.user.facultyId],
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  },
);

// ====================== START SERVER ======================

app.get("/", (req, res) => {
  res.send("Faculty Consultation Backend is running!");
});

if (require.main === module)
  app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
  });

module.exports = { app, pool };
