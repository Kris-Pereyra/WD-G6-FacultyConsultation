require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'faculty-consultation-secret-key-2026'; // change later if you want

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
pool.query('SELECT NOW()')
  .then(() => console.log('✅ PostgreSQL connected successfully!'))
  .catch(err => console.error('❌ Database connection failed:', err.message));

// ====================== AUTH ======================

// Student Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, studentId, email, phone, program, yearLevel, password } = req.body;

    if (!fullName || !studentId || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    // Check if email or student_id already exists
    const exists = await pool.query(
      'SELECT id FROM students WHERE email = $1 OR student_id = $2',
      [email.toLowerCase(), studentId]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: 'Email or Student ID already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO students (full_name, student_id, email, phone, program, year_level, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, full_name, student_id, email, phone, program, year_level`,
      [fullName, studentId, email.toLowerCase(), phone, program, yearLevel, passwordHash]
    );

    res.status(201).json({
      message: 'Account created successfully!',
      student: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Student Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM students WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const student = result.rows[0];
    const isMatch = await bcrypt.compare(password, student.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      student: {
        id: student.id,
        full_name: student.full_name,
        student_id: student.student_id,
        email: student.email,
        phone: student.phone,
        program: student.program,
        year_level: student.year_level
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// ====================== FACULTY ======================

// Get all faculty
app.get('/api/faculty', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faculty ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch faculty.' });
  }
});

// ====================== BOOKINGS ======================

// Create a booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { studentId, facultyId, dateKey, timeSlot, subject } = req.body;

    if (!studentId || !facultyId || !dateKey || !timeSlot || !subject) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const result = await pool.query(
      `INSERT INTO bookings (student_id, faculty_id, date_key, time_slot, subject, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING *`,
      [studentId, facultyId, dateKey, timeSlot, subject]
    );

    res.status(201).json({
      message: 'Booking created successfully!',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
});

// Get bookings of a student
app.get('/api/bookings/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await pool.query(
      `SELECT b.*, f.name AS faculty_name, f.department, f.room
       FROM bookings b
       JOIN faculty f ON b.faculty_id = f.id
       WHERE b.student_id = $1
       ORDER BY b.date_key, b.time_slot`,
      [studentId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
});

// Update booking status
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    res.json({
      message: 'Status updated!',
      booking: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// Get all bookings (for Faculty Dashboard)
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, 
             s.full_name AS student_name, 
             s.student_id, 
             s.email AS student_email,
             f.name AS faculty_name
      FROM bookings b
      JOIN students s ON b.student_id = s.id
      JOIN faculty f ON b.faculty_id = f.id
      ORDER BY b.date_key, b.time_slot
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// ====================== START SERVER ======================

app.get('/', (req, res) => {
  res.send('Faculty Consultation Backend is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});

// Update booking status (Accept / Decline / Cancel)
app.patch('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Confirmed' or 'Declined' or 'Cancelled'

    const allowed = ['Pending', 'Confirmed', 'Declined', 'Cancelled', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Status updated', booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

