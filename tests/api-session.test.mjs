import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const source = await readFile(
  new URL("../src/api.js", import.meta.url),
  "utf8",
);
let nonce = 0;
async function loadApi() {
  return import(
    `data:text/javascript;base64,${Buffer.from(source + `\n// instance ${nonce++}`).toString("base64")}`
  );
}
function storageWindow() {
  const data = new Map();
  const target = new EventTarget();
  target.sessionStorage = {
    getItem: (key) => data.get(key) || null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  return target;
}
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

test("login survives module reload, sends bearer token, and logout removes stored session", async () => {
  global.window = storageWindow();
  global.fetch = async () => json({ token: "signed-token", role: "student" });
  const first = await loadApi();
  await first.login("test@student.edu.ph", "password");
  const reloaded = await loadApi();
  assert.equal(reloaded.getAuthToken(), "signed-token");
  global.fetch = async (url, options) => {
    assert.ok(url.endsWith("/api/me"));
    assert.equal(options.headers.Authorization, "Bearer signed-token");
    return json({ role: "student", student: { id: 7 } });
  };
  assert.equal((await reloaded.getCurrentUser()).student.id, 7);
  reloaded.clearAuthToken();
  assert.equal((await loadApi()).getAuthToken(), null);
});

test("expired session is cleared and emits an expiry event", async () => {
  global.window = storageWindow();
  global.fetch = async () => json({ token: "expired-token" });
  const api = await loadApi();
  await api.login("test@student.edu.ph", "password");
  let expired = 0;
  window.addEventListener("consulttime:session-expired", () => expired++);
  global.fetch = async () => json({ message: "Session expired" }, 401);
  await assert.rejects(api.getCurrentUser(), { status: 401 });
  assert.equal(expired, 1);
  assert.equal(api.getAuthToken(), null);
  assert.equal((await loadApi()).getAuthToken(), null);
});

test("temporary connection failure preserves the session for retry", async () => {
  global.window = storageWindow();
  global.fetch = async () => json({ token: "valid-token" });
  const api = await loadApi();
  await api.login("test@student.edu.ph", "password");
  global.fetch = async () => {
    throw new Error("Offline");
  };
  await assert.rejects(api.getCurrentUser(), /Offline/);
  assert.equal(api.getAuthToken(), "valid-token");
});

test("a stale unauthorized response cannot clear a newer login", async () => {
  global.window = storageWindow();
  global.fetch = async () => json({ token: "old-token" });
  const api = await loadApi();
  await api.login("test@student.edu.ph", "password");
  let finish;
  global.fetch = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const pending = api.getCurrentUser();
  global.fetch = async () => json({ token: "new-token" });
  await api.login("other@student.edu.ph", "password");
  finish(json({ message: "Old session expired" }, 401));
  await assert.rejects(pending);
  assert.equal(api.getAuthToken(), "new-token");
});
