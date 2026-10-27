const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { createRequire } = require("node:module");
const backendRequire = createRequire(
  path.resolve(__dirname, "../Backend/server.js"),
);
const { validProfilePhoto } = backendRequire("./profile-photo.cjs");
const jwt = backendRequire("jsonwebtoken");
const secret = "test-only-secret-not-a-production-credential";
const token = (role) =>
  jwt.sign(
    role === "faculty" ? { id: 9, facultyId: 2, role } : { id: 7, role },
    secret,
    { expiresIn: "8h" },
  );
const PHOTO =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAEAAQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzqiiiuA+0P//Z";
async function withServer(run, failing = false) {
  const data = { student: null, faculty: null };
  const writes = [];
  const pool = {
    async query(sql, args) {
      if (sql === "SELECT NOW()") return { rows: [] };
      if (sql.includes("SET profile_photo")) {
        if (failing)
          throw Object.assign(new Error("simulated database failure"), {
            code: "TEST",
          });
        const role = sql.includes("UPDATE students") ? "student" : "faculty";
        if (role === "student") assert.deepEqual(args.slice(1), [7]);
        else assert.deepEqual(args.slice(1), [2, 9]);
        data[role] = args[0];
        writes.push(role);
        return { rows: [{ id: role === "student" ? 7 : 2 }] };
      }
      if (sql.includes("SELECT * FROM faculty"))
        return {
          rows: [{ id: 2, name: "Faculty Test", profile_photo: data.faculty }],
        };
      if (sql.includes("FROM students WHERE id"))
        return {
          rows: [
            {
              id: 7,
              full_name: "Student Test",
              role: "student",
              profile_photo: data.student,
            },
          ],
        };
      if (sql.includes("FROM faculty_accounts a JOIN faculty"))
        return {
          rows: [{ id: 2, name: "Faculty Test", profile_photo: data.faculty }],
        };
      throw new Error("Unexpected query: " + sql);
    },
  };
  function mockedRequire(name) {
    if (name === "pg")
      return {
        Pool: function () {
          return pool;
        },
      };
    if (name === "dotenv") return { config() {} };
    return backendRequire(name);
  }
  const module = { exports: {} };
  new Function(
    "require",
    "module",
    "exports",
    "__dirname",
    "process",
    fs.readFileSync(path.resolve(__dirname, "../Backend/server.js"), "utf8"),
  )(
    mockedRequire,
    module,
    module.exports,
    path.resolve(__dirname, "../Backend"),
    { env: { JWT_SECRET: secret } },
  );
  const server = module.exports.app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  async function request(route, method = "GET", role = "student", body) {
    const res = await fetch(
      `http://127.0.0.1:${server.address().port}${route}`,
      {
        method,
        headers: {
          ...(role ? { Authorization: `Bearer ${token(role)}` } : {}),
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
      },
    );
    return { status: res.status, body: await res.json() };
  }
  try {
    await run(request, data, writes);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("photo validation accepts a bounded JPEG and rejects active content, malformed data and oversized dimensions", () => {
  assert.equal(validProfilePhoto(PHOTO), true);
  for (const bad of [
    null,
    "https://example.com/photo.jpg",
    "data:image/svg+xml;base64,PHN2Zz4=",
    "data:image/jpeg;base64,PGh0bWw+",
    "data:image/jpeg;base64,!!!!",
    PHOTO + "A",
  ])
    assert.equal(validProfilePhoto(bad), false);
  const bytes = Buffer.from(PHOTO.split(",")[1], "base64");
  const marker = bytes.indexOf(Buffer.from([0xff, 0xc0]));
  assert.ok(marker > 0);
  bytes.writeUInt16BE(513, marker + 7);
  assert.equal(
    validProfilePhoto("data:image/jpeg;base64," + bytes.toString("base64")),
    false,
  );
});

test("student uploads, replaces and removes its own photo; a fresh account lookup retains the saved photo", async () => {
  await withServer(async (request, data, writes) => {
    assert.equal(
      (await request("/api/me/photo", "PUT", null, { photo: PHOTO })).status,
      401,
    );
    const saved = await request("/api/me/photo", "PUT", "student", {
      photo: PHOTO,
      studentId: 999,
      facultyId: 999,
    });
    assert.equal(saved.status, 200);
    assert.equal(saved.body.profile_photo, PHOTO);
    assert.equal((await request("/api/me")).body.student.profile_photo, PHOTO);
    assert.equal(data.faculty, null);
    assert.equal(
      (await request("/api/me/photo", "PUT", "student", { photo: PHOTO }))
        .status,
      200,
    );
    const removed = await request("/api/me/photo", "DELETE");
    assert.equal(removed.status, 200);
    assert.equal(removed.body.profile_photo, null);
    assert.equal((await request("/api/me")).body.student.profile_photo, null);
    assert.deepEqual(writes, ["student", "student", "student"]);
  });
});

test("faculty photo is returned by the directory and restored profile, then disappears after removal", async () => {
  await withServer(async (request, data) => {
    assert.equal(
      (
        await request("/api/me/photo", "PUT", "faculty", {
          photo: PHOTO,
          id: 999,
        })
      ).status,
      200,
    );
    assert.equal(
      (await request("/api/faculty", "GET", null)).body[0].profile_photo,
      PHOTO,
    );
    assert.equal(
      (await request("/api/me", "GET", "faculty")).body.faculty.profile_photo,
      PHOTO,
    );
    assert.equal(data.student, null);
    assert.equal(
      (await request("/api/me/photo", "DELETE", "faculty")).status,
      200,
    );
    assert.equal(
      (await request("/api/faculty", "GET", null)).body[0].profile_photo,
      null,
    );
  });
});

test("bad images and oversized requests do not change a saved photo", async () => {
  await withServer(async (request, data, writes) => {
    data.student = PHOTO;
    assert.equal(
      (await request("/api/me/photo", "PUT", "student", { photo: "invalid" }))
        .status,
      400,
    );
    assert.equal(
      (
        await request("/api/me/photo", "PUT", "student", {
          photo: "x".repeat(300000),
        })
      ).status,
      413,
    );
    assert.equal(data.student, PHOTO);
    assert.equal(writes.length, 0);
  });
});

test("failed database write reports an error instead of success", async () => {
  await withServer(async (request) => {
    const result = await request("/api/me/photo", "PUT", "student", {
      photo: PHOTO,
    });
    assert.equal(result.status, 500);
    assert.match(result.body.message, /Unable to save/);
  }, true);
});
