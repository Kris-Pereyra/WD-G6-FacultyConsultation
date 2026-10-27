"use strict";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const STUDENT_EMAIL = /^[a-z0-9._%+-]+@student\.edu\.ph$/i;
const FACULTY_EMAIL = /^[a-z0-9._%+-]+@faculty\.edu\.ph$/i;
const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";
function validPassword(password) {
  return (
    typeof password === "string" &&
    Buffer.byteLength(password, "utf8") <= 72 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)
  );
}
function registerAuth(app, pool, secret) {
  if (typeof secret !== "string" || secret.length < 32)
    throw new Error(
      "Set JWT_SECRET to a random secret of at least 32 characters in Backend/.env.",
    );
  function requireAuth(req, res, next) {
    const header = req.get("authorization") || "";
    if (!header.startsWith("Bearer "))
      return res.status(401).json({ message: "Please log in." });
    try {
      const user = jwt.verify(header.slice(7), secret, {
        algorithms: ["HS256"],
      });
      if (
        !["student", "faculty"].includes(user.role) ||
        !Number.isSafeInteger(user.id) ||
        user.id < 1 ||
        (user.role === "faculty" &&
          (!Number.isSafeInteger(user.facultyId) || user.facultyId < 1))
      )
        throw new Error("Invalid identity");
      req.user = user;
      next();
    } catch {
      return res.status(401).json({
        message: "Your session is invalid or expired. Please log in again.",
      });
    }
  }
  const requireRole = (role) => (req, res, next) =>
    req.user.role === role
      ? next()
      : res
          .status(403)
          .json({ message: "This action is not available for your account." });
  const sign = (identity) =>
    jwt.sign(identity, secret, { algorithm: "HS256", expiresIn: "8h" });

  app.post("/api/signup", async (req, res) => {
    const body = req.body || {};
    const email = normalizeEmail(body.email);
    const { fullName, studentId, phone, program, yearLevel, password } = body;
    if (body.role && body.role !== "student")
      return res.status(403).json({
        message: "Faculty accounts must be registered by an administrator.",
      });
    if (!STUDENT_EMAIL.test(email))
      return res.status(400).json({
        message:
          "Student registration requires name@student.edu.ph. Faculty accounts are created by an administrator.",
      });
    if (
      typeof fullName !== "string" ||
      fullName.trim().length < 2 ||
      typeof studentId !== "string" ||
      !studentId.trim() ||
      !validPassword(password)
    )
      return res.status(400).json({
        message:
          "Enter your name, student ID, and an 8+ character password with uppercase, lowercase and a number (maximum 72 UTF-8 bytes).",
      });
    try {
      const exists = await pool.query(
        "SELECT id FROM students WHERE LOWER(email) = $1 OR student_id = $2",
        [email, studentId.trim()],
      );
      if (exists.rows.length)
        return res
          .status(409)
          .json({ message: "Email or Student ID already registered." });
      const hash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO students (full_name, student_id, email, phone, program, year_level, password_hash, role)
        VALUES ($1,$2,$3,$4,$5,$6,$7,'student') RETURNING id,full_name,student_id,email,phone,program,year_level,role`,
        [
          fullName.trim(),
          studentId.trim(),
          email,
          phone || null,
          program || null,
          yearLevel || null,
          hash,
        ],
      );
      const student = result.rows[0];
      res.status(201).json({
        message: "Account created successfully!",
        role: student.role,
        token: sign({
          id: Number(student.id),
          email: student.email,
          role: student.role,
        }),
        student,
      });
    } catch (error) {
      if (error.code === "23505")
        return res
          .status(409)
          .json({ message: "Email or Student ID already registered." });
      console.error("Signup failed:", error.code || error.message);
      res.status(500).json({ message: "Server error during signup." });
    }
  });

  app.post("/api/login", async (req, res) => {
    const email = normalizeEmail(req.body?.email);
    const password = req.body?.password;
    if (
      !email ||
      typeof password !== "string" ||
      !password ||
      Buffer.byteLength(password, "utf8") > 72
    )
      return res
        .status(400)
        .json({ message: "Enter a valid email and password." });
    const expectedRole = STUDENT_EMAIL.test(email)
      ? "student"
      : FACULTY_EMAIL.test(email)
        ? "faculty"
        : null;
    if (!expectedRole)
      return res
        .status(400)
        .json({ message: "Use name@student.edu.ph or name@faculty.edu.ph." });
    try {
      const result =
        expectedRole === "student"
          ? await pool.query(
              "SELECT id,full_name,student_id,email,phone,program,year_level,section,profile_photo,password_hash,role FROM students WHERE LOWER(email)=$1",
              [email],
            )
          : await pool.query(
              `SELECT a.id,a.faculty_id,a.email,a.password_hash,a.role,
                      f.name,f.department,f.room,
                      f.available_days,f.start_minutes,f.end_minutes,f.profile_photo
               FROM faculty_accounts a
               JOIN faculty f ON f.id=a.faculty_id
               WHERE LOWER(a.email)=$1`,
              [email],
            );
      const account = result.rows[0];
      if (
        !account ||
        account.role !== expectedRole ||
        !(await bcrypt.compare(password, account.password_hash))
      )
        return res.status(401).json({ message: "Invalid email or password." });
      if (account.role === "faculty") {
        const faculty = {
          id: Number(account.faculty_id),
          name: account.name,
          email: account.email,
          department: account.department,
          room: account.room,
          available_days: account.available_days,
          start_minutes: account.start_minutes,
          end_minutes: account.end_minutes,
          profile_photo: account.profile_photo || null,
        };
        return res.json({
          message: "Login successful!",
          role: account.role,
          token: sign({
            id: Number(account.id),
            facultyId: faculty.id,
            email: account.email,
            role: account.role,
          }),
          faculty,
        });
      }
      const { password_hash, ...student } = account;
      res.json({
        message: "Login successful!",
        role: student.role,
        token: sign({
          id: Number(student.id),
          email: student.email,
          role: student.role,
        }),
        student,
      });
    } catch (error) {
      console.error("Login failed:", error.code || error.message);
      res.status(500).json({ message: "Server error during login." });
    }
  });
  // The database is authoritative for restored accounts and profile data.
  async function readProfile(user) {
    if (user.role === "student") {
      const result = await pool.query(
        `SELECT id, full_name, student_id, email, phone, program, year_level,
                section, profile_photo, role FROM students WHERE id = $1 AND role = 'student'`,
        [user.id],
      );
      return result.rows[0]
        ? { role: "student", student: result.rows[0] }
        : null;
    }
    const result = await pool.query(
      `SELECT f.id, f.name, a.email, f.department, f.room,
              f.available_days, f.start_minutes, f.end_minutes, f.profile_photo
       FROM faculty_accounts a JOIN faculty f ON f.id = a.faculty_id
       WHERE a.id = $1 AND a.faculty_id = $2 AND a.role = 'faculty'`,
      [user.id, user.facultyId],
    );
    return result.rows[0] ? { role: "faculty", faculty: result.rows[0] } : null;
  }

  app.get("/api/me", requireAuth, async (req, res) => {
    res.set("Cache-Control", "no-store");
    try {
      const profile = await readProfile(req.user);
      if (!profile)
        return res
          .status(401)
          .json({ message: "Account not found. Please log in again." });
      res.json(profile);
    } catch (error) {
      console.error("Profile lookup failed:", error.code || error.message);
      res
        .status(500)
        .json({ message: "Unable to load your account. Please try again." });
    }
  });

  app.put("/api/me", requireAuth, async (req, res) => {
    res.set("Cache-Control", "no-store");
    const body = req.body || {};
    const text = (value, min, max) =>
      typeof value === "string" &&
      value.trim().length >= min &&
      value.trim().length <= max;
    if (!text(body.fullName, 2, 150)) {
      return res
        .status(400)
        .json({ message: "Enter a full name between 2 and 150 characters." });
    }
    try {
      let result;
      if (req.user.role === "student") {
        const email = normalizeEmail(body.email);
        if (
          !STUDENT_EMAIL.test(email) ||
          email.length > 254 ||
          !text(body.studentId, 1, 50) ||
          !text(body.phone, 0, 30) ||
          !text(body.yearLevel, 0, 50) ||
          !text(body.section, 0, 50)
        ) {
          return res.status(400).json({
            message:
              "Enter a valid student email and ID. Contact number, year level and section must fit their field limits.",
          });
        }
        const duplicate = await pool.query(
          "SELECT id FROM students WHERE id <> $1 AND (LOWER(email) = $2 OR student_id = $3)",
          [req.user.id, email, body.studentId.trim()],
        );
        if (duplicate.rows.length)
          return res
            .status(409)
            .json({ message: "Email or Student ID already registered." });
        result = await pool.query(
          `UPDATE students SET full_name = $1, student_id = $2, email = $3,
             phone = $4, year_level = $5, section = $6
           WHERE id = $7 AND role = 'student'
           RETURNING id, full_name, student_id, email, phone, program, year_level, section, profile_photo, role`,
          [
            body.fullName.trim(),
            body.studentId.trim(),
            email,
            body.phone.trim() || null,
            body.yearLevel.trim() || null,
            body.section.trim() || null,
            req.user.id,
          ],
        );
        if (!result.rows.length)
          return res
            .status(401)
            .json({ message: "Account not found. Please log in again." });
        return res.json({
          message: "Profile saved successfully.",
          role: "student",
          student: result.rows[0],
        });
      }
      if (!text(body.department, 1, 150) || !text(body.room, 0, 150)) {
        return res.status(400).json({
          message:
            "Enter a department (up to 150 characters) and a room of up to 150 characters.",
        });
      }
      // Faculty login email remains administrator-managed.
      result = await pool.query(
        `UPDATE faculty f SET name = $1, department = $2, room = $3
         FROM faculty_accounts a
         WHERE f.id = $4 AND a.id = $5 AND a.faculty_id = f.id AND a.role = 'faculty'
         RETURNING f.id`,
        [
          body.fullName.trim(),
          body.department.trim(),
          body.room.trim() || null,
          req.user.facultyId,
          req.user.id,
        ],
      );
      if (!result.rows.length)
        return res
          .status(401)
          .json({ message: "Account not found. Please log in again." });
      const profile = await readProfile(req.user);
      if (!profile)
        return res
          .status(401)
          .json({ message: "Account not found. Please log in again." });
      res.json({ message: "Profile saved successfully.", ...profile });
    } catch (error) {
      if (error.code === "23505")
        return res
          .status(409)
          .json({ message: "Email or Student ID already registered." });
      console.error("Profile save failed:", error.code || error.message);
      res
        .status(500)
        .json({ message: "Unable to save your profile. Please try again." });
    }
  });

  return { requireAuth, requireRole };
}
module.exports = {
  registerAuth,
  STUDENT_EMAIL,
  FACULTY_EMAIL,
  normalizeEmail,
  validPassword,
};
