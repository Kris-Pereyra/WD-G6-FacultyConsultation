import { useState, useEffect, useRef } from "react";
import facultyBanner from "./assets/faculty-banner.jpg";
import "./FacultyDashboard.css";
import ProfileAvatar from "./ProfileAvatar";
import ProfilePhotoEditor from "./ProfilePhotoEditor";
import { DashboardHeader, DashboardSidebar } from "./DashboardShell";
import { saveFacultyAvailability, updateBookingStatus, saveProfile } from "./api";

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
    close: "M6 6l12 12M6 18 18 6",
    mail: "M3 5h18v14H3zM3 5l9 7 9-7",
    location: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    edit: "m15 4 5 5M4 20l5-1L21 7l-5-5L4 14z",
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

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function clockLabel(value) {
  if (!/^\d{2}:\d{2}$/.test(value || "")) return "Choose a time";
  const [hours, minutes] = value.split(":").map(Number);
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}

function RequestDetailsDialog({ booking, room, busy, loading, notice, onClose, onComplete }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  return (
    <dialog ref={dialogRef} className="fd-request-dialog"
      aria-labelledby="fd-request-title" aria-describedby="fd-request-description"
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || busy) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
      }}>
      <div className="fd-dialog-card">
        <header className="fd-dialog-header">
          <div>
            <span className="fd-section-eyebrow">CONSULTATION REQUEST</span>
            <h2 id="fd-request-title">Request Details</h2>
            <p id="fd-request-description">Review the selected student's consultation.</p>
          </div>
          <button type="button" className="fd-dialog-close" aria-label="Close request details"
            disabled={busy} onClick={onClose} autoFocus><Icon name="close" /></button>
        </header>
        <div className="fd-dialog-body">
          <div className="fd-request-person">
            <ProfileAvatar className="fd-person-avatar" name={booking.student_name} photo={booking.student_photo} />
            <div><h3>{booking.student_name || "Student"}</h3><p>{booking.student_email || "Email not provided"}</p></div>
            <span className={`fd-badge fd-status-${statusOf(booking).toLowerCase().replace(/[^a-z]/g, "")}`}>{statusOf(booking)}</span>
          </div>
          <dl className="fd-dialog-grid">
            {[
              ["Student ID", booking.student_id], ["Faculty", booking.faculty_name],
              ["Date", formatDate(dateKey(booking))], ["Time", timeLabel(booking)],
              ["Location", booking.location || booking.room || room],
            ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>)}
            <div className="fd-detail-topic"><dt>Consultation purpose</dt><dd>{booking.subject || "Not provided"}</dd></div>
          </dl>
          {notice && <p className="fd-feedback is-error" role="alert">{notice}</p>}
        </div>
        <footer className="fd-dialog-footer">
          <span className="fd-dialog-timezone"><Icon name="clock" /> All times are in Manila</span>
          <div className="fd-editor-actions">
            <button type="button" className="fd-outline" disabled={busy} onClick={onClose}>Close</button>
            {isStatus(booking, "Confirmed") && <button type="button" className="fd-primary"
              disabled={busy || loading || booking.id == null} onClick={() => onComplete(booking.id)}>
              {busy ? "Saving..." : "Mark as Completed"}
            </button>}
          </div>
        </footer>
      </div>
    </dialog>
  );
}

// Parent owns API state. No fake bookings or optimistic status changes.
export default function FacultyDashboard({
  profileData = {},
  faculty = null,
  allBookings = [],
  loadAllBookings,
  onAvailabilitySaved,
  onProfileSaved,
  onPhotoSaved,
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
  useEffect(() => {
    setDetails((current) => {
      if (!current) return current;

      const updated = allBookings.find(
        (booking) => String(booking.id) === String(current.id),
      );

      return updated ? { ...current, ...updated } : null;
    });
  }, [allBookings]);
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
      if (typeof onAvailabilitySaved === "function") onAvailabilitySaved(result.faculty);
      setAvailabilityMessage(result.message);
    } catch (error) {
      setAvailabilityError(error.message || "Failed to save availability.");
    } finally {
      setSavingAvailability(false);
    }
  }
  async function handleRemoveAvailability() {
    if (savingAvailability) return;
    if (!window.confirm("Remove all consultation availability? Existing bookings will remain unchanged.")) return;
    setSavingAvailability(true);
    setAvailabilityMessage("");
    setAvailabilityError("");
    try {
      const result = await saveFacultyAvailability({ available_days: [] });
      setAvailabilityDays([]);
      if (typeof onAvailabilitySaved === "function") onAvailabilitySaved(result.faculty);
      setAvailabilityMessage(result.message);
    } catch (error) {
      setAvailabilityError(error.message || "Failed to remove availability.");
    } finally {
      setSavingAvailability(false);
    }
  }

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoPending, setPhotoPending] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  async function handleSaveProfile(event) {
    event.preventDefault();
    if (savingProfile || photoBusy) return;
    if (photoPending) {
      setProfileError("Save Photo or cancel its preview before saving your personal details.");
      return;
    }
    setSavingProfile(true);
    setProfileMessage("");
    setProfileError("");
    try {
      const result = await saveProfile(profileDraft);
      if (typeof onProfileSaved === "function") onProfileSaved(result.faculty);
      setEditingProfile(false);
      setProfileMessage(result.message);
    } catch (error) {
      setProfileError(error.message || "Unable to save your profile.");
    } finally {
      setSavingProfile(false);
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
    if (next !== "profile") {
      setEditingProfile(false);
      setPhotoPending(false);
      setProfileError("");
    }
    setPage(next);
    setFilter(status);
    setQuery("");
    setDetails(null);
  };

  async function completeConsultation(id) {
    const result = await updateBookingStatus(id, "Completed");

    setDetails((current) =>
      current && current.id === id
        ? { ...current, ...result.booking }
        : current,
    );

    if (typeof loadAllBookings === "function") {
      await loadAllBookings();
    }
  }

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
                  <button type="button" className="fd-student fd-student-trigger" aria-haspopup="dialog"
                    aria-label={`View request from ${b.student_name || "student"}`} onClick={() => { setNotice(""); setDetails(b); }}>
                    <ProfileAvatar className="fd-avatar" name={b.student_name} photo={b.student_photo} />
                    <span className="fd-student-copy">
                      <strong>{b.student_name || "Student"}</strong>
                      <small>
                        {b.program ||
                          b.student_program ||
                          b.student_id ||
                          "Student consultation"}
                      </small>
                    </span>
                  </button>
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
                      aria-haspopup="dialog"
                      aria-label={`View request from ${b.student_name || "student"}`}
                      onClick={() => { setNotice(""); setDetails(b); }}
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
      <DashboardHeader name={name} role="Faculty" photo={profile.photo || faculty?.profile_photo}
        onDashboard={() => navigate("dashboard")} onProfile={() => navigate("profile")}
        onLogout={handleLogout} logoutDisabled={busy || typeof handleLogout !== "function"}
        actions={
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
        } />
      <div className="fd-body ct-dashboard-layout">
        <DashboardSidebar label="Faculty navigation" items={NAV} activePage={page} onNavigate={navigate} />
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
                        onClick={() => { setNotice(""); setDetails(b); }}
                      >
                        <span>{timeLabel(b)}</span>
                        <span>
                          <strong>{b.subject || "Consultation"}</strong>
                          <small>{b.student_name || "Student"}</small>
                        </span>
                        <span className="fd-location">
                          {b.location ||
                            b.room ||
                            faculty?.room ||
                            "Location not set"}
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
            <section className="fd-workspace" aria-labelledby="fd-availability-title">
              <div className="fd-workspace-heading">
                <span className="fd-section-eyebrow">CONSULTATION HOURS</span>
                <h1 id="fd-availability-title">Manage Availability</h1>
                <p>Make time for your students. Set the days and hours that work for you.</p>
              </div>
              <div className="fd-availability-layout">
                <form className="fd-panel fd-editor-card" onSubmit={handleSaveAvailability}>
                  <fieldset className="fd-editor-fieldset" disabled={savingAvailability}>
                    <legend><span className="fd-step">1</span> Consultation days</legend>
                    <p className="fd-field-help">Select the days you are available each week.</p>
                    <div className="fd-day-grid">
                      {WEEKDAYS.map((day, index) => (
                        <label className={`fd-day-choice ${availabilityDays.includes(index) ? "is-selected" : ""}`} key={day}>
                          <input type="checkbox" checked={availabilityDays.includes(index)} onChange={(event) => {
                            const checked = event.target.checked;
                            setAvailabilityDays((previous) => checked
                              ? [...new Set([...previous, index])].sort((a, b) => a - b)
                              : previous.filter((value) => value !== index));
                            setAvailabilityMessage(""); setAvailabilityError("");
                          }} />
                          <span>{day}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset className="fd-editor-fieldset fd-hours-fieldset" disabled={savingAvailability}>
                    <legend><span className="fd-step">2</span> Consultation hours</legend>
                    <p className="fd-field-help">The same hours apply to each selected day. Sessions last 30 minutes.</p>
                    <div className="fd-time-grid">
                      <label className="fd-editor-field"><span>Start time</span>
                        <input type="time" required step="60" value={availabilityStart} onChange={(event) => {
                          setAvailabilityStart(event.target.value); setAvailabilityMessage(""); setAvailabilityError("");
                        }} />
                      </label>
                      <label className="fd-editor-field"><span>End time</span>
                        <input type="time" required step="60" value={availabilityEnd} onChange={(event) => {
                          setAvailabilityEnd(event.target.value); setAvailabilityMessage(""); setAvailabilityError("");
                        }} />
                      </label>
                    </div>
                    <p className="fd-timezone-note"><Icon name="clock" /> Philippine time · UTC+8</p>
                  </fieldset>
                  {availabilityError && <p className="fd-feedback is-error" role="alert">{availabilityError}</p>}
                  {availabilityMessage && <p className="fd-feedback is-success" role="status"><Icon name="check" />{availabilityMessage}</p>}
                  <div className="fd-form-footer">
                    <p>Your changes take effect after saving.</p>
                    <button type="submit" className="fd-primary" disabled={savingAvailability}>{savingAvailability ? "Saving..." : "Save Availability"}</button>
                  </div>
                </form>
                <aside className="fd-availability-aside" aria-label="Schedule preview">
                  <section className="fd-panel fd-preview-card">
                    <div className="fd-preview-heading"><span className="fd-stat-icon"><Icon name="calendar" /></span><h2>Schedule preview</h2></div>
                    <p className="fd-field-help">A preview of your selected days and hours.</p>
                    <div className="fd-preview-hours"><small>CONSULTATION HOURS</small><strong>{clockLabel(availabilityStart)} – {clockLabel(availabilityEnd)}</strong><span>30-minute consultations · Manila time</span></div>
                    <div className="fd-preview-days">
                      {WEEKDAYS.filter((_, index) => availabilityDays.includes(index)).map((day) => <span key={day}>{day}</span>)}
                      {!availabilityDays.length && <p>No days selected. Choose days to build your schedule.</p>}
                    </div>
                    <div className={`fd-schedule-state ${faculty?.available_days?.length ? "is-active" : "is-paused"}`}>
                      <span aria-hidden="true" />{faculty?.available_days?.length ? "Currently accepting new bookings" : "New bookings are paused"}
                    </div>
                  </section>
                  <section className="fd-panel fd-pause-card">
                    <h2>Taking a break?</h2>
                    <p>Remove your availability to stop new bookings. Existing bookings will stay in your schedule.</p>
                    <button type="button" className="fd-outline" disabled={savingAvailability || !faculty?.available_days?.length} onClick={handleRemoveAvailability}>Remove availability</button>
                    <small>You can select days and save again when you are ready.</small>
                  </section>
                </aside>
              </div>
            </section>
          )}
          {page === "profile" && (
            <section className="fd-workspace" aria-labelledby="fd-profile-title">
              <div className="fd-workspace-heading">
                <span className="fd-section-eyebrow">FACULTY ACCOUNT</span>
                <h1 id="fd-profile-title">My Profile</h1>
                <p>Keep your information up to date so students know where to find you.</p>
              </div>
              <div className="fd-profile-layout">
                <aside className="fd-panel fd-profile-summary">
                  <ProfileAvatar className="fd-profile-initials" name={name} photo={profile.photo || faculty?.profile_photo} />
                  <span className="fd-role-label">Faculty account</span>
                  <h2>{name}</h2>
                  <p>{profile.department || faculty?.department || "Department not provided"}</p>
                  <div className="fd-profile-contact"><Icon name="mail" /><span>{profile.email || faculty?.email || "Email not provided"}</span></div>
                  <div className="fd-profile-contact"><Icon name="location" /><span>{faculty?.room || "Consultation room not set"}</span></div>
                  <div className="fd-profile-reminder"><Icon name="user" /><p>Students see your name, department and consultation room when booking.</p></div>
                </aside>
                <section className="fd-panel fd-editor-card fd-profile-card">
                  <div className="fd-card-heading">
                    <div><h2>Personal information</h2><p>Your faculty and consultation details.</p></div>
                    {!editingProfile && <button type="button" className="fd-outline" disabled={photoBusy} onClick={() => {
                      setProfileDraft({ fullName: name, department: faculty?.department || "", room: faculty?.room || "" });
                      setPhotoPending(false);
                      setProfileMessage(""); setProfileError(""); setEditingProfile(true);
                    }}><Icon name="edit" />Edit Profile</button>}
                  </div>
                  {profileMessage && <p className="fd-feedback is-success" role="status"><Icon name="check" />{profileMessage}</p>}
                  {profileError && <p className="fd-feedback is-error" role="alert">{profileError}</p>}
                  {editingProfile ? (
                    <form onSubmit={handleSaveProfile}>
                      <div className="ct-photo-panel is-inline" aria-label="Edit profile photo">
                        <ProfilePhotoEditor name={name} photo={profile.photo || faculty?.profile_photo}
                          disabled={savingProfile} onBusyChange={setPhotoBusy} onDraftChange={(pending) => { setPhotoPending(pending); setProfileError(""); }}
                          onSaved={(photo) => onPhotoSaved?.(photo)} />
                      </div>
                      <fieldset className="fd-editor-fieldset" disabled={savingProfile || photoBusy}>
                        <legend className="fd-sr">Edit faculty profile</legend>
                        <div className="fd-profile-fields">
                          <label className="fd-editor-field fd-field-wide"><span>Full name</span>
                            <input type="text" required minLength={2} maxLength={150} autoComplete="name" value={profileDraft.fullName || ""} onChange={(event) => setProfileDraft((draft) => ({ ...draft, fullName: event.target.value }))} />
                          </label>
                          <label className="fd-editor-field fd-field-wide"><span>Email address</span>
                            <input type="email" readOnly value={profile.email || faculty?.email || ""} aria-describedby="fd-email-help" />
                            <small id="fd-email-help">Your login email is managed by your administrator.</small>
                          </label>
                          {[["department", "Department"], ["room", "Consultation room"]].map(([key, label]) => (
                            <label className="fd-editor-field" key={key}><span>{label}</span>
                              <input type="text" value={profileDraft[key] || ""} maxLength={150} required={key === "department"} onChange={(event) => setProfileDraft((draft) => ({ ...draft, [key]: event.target.value }))} />
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      <div className="fd-form-footer">
                        <p>Changes are saved to your faculty account.</p>
                        <div className="fd-editor-actions">
                          <button type="button" className="fd-outline" disabled={savingProfile || photoBusy} onClick={() => { setEditingProfile(false); setPhotoPending(false); setProfileDraft({}); setProfileError(""); }}>Cancel</button>
                          <button type="submit" className="fd-primary" disabled={savingProfile || photoBusy}>{savingProfile ? "Saving..." : "Save Changes"}</button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <>
                      <dl className="fd-profile-values">
                        {[["Full name", name], ["Email address", profile.email || faculty?.email], ["Department", profile.department || faculty?.department], ["Consultation room", faculty?.room]].map(([label, value]) => (
                          <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>
                        ))}
                      </dl>
                      <div className="fd-account-note"><Icon name="mail" /><p>Need to change your login email? Contact your administrator.</p></div>
                    </>
                  )}
                </section>
              </div>
            </section>
          )}
          {details && <RequestDetailsDialog booking={details} room={faculty?.room} busy={busy} loading={loading} notice={notice}
            onClose={() => setDetails(null)} onComplete={(id) => run(completeConsultation, id)} />}
          <p className="fd-footer">
            ConsultTime · Western Mindanao State University · All times in
            Manila
          </p>
        </main>
      </div>
    </div>
  );
}
