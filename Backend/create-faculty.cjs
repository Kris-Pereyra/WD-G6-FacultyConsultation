"use strict";
const { FACULTY_EMAIL, normalizeEmail, validPassword } = require("./auth.cjs");
async function provisionFaculty(pool, bcrypt, { facultyId, email, password }) {
  email = normalizeEmail(email);
  if (!Number.isSafeInteger(facultyId) || facultyId < 1)
    throw new Error("Enter a valid faculty ID.");
  if (!FACULTY_EMAIL.test(email))
    throw new Error("Faculty email must end with @faculty.edu.ph.");
  if (!validPassword(password))
    throw new Error(
      "Use 8+ characters with uppercase, lowercase and a number, maximum 72 UTF-8 bytes.",
    );
  const faculty = await pool.query("SELECT id,name FROM faculty WHERE id=$1", [
    facultyId,
  ]);
  if (!faculty.rows.length)
    throw new Error(
      "Faculty ID does not exist. Add the faculty member to your existing faculty table first.",
    );
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    "INSERT INTO faculty_accounts(faculty_id,email,password_hash,role) VALUES($1,$2,$3,'faculty') RETURNING id,faculty_id,email,role",
    [facultyId, email, hash],
  );
  return { ...result.rows[0], name: faculty.rows[0].name };
}
async function main() {
  require("dotenv").config({ path: require("path").join(__dirname, ".env") });
  const { Pool } = require("pg");
  const bcrypt = require("bcryptjs");
  const readline = require("readline");
  if (!process.stdin.isTTY)
    throw new Error(
      "Run this administrator setup script in an interactive terminal.",
    );
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    port: Number(process.env.DB_PORT) || 5432,
    ssl: { rejectUnauthorized: false },
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  const ask = (question) =>
    new Promise((resolve) => rl.question(question, resolve));
  const originalWrite = rl._writeToOutput.bind(rl);
  const hidden = async (question) => {
    process.stdout.write(question);
    rl._writeToOutput = () => {};
    try {
      return await ask("");
    } finally {
      rl._writeToOutput = originalWrite;
      process.stdout.write("\n");
    }
  };
  try {
    console.log(
      "Administrator: register an account for an existing faculty record.",
    );
    const directory = await pool.query(
      "SELECT id,name,department FROM faculty ORDER BY id",
    );
    console.table(directory.rows);
    const facultyId = Number((await ask("Faculty ID: ")).trim());
    const email = await ask("Faculty email (name@faculty.edu.ph): ");
    const password = await hidden("Password (hidden): ");
    if (password !== (await hidden("Confirm password (hidden): ")))
      throw new Error("Passwords do not match.");
    const account = await provisionFaculty(pool, bcrypt, {
      facultyId,
      email,
      password,
    });
    console.log("Faculty account created:", account.name, account.email);
  } catch (error) {
    console.error(
      error.code === "23505"
        ? "This faculty member or email already has an account."
        : error.message,
    );
    process.exitCode = 1;
  } finally {
    rl.close();
    await pool.end();
  }
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
module.exports = { provisionFaculty };
