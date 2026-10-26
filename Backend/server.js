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

// ====================== BOOKINGS ======================

// Create a booking
app.post(
  "/api/bookings",
  requireAuth,
  requireRole("student"),
  async (req, res) => {
    try {
      const { facultyId, dateKey, timeSlot, subject } = req.body;
      const studentId = req.user.id;

      if (!studentId || !facultyId || !dateKey || !timeSlot || !subject) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const result = await pool.query(
        `INSERT INTO bookings (student_id, faculty_id, date_key, time_slot, subject, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING *`,
        [studentId, facultyId, dateKey, timeSlot, subject],
      );

      res.status(201).json({
        message: "Booking created successfully!",
        booking: result.rows[0],
      });
    } catch (error) {
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
        return res
          .status(404)
          .json({
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
