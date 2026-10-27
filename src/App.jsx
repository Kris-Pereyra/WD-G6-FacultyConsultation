import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  getFaculty,
  getFacultyOccupiedSlots,
  signup,
  login,
  createBooking,
  getStudentBookings,
  getAllBookings,
  updateBookingStatus,
  clearAuthToken,
  cancelBooking,
  getAuthToken,
  getCurrentUser,
  saveProfile,
} from "./api";
import FacultyDashboard from "./FacultyDashboard";
import "./App.css";
import "./LandingPage.css";
import "./Consistency.css";
/*import BackendTest from './BackendTest';*/

import weblogo from "./assets/weblogo.jpg";
import wmsuLogo from "./assets/wmsuLogo.png";
import calendar from "./assets/calendar.jpg";
import pic1 from "./assets/pic1.jpg";

function ConsultBrand() {
  return (
    <span className="consult-brand">
      <span className="consult-brand-images">
        <img src={wmsuLogo} alt="WMSU Logo" />
        <img src={weblogo} alt="ConsultTime Logo" />
      </span>
      <span className="consult-brand-name">ConsultTime</span>
    </span>
  );
}

/* SIMPLE ICONS */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-7h6v7" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" />
      <path d="M15 14c3 0 5 2 5 5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="chevron-icon">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

function Svg({ children, className = "icon" }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      {children}
    </svg>
  );
}

function LoginUsersIcon() {
  return (
    <Svg>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}

function LoginCalendarIcon() {
  return (
    <Svg>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </Svg>
  );
}

function LoginClipboardIcon() {
  return (
    <Svg>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </Svg>
  );
}

function UserOutlineIcon() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </Svg>
  );
}

function GraduationCapIcon() {
  return (
    <Svg>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg>
      <circle cx="12" cy="16" r="1" />
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </Svg>
  );
}

function ChevronDownIcon({ className = "icon select-chevron" }) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a17.7 17.7 0 0 1 4.1-5" />
      <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-2.2 3.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

// Demo schedules only. Replace with facultyList-published availability from Express.
/*const facultyList = [
  { id: 'novie', name: 'Prof. Novie Jozane', department: 'Computer Science', subject: 'Programming and software development', room: 'Faculty Room 204', initials: 'NJ', style: 'avatar-one', days: [1,3], start: 14*60, end: 16*60 },
  { id: 'kris', name: 'Prof. Kris', department: 'Information Technology', subject: 'Networking and information systems', room: 'Faculty Room 101', initials: 'KR', style: 'avatar-two', days: [2,4], start: 9*60, end: 11*60 },
  { id: 'ian', name: 'Prof. Ian Lim', department: 'Mathematics', subject: 'Mathematics and statistics', room: 'Faculty Room 305', initials: 'IL', style: 'avatar-three', days: [1,5], start: 13*60, end: 15*60 },
  { id: 'ellice', name: 'Prof. Ellice Vicente', department: 'Engineering', subject: 'Engineering fundamentals', room: 'Engineering Building 2B', initials: 'EV', style: 'avatar-four', days: [3,5], start: 10*60, end: 12*60 }
]*/

const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Declined",
  "Cancelled",
  "Completed",
];
const isActive = (booking) => ["Pending", "Confirmed"].includes(booking.status);
const formatMinutes = (minutes) => {
  const hour = Math.floor(minutes / 60);
  return (
    (hour % 12 || 12) +
    ":" +
    String(minutes % 60).padStart(2, "0") +
    (hour < 12 ? " AM" : " PM")
  );
};
function manilaToday() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
function slotStart(dateKey, time) {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)/);
  if (!match) return NaN;
  const hour = (Number(match[1]) % 12) + (match[3] === "PM" ? 12 : 0);
  return Date.parse(
    dateKey +
      "T" +
      String(hour).padStart(2, "0") +
      ":" +
      match[2] +
      ":00+08:00",
  );
}

function bookingStart(booking) {
  const date = String(booking.date_key || booking.dateKey || "").slice(0, 10);

  return slotStart(date, booking.time_slot || booking.time || "");
}

function getTimeSlots(facultyList, dateKey) {
  if (!facultyList || !dateKey) return [];
  const days = facultyList.available_days || facultyList.days || [];
  const start = facultyList.start_minutes ?? facultyList.start;
  const end = facultyList.end_minutes ?? facultyList.end;

  if (!days.includes(new Date(dateKey + "T12:00:00Z").getUTCDay())) return [];

  const slots = [];
  for (let minute = start; minute + 30 <= end; minute += 30) {
    const time = formatMinutes(minute) + " - " + formatMinutes(minute + 30);
    if (slotStart(dateKey, time) > Date.now()) slots.push(time);
  }
  return slots;
}

function getFacultyDates(facultyList, count = 10) {
  if (!facultyList) return [];
  const dates = [];
  const day = new Date(manilaToday() + "T12:00:00Z");
  for (let offset = 0; offset < 60 && dates.length < count; offset++) {
    const key = day.toISOString().slice(0, 10);
    if (getTimeSlots(facultyList, key).length) {
      dates.push({
        key,
        label: day.toLocaleDateString("en-US", {
          timeZone: "UTC",
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
        fullDate: day.toLocaleDateString("en-US", {
          timeZone: "UTC",
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
    day.setUTCDate(day.getUTCDate() + 1);
  }
  return dates;
}

function facultyHours(facultyList) {
  if (!facultyList) return "";
  const days = facultyList.available_days || facultyList.days || [];
  const start = facultyList.start_minutes ?? facultyList.start;
  const end = facultyList.end_minutes ?? facultyList.end;
  return (
    days
      .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d])
      .join(", ") +
    " · " +
    formatMinutes(start) +
    " – " +
    formatMinutes(end) +
    " (Manila)"
  );
}

function hasConflict(bookings, dateKey, time) {
  const start = slotStart(dateKey, time);
  return bookings.some(
    (b) => isActive(b) && Math.abs(bookingStart(b) - start) < 30 * 60 * 1000,
  );
}

function getNameFromEmail(email) {
  const username = email.split("@")[0].split("+")[0];
  const name = username
    .replace(/[._-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

  return name || "Student";
}

function formatBookingDate(value) {
  if (!value) return "Date to be confirmed";
  const key = String(value).slice(0, 10);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(key)
    ? new Date(key + "T12:00:00+08:00")
    : new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-US", {
        timeZone: "Asia/Manila",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
}
function accountProfile(result) {
  if (result.role === "faculty") {
    const f = result.faculty;
    return { fullName: f.name || "", email: f.email || "", department: f.department || "", room: f.room || "" };
  }
  const student = result.student;
  return {
    fullName: student.full_name || "", studentId: student.student_id || "",
    email: student.email || "", phone: student.phone || "", course: student.program || "",
    yearLevel: student.year_level || "", section: student.section || "",
    department: "College of Computing Studies",
  };
}
/* APP*/

function App() {
  const [allBookings, setAllBookings] = useState([]);
  const [isFacultyView, setIsFacultyView] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [activeDashboardPage, setActiveDashboardPage] = useState("dashboard");
  const [facultySearch, setfacultySearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [bookingFilter, setBookingFilter] = useState("All Bookings");
  const [bookingSearch, setBookingSearch] = useState("");
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileDraft, setProfileDraft] = useState({});
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [selectedfacultyForBooking, setselectedfacultyForBooking] =
    useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);
  const [occupiedSlotsLoading, setOccupiedSlotsLoading] = useState(true);
  const [occupiedSlotsError, setOccupiedSlotsError] = useState("");

  useEffect(() => {
    if (!selectedfacultyForBooking) return;

    let cancelled = false;
    setOccupiedSlots([]);
    setOccupiedSlotsLoading(true);
    setOccupiedSlotsError("");

    getFacultyOccupiedSlots(selectedfacultyForBooking.id)
      .then((slots) => {
        if (!cancelled) setOccupiedSlots(slots);
      })
      .catch((error) => {
        if (!cancelled) {
          setOccupiedSlotsError(
            error.message || "Failed to load occupied slots.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setOccupiedSlotsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedfacultyForBooking]);
  const availabilityRef = useRef(null);
  useEffect(() => {
    if (!selectedfacultyForBooking) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = availabilityRef.current;
    dialog?.querySelector("button")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setselectedfacultyForBooking(null);
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        dialog?.querySelectorAll(
          'button:not(:disabled), textarea, input, select, [tabindex="0"]',
        ) || [],
      );
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [selectedfacultyForBooking]);
  const [selectedBookingDate, setSelectedBookingDate] = useState("");
  const [selectedBookingTime, setSelectedBookingTime] = useState("");
  const [bookingSubject, setBookingSubject] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const emptySignup = {
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    studentId: "",
    email: "",
    phone: "",
    program: "",
    yearLevel: "",
    password: "",
    confirmPassword: "",
    agree: false,
  };
  const [signupForm, setSignupForm] = useState(emptySignup);
  const [signupErrors, setSignupErrors] = useState({});
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [legalDoc, setLegalDoc] = useState(null); // "terms" | "privacy" | null
  useEffect(() => {
    if (!legalDoc) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") setLegalDoc(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [legalDoc]);
  const [profileData, setProfileData] = useState({
    fullName: "", studentId: "", email: "", phone: "", course: "",
    yearLevel: "", section: "", department: "",
  });
  // Bookings are loaded from the API after authentication.
  const [bookings, setBookings] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [bookingNotice, setBookingNotice] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [token, setToken] = useState(getAuthToken);
  const [restoringSession, setRestoringSession] = useState(() => Boolean(getAuthToken()));
  const [restoreError, setRestoreError] = useState("");
  const [restoreAttempt, setRestoreAttempt] = useState(0);

  function applyAccount(result) {
    setCurrentRole(result.role);
    setCurrentFaculty(result.role === "faculty" ? result.faculty : null);
    setCurrentStudent(result.role === "student" ? result.student : null);
    setIsFacultyView(result.role === "faculty");
    setProfileData(accountProfile(result));
  }

  useEffect(() => {
    function expireSession() {
      setToken(null);
      setCurrentRole(null);
      setCurrentStudent(null);
      setCurrentFaculty(null);
      setBookings([]);
      setAllBookings([]);
      setProfileData({});
      setIsProfileEditing(false);
      setselectedfacultyForBooking(null);
      setIsFacultyView(false);
      setRestoringSession(false);
      setCurrentPage("login");
      setLoginError("Your session has expired. Please log in again.");
    }
    window.addEventListener("consulttime:session-expired", expireSession);
    return () => window.removeEventListener("consulttime:session-expired", expireSession);
  }, []);

  useEffect(() => {
    if (!getAuthToken()) return;
    let cancelled = false;
    getCurrentUser().then((result) => {
      if (cancelled) return;
      applyAccount(result);
      setToken(getAuthToken());
      setCurrentPage("dashboard");
      setRestoringSession(false);
    }).catch((error) => {
      if (cancelled) return;
      if (error.status === 401) {
        clearAuthToken();
        setToken(null);
        setCurrentPage("login");
        setLoginError("Your session has expired. Please log in again.");
        setRestoringSession(false);
      } else {
        // A temporary outage must not discard a valid stored session.
        setRestoreError(error.message || "Unable to reconnect. Please try again.");
      }
    });
    return () => { cancelled = true; };
  }, [restoreAttempt]);

  async function handleSaveStudentProfile() {
    if (profileSaving) return;
    setProfileSaving(true);
    setProfileSaved(false);
    setProfileError("");
    try {
      const result = await saveProfile(profileDraft);
      applyAccount(result);
      setIsProfileEditing(false);
      setProfileSaved(true);
    } catch (error) {
      setProfileError(error.message || "Unable to save your profile.");
    } finally {
      setProfileSaving(false);
    }
  }

  useEffect(() => {
    if (!token || currentPage !== "dashboard") return;
    if (currentRole !== "student" && currentRole !== "faculty") return;
    if (currentRole === "student" && !currentStudent?.id) return;

    let stopped = false;
    let loading = false;

    async function refreshBookings() {
      if (stopped || loading || document.hidden) return;

      loading = true;

      try {
        const data =
          currentRole === "faculty"
            ? await getAllBookings()
            : await getStudentBookings(currentStudent.id);

        if (stopped) return;

        if (currentRole === "faculty") {
          setAllBookings(data);
        } else {
          setBookings(data);
        }
      } catch (error) {
        if (!stopped) {
          console.error("Booking refresh failed:", error.message);
        }
      } finally {
        loading = false;
      }
    }

    refreshBookings();

    const timer = window.setInterval(refreshBookings, 10000);
    window.addEventListener("focus", refreshBookings);
    document.addEventListener("visibilitychange", refreshBookings);

    return () => {
      stopped = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", refreshBookings);
      document.removeEventListener("visibilitychange", refreshBookings);
    };
  }, [token, currentPage, currentRole, currentStudent?.id]);
  useEffect(() => {
    getFaculty()
      .then((data) => setFacultyList(data))
      .catch((err) => console.error("Failed to load faculty:", err));
  }, []);

  async function loadAllBookings() {
    try {
      const data = await getAllBookings();
      setAllBookings(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAccept(bookingId) {
    try {
      await updateBookingStatus(bookingId, "Confirmed");
      await loadAllBookings();
      alert("Booking Accepted!");
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDecline(bookingId) {
    try {
      await updateBookingStatus(bookingId, "Declined");
      await loadAllBookings();
      alert("Booking Declined!");
    } catch (err) {
      alert(err.message);
    }
  }

  console.log("App is running, currentPage =", currentPage);

  const availableBookingDates = getFacultyDates(selectedfacultyForBooking);
  const upcomingBookings = bookings
    .filter(
      (booking) =>
        booking.status === "Confirmed" && bookingStart(booking) > Date.now(),
    )
    .sort((a, b) => bookingStart(a) - bookingStart(b));
  const nextBooking = upcomingBookings[0];
  const visibleBookings = bookings.filter((booking) => {
    const query = bookingSearch.trim().toLowerCase();
    return (
      (bookingFilter === "All Bookings" || booking.status === bookingFilter) &&
      (!query ||
        [
          booking.faculty_name,
          booking.faculty,
          booking.subject,
          booking.department,
          booking.status,
          booking.date_key,
          booking.time_slot,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query))
    );
  });
  const pendingCount = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;
  const availablefacultyListCount = facultyList.filter((f) =>
    getFacultyDates(f).some((date) =>
      getTimeSlots(f, date.key).some(
        (time) => !hasConflict(bookings, date.key, time),
      ),
    ),
  ).length;

  /* NAVIGATION*/

  function handleLogin() {
    setCurrentPage("login");
    window.scrollTo(0, 0);
  }

  function handleSignup() {
    setSignupErrors({});
    setCurrentPage("signup");
    window.scrollTo(0, 0);
  }

  function updateSignup(field, value) {
    setSignupForm((current) => ({ ...current, [field]: value }));
    setSignupErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();

    const f = signupForm;
    const email = f.email.trim().toLowerCase();
    const errors = {};

    const namePattern = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ .'-]*$/;
    const firstName = f.firstName.trim();
    const middleName = f.middleName.trim();
    const lastName = f.lastName.trim();
    const suffix = f.suffix.trim();

    if (!firstName) errors.firstName = "Enter your first name.";
    else if (!namePattern.test(firstName))
      errors.firstName = "Use letters only for your first name.";
    if (middleName && !namePattern.test(middleName))
      errors.middleName = "Use letters only for your middle name.";
    if (!lastName) errors.lastName = "Enter your last name.";
    else if (!namePattern.test(lastName))
      errors.lastName = "Use letters only for your last name.";
    if (suffix && !/^[A-Za-z.]{1,6}$/.test(suffix))
      errors.suffix = "Use a short suffix such as Jr., Sr. or III.";
    if (!f.studentId.trim()) errors.studentId = "Enter your student ID.";
    if (!/^[a-z0-9._%+-]+@student\.edu\.ph$/i.test(email)) {
      errors.email = "Use your student email, such as name@student.edu.ph.";
    }
    if (!/^(09|\+639)\d{9}$/.test(f.phone.replace(/[\s-]/g, ""))) {
      errors.phone = "Enter a valid mobile number, such as 09123456789.";
    }
    if (!f.program) errors.program = "Select your program.";
    if (!f.yearLevel) errors.yearLevel = "Select your year level.";
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(f.password)) {
      errors.password =
        "Use 8+ characters with uppercase, lowercase and a number.";
    }
    if (f.confirmPassword !== f.password || !f.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!f.agree)
      errors.agree = "Please accept the Terms of Service and Privacy Policy.";

    setSignupErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      const result = await signup({
        // The backend still receives one fullName, built from the separate fields.
        fullName: [firstName, middleName, lastName, suffix]
          .filter(Boolean)
          .join(" "),
        firstName,
        middleName,
        lastName,
        suffix,
        studentId: f.studentId.trim(),
        email,
        phone: f.phone.trim(),
        program: f.program,
        yearLevel: f.yearLevel,
        password: f.password,
      });

      setCurrentRole("student");
      setIsFacultyView(false);
      setToken(result.token);
      setCurrentStudent(result.student);
      setProfileData(accountProfile(result));

      setSignupForm(emptySignup);
      handleDashboard();
    } catch (err) {
      setSignupErrors({ email: err.message || "Signup failed." });
    }
  }

  function handleHome() {
    setCurrentPage("home");
    window.scrollTo(0, 0);
  }

  function handleDashboard() {
    setCurrentPage("dashboard");
    setActiveDashboardPage("dashboard");
    window.scrollTo(0, 0);
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = loginEmail.trim().toLowerCase();
    if (
      !/^[a-z0-9._%+-]+@(student|faculty)\.edu\.ph$/i.test(email) ||
      !loginPassword
    ) {
      setLoginError(
        "Use name@student.edu.ph or name@faculty.edu.ph and enter your password.",
      );
      return;
    }
    try {
      const result = await login(email, loginPassword);
      setToken(result.token);
      setCurrentRole(result.role);
      setLoginError("");
      setIsUserMenuOpen(false);
      applyAccount(result);
      setIsProfileEditing(false);
      setProfileSaved(false);
      setProfileError("");
      setActiveDashboardPage("dashboard");
      setCurrentPage("dashboard");
      setBookings([]);
      setAllBookings([]);
      setLoginPassword("");
      window.scrollTo(0, 0);
    } catch (err) {
      clearAuthToken();
      setToken(null);
      setCurrentRole(null);
      setCurrentStudent(null);
      setIsFacultyView(false);
      setCurrentPage("login");
      setLoginError(err.message || "Login failed.");
    }
  }

  function handleLogout() {
    clearAuthToken();
    setRestoringSession(false);
    setRestoreError("");
    setProfileError("");
    setProfileDraft({});
    setProfileData({});
    setselectedfacultyForBooking(null);
    setCurrentFaculty(null);
    setCurrentRole(null);
    setAllBookings([]);
    setIsProfileEditing(false);
    setProfileSaved(false);
    setActiveDashboardPage("dashboard");
    setCurrentPage("home");
    setIsFacultyView(false);
    setBookings([]);
    setBookingNotice("");
    setLoginPassword("");
    setCurrentStudent(null);
    setToken(null);
    window.scrollTo(0, 0);
  }

  async function openFacultyAvailability(faculty) {
    setBookingError("");
    setBookingNotice("");

    try {
      const latestFaculty = await getFaculty();
      setFacultyList(latestFaculty);

      const updatedFaculty = latestFaculty.find(
        (member) => String(member.id) === String(faculty.id),
      );

      if (!updatedFaculty) {
        throw new Error("This faculty member is no longer available.");
      }

      const dates = getFacultyDates(updatedFaculty);

      setSelectedBookingDate(dates[0]?.key || "");
      setSelectedBookingTime("");
      setBookingSubject("");
      setselectedfacultyForBooking(updatedFaculty);
    } catch (error) {
      window.alert(
        error.message || "Failed to load availability. Please try again.",
      );
    }
  }

  function closeFacultyAvailability() {
    setselectedfacultyForBooking(null);
    setSelectedBookingDate("");
    setSelectedBookingTime("");
    setBookingSubject("");
  }

  async function handleCreateBooking(event) {
    event.preventDefault();
    const subject = bookingSubject.trim();

    if (occupiedSlotsLoading || occupiedSlotsError) {
      setBookingError(
        occupiedSlotsLoading
          ? "Please wait while availability is checked."
          : "Availability could not be checked. Close this window and try again.",
      );
      return;
    }

    const slotReserved = occupiedSlots.some(
      (slot) =>
        Math.abs(
          slotStart(String(slot.date_key).slice(0, 10), slot.time_slot) -
            slotStart(selectedBookingDate, selectedBookingTime),
        ) <
        30 * 60 * 1000,
    );

    if (slotReserved) {
      setBookingError(
        "This consultation slot is already reserved. Please choose another time.",
      );
      setSelectedBookingTime("");
      return;
    }
    if (
      !selectedfacultyForBooking ||
      !selectedBookingDate ||
      !selectedBookingTime
    ) {
      setBookingError("Choose a faculty member, date, and time.");
      return;
    }
    if (subject.length < 5 || subject.length > 300) {
      setBookingError(
        "Enter a consultation topic between 5 and 300 characters.",
      );
      return;
    }
    const bookingDate = getFacultyDates(selectedfacultyForBooking).find(
      (date) => date.key === selectedBookingDate,
    );
    if (
      !bookingDate ||
      !getTimeSlots(selectedfacultyForBooking, selectedBookingDate).includes(
        selectedBookingTime,
      )
    ) {
      setBookingError(
        "This time is no longer available. Please choose another slot.",
      );
      setSelectedBookingTime("");
      return;
    }
    if (hasConflict(bookings, selectedBookingDate, selectedBookingTime)) {
      setBookingError(
        "You already have a pending or confirmed consultation that overlaps this time.",
      );
      return;
    }
    try {
      await createBooking({
        studentId: currentStudent.id,
        facultyId: selectedfacultyForBooking.id,
        dateKey: selectedBookingDate,
        timeSlot: selectedBookingTime,
        subject: bookingSubject.trim(),
      });

      // Refresh the list from the database
      const updated = await getStudentBookings(currentStudent.id);
      setBookings(updated);

      setBookingNotice("Booking created successfully!");
      closeFacultyAvailability();
    } catch (err) {
      setBookingError(err.message || "Failed to create booking.");
    }
  }

  async function handleCancelBooking(id) {
    const booking = bookings.find((item) => item.id === id);

    if (!booking || !isActive(booking) || bookingStart(booking) <= Date.now()) {
      return;
    }

    if (!window.confirm("Cancel this consultation request?")) return;

    setBookingNotice("");

    try {
      const result = await cancelBooking(id);

      setBookings((current) =>
        current.map((item) =>
          item.id === id ? { ...item, ...result.booking } : item,
        ),
      );

      setBookingNotice(
        "Booking cancelled. You may request another available time.",
      );
    } catch (error) {
      setBookingNotice(error.message || "Failed to cancel booking.");
    }
  }

  function handleLearnMore() {
    const aboutSection = document.getElementById("about");

    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  }

  /*DASHBOARD NAVIGATION */

  function handleDashboardNavigation(page) {
    if (currentRole === "faculty") {
      setIsFacultyView(true);
      return;
    }
    setIsFacultyView(false);
    setActiveDashboardPage(page);
  }

  if (restoringSession) {
    return (
      <main className="consult-app" style={{ minHeight: "100vh", display: "grid", placeContent: "center", padding: 24, textAlign: "center" }}>
        <h1>ConsultTime</h1>
        {restoreError ? <>
          <p role="alert">{restoreError}</p>
          <button type="button" onClick={() => { setRestoreError(""); setRestoreAttempt((attempt) => attempt + 1); }}>Retry connection</button>
          <button type="button" onClick={handleLogout}>Sign out</button>
        </> : <p role="status">Restoring your session…</p>}
      </main>
    );
  }

  /*LOGIN PAGE */

  if (currentPage === "login") {
    return (
      <div className="login-page redesigned-login-page consult-app">
        {/* LOGIN NAVIGATION */}
        <nav>
          <div
            className="logo-container"
            onClick={handleHome}
            role="button"
            tabIndex={0}
          >
            <ConsultBrand />
          </div>

          <div className="nav-links">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              About
            </a>
          </div>

          <button className="pagebtn" type="button" onClick={handleSignup}>
            Sign Up
          </button>
        </nav>

        {/* LOGIN CONTENT */}
        <main className="redesigned-login-layout">
          <section className="login-intro-panel">
            <span className="login-audience-tag">
              For WMSU students and faculty
            </span>
            <h1>Your next step to academic support.</h1>
            <p className="login-intro-description">
              Connect with your faculty and make time for the guidance you need.
            </p>

            <img
              className="login-feature-image"
              src={pic1}
              alt="ConsultTime consultation schedule"
            />

            <div className="login-benefit-list">
              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginUsersIcon />
                </span>
                <div>
                  <strong>Connect with your faculty</strong>
                  <p>Find the right person for your questions.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginCalendarIcon />
                </span>
                <div>
                  <strong>Book a convenient time</strong>
                  <p>Choose a consultation that fits your schedule.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginClipboardIcon />
                </span>
                <div>
                  <strong>Stay on top of your bookings</strong>
                  <p>Keep your requests and upcoming sessions in one place.</p>
                </div>
              </div>
            </div>

            <div className="login-intro-footer">
              Made for the Western Mindanao State University community.
            </div>
          </section>

          {/* LOGIN CARD */}
          <form
            className="login-card redesigned-login-card"
            onSubmit={handleLoginSubmit}
          >
            <div className="login-card-header">
              <h2>Welcome back!</h2>
              <p>
                Log in to manage your consultations and connect with your
                faculty.
              </p>
            </div>

            <label className="login-form-label" htmlFor="login-email">
              University Email <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="name@student.edu.ph or name@faculty.edu.ph"
                value={loginEmail}
                onChange={(event) => {
                  setLoginEmail(event.target.value);
                  setLoginError("");
                }}
                required
              />
            </div>

            <small className="login-field-hint">
              Students: @student.edu.ph · Faculty: @faculty.edu.ph.
            </small>

            <label
              className="login-form-label password-label"
              htmlFor="login-password"
            >
              Password <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-password"
                type={showLoginPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(event) => {
                  setLoginPassword(event.target.value);
                  setLoginError("");
                }}
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={
                  showLoginPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowLoginPassword((show) => !show)}
              >
                {showLoginPassword ? <EyeIcon /> : <EyeOffIcon />}
              </button>
            </div>

            <div className="login-options redesigned-login-options">
              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button
                className="forgot-password"
                type="button"
                onClick={() => alert("Password recovery will be added later.")}
              >
                Forgot password?
              </button>
            </div>

            {loginError && (
              <p className="login-error" role="alert">
                {loginError}
              </p>
            )}

            <button
              className="main-login-btn redesigned-main-login-btn"
              type="submit"
            >
              Log In
            </button>

            <div className="register-text redesigned-register-text">
              <span>New to ConsultTime?</span>
              <button type="button" onClick={handleSignup}>
                Create a student account
              </button>
            </div>
          </form>
        </main>

        <footer className="login-page-footer">
          <span>ConsultTime · Western Mindanao State University</span>
          <span>Need help? Contact support</span>
        </footer>
      </div>
    );
  }

  /* SIGN UP PAGE */

  if (currentPage === "signup") {
    return (
      <div className="login-page redesigned-login-page signup-page consult-app">
        <nav>
          <div
            className="logo-container"
            onClick={handleHome}
            role="button"
            tabIndex={0}
          >
            <ConsultBrand />
          </div>

          <div className="nav-links">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              How it Works
            </a>
            <a
              href="#about"
              onClick={(event) => {
                event.preventDefault();
                handleHome();
              }}
            >
              About
            </a>
          </div>

          <button className="pagebtn" type="button" onClick={handleLogin}>
            Sign In
          </button>
        </nav>

        <main className="signup-layout">
          <section className="login-intro-panel">
            <span className="login-audience-tag">For WMSU students</span>
            <h1>Your next step to academic support.</h1>
            <p className="login-intro-description">
              Join ConsultTime to connect with your faculty and make time for
              the guidance you need.
            </p>

            <img
              className="login-feature-image"
              src={pic1}
              alt="ConsultTime consultation schedule"
            />

            <div className="login-benefit-list">
              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginUsersIcon />
                </span>
                <div>
                  <strong>Connect with your faculty</strong>
                  <p>Find the right person for your questions.</p>
                </div>
              </div>
              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginCalendarIcon />
                </span>
                <div>
                  <strong>Book a convenient time</strong>
                  <p>Choose a consultation that fits your schedule.</p>
                </div>
              </div>
              <div className="login-benefit-item">
                <span className="login-benefit-icon">
                  <LoginClipboardIcon />
                </span>
                <div>
                  <strong>Stay on top of your bookings</strong>
                  <p>Keep your requests and upcoming sessions in one place.</p>
                </div>
              </div>
            </div>

            <div className="login-intro-footer">
              Made for the Western Mindanao University community.
            </div>
          </section>

          <form
            className="signup-card"
            onSubmit={handleSignupSubmit}
            noValidate
          >
            <div className="signup-card-header">
              <h2>Create your student account</h2>
              <p>
                Enter your details to get started. Fields marked * are required.
              </p>
            </div>

            <h3 className="signup-section">
              <UserOutlineIcon /> Personal Information
            </h3>
            <div className="signup-grid">
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-firstName">
                  First Name <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.firstName ? " has-error" : ""}`}
                >
                  <input
                    id="su-firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="Enter your first name"
                    value={signupForm.firstName}
                    onChange={(event) =>
                      updateSignup("firstName", event.target.value)
                    }
                  />
                </div>
                {signupErrors.firstName && (
                  <p className="signup-error">{signupErrors.firstName}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-middleName">
                  Middle Name <em className="signup-optional">(optional)</em>
                </label>
                <div
                  className={`signup-input${signupErrors.middleName ? " has-error" : ""}`}
                >
                  <input
                    id="su-middleName"
                    type="text"
                    autoComplete="additional-name"
                    placeholder="Enter your middle name"
                    value={signupForm.middleName}
                    onChange={(event) =>
                      updateSignup("middleName", event.target.value)
                    }
                  />
                </div>
                {signupErrors.middleName && (
                  <p className="signup-error">{signupErrors.middleName}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-lastName">
                  Last Name <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.lastName ? " has-error" : ""}`}
                >
                  <input
                    id="su-lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Enter your last name"
                    value={signupForm.lastName}
                    onChange={(event) =>
                      updateSignup("lastName", event.target.value)
                    }
                  />
                </div>
                {signupErrors.lastName && (
                  <p className="signup-error">{signupErrors.lastName}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-suffix">
                  Suffix <em className="signup-optional">(optional)</em>
                </label>
                <div
                  className={`signup-input${signupErrors.suffix ? " has-error" : ""}`}
                >
                  <input
                    id="su-suffix"
                    type="text"
                    autoComplete="honorific-suffix"
                    placeholder="e.g., Jr., Sr., III"
                    value={signupForm.suffix}
                    onChange={(event) =>
                      updateSignup("suffix", event.target.value)
                    }
                  />
                </div>
                {signupErrors.suffix && (
                  <p className="signup-error">{signupErrors.suffix}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-studentId">
                  Student ID <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.studentId ? " has-error" : ""}`}
                >
                  <input
                    id="su-studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    value={signupForm.studentId}
                    onChange={(event) =>
                      updateSignup("studentId", event.target.value)
                    }
                  />
                </div>
                {signupErrors.studentId && (
                  <p className="signup-error">{signupErrors.studentId}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-phone">
                  Contact Number <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.phone ? " has-error" : ""}`}
                >
                  <input
                    id="su-phone"
                    type="tel"
                    placeholder="Enter your contact number"
                    value={signupForm.phone}
                    onChange={(event) =>
                      updateSignup("phone", event.target.value)
                    }
                  />
                </div>
                {signupErrors.phone && (
                  <p className="signup-error">{signupErrors.phone}</p>
                )}
              </div>
              <div className="signup-field wide">
                <label className="signup-label" htmlFor="su-email">
                  University Email <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.email ? " has-error" : ""}`}
                >
                  <input
                    id="su-email"
                    type="email"
                    placeholder="name@student.edu.ph"
                    value={signupForm.email}
                    onChange={(event) =>
                      updateSignup("email", event.target.value)
                    }
                  />
                </div>
                {signupErrors.email && (
                  <p className="signup-error">{signupErrors.email}</p>
                )}
              </div>
            </div>
            <p className="signup-hint">
              Student signup uses @student.edu.ph. Faculty accounts are
              registered by an administrator.
            </p>

            <h3 className="signup-section">
              <GraduationCapIcon /> Academic Information
            </h3>
            <div className="signup-grid">
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-program">
                  Program <span>*</span>
                </label>
                <div
                  className={`signup-input signup-select${signupErrors.program ? " has-error" : ""}`}
                >
                  <select
                    id="su-program"
                    className={signupForm.program ? "" : "is-placeholder"}
                    value={signupForm.program}
                    onChange={(event) =>
                      updateSignup("program", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select your program
                    </option>
                    <option value="Associate in Computer Technology">
                      Associate in Computer Technology
                    </option>
                    <option value="BS Computer Science">
                      BS Computer Science
                    </option>
                    <option value="BS Information Technology">
                      BS Information Technology
                    </option>
                    <option value="BS Information Systems">
                      BS Information Systems
                    </option>
                    <option value="Bachelor of Secondary Education">
                      Bachelor of Secondary Education
                    </option>
                    <option value="BS Nursing">BS Nursing</option>
                    <option value="BS Civil Engineering">
                      BS Civil Engineering
                    </option>
                    <option value="BS Business Administration">
                      BS Business Administration
                    </option>
                  </select>
                  <ChevronDownIcon />
                </div>
                {signupErrors.program && (
                  <p className="signup-error">{signupErrors.program}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-yearLevel">
                  Year Level <span>*</span>
                </label>
                <div
                  className={`signup-input signup-select${signupErrors.yearLevel ? " has-error" : ""}`}
                >
                  <select
                    id="su-yearLevel"
                    className={signupForm.yearLevel ? "" : "is-placeholder"}
                    value={signupForm.yearLevel}
                    onChange={(event) =>
                      updateSignup("yearLevel", event.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select your year level
                    </option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                  <ChevronDownIcon />
                </div>
                {signupErrors.yearLevel && (
                  <p className="signup-error">{signupErrors.yearLevel}</p>
                )}
              </div>
            </div>

            <h3 className="signup-section">
              <LockIcon /> Account Security
            </h3>
            <div className="signup-grid">
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-password">
                  Password <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.password ? " has-error" : ""}`}
                >
                  <input
                    id="su-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={signupForm.password}
                    onChange={(event) =>
                      updateSignup("password", event.target.value)
                    }
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={
                      showSignupPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowSignupPassword((v) => !v)}
                  >
                    {showSignupPassword ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {signupErrors.password && (
                  <p className="signup-error">{signupErrors.password}</p>
                )}
              </div>
              <div className="signup-field">
                <label className="signup-label" htmlFor="su-confirmPassword">
                  Confirm Password <span>*</span>
                </label>
                <div
                  className={`signup-input${signupErrors.confirmPassword ? " has-error" : ""}`}
                >
                  <input
                    id="su-confirmPassword"
                    type={showSignupConfirm ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={signupForm.confirmPassword}
                    onChange={(event) =>
                      updateSignup("confirmPassword", event.target.value)
                    }
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    aria-label={
                      showSignupConfirm ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowSignupConfirm((v) => !v)}
                  >
                    {showSignupConfirm ? <EyeIcon /> : <EyeOffIcon />}
                  </button>
                </div>
                {signupErrors.confirmPassword && (
                  <p className="signup-error">{signupErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            <p className="signup-hint after-grid">
              Use at least 8 characters, including uppercase and lowercase
              letters and a number.
            </p>

            <div className="signup-terms-wrap">
              <label className="signup-terms">
                <input
                  type="checkbox"
                  checked={signupForm.agree}
                  onChange={(event) =>
                    updateSignup("agree", event.target.checked)
                  }
                />
                <span>
                  I agree to the{" "}
                  <button
                    className="signup-link"
                    type="button"
                    onClick={() => setLegalDoc("terms")}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    className="signup-link"
                    type="button"
                    onClick={() => setLegalDoc("privacy")}
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {signupErrors.agree && (
                <p className="signup-error">{signupErrors.agree}</p>
              )}
            </div>

            <button className="signup-submit" type="submit">
              Create Account
            </button>

            <p className="signup-alt">
              Already have an account?{" "}
              <button type="button" onClick={handleLogin}>
                Sign In
              </button>
            </p>
          </form>
        </main>

        {legalDoc &&
          createPortal(
            <div
              className="legal-modal-backdrop"
              role="presentation"
              onClick={() => setLegalDoc(null)}
            >
              <div
                className="legal-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="legal-modal-title"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  className="legal-modal-close"
                  type="button"
                  aria-label="Close"
                  onClick={() => setLegalDoc(null)}
                >
                  ×
                </button>
                <h2 id="legal-modal-title">
                  {legalDoc === "terms" ? "Terms of Service" : "Privacy Policy"}
                </h2>
                <p className="legal-modal-updated">
                  Temporary text · Last updated: to be announced
                </p>
                <div className="legal-modal-body">
                  {legalDoc === "terms" ? (
                    <>
                      <h3>1. Acceptance of Terms</h3>
                      <p>
                        By creating a
                        ConsultTime account you agree to use the system only
                        for scheduling and managing academic consultations with
                        WMSU faculty.
                      </p>
                      <h3>2. Your Account</h3>
                      <p>
                        You are responsible
                        for keeping your password secure and for the accuracy of
                        the information you provide.
                      </p>
                      <h3>3. Booking Consultations</h3>
                      <p>
                        Booking requests are
                        subject to faculty approval, and students are expected
                        to cancel in advance if they can no longer attend.
                      </p>
                      <h3>4. Acceptable Use</h3>
                      <p>
                        Do not misuse the
                        system, impersonate others, or attempt to access
                        accounts that are not yours.
                      </p>
                      <h3>5. Changes</h3>
                      <p>
                        These terms may be
                        updated, and the final version will replace this
                        content.
                      </p>
                    </>
                  ) : (
                    <>
                      <h3>1. Information We Collect</h3>
                      <p>
                        ConsultTime collects
                        your name, student ID, university email, contact number,
                        program and year level to create your account.
                      </p>
                      <h3>2. How We Use Your Information</h3>
                      <p>
                        Your information is
                        used to schedule consultations, notify you about booking
                        updates and help faculty identify who they are meeting.
                      </p>
                      <h3>3. Sharing of Information</h3>
                      <p>
                        Your details are
                        shared only with the faculty member you book and
                        authorized university personnel.
                      </p>
                      <h3>4. Data Protection</h3>
                      <p>
                        Reasonable measures
                        are taken to protect your data, and passwords are never
                        stored in plain text.
                      </p>
                      <h3>5. Your Rights</h3>
                      <p>
                        You may request to
                        view, correct or delete your information. The final
                        policy will replace this content.
                      </p>
                    </>
                  )}
                </div>
                <div className="legal-modal-actions">
                  <button
                    className="legal-modal-secondary"
                    type="button"
                    onClick={() => setLegalDoc(null)}
                  >
                    Close
                  </button>
                  <button
                    className="legal-modal-primary"
                    type="button"
                    onClick={() => {
                      updateSignup("agree", true);
                      setLegalDoc(null);
                    }}
                  >
                    I Agree
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )}

        <footer className="login-page-footer">
          <span>ConsultTime · Western Mindanao State University</span>
          <span>Need help? Contact support</span>
        </footer>
      </div>
    );
  }

  /* STUDENT DASHBOARD */

  if (currentPage === "dashboard" && currentRole === "faculty") {
    const facultyRecord = facultyList.find(
      (member) => String(member.id) === String(currentFaculty?.id),
    );
    return (
      <div className="consult-app faculty-page-scope">
        <FacultyDashboard
          profileData={profileData}
          faculty={
            facultyRecord
              ? { ...facultyRecord, ...currentFaculty }
              : currentFaculty
          }
          allBookings={allBookings}
          loadAllBookings={loadAllBookings}
          onAvailabilitySaved={(updatedFaculty) => {
            setCurrentFaculty((current) =>
              current ? { ...current, ...updatedFaculty } : current,
            );

            setFacultyList((current) =>
              current.map((member) =>
                String(member.id) === String(updatedFaculty.id)
                  ? { ...member, ...updatedFaculty }
                  : member,
              ),
            );
          }}
          onProfileSaved={(updatedFaculty) => {
            setCurrentFaculty(updatedFaculty);
            setProfileData(accountProfile({ role: "faculty", faculty: updatedFaculty }));
            setFacultyList((current) => current.map((member) =>
              String(member.id) === String(updatedFaculty.id) ? { ...member, ...updatedFaculty } : member,
            ));
          }}
          handleAccept={handleAccept}
          handleDecline={handleDecline}
          handleLogout={handleLogout}
        />
      </div>
    );
  }

  if (currentPage === "dashboard") {
    return (
      <div className="dashboard-page student-dashboard-shell consult-app">
        {/*TOP HEADER */}

        <header className="dashboard-header">
          {/* LOGO */}

          <div className="dashboard-logo" onClick={handleHome}>
            <ConsultBrand />
          </div>

          {/* TOP NAVIGATION */}

          <div className="dashboard-top-nav">
            {currentRole === "faculty" ? (
              <button
                className="top-nav-btn active"
                onClick={() => {
                  setIsFacultyView(true);
                  loadAllBookings();
                }}
              >
                Faculty Dashboard
              </button>
            ) : (
              <>
                <button
                  className={
                    activeDashboardPage === "dashboard"
                      ? "top-nav-btn active"
                      : "top-nav-btn"
                  }
                  onClick={() => handleDashboardNavigation("dashboard")}
                >
                  Home
                </button>

                <button
                  className={
                    activeDashboardPage === "facultyList"
                      ? "top-nav-btn active"
                      : "top-nav-btn"
                  }
                  onClick={() => handleDashboardNavigation("facultyList")}
                >
                  Find Faculty
                </button>

                <button
                  className={
                    activeDashboardPage === "bookings"
                      ? "top-nav-btn active"
                      : "top-nav-btn"
                  }
                  onClick={() => handleDashboardNavigation("bookings")}
                >
                  My Bookings
                </button>

                <button
                  className={
                    activeDashboardPage === "profile"
                      ? "top-nav-btn active"
                      : "top-nav-btn"
                  }
                  onClick={() => handleDashboardNavigation("profile")}
                >
                  Profile
                </button>
              </>
            )}
          </div>

          {/* USER */}

          <div className="dashboard-user">
            <div className="user-avatar">
              <UserIcon />
            </div>

            <div className="user-information">
              <strong>{profileData.fullName}</strong>

              <span>{currentRole === "faculty" ? "Faculty" : "Student"}</span>
            </div>

            <button
              className="user-arrow"
              type="button"
              aria-label="Open account menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen((open) => !open)}
            >
              ▼
            </button>
          </div>

          {isUserMenuOpen && (
            <div className="dashboard-account-menu" role="menu">
              <button
                className="dashboard-logout-button"
                type="button"
                role="menuitem"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  handleLogout();
                }}
              >
                Log Out
              </button>
            </div>
          )}
        </header>

        {/* DASHBOARD BODY */}

        <div className="dashboard-body">
          {/*SIDEBAR*/}

          <aside className="dashboard-sidebar">
            {currentRole === "faculty" ? (
              <button
                className="sidebar-btn active"
                onClick={() => {
                  setIsFacultyView(true);
                  loadAllBookings();
                }}
              >
                <CalendarIcon />
                <span>Faculty Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  className={
                    activeDashboardPage === "dashboard"
                      ? "sidebar-btn active"
                      : "sidebar-btn"
                  }
                  onClick={() => handleDashboardNavigation("dashboard")}
                >
                  <HomeIcon />

                  <span>Dashboard</span>
                </button>

                <button
                  className={
                    activeDashboardPage === "facultyList"
                      ? "sidebar-btn active"
                      : "sidebar-btn"
                  }
                  onClick={() => handleDashboardNavigation("facultyList")}
                >
                  <SearchIcon />

                  <span>Find Faculty</span>
                </button>

                <button
                  className={
                    activeDashboardPage === "bookings"
                      ? "sidebar-btn active"
                      : "sidebar-btn"
                  }
                  onClick={() => handleDashboardNavigation("bookings")}
                >
                  <CalendarIcon />

                  <span>My Bookings</span>
                </button>

                <button
                  className={
                    activeDashboardPage === "profile"
                      ? "sidebar-btn active"
                      : "sidebar-btn"
                  }
                  onClick={() => handleDashboardNavigation("profile")}
                >
                  <UserIcon />

                  <span>Profile</span>
                </button>
              </>
            )}
          </aside>

          {/*MAIN DASHBOARD CONTENT*/}

          <main className="dashboard-main">
            {/*DASHBOARD HOME */}

            {!isFacultyView && activeDashboardPage === "dashboard" && (
              <>
                {/* WELCOME AREA */}

                <div className="dashboard-welcome">
                  <div className="welcome-content">
                    <p className="welcome-small">Hello,</p>

                    <h1>{profileData.fullName}!</h1>

                    <p className="welcome-description">
                      Book a consultation with your faculty members
                      <br />
                      and get the academic support you need.
                    </p>

                    {/* SEARCH */}

                    <div className="dashboard-search">
                      <div className="search-input">
                        <SearchIcon />

                        <input
                          type="text"
                          placeholder="Search faculty by name, subject, or department..."
                          value={facultySearch}
                          onChange={(event) =>
                            setfacultySearch(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              setSelectedDepartment("All Departments");
                              handleDashboardNavigation("facultyList");
                            }
                          }}
                        />
                      </div>

                      <button
                        className="dashboard-search-btn"
                        onClick={() => {
                          setSelectedDepartment("All Departments");
                          handleDashboardNavigation("facultyList");
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* DASHBOARD IMAGE */}

                  <div className="dashboard-image">
                    <img src={calendar} alt="Consultation schedule" />
                  </div>
                </div>

                {/* STAT CARDS */}

                <div className="stat-grid">
                  <div
                    className="stat-card"
                    onClick={() => handleDashboardNavigation("facultyList")}
                  >
                    <div className="stat-icon">
                      <UsersIcon />
                    </div>

                    <div className="stat-content">
                      <span>Available faculty</span>

                      <strong>{availablefacultyListCount}</strong>
                    </div>

                    <ChevronIcon />
                  </div>

                  <div
                    className="stat-card"
                    onClick={() => handleDashboardNavigation("bookings")}
                  >
                    <div className="stat-icon">
                      <CalendarIcon />
                    </div>

                    <div className="stat-content">
                      <span>Upcoming Consultations</span>

                      <strong>{upcomingBookings.length}</strong>
                    </div>

                    <ChevronIcon />
                  </div>

                  <div
                    className="stat-card"
                    onClick={() => handleDashboardNavigation("bookings")}
                  >
                    <div className="stat-icon">
                      <CalendarIcon />
                    </div>

                    <div className="stat-content">
                      <span>My Bookings</span>

                      <strong>{bookings.length}</strong>
                    </div>

                    <ChevronIcon />
                  </div>

                  <div
                    className="stat-card"
                    onClick={() => {
                      setBookingFilter("Pending");
                      handleDashboardNavigation("bookings");
                    }}
                  >
                    <div className="stat-icon">
                      <ClockIcon />
                    </div>

                    <div className="stat-content">
                      <span>Pending Requests</span>

                      <strong>{pendingCount}</strong>
                    </div>

                    <ChevronIcon />
                  </div>
                </div>

                {/* LOWER CONTENT */}

                <div className="dashboard-lower">
                  {/* FIND facultyList */}

                  <div className="faculty-section">
                    <div className="section-heading">
                      <h2>Find a Faculty</h2>

                      <button
                        onClick={() => handleDashboardNavigation("facultyList")}
                      >
                        View All
                      </button>
                    </div>

                    <div className="faculty-grid">
                      {facultyList.slice(0, 4).map((faculty, index) => (
                        <div
                          className="faculty-card"
                          key={faculty.id || faculty.name}
                        >
                          <div
                            className={
                              "faculty-avatar " +
                              (faculty.style ||
                                [
                                  "avatar-one",
                                  "avatar-two",
                                  "avatar-three",
                                  "avatar-four",
                                ][index % 4])
                            }
                          >
                            {faculty.initials ||
                              (faculty.name || "Faculty")
                                .split(" ")
                                .slice(-2)
                                .map((part) => part[0])
                                .join("")}
                          </div>
                          <h3>{faculty.name}</h3>
                          <p className="faculty-department">
                            {faculty.department}
                          </p>
                          <div className="faculty-detail">
                            <CalendarIcon />
                            <span>
                              {facultyHours(faculty) ||
                                "No published availability"}
                            </span>
                          </div>
                          <div className="faculty-detail">
                            <span className="location-symbol">◇</span>
                            <span>
                              {faculty.room || "Location to be confirmed"}
                            </span>
                          </div>
                          <button
                            className="availability-btn"
                            onClick={() => openFacultyAvailability(faculty)}
                          >
                            View Availability
                          </button>
                        </div>
                      ))}
                    </div>
                    {!facultyList.length && (
                      <p className="dashboard-empty-note">
                        No faculty members to display. Check the backend
                        connection or try again later.
                      </p>
                    )}
                  </div>

                  {/* RIGHT COLUMN */}

                  <div className="dashboard-right-column">
                    {/* UPCOMING CONSULTATION */}

                    <div className="upcoming-section">
                      <div className="section-heading">
                        <h2>Upcoming Consultation</h2>

                        <button
                          onClick={() => handleDashboardNavigation("bookings")}
                        >
                          View All
                        </button>
                      </div>

                      {nextBooking ? (
                        <div className="consultation-card">
                          <div className="consultation-icon">
                            <CalendarIcon />
                          </div>
                          <div className="consultation-info">
                            <h3>
                              {nextBooking.faculty_name ||
                                nextBooking.faculty ||
                                "Faculty Member"}
                            </h3>
                            <p>{nextBooking.department}</p>
                            <div>
                              {formatBookingDate(
                                nextBooking.date_key ||
                                  nextBooking.dateKey ||
                                  nextBooking.date,
                              )}{" "}
                              · {nextBooking.time_slot || nextBooking.time}
                            </div>
                            <div>{nextBooking.location}</div>
                          </div>
                          <span className="confirmed">Confirmed</span>
                        </div>
                      ) : (
                        <p className="availability-demo-note">
                          No upcoming confirmed consultations. Pending requests
                          appear in My Bookings.
                        </p>
                      )}
                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="quick-actions">
                      <h2>Quick Actions</h2>

                      <div className="quick-grid">
                        <button
                          className="quick-card"
                          onClick={() =>
                            handleDashboardNavigation("facultyList")
                          }
                        >
                          <div className="quick-icon">
                            <SearchIcon />
                          </div>

                          <div>
                            <strong>Find Faculty</strong>

                            <span>
                              Search and filter faculty
                              <br />
                              members
                            </span>
                          </div>

                          <ChevronIcon />
                        </button>

                        <button
                          className="quick-card"
                          onClick={() => handleDashboardNavigation("bookings")}
                        >
                          <div className="quick-icon">
                            <CalendarIcon />
                          </div>

                          <div>
                            <strong>My Bookings</strong>

                            <span>
                              View and manage
                              <br />
                              your consultations
                            </span>
                          </div>

                          <ChevronIcon />
                        </button>

                        <button
                          className="quick-card"
                          onClick={() => handleDashboardNavigation("profile")}
                        >
                          <div className="quick-icon">
                            <UserIcon />
                          </div>

                          <div>
                            <strong>Profile</strong>

                            <span>
                              Manage your account
                              <br />
                              and information
                            </span>
                          </div>

                          <ChevronIcon />
                        </button>

                        <button
                          className="quick-card"
                          onClick={() =>
                            alert("Contact support will be added later.")
                          }
                        >
                          <div className="quick-icon">
                            <BookIcon />
                          </div>

                          <div>
                            <strong>Need Help?</strong>

                            <span>
                              Check FAQs or contact
                              <br />
                              support
                            </span>
                          </div>

                          <ChevronIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/*FIND facultyList PAGE*/}

            {!isFacultyView && activeDashboardPage === "facultyList" && (
              <div className="find-faculty-page">
                <div className="faculty-page-heading">
                  <div>
                    <p className="faculty-eyebrow">CONSULTATION DIRECTORY</p>
                    <h1>Find Faculty</h1>
                    <p className="faculty-page-description">
                      Browse faculty members and find the right person to help
                      with your academic concerns.
                    </p>
                  </div>

                  <div className="faculty-heading-icon">
                    <UsersIcon />
                  </div>
                </div>

                <div className="faculty-search-panel">
                  <div className="faculty-search-field">
                    <SearchIcon />
                    <input
                      type="text"
                      value={facultySearch}
                      onChange={(event) => setfacultySearch(event.target.value)}
                      placeholder="Search by faculty name, subject, or department..."
                      aria-label="Search faculty"
                    />
                  </div>

                  <div className="faculty-filter-field">
                    <label htmlFor="facultyList-department">Department</label>
                    <select
                      id="facultyList-department"
                      value={selectedDepartment}
                      onChange={(event) =>
                        setSelectedDepartment(event.target.value)
                      }
                    >
                      <option>All Departments</option>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Mathematics</option>
                      <option>Engineering</option>
                    </select>
                  </div>

                  <button
                    className="faculty-search-submit"
                    onClick={() => {
                      const facultyList = document.getElementById(
                        "facultyList-results",
                      );
                      if (facultyList)
                        facultyList.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                  >
                    <SearchIcon />
                    Search
                  </button>
                </div>

                <div
                  className="faculty-results-heading"
                  id="facultyList-results"
                >
                  <div>
                    <h2>Faculty Members</h2>
                    <p>
                      Choose a faculty member to view their consultation
                      availability.
                    </p>
                  </div>
                  <span className="faculty-result-count">
                    {
                      facultyList.filter((facultyList) => {
                        const query = facultySearch.trim().toLowerCase();
                        const matchesQuery =
                          !query ||
                          `${facultyList.name} ${facultyList.department} ${facultyList.subject}`
                            .toLowerCase()
                            .includes(query);
                        const matchesDepartment =
                          selectedDepartment === "All Departments" ||
                          facultyList.department === selectedDepartment;
                        return matchesQuery && matchesDepartment;
                      }).length
                    }{" "}
                    results
                  </span>
                </div>

                <div className="faculty-directory-grid">
                  {facultyList
                    .filter((facultyList) => {
                      const query = facultySearch.trim().toLowerCase();
                      const matchesQuery =
                        !query ||
                        `${facultyList.name} ${facultyList.department} ${facultyList.subject}`
                          .toLowerCase()
                          .includes(query);
                      const matchesDepartment =
                        selectedDepartment === "All Departments" ||
                        facultyList.department === selectedDepartment;
                      return matchesQuery && matchesDepartment;
                    })
                    .map((facultyList) => (
                      <article
                        className="directory-faculty-card"
                        key={facultyList.name}
                      >
                        <div className="directory-card-top">
                          <div
                            className={`faculty-avatar ${facultyList.style}`}
                          >
                            {facultyList.initials}
                          </div>
                          <span className="faculty-status">
                            <span></span> Consultation hours
                          </span>
                        </div>

                        <h3>{facultyList.name}</h3>
                        <p className="directory-department">
                          {facultyList.department}
                        </p>
                        <p className="directory-subject">
                          {facultyList.subject}
                        </p>

                        <div className="directory-detail">
                          <CalendarIcon />
                          <div>
                            <strong>
                              {getFacultyDates(facultyList)[0]?.label ||
                                "No published slots"}
                            </strong>
                            <span>{facultyHours(facultyList)}</span>
                          </div>
                        </div>

                        <div className="directory-detail">
                          <BookIcon />
                          <div>
                            <span>{facultyList.room}</span>
                          </div>
                        </div>

                        <button
                          className="directory-availability-btn"
                          onClick={() => openFacultyAvailability(facultyList)}
                        >
                          View Availability
                          <ChevronIcon />
                        </button>
                      </article>
                    ))}
                </div>

                {facultyList.filter((facultyList) => {
                  const query = facultySearch.trim().toLowerCase();
                  const matchesQuery =
                    !query ||
                    `${facultyList.name} ${facultyList.department} ${facultyList.subject}`
                      .toLowerCase()
                      .includes(query);
                  const matchesDepartment =
                    selectedDepartment === "All Departments" ||
                    facultyList.department === selectedDepartment;
                  return matchesQuery && matchesDepartment;
                }).length === 0 && (
                  <div className="faculty-empty-state">
                    <SearchIcon />
                    <h3>No faculty members found</h3>
                    <p>Try another name or choose a different department.</p>
                    <button
                      onClick={() => {
                        setfacultySearch("");
                        setSelectedDepartment("All Departments");
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedfacultyForBooking &&
              createPortal(
                <div
                  className="ct-availability-layer"
                  onClick={closeFacultyAvailability}
                >
                  <div
                    className="ct-availability-dialog"
                    ref={availabilityRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ct-availability-title"
                    aria-describedby="ct-availability-description"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="ct-availability-header">
                      <div>
                        <span className="ct-availability-eyebrow">
                          BOOK A CONSULTATION
                        </span>
                        <h2 id="ct-availability-title">
                          {selectedfacultyForBooking.name}
                        </h2>
                        <p id="ct-availability-description">
                          {selectedfacultyForBooking.department}
                          {selectedfacultyForBooking.room
                            ? " · " + selectedfacultyForBooking.room
                            : ""}
                        </p>
                      </div>
                      <button
                        className="ct-availability-close"
                        type="button"
                        aria-label="Close availability"
                        onClick={closeFacultyAvailability}
                      >
                        ×
                      </button>
                    </div>
                    <form
                      className="ct-availability-form"
                      onSubmit={handleCreateBooking}
                    >
                      <div className="ct-availability-body">
                        <div className="ct-availability-schedule">
                          <CalendarIcon />
                          <div>
                            <strong>Consultation schedule</strong>
                            <span>
                              {facultyHours(selectedfacultyForBooking) ||
                                "No published schedule"}
                            </span>
                            <small>All times are in Asia/Manila.</small>
                          </div>
                        </div>
                        {!availableBookingDates.length ? (
                          <div className="ct-availability-empty" role="status">
                            <CalendarIcon />
                            <h3>No available dates</h3>
                            <p>
                              This faculty member has no upcoming published
                              slots. Please check again later or choose another
                              faculty member.
                            </p>
                          </div>
                        ) : (
                          <>
                            <fieldset>
                              <legend>1. Choose a date</legend>
                              <div className="ct-availability-dates">
                                {availableBookingDates.map((date) => (
                                  <button
                                    className={
                                      "ct-availability-date" +
                                      (selectedBookingDate === date.key
                                        ? " is-selected"
                                        : "")
                                    }
                                    key={date.key}
                                    type="button"
                                    aria-pressed={
                                      selectedBookingDate === date.key
                                    }
                                    onClick={() => {
                                      setSelectedBookingDate(date.key);
                                      setSelectedBookingTime("");
                                      setBookingError("");
                                    }}
                                  >
                                    <span>{date.label.split(",")[0]}</span>
                                    <strong>
                                      {date.label.split(" ").slice(1).join(" ")}
                                    </strong>
                                  </button>
                                ))}
                              </div>
                            </fieldset>
                            <fieldset>
                              <legend>2. Choose a time</legend>
                              <p className="ct-availability-hint">
                                Each consultation lasts 30 minutes.
                              </p>
                              <div className="ct-availability-times">
                                {getTimeSlots(
                                  selectedfacultyForBooking,
                                  selectedBookingDate,
                                ).map((time) => {
                                  const conflict =
                                    occupiedSlotsLoading ||
                                    Boolean(occupiedSlotsError) ||
                                    hasConflict(
                                      bookings,
                                      selectedBookingDate,
                                      time,
                                    ) ||
                                    occupiedSlots.some(
                                      (slot) =>
                                        Math.abs(
                                          slotStart(
                                            String(slot.date_key).slice(0, 10),
                                            slot.time_slot,
                                          ) -
                                            slotStart(
                                              selectedBookingDate,
                                              time,
                                            ),
                                        ) <
                                        30 * 60 * 1000,
                                    );
                                  return (
                                    <button
                                      className={
                                        "ct-availability-time" +
                                        (selectedBookingTime === time
                                          ? " is-selected"
                                          : "")
                                      }
                                      key={time}
                                      type="button"
                                      disabled={conflict}
                                      aria-pressed={
                                        selectedBookingTime === time
                                      }
                                      onClick={() => {
                                        setSelectedBookingTime(time);
                                        setBookingError("");
                                      }}
                                    >
                                      <strong>{time}</strong>
                                      <span>
                                        {occupiedSlotsLoading
                                          ? "Checking availability..."
                                          : occupiedSlotsError
                                            ? "Availability check failed"
                                            : conflict
                                              ? "Unavailable"
                                              : "30 minutes"}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              {!getTimeSlots(
                                selectedfacultyForBooking,
                                selectedBookingDate,
                              ).length && (
                                <p
                                  className="ct-availability-hint"
                                  role="status"
                                >
                                  No remaining slots on this date. Please select
                                  another date.
                                </p>
                              )}
                            </fieldset>
                            <label className="ct-availability-topic">
                              <span>3. What would you like to discuss?</span>
                              <textarea
                                value={bookingSubject}
                                onChange={(event) =>
                                  setBookingSubject(event.target.value)
                                }
                                placeholder="Enter your subject or consultation topic"
                                rows={3}
                                minLength={5}
                                maxLength={300}
                                required
                              />
                              <small>
                                5–300 characters ·{" "}
                                {bookingSubject.trim().length}/300
                              </small>
                            </label>
                          </>
                        )}
                        {bookingError && (
                          <p className="ct-availability-error" role="alert">
                            {bookingError}
                          </p>
                        )}
                      </div>
                      <div className="ct-availability-footer">
                        <div
                          className="ct-availability-selection"
                          role="status"
                        >
                          {selectedBookingDate && selectedBookingTime ? (
                            <>
                              <strong>
                                {formatBookingDate(selectedBookingDate)}
                              </strong>
                              <span>{selectedBookingTime}</span>
                            </>
                          ) : (
                            <span>Select a date and time to continue.</span>
                          )}
                        </div>
                        <p className="ct-availability-hint">
                          Requests need faculty approval.
                        </p>
                        <div className="ct-availability-actions">
                          <button
                            type="button"
                            className="ct-availability-cancel"
                            onClick={closeFacultyAvailability}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="ct-availability-submit"
                            disabled={
                              !availableBookingDates.length ||
                              !selectedBookingDate ||
                              !selectedBookingTime ||
                              bookingSubject.trim().length < 5
                            }
                          >
                            Submit Request
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>,
                document.body,
              )}

            {/* BOOKINGS PAGE */}

            {!isFacultyView && activeDashboardPage === "bookings" && (
              <div className="bookings-page">
                <div className="bookings-page-heading">
                  <div className="bookings-heading-icon">
                    <CalendarIcon />
                  </div>
                  <div>
                    <span className="bookings-eyebrow">YOUR CONSULTATIONS</span>
                    <h1>My Bookings</h1>
                    <p>
                      Keep track of your requests and upcoming consultations.
                    </p>
                  </div>
                </div>
                {bookingNotice && (
                  <p className="booking-notice" role="status">
                    {bookingNotice}
                  </p>
                )}
                <div className="booking-summary-grid">
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon">
                      <CalendarIcon />
                    </div>
                    <div>
                      <span>All Bookings</span>
                      <strong>{bookings.length}</strong>
                    </div>
                  </div>
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon upcoming">
                      <ClockIcon />
                    </div>
                    <div>
                      <span>Pending Requests</span>
                      <strong>{pendingCount}</strong>
                    </div>
                  </div>
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon completed">
                      <BookIcon />
                    </div>
                    <div>
                      <span>Confirmed</span>
                      <strong>
                        {
                          bookings.filter(
                            (booking) => booking.status === "Confirmed",
                          ).length
                        }
                      </strong>
                    </div>
                  </div>
                </div>
                <div className="bookings-toolbar">
                  <div className="bookings-search-field">
                    <SearchIcon />
                    <input
                      aria-label="Search bookings"
                      placeholder="Search faculty, topic, or date..."
                      value={bookingSearch}
                      onChange={(event) => setBookingSearch(event.target.value)}
                    />
                  </div>
                  <div
                    className="booking-filter-tabs"
                    role="group"
                    aria-label="Filter by booking status"
                  >
                    {["All Bookings", ...BOOKING_STATUSES].map((filter) => (
                      <button
                        type="button"
                        key={filter}
                        className={bookingFilter === filter ? "active" : ""}
                        aria-pressed={bookingFilter === filter}
                        onClick={() => setBookingFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bookings-list-heading">
                  <div>
                    <h2>Your consultations</h2>
                    <p>Review your booking details and request status.</p>
                  </div>
                  <button
                    className="bookings-find-button"
                    onClick={() => handleDashboardNavigation("facultyList")}
                  >
                    <SearchIcon />
                    Find Faculty
                  </button>
                </div>
                <div className="booking-cards-list">
                  {visibleBookings.map((booking) => (
                    <article className="booking-card" key={booking.id}>
                      <div className="booking-date-block">
                        <CalendarIcon />
                        <span>Consultation</span>
                        <strong>
                          {String(
                            booking.date_key || booking.dateKey || "",
                          ).slice(8, 10) || "—"}
                        </strong>
                        <small>Manila time</small>
                      </div>
                      <div className="booking-card-main">
                        <div className="booking-card-title-row">
                          <div>
                            <h3>
                              {booking.faculty_name ||
                                booking.faculty ||
                                "Faculty Member"}
                            </h3>
                            <p>
                              {booking.department || "Faculty consultation"}
                            </p>
                          </div>
                          <span
                            className={
                              "booking-status status-" +
                              String(booking.status || "Pending").toLowerCase()
                            }
                          >
                            {booking.status || "Pending"}
                          </span>
                        </div>
                        <div className="booking-subject">
                          <BookIcon />
                          {booking.subject || "Consultation"}
                        </div>

                        {isActive(booking) &&
                          bookingStart(booking) > Date.now() && (
                            <button
                              type="button"
                              className="bookings-find-button"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </button>
                          )}

                        <div className="booking-details-row">
                          <span>
                            <CalendarIcon />
                            {formatBookingDate(
                              booking.date_key ||
                                booking.dateKey ||
                                booking.date,
                            )}
                          </span>
                          <span>
                            <ClockIcon />
                            {booking.time_slot || booking.time}
                          </span>
                          {(booking.location || booking.room) && (
                            <span>
                              <UserIcon />
                              {booking.location || booking.room}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                  {!visibleBookings.length && (
                    <div className="bookings-empty-state">
                      <CalendarIcon />
                      <h3>
                        {bookings.length
                          ? "No matching bookings"
                          : "No bookings yet"}
                      </h3>
                      <p>
                        {bookings.length
                          ? "Try a different search or status filter."
                          : "Find a faculty member and choose a consultation time."}
                      </p>
                      <button
                        onClick={() => {
                          if (bookings.length) {
                            setBookingSearch("");
                            setBookingFilter("All Bookings");
                          } else handleDashboardNavigation("facultyList");
                        }}
                      >
                        {bookings.length ? "Clear filters" : "Find Faculty"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* PROFILE PAGE*/}

            {!isFacultyView && activeDashboardPage === "profile" && (
              <div className="profile-page">
                <div className="profile-page-heading">
                  <div className="profile-heading-icon">
                    <UserIcon />
                  </div>
                  <div>
                    <span className="profile-eyebrow">STUDENT ACCOUNT</span>
                    <h1>My Profile</h1>
                    <p>
                      View and manage your personal and academic information.
                    </p>
                  </div>
                </div>

                <section className="profile-overview-card">
                  <div className="profile-avatar">
                    {profileData.fullName
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="profile-overview-info">
                    <h2>{profileData.fullName || "Student Name"}</h2>
                    <p>
                      {profileData.course} <span>•</span>{" "}
                      {profileData.yearLevel}
                    </p>
                    <span className="profile-account-badge">
                      <UserIcon /> Student Account
                    </span>
                  </div>
                  <button
                    className="profile-edit-button"
                    disabled={profileSaving}
                    onClick={() => {
                      setProfileDraft({ ...profileData });
                      setIsProfileEditing((current) => !current);
                      setProfileSaved(false);
                      setProfileError("");
                    }}
                  >
                    <UserIcon />{" "}
                    {isProfileEditing ? "Cancel Edit" : "Edit Profile"}
                  </button>
                </section>

                {profileSaved && (
                  <div className="profile-success-message">
                    Your profile changes have been saved.
                  </div>
                )}

                {profileError && <p role="alert">{profileError}</p>}
                <div className="profile-content-grid">
                  <section className="profile-details-card">
                    <div className="profile-section-heading">
                      <div>
                        <h2>Personal Information</h2>
                        <p>Keep your contact information up to date.</p>
                      </div>
                    </div>
                    <div className="profile-fields-grid">
                      <label className="profile-field">
                        <span>Full Name</span>
                        <input
                          type="text"
                          autoComplete="name"
                          value={(isProfileEditing ? profileDraft.fullName : profileData.fullName) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              fullName: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="profile-field">
                        <span>Student ID</span>
                        <input
                          type="text"
                          value={(isProfileEditing ? profileDraft.studentId : profileData.studentId) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              studentId: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="profile-field">
                        <span>Email</span>
                        <input
                          type="email"
                          autoComplete="email"
                          value={(isProfileEditing ? profileDraft.email : profileData.email) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              email: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="profile-field">
                        <span>Contact Number</span>
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={(isProfileEditing ? profileDraft.phone : profileData.phone) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              phone: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="profile-field">
                        <span>Year Level</span>
                        <input
                          type="text"
                          value={(isProfileEditing ? profileDraft.yearLevel : profileData.yearLevel) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              yearLevel: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className="profile-field">
                        <span>Section</span>
                        <input
                          type="text"
                          value={(isProfileEditing ? profileDraft.section : profileData.section) || ""}
                          readOnly={!isProfileEditing || profileSaving}
                          onChange={(event) =>
                            setProfileDraft((current) => ({
                              ...current,
                              section: event.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                    {isProfileEditing && (
                      <div className="profile-form-actions">
                        <button
                          className="profile-discard-button"
                          disabled={profileSaving}
                          onClick={() => {
                            setIsProfileEditing(false);
                            setProfileDraft({ ...profileData });
                            setProfileSaved(false);
                            setProfileError("");
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="profile-save-button"
                          disabled={profileSaving}
                          onClick={handleSaveStudentProfile}
                        >
                          {profileSaving ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    )}
                  </section>

                  <section className="profile-details-card academic-card">
                    <div className="profile-section-heading">
                      <div>
                        <h2>Academic Information</h2>
                        <p>Your current school details.</p>
                      </div>
                    </div>

                    <div className="profile-academic-item">
                      <span className="profile-academic-icon">
                        <BookIcon />
                      </span>

                      <div>
                        <small>Program</small>
                        <strong>{profileData.course}</strong>
                      </div>
                    </div>

                    <div className="profile-academic-item">
                      <span className="profile-academic-icon">
                        <UsersIcon />
                      </span>
                      <div>
                        <small>Year Level</small>
                        <strong>{profileData.yearLevel}</strong>
                      </div>
                    </div>

                    <div className="profile-academic-item">
                      <span className="profile-academic-icon">
                        <HomeIcon />
                      </span>
                      <div>
                        <small>College / Department</small>
                        <strong>{profileData.department}</strong>
                      </div>
                    </div>
                  </section>
                </div>

                <div className="profile-bottom-row">
                  <p>
                    Profile details are currently stored in this page preview
                    only.
                  </p>
                  <div className="profile-bottom-actions">
                    <button
                      className="profile-back-button"
                      onClick={() => handleDashboardNavigation("dashboard")}
                    >
                      <ChevronIcon /> Back to Dashboard
                    </button>
                    <button
                      className="profile-logout-button"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  /* LANDING PAGE — presentation only; existing handlers retained. */
  return (
    <div className="ct-home consult-app" id="home">
      <nav className="ct-home-nav" aria-label="Main navigation">
        <a href="#home" className="ct-home-brand" aria-label="ConsultTime home">
          <ConsultBrand />
        </a>
        <div className="ct-home-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
        <button className="ct-home-login" onClick={handleLogin}>
          Log In <ChevronIcon />
        </button>
      </nav>
      <main>
        <section className="ct-home-hero" aria-labelledby="ct-home-title">
          <div className="ct-home-hero-copy">
            <span className="ct-home-eyebrow">
              <span />
              FOR THE WMSU COMMUNITY
            </span>
            <h1 id="ct-home-title">
              Make time for
              <br />
              <em>your next step.</em>
            </h1>
            <p>
              Good guidance starts with a conversation. Find your faculty,
              choose a consultation time, and get the support you need—all in
              one place.
            </p>
            <div className="ct-home-hero-actions">
              <button className="ct-home-primary" onClick={handleLogin}>
                Book a consultation <ChevronIcon />
              </button>
              <button className="ct-home-secondary" onClick={handleLearnMore}>
                Explore ConsultTime
              </button>
            </div>
            <div className="ct-home-hero-note">
              <span className="ct-home-note-icon">
                <UsersIcon />
              </span>
              <div>
                <strong>Less back-and-forth. More connection.</strong>
                <span>Made for students and the faculty who guide them.</span>
              </div>
            </div>
          </div>
          <div
            className="ct-home-visual"
            aria-label="Illustrative consultation dashboard preview"
          >
            <div className="ct-home-preview">
              <div className="ct-home-preview-top">
                <span>
                  <span className="ct-home-mini-mark">
                    <CalendarIcon />
                  </span>
                  ConsultTime
                </span>
                <span className="ct-home-preview-label">A LOOK INSIDE</span>
              </div>
              <div className="ct-home-preview-content">
                <span className="ct-home-preview-kicker">
                  YOUR SPACE FOR ACADEMIC SUPPORT
                </span>
                <h2>A clearer week ahead.</h2>
                <p>Your consultations, thoughtfully organized.</p>
                <div className="ct-home-preview-week">
                  {["MON", "TUE", "WED", "THU", "FRI"].map((day, index) => (
                    <div
                      className={index === 2 ? "is-highlighted" : ""}
                      key={day}
                    >
                      <span>{day}</span>
                      <strong>{12 + index}</strong>
                      <i />
                    </div>
                  ))}
                </div>
                <div className="ct-home-preview-session">
                  <div className="ct-home-session-heading">
                    <span className="ct-home-session-icon">
                      <BookIcon />
                    </span>
                    <span className="ct-home-preview-status">
                      Consultation preview
                    </span>
                  </div>
                  <h3>A little guidance goes a long way.</h3>
                  <p>Academic consultation</p>
                  <div className="ct-home-preview-detail">
                    <ClockIcon />
                    <span>30 minutes for your questions</span>
                  </div>
                  <div className="ct-home-preview-detail">
                    <UsersIcon />
                    <span>One conversation. A fresh perspective.</span>
                  </div>
                </div>
                <div className="ct-home-preview-bottom">
                  <span>
                    <CalendarIcon />
                    Find a time that works for you.
                  </span>
                  <ChevronIcon />
                </div>
              </div>
            </div>
            <div className="ct-home-floating">
              <span>
                <CalendarIcon />
              </span>
              <div>
                <strong>Your next step, simplified.</strong>
                <p>Find. Schedule. Connect.</p>
              </div>
            </div>
            <p className="ct-home-visual-caption">
              Illustrative preview · Booking requests need faculty approval.
            </p>
          </div>
        </section>
        <div className="ct-home-benefit-strip">
          <span>
            <SearchIcon />
            Find the right faculty
          </span>
          <span>
            <ClockIcon />
            Choose an available time
          </span>
          <span>
            <CalendarIcon />
            Keep bookings in one place
          </span>
        </div>
        <section
          className="ct-home-how"
          id="how-it-works"
          aria-labelledby="ct-home-how-title"
        >
          <div className="ct-home-section-intro">
            <span className="ct-home-eyebrow">A SIMPLE WAY TO CONNECT</span>
            <h2 id="ct-home-how-title">From a question to a conversation.</h2>
            <p>A few simple steps to the support you're looking for.</p>
          </div>
          <div className="ct-home-step-grid">
            {[
              {
                n: "01",
                icon: <UserIcon />,
                title: "Sign in to your space",
                text: "Create your student account or log in with your assigned faculty account.",
              },
              {
                n: "02",
                icon: <SearchIcon />,
                title: "Find your faculty",
                text: "Browse faculty members and check their published consultation schedules.",
              },
              {
                n: "03",
                icon: <CalendarIcon />,
                title: "Make the connection",
                text: "Choose a time, share your topic, and follow your request in My Bookings.",
              },
            ].map((step) => (
              <article className="ct-home-step" key={step.n}>
                <div className="ct-home-step-top">
                  <span className="ct-home-tile-icon">{step.icon}</span>
                  <span>{step.n}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section
          className="ct-home-about"
          id="about"
          aria-labelledby="ct-home-about-title"
        >
          <div className="ct-home-about-copy">
            <span className="ct-home-eyebrow">
              BUILT AROUND YOUR ACADEMIC JOURNEY
            </span>
            <h2 id="ct-home-about-title">
              More organized.
              <br />
              More connected.
            </h2>
            <p>
              ConsultTime brings students and faculty together through a shared
              space for academic consultations. Spend less time arranging a
              meeting and more time on the conversations that move you forward.
            </p>
            <button className="ct-home-text-link" onClick={handleSignup}>
              Create a student account <ChevronIcon />
            </button>
          </div>
          <div className="ct-home-feature-list">
            {[
              {
                icon: <UsersIcon />,
                title: "Faculty, easier to find",
                text: "Explore departments and discover who can help with your questions.",
              },
              {
                icon: <ClockIcon />,
                title: "Availability, easier to see",
                text: "View published dates and time slots before sending a request.",
              },
              {
                icon: <BookIcon />,
                title: "Consultations, easier to follow",
                text: "Keep your topics, appointment details, and request statuses together.",
              },
            ].map((feature) => (
              <article className="ct-home-feature" key={feature.title}>
                <span className="ct-home-tile-icon">{feature.icon}</span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="ct-home-cta" aria-labelledby="ct-home-cta-title">
          <div>
            <span className="ct-home-eyebrow">LET'S MAKE TIME</span>
            <h2 id="ct-home-cta-title">
              Your questions deserve a conversation.
            </h2>
            <p>Take the next step with ConsultTime.</p>
          </div>
          <button className="ct-home-primary" onClick={handleLogin}>
            Get started <ChevronIcon />
          </button>
        </section>
      </main>
      <footer className="ct-home-footer">
        <a href="#home" className="ct-home-footer-brand">
          ConsultTime<span>Western Mindanao State University</span>
        </a>
        <p>© {new Date().getFullYear()} ConsultTime. All rights reserved.</p>
        <a href="#how-it-works">
          How it works <ChevronIcon />
        </a>
      </footer>
    </div>
  );
}

export default App;
