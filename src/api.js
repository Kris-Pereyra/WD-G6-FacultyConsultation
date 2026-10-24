const API_URL = 'http://localhost:5000/api';

export async function getFaculty() {
  const res = await fetch(`${API_URL}/faculty`);
  if (!res.ok) throw new Error('Failed to fetch faculty');
  return res.json();
}

export async function signup(data) {
  const res = await fetch(`${API_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Signup failed');
  return result;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Login failed');
  return result;
}

export async function createBooking(data) {
  const res = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Booking failed');
  return result;
}

export async function getStudentBookings(studentId) {
  const res = await fetch(`${API_URL}/bookings/student/${studentId}`);
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return res.json();
}

export async function updateBookingStatus(bookingId, status) {
  const res = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Failed to update status');
  return result;
}

export async function getAllBookings() {
  const res = await fetch(`${API_URL}/bookings`);
  if (!res.ok) throw new Error('Failed to fetch all bookings');
  return res.json();
}

