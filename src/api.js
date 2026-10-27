const API_URL = "https://wd-g6-facultyconsultation.onrender.com/api";
// Tab-scoped storage survives refresh; the backend validates every token.
const SESSION_KEY = "consulttime.auth.v1";
function readStoredToken() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
let authToken = readStoredToken();
export function getAuthToken() {
  return authToken;
}
function rememberAuthToken(value) {
  authToken = typeof value === "string" && value ? value : null;
  try {
    if (authToken) window.sessionStorage.setItem(SESSION_KEY, authToken);
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* Login still works if browser storage is unavailable. */
  }
}
export function clearAuthToken() {
  rememberAuthToken(null);
}
async function apiFetch(url, options = {}) {
  const requestToken = authToken;
  const response = await fetch(url, options);
  // An old request must not sign out a newly logged-in account.
  if (
    response.status === 401 &&
    requestToken &&
    requestToken === authToken &&
    options.headers?.Authorization
  ) {
    clearAuthToken();
    window.dispatchEvent(new Event("consulttime:session-expired"));
  }
  return response;
}
function authHeaders() {
  return authToken ? { Authorization: "Bearer " + authToken } : {};
}

export async function getFaculty() {
  const res = await apiFetch(`${API_URL}/faculty`);
  if (!res.ok) throw new Error("Failed to fetch faculty");
  return res.json();
}

export async function signup(data) {
  const res = await apiFetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Signup failed");
  rememberAuthToken(result.token);
  return result;
}

export async function login(email, password) {
  const res = await apiFetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  rememberAuthToken(result.token);
  return result;
}

export async function createBooking(data) {
  const res = await apiFetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Booking failed");
  return result;
}

export async function getStudentBookings(studentId) {
  const res = await apiFetch(`${API_URL}/bookings/student/${studentId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function updateBookingStatus(bookingId, status) {
  const res = await apiFetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");
  return result;
}

export async function getAllBookings() {
  const res = await apiFetch(`${API_URL}/bookings`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch all bookings");
  return res.json();
}

export async function saveFacultyAvailability(data) {
  const res = await apiFetch(`${API_URL}/faculty/availability`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to save availability.");
  }

  return result;
}

export async function getFacultyOccupiedSlots(facultyId) {
  const res = await apiFetch(`${API_URL}/faculty/${facultyId}/occupied-slots`, {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to load occupied slots.");
  }

  return result;
}

export async function cancelBooking(bookingId) {
  const res = await apiFetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to cancel booking.");
  }

  return result;
}

export async function getCurrentUser() {
  const res = await apiFetch(`${API_URL}/me`, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const result = await res.json();
  if (!res.ok) {
    const error = new Error(
      result.message || "Unable to restore your session.",
    );
    error.status = res.status;
    throw error;
  }
  return result;
}
export async function saveProfile(data) {
  const res = await apiFetch(`${API_URL}/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok)
    throw new Error(result.message || "Unable to save your profile.");
  return result;
}
