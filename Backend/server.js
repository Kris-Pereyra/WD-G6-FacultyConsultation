
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Test database connection
pool.query('SELECT NOW()')
  .then(() => {
    console.log('PostgreSQL database connected successfully!');
  })
  .catch((error) => {
    console.error('PostgreSQL connection failed:', error.message);
  });

// Test API route
app.get('/api/message', (req, res) => {
  res.json({
    message: 'Hello from the backend!'
  });
});

// Test database API route
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');

    res.json({
      message: 'Database connection successful!',
      time: result.rows[0].current_time
    });
  } catch (error) {
    console.error('Database query failed:', error.message);
    res.status(500).json({
      message: 'Database connection failed.'
    });
  }
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

