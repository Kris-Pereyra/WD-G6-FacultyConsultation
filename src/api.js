const API_URL = "https://wd-g6-facultyconsultation.onrender.com/api";
// Session-only token; logout/reload clears it.
let authToken = null;
export function clearAuthToken() {
  authToken = null;
}
function authHeaders() {
  return authToken ? { Authorization: "Bearer " + authToken } : {};
}

export async function getFaculty() {
  const res = await fetch(`${API_URL}/faculty`);
  if (!res.ok) throw new Error("Failed to fetch faculty");
  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Signup failed");
  authToken = result.token;
  return result;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ email, password }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Login failed");
  authToken = result.token;
  return result;
}

export async function createBooking(data) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Booking failed");
  return result;
}

export async function getStudentBookings(studentId) {
  const res = await fetch(`${API_URL}/bookings/student/${studentId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function updateBookingStatus(bookingId, status) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");
  return result;
}

export async function getAllBookings() {
  const res = await fetch(`${API_URL}/bookings`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch all bookings");
  return res.json();
}

export async function saveFacultyAvailability(data) {
  const res = await fetch(`${API_URL}/faculty/availability`, {
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
  const res = await fetch(`${API_URL}/faculty/${facultyId}/occupied-slots`, {
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to load occupied slots.");
  }

  return result;
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: authHeaders(),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Failed to cancel booking.");
  }

  return result;
}
