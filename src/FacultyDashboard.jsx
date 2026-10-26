import { useState } from "react";
import weblogo from "./assets/weblogo.jpg";
import wmsuLogo from "./assets/wmsuLogo.png";
import facultyBanner from "./assets/faculty-banner.jpg";
import "./FacultyDashboard.css";
import { saveFacultyAvailability } from "./api";

const NAV = [
  ["dashboard", "home", "Dashboard"],
  ["requests", "requests", "My Requests"],
  ["consultations", "calendar", "My Consultations"],
  ["availability", "clock", "Manage Availability"],
  ["profile", "user", "My Profile"],
];
function Icon({ name }) {
  const paths = {
    home: "M3 10 12 3l9 7M5 9v12h14V9M9 21v-7h6v7",
    requests: "M14 21H5V3h14v11M8 7h8M8 11h8M8 15h4M17 16v6M14 19h6",
    calendar: "M8 3v4M16 3v4M3 10h18M7 14h2M12 14h2M7 18h2M12 18h2",
    clock: "M12 7v5l3 2",
    user: "M4 21c0-8 16-8 16 0",
    check: "m7 12 3 3 7-7",
    arrow: "m9 6 6 6-6 6",
    logout: "M9 4H4v16h5M10 12h11m-4-4 4 4-4 4",
    bell: "M5 17h14l-2-4V9a5 5 0 0 0-10 0v4zM10 21h4",
  };
  return (
    <svg className="fd-icon" viewBox="0 0 24 24" aria-hidden="true">
      {["clock", "check"].includes(name) && <circle cx="12" cy="12" r="9" />}
      {name === "user" && <circle cx="12" cy="8" r="4" />}
      {name === "calendar" && (
        <rect x="3" y="5" width="18" height="16" rx="2" />
      )}
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
const dateKey = (b) =>
  String(b.date_key || b.dateKey || b.date || "").slice(0, 10);
const timeLabel = (b) => b.time_slot || b.time || "Time to be confirmed";
function startTime(b) {
  const match = timeLabel(b).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return NaN;
  const hour =
    (Number(match[1]) % 12) + (match[3].toUpperCase() === "PM" ? 12 : 0);
  return Date.parse(
    `${dateKey(b)}T${String(hour).padStart(2, "0")}:${match[2]}:00+08:00`,
  );
}
function formatDate(key) {
  const d = new Date(`${key}T12:00:00+08:00`);
  return Number.isNaN(d.getTime())
    ? "Date to be confirmed"
    : d.toLocaleDateString("en-US", {
        timeZone: "Asia/Manila",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}
const statusOf = (b) => String(b.status || "Unknown");
const isStatus = (b, status) =>
  statusOf(b).toLowerCase() === status.toLowerCase();

// Parent owns API state. No fake bookings or optimistic status changes.
export default function FacultyDashboard({
  profileData = {},
  faculty = null,
  allBookings = [],
  loadAllBookings,
  handleAccept,
  handleDecline,
  handleLogout,
  loading = false,
  error = "",
}) {
  const [page, setPage] = useState("dashboard");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [notifications, setNotifications] = useState(false);
  const [details, setDetails] = useState(null);
  const toTimeInput = (minutes) =>
    Number.isInteger(minutes)
      ? `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
          minutes % 60,
        ).padStart(2, "0")}`
      : "";

  const [availabilityDays, setAvailabilityDays] = useState(
    () => faculty?.available_days || [],
  );
  const [availabilityStart, setAvailabilityStart] = useState(() =>
    toTimeInput(faculty?.start_minutes),
  );
  const [availabilityEnd, setAvailabilityEnd] = useState(() =>
    toTimeInput(faculty?.end_minutes),
  );
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");

  async function handleSaveAvailability(event) {
    event.preventDefault();
    if (savingAvailability) return;

    setAvailabilityMessage("");
    setAvailabilityError("");

    const toMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    if (
      availabilityDays.length === 0 ||
      !availabilityStart ||
      !availabilityEnd ||
      toMinutes(availabilityEnd) - toMinutes(availabilityStart) < 30
    ) {
      setAvailabilityError(
        "Choose at least one day and hours covering at least 30 minutes.",
      );
      return;
    }

    setSavingAvailability(true);
    try {
      const result = await saveFacultyAvailability({
        available_days: availabilityDays,
        start_minutes: toMinutes(availabilityStart),
        end_minutes: toMinutes(availabilityEnd),
      });
      setAvailabilityMessage(result.message);
    } catch (error) {
      setAvailabilityError(error.message || "Failed to save availability.");
    } finally {
      setSavingAvailability(false);
    }
  }
  const profile = profileData || {};
  const name = profile.fullName || faculty?.name || "Professor";
  const rows = Array.isArray(allBookings)
    ? allBookings.filter((b) => b && typeof b === "object")
    : [];
  // /bookings must be scoped to the authenticated faculty on the server.
  const pending = rows.filter((b) => isStatus(b, "Pending"));
  const upcoming = rows.filter(
    (b) => isStatus(b, "Confirmed") && startTime(b) > Date.now(),
  );
  const completed = rows.filter(
    (b) =>
      isStatus(b, "Completed") &&
      dateKey(b).slice(0, 7) === todayKey().slice(0, 7),
  );
  const schedule = rows
    .filter((b) => isStatus(b, "Confirmed") && dateKey(b) === selectedDate)
    .sort((a, b) => (startTime(a) || 0) - (startTime(b) || 0));
  const visible = rows
    .filter(
      (b) =>
        (page !== "consultations" || !isStatus(b, "Pending")) &&
        (filter === "All" || isStatus(b, filter)) &&
        [b.student_name, b.student_email, b.student_id, b.subject, b.status]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) => dateKey(b).localeCompare(dateKey(a)));
  const navigate = (next, status = "All") => {
    setPage(next);
    setFilter(status);
    setQuery("");
    setDetails(null);
  };
  async function run(action, id) {
    if (busy || typeof action !== "function") return;
    setBusy(true);
    setNotice("");
    try {
      await action(id);
    } catch (e) {
      setNotice(
        e?.message || "Unable to complete the request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  const stats = [
    [pending.length, "Pending Requests", "requests", "requests", "Pending"],
    [
      upcoming.length,
      "Upcoming Consultations",
      "calendar",
      "consultations",
      "Confirmed",
    ],
    [
      completed.length,
      "Completed This Month",
      "check",
      "consultations",
      "Completed",
    ],
    [
      faculty?.consultation_status || "Not set",
      "Consultation Status",
      "clock",
      "availability",
      "All",
    ],
  ];
  function requestTable(data) {
    return (
      <div className="fd-table-wrap">
        <table className="fd-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Requested Date &amp; Time</th>
              <th>Status</th>
              <th>
                <span className="fd-sr">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((b, index) => (
              <tr key={b.id ?? index}>
                <td>
                  <div className="fd-student">
                    <span className="fd-avatar">
                      <Icon name="user" />
                    </span>
                    <div>
                      <strong>{b.student_name || "Student"}</strong>
                      <small>
                        {b.program ||
                          b.student_program ||
                          b.student_id ||
                          "Student consultation"}
                      </small>
                    </div>
                  </div>
                </td>
                <td>{b.subject || "General consultation"}</td>
                <td>
                  {formatDate(dateKey(b))}
                  <small>{timeLabel(b)}</small>
                </td>
                <td>
                  <span
                    className={`fd-badge fd-status-${statusOf(b)
                      .toLowerCase()
                      .replace(/[^a-z]/g, "")}`}
                  >
                    {statusOf(b)}
                  </span>
                </td>
                <td>
                  <div className="fd-row-actions">
                    {isStatus(b, "Pending") && (
                      <div className="fd-decisions">
                        <button
                          type="button"
                          className="fd-primary"
                          disabled={
                            busy ||
                            loading ||
                            b.id == null ||
                            typeof handleAccept !== "function"
                          }
                          onClick={() => run(handleAccept, b.id)}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="fd-outline"
                          disabled={
                            busy ||
                            loading ||
                            b.id == null ||
                            typeof handleDecline !== "function"
                          }
                          onClick={() => run(handleDecline, b.id)}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      className="fd-icon-button"
                      aria-label={`View request from ${b.student_name || "student"}`}
                      onClick={() => setDetails(b)}
                    >
                      <Icon name="arrow" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && (
          <p className="fd-empty">
            {loading ? "Loading bookings…" : "No requests to display."}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="fd-shell">
      <header className="fd-header">
        <button
          type="button"
          className="fd-brand"
          onClick={() => navigate("dashboard")}
          aria-label="ConsultTime dashboard"
        >
          <span className="fd-logos">
            <img src={wmsuLogo} alt="WMSU" />
            <img src={weblogo} alt="ConsultTime" />
          </span>
          <span>ConsultTime</span>
        </button>
        <div className="fd-header-right">
          <div className="fd-notifications">
            <button
              type="button"
              className="fd-icon-button"
              aria-label="Pending requests notifications"
              aria-expanded={notifications}
              onClick={() => setNotifications((v) => !v)}
            >
              <Icon name="bell" />
              {pending.length > 0 && <i />}
            </button>
            {notifications && (
              <div className="fd-notification-panel">
                <strong>
                  {pending.length} pending request
                  {pending.length === 1 ? "" : "s"}
                </strong>
                <button
                  type="button"
                  className="fd-link"
                  onClick={() => {
                    navigate("requests", "Pending");
                    setNotifications(false);
                  }}
                >
                  View requests →
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="fd-user"
            onClick={() => navigate("profile")}
          >
            <span className="fd-user-avatar">
              <Icon name="user" />
            </span>
            <span>
              <strong>{name}</strong>
              <small>Faculty</small>
            </span>
            <span aria-hidden="true">⌄</span>
          </button>
        </div>
      </header>
      <div className="fd-body">
        <aside className="fd-sidebar">
          <nav aria-label="Faculty navigation">
            {NAV.map(([key, icon, label]) => (
              <button
                type="button"
                key={key}
                className={`fd-nav ${page === key ? "is-active" : ""}`}
                aria-current={page === key ? "page" : undefined}
                onClick={() => navigate(key)}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <button
            type="button"
            className="fd-nav fd-logout"
            disabled={typeof handleLogout !== "function" || busy}
            onClick={handleLogout}
          >
            <Icon name="logout" />
            <span>Log Out</span>
          </button>
          <div className="fd-wave" aria-hidden="true" />
        </aside>
        <main className="fd-main" aria-busy={loading || busy}>
          {(error || notice) && (
            <p className="fd-error" role="alert">
              {error || notice}
            </p>
          )}
          {page === "dashboard" && (
            <>
              <div
                className="fd-welcome"
                style={{ "--fd-banner": `url("${facultyBanner}")` }}
              >
                <h1>Good day, Professor!</h1>
                <p>Here’s an overview of your consultations.</p>
              </div>
              <div className="fd-stats">
                {stats.map(([value, label, icon, target, status]) => (
                  <button
                    type="button"
                    className="fd-stat"
                    key={label}
                    onClick={() => navigate(target, status)}
                  >
                    <span className="fd-stat-icon">
                      <Icon name={icon} />
                    </span>
                    <strong>
                      {typeof value === "number"
                        ? String(value).padStart(2, "0")
                        : value}
                    </strong>
                    <span>{label}</span>
                    <span className="fd-stat-arrow">
                      <Icon name="arrow" />
                    </span>
                  </button>
                ))}
              </div>
              <div className="fd-columns">
                <div className="fd-panel">
                  <div className="fd-panel-heading">
                    <h2>Recent Requests</h2>
                    <button
                      type="button"
                      className="fd-link"
                      onClick={() => navigate("requests")}
                    >
                      View all <Icon name="arrow" />
                    </button>
                  </div>
                  {requestTable(
                    [...rows]
                      .sort((a, b) => dateKey(b).localeCompare(dateKey(a)))
                      .slice(0, 5),
                  )}
                </div>
                <div className="fd-right">
                  <div className="fd-panel">
                    <div className="fd-panel-heading">
                      <h2>
                        {selectedDate === todayKey()
                          ? "Today’s Schedule"
                          : "Consultation Schedule"}
                      </h2>
                      <label className="fd-date">
                        <span className="fd-sr">Schedule date</span>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </label>
                    </div>
                    {schedule.map((b, i) => (
                      <button
                        type="button"
                        className="fd-schedule-row"
                        key={b.id ?? i}
                        onClick={() => setDetails(b)}
                      >
                        <span>{timeLabel(b)}</span>
                        <span>
                          <strong>{b.subject || "Consultation"}</strong>
                          <small>{b.student_name || "Student"}</small>
                        </span>
                        <span className="fd-location">
                          {b.location || "Location not set"}
                        </span>
                      </button>
                    ))}
                    {!schedule.length && (
                      <p className="fd-empty">
                        {loading
                          ? "Loading schedule…"
                          : "No confirmed consultations for this date."}
                      </p>
                    )}
                  </div>
                  <div className="fd-panel">
                    <div className="fd-panel-heading">
                      <h2>Quick Actions</h2>
                    </div>
                    <div className="fd-quick-grid">
                      {[
                        [
                          "availability",
                          "calendar",
                          "Set Availability",
                          "Manage your time slots",
                        ],
                        [
                          "requests",
                          "requests",
                          "View Requests",
                          "Check pending requests",
                        ],
                        [
                          "consultations",
                          "calendar",
                          "My Consultations",
                          "See your appointments",
                        ],
                        [
                          "profile",
                          "user",
                          "View Profile",
                          "See your information",
                        ],
                      ].map(([target, icon, title, text]) => (
                        <button
                          type="button"
                          className="fd-quick"
                          key={title}
                          onClick={() => navigate(target)}
                        >
                          <span className="fd-avatar">
                            <Icon name={icon} />
                          </span>
                          <span>
                            <strong>{title}</strong>
                            <small>{text}</small>
                          </span>
                          <Icon name="arrow" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {["requests", "consultations"].includes(page) && (
            <div className="fd-panel">
              <div className="fd-panel-heading">
                <div>
                  <h1>
                    {page === "requests" ? "My Requests" : "My Consultations"}
                  </h1>
                  <p>Review your student consultation bookings.</p>
                </div>
                <button
                  type="button"
                  className="fd-outline"
                  disabled={
                    busy || loading || typeof loadAllBookings !== "function"
                  }
                  onClick={() => run(loadAllBookings)}
                >
                  Refresh
                </button>
              </div>
              <div className="fd-filters">
                <label>
                  Search requests
                  <input
                    type="search"
                    placeholder="Student, subject or ID"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <label>
                  Status
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {[
                      "All",
                      ...(page === "requests" ? ["Pending"] : []),
                      "Confirmed",
                      "Completed",
                      "Declined",
                      "Cancelled",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              {requestTable(visible)}
            </div>
          )}
          {page === "availability" && (
            <div className="fd-panel fd-info">
              <h1>Manage Availability</h1>
              <p>
                Choose your weekly consultation days and hours. All times are in
                Philippine time.
              </p>

              <form onSubmit={handleSaveAvailability}>
                <fieldset disabled={savingAvailability}>
                  <legend>Consultation days</legend>

                  {[
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ].map((day, index) => (
                    <label
                      key={day}
                      style={{ display: "block", marginBottom: "8px" }}
                    >
                      <input
                        type="checkbox"
                        checked={availabilityDays.includes(index)}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          setAvailabilityDays((previous) =>
                            checked
                              ? [...new Set([...previous, index])].sort(
                                  (a, b) => a - b,
                                )
                              : previous.filter((value) => value !== index),
                          );
                          setAvailabilityMessage("");
                          setAvailabilityError("");
                        }}
                      />{" "}
                      {day}
                    </label>
                  ))}
                </fieldset>

                <fieldset
                  disabled={savingAvailability}
                  style={{ marginTop: "16px" }}
                >
                  <legend>Consultation hours</legend>
                  <p>The same hours apply to each selected day.</p>

                  <label style={{ display: "block", marginBottom: "12px" }}>
                    Start time{" "}
                    <input
                      type="time"
                      required
                      step="60"
                      value={availabilityStart}
                      onChange={(event) => {
                        setAvailabilityStart(event.target.value);
                        setAvailabilityMessage("");
                        setAvailabilityError("");
                      }}
                    />
                  </label>

                  <label style={{ display: "block", marginBottom: "12px" }}>
                    End time{" "}
                    <input
                      type="time"
                      required
                      step="60"
                      value={availabilityEnd}
                      onChange={(event) => {
                        setAvailabilityEnd(event.target.value);
                        setAvailabilityMessage("");
                        setAvailabilityError("");
                      }}
                    />
                  </label>
                </fieldset>

                {availabilityError && <p role="alert">{availabilityError}</p>}
                {availabilityMessage && (
                  <p role="status">{availabilityMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={savingAvailability}
                  style={{ marginTop: "16px" }}
                >
                  {savingAvailability ? "Saving..." : "Save Availability"}
                </button>
              </form>
            </div>
          )}
          {page === "profile" && (
            <div className="fd-panel fd-info">
              <span className="fd-stat-icon">
                <Icon name="user" />
              </span>
              <h1>My Profile</h1>
              <dl>
                <dt>Full name</dt>
                <dd>{name}</dd>
                <dt>Email</dt>
                <dd>{profile.email || faculty?.email || "Not provided"}</dd>
                <dt>Department</dt>
                <dd>
                  {profile.department || faculty?.department || "Not provided"}
                </dd>
                <dt>Role</dt>
                <dd>Faculty</dd>
              </dl>
              <div className="fd-note">
                Profile editing is not connected to a save endpoint yet.
              </div>
            </div>
          )}
          {details && (
            <div
              className="fd-panel fd-details"
              role="region"
              aria-label="Request details"
            >
              <div className="fd-panel-heading">
                <h2>Request Details</h2>
                <button
                  type="button"
                  className="fd-outline"
                  onClick={() => setDetails(null)}
                >
                  Close
                </button>
              </div>
              <dl>
                {[
                  ["Student", details.student_name],
                  ["Student ID", details.student_id],
                  ["Email", details.student_email],
                  ["Faculty", details.faculty_name],
                  ["Subject", details.subject],
                  ["Date", formatDate(dateKey(details))],
                  ["Time", timeLabel(details)],
                  ["Location", details.location],
                  ["Status", statusOf(details)],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value || "Not provided"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <p className="fd-footer">
            ConsultTime · Western Mindanao State University · All times in
            Manila
          </p>
        </main>
      </div>
    </div>
  );
}
