const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const backendRequire = createRequire(path.resolve(__dirname, '../Backend/server.js'));
const jwt = backendRequire('jsonwebtoken');
const secret = 'test-only-secret-not-a-production-credential';
const student = { id: 7, full_name: 'Test Student', student_id: '2026-7', email: 'test@student.edu.ph', phone: null, program: 'BSCS', year_level: '2nd Year', section: 'A', role: 'student' };
const faculty = { id: 2, name: 'Test Faculty', email: 'test@faculty.edu.ph', department: 'CCS', room: '101', available_days: [1, 3], start_minutes: 540, end_minutes: 600 };
const sign = (identity) => jwt.sign(identity, secret, { expiresIn: '8h' });
const studentToken = sign({ id: 7, role: 'student', email: student.email });
const facultyToken = sign({ id: 9, facultyId: 2, role: 'faculty', email: faculty.email });

async function withServer(query, run) {
  const pool = { query };
  function mockedRequire(name) {
    if (name === 'pg') return { Pool: function () { return pool; } };
    if (name === 'dotenv') return { config() {} };
    return backendRequire(name);
  }
  const module = { exports: {} };
  new Function('require', 'module', 'exports', '__dirname', 'process', fs.readFileSync(path.resolve(__dirname, '../Backend/server.js'), 'utf8'))(
    mockedRequire, module, module.exports, path.resolve(__dirname, '../Backend'), { env: { JWT_SECRET: secret } },
  );
  const server = module.exports.app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const request = async (route, { token, body, method = 'GET' } = {}) => {
    const res = await fetch(`http://127.0.0.1:${server.address().port}${route}`, {
      method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { status: res.status, cache: res.headers.get('cache-control'), body: await res.json() };
  };
  try { await run(request); } finally { await new Promise(resolve => server.close(resolve)); }
}
const rows = (value) => ({ rows: value });

test('me rejects missing, forged and expired tokens before any profile query', async () => {
  await withServer(async (sql) => { assert.equal(sql, 'SELECT NOW()'); return rows([]); }, async request => {
    for (const token of [undefined, 'forged', jwt.sign({ id: 7, role: 'student' }, secret, { expiresIn: -1 })]) {
      assert.equal((await request('/api/me', { token })).status, 401);
    }
  });
});

test('student profile save is scoped to signed identity and survives a subsequent lookup', async () => {
  let record = { ...student };
  await withServer(async (sql, args) => {
    if (sql === 'SELECT NOW()') return rows([]);
    if (sql.includes('id <>')) return rows([]);
    if (sql.includes('UPDATE students')) {
      assert.equal(args[6], 7); // Ignore a submitted different account id.
      record = { ...record, full_name: args[0], student_id: args[1], email: args[2], phone: args[3], year_level: args[4], section: args[5] };
      return rows([record]);
    }
    assert.deepEqual(args, [7]);
    assert.ok(!sql.includes('password_hash'));
    return rows([record]);
  }, async request => {
    const saved = await request('/api/me', { token: studentToken, method: 'PUT', body: { id: 999, fullName: ' Updated Student ', studentId: '2026-7', email: 'UPDATED@student.edu.ph', phone: '', yearLevel: '3rd Year', section: 'B' } });
    assert.equal(saved.status, 200);
    const restored = await request('/api/me', { token: studentToken });
    assert.equal(restored.cache, 'no-store');
    assert.equal(restored.body.student.full_name, 'Updated Student');
    assert.equal(restored.body.student.email, 'updated@student.edu.ph');
    assert.equal(restored.body.student.section, 'B');
  });
});

test('profile validation and duplicate email/ID errors do not report success', async () => {
  let updates = 0;
  await withServer(async sql => {
    if (sql === 'SELECT NOW()') return rows([]);
    if (sql.includes('id <>')) return rows([{ id: 8 }]);
    updates++;
    return rows([]);
  }, async request => {
    assert.equal((await request('/api/me', { token: studentToken, method: 'PUT', body: { fullName: '' } })).status, 400);
    assert.equal((await request('/api/me', { token: studentToken, method: 'PUT', body: { fullName: 'A Student', studentId: 'taken', email: student.email, phone: '', yearLevel: '', section: '' } })).status, 409);
    assert.equal(updates, 0);
  });
});

test('faculty profile updates are scoped to its account and preserve login email', async () => {
  let record = { ...faculty };
  await withServer(async (sql, args) => {
    if (sql === 'SELECT NOW()') return rows([]);
    if (sql.includes('UPDATE faculty')) {
      assert.deepEqual(args.slice(3), [2, 9]);
      assert.ok(!sql.includes('email ='));
      record = { ...record, name: args[0], department: args[1], room: args[2] };
      return rows([{ id: 2 }]);
    }
    assert.deepEqual(args, [9, 2]);
    return rows([record]);
  }, async request => {
    const response = await request('/api/me', { token: facultyToken, method: 'PUT', body: { fullName: 'Updated Faculty', department: 'CCS', room: '202', email: 'ignored@faculty.edu.ph' } });
    assert.equal(response.status, 200);
    assert.equal(response.body.faculty.room, '202');
    assert.equal(response.body.faculty.email, faculty.email);
  });
});

test('availability can be removed without changing bookings; students cannot remove it', async () => {
  let changes = 0;
  await withServer(async (sql, args) => {
    if (sql === 'SELECT NOW()') return rows([]);
    assert.ok(sql.includes('UPDATE faculty'));
    assert.ok(!sql.includes('bookings'));
    assert.deepEqual(args, [[], null, null, 2]);
    changes++;
    return rows([{ ...faculty, available_days: [] }]);
  }, async request => {
    assert.equal((await request('/api/faculty/availability', { token: studentToken, method: 'PUT', body: { available_days: [] } })).status, 403);
    const result = await request('/api/faculty/availability', { token: facultyToken, method: 'PUT', body: { available_days: [] } });
    assert.equal(result.status, 200);
    assert.deepEqual(result.body.faculty.available_days, []);
    assert.match(result.body.message, /Existing bookings are unchanged/);
    assert.equal(changes, 1);
  });
});

test('availability rejects invalid schedules and saves a valid schedule', async () => {
  await withServer(async (sql, args) => {
    if (sql === 'SELECT NOW()') return rows([]);
    assert.deepEqual(args, [[1, 3], 540, 600, 2]);
    return rows([faculty]);
  }, async request => {
    for (const body of [{ available_days: [7], start_minutes: 540, end_minutes: 600 }, { available_days: [1], start_minutes: 600, end_minutes: 540 }, { available_days: [1] }]) {
      assert.equal((await request('/api/faculty/availability', { token: facultyToken, method: 'PUT', body })).status, 400);
    }
    assert.equal((await request('/api/faculty/availability', { token: facultyToken, method: 'PUT', body: { available_days: [3, 1, 1], start_minutes: 540, end_minutes: 600 } })).status, 200);
  });
});
