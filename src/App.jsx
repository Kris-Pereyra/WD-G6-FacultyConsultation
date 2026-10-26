import { useState, useEffect } from 'react'
import { getFaculty, signup, login, createBooking, getStudentBookings, getAllBookings, updateBookingStatus } from './api'
import './App.css'
/*import BackendTest from './BackendTest';*/

import weblogo from './assets/weblogo.jpg'
import wmsuLogo from './assets/wmsuLogo.png'
import calendar from './assets/calendar.jpg'
import pic1 from './assets/pic1.jpg'


/* SIMPLE ICONS */

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M9 21v-7h6v7" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="11" cy="11" r="7" />
      <path d="M16.5 16.5L21 21" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 20c0-3.5 2.5-6 6-6s6 2.5 6 6" />
      <path d="M15 14c3 0 5 2 5 5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 5.5v16" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="chevron-icon">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function Svg({ children, className = 'icon' }) {
  return <svg viewBox="0 0 24 24" className={className}>{children}</svg>
}

function LoginUsersIcon() {
  return (
    <Svg>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  )
}

function LoginCalendarIcon() {
  return (
    <Svg>
      <path d="M8 2v4" /><path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
      <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
    </Svg>
  )
}

function LoginClipboardIcon() {
  return (
    <Svg>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </Svg>
  )
}

function UserOutlineIcon() {
  return (
    <Svg>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </Svg>
  )
}

function GraduationCapIcon() {
  return (
    <Svg>
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </Svg>
  )
}

function LockIcon() {
  return (
    <Svg>
      <circle cx="12" cy="16" r="1" />
      <rect x="3" y="10" width="18" height="12" rx="2" />
      <path d="M7 10V7a5 5 0 0 1 10 0v3" />
    </Svg>
  )
}

function ChevronDownIcon({ className = 'icon select-chevron' }) {
  return (
    <Svg className={className}>
      <path d="m6 9 6 6 6-6" />
    </Svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="icon">
      <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.5 0-10-7-10-7a17.7 17.7 0 0 1 4.1-5" />
      <path d="M9.9 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a17.8 17.8 0 0 1-2.2 3.2" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M3 3l18 18" />
    </svg>
  )
}

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'Declined', 'Cancelled', 'Completed']
const isActive = booking => ['Pending', 'Confirmed'].includes(booking.status)
const formatMinutes = minutes => {
  const hour = Math.floor(minutes / 60)
  return (hour % 12 || 12) + ':' + String(minutes % 60).padStart(2, '0') + (hour < 12 ? ' AM' : ' PM')
}
function manilaToday() {
  return new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date())
}
function slotStart(dateKey, time) {
  const match = time.match(/^(\d{1,2}):(\d{2}) (AM|PM)/)
  if (!match) return NaN
  const hour = Number(match[1]) % 12 + (match[3] === 'PM' ? 12 : 0)
  return Date.parse(dateKey + 'T' + String(hour).padStart(2,'0') + ':' + match[2] + ':00+08:00')
}

function bookingStart(booking) {
  return slotStart(booking.date_key || booking.dateKey, booking.time_slot || booking.time)
}



function getTimeSlots(facultyList, dateKey) {
  if (!facultyList || !dateKey) return []
  const days = facultyList.available_days || facultyList.days || []
  const start = facultyList.start_minutes ?? facultyList.start
  const end = facultyList.end_minutes ?? facultyList.end

  if (!days.includes(new Date(dateKey + 'T12:00:00Z').getUTCDay())) return []

  const slots = []
  for (let minute = start; minute + 30 <= end; minute += 30) {
    const time = formatMinutes(minute) + ' - ' + formatMinutes(minute + 30)
    if (slotStart(dateKey, time) > Date.now()) slots.push(time)
  }
  return slots
}

function getFacultyDates(facultyList, count = 10) {
  if (!facultyList) return []
  const dates = []
  const day = new Date(manilaToday() + 'T12:00:00Z')
  for (let offset = 0; offset < 60 && dates.length < count; offset++) {
    const key = day.toISOString().slice(0, 10)
    if (getTimeSlots(facultyList, key).length) {
      dates.push({
        key,
        label: day.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' }),
        fullDate: day.toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' })
      })
    }
    day.setUTCDate(day.getUTCDate() + 1)
  }
  return dates
}

function facultyHours(facultyList) {
  if (!facultyList) return ''
  const days = facultyList.available_days || facultyList.days || []
  const start = facultyList.start_minutes ?? facultyList.start
  const end = facultyList.end_minutes ?? facultyList.end
  return days.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') +
    ' · ' + formatMinutes(start) + ' – ' + formatMinutes(end) + ' (Manila)'
}

function hasConflict(bookings, dateKey, time) {
  const start = slotStart(dateKey, time)
  return bookings.some(b => isActive(b) && Math.abs(bookingStart(b) - start) < 30 * 60 * 1000)
}

function getNameFromEmail(email) {
  const username = email.split('@')[0].split('+')[0]
  const name = username
    .replace(/[._-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ')

  return name || 'Student'
}



/* APP*/

function App() {


  const [allBookings, setAllBookings] = useState([])
  const [isFacultyView, setIsFacultyView] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [activeDashboardPage, setActiveDashboardPage] = useState('dashboard')
  const [facultySearch, setfacultySearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [bookingFilter, setBookingFilter] = useState('All Bookings')
  const [bookingSearch, setBookingSearch] = useState('')
  const [isProfileEditing, setIsProfileEditing] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [selectedfacultyForBooking, setselectedfacultyForBooking] = useState(null)
  const [selectedBookingDate, setSelectedBookingDate] = useState('')
  const [selectedBookingTime, setSelectedBookingTime] = useState('')
  const [bookingSubject, setBookingSubject] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const emptySignup = {
    fullName: '', studentId: '', email: '', phone: '',
    program: '', yearLevel: '', password: '', confirmPassword: '', agree: false
  }
  const [signupForm, setSignupForm] = useState(emptySignup)
  const [signupErrors, setSignupErrors] = useState({})
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirm, setShowSignupConfirm] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    studentId: 'Student ID not set',
    email: '',
    phone: 'Not provided',
    course: 'BS Computer Science',
    yearLevel: '2nd Year',
    section: 'Not set',
    department: 'College of Computing Studies'
  })
  // In-memory demo data is cleared on logout/reload; never treat this as a database.
  const [bookings, setBookings] = useState([])
  const [bookingError, setBookingError] = useState('')
  const [bookingNotice, setBookingNotice] = useState('')
  const [facultyList, setFacultyList] = useState([])
  const [currentStudent, setCurrentStudent] = useState(null)
  const [token, setToken] = useState(null)
  useEffect(() => {
  getFaculty()
    .then(data => setFacultyList(data))
    .catch(err => console.error('Failed to load faculty:', err))
}, [])

async function loadAllBookings() {
  try {
    const data = await getAllBookings()
    setAllBookings(data)
  } catch (err) {
    console.error(err)
  }
}

async function handleAccept(bookingId) {
  try {
    await updateBookingStatus(bookingId, 'Confirmed')
    await loadAllBookings()
    alert('Booking Accepted!')
  } catch (err) {
    alert(err.message)
  }
}

async function handleDecline(bookingId) {
  try {
    await updateBookingStatus(bookingId, 'Declined')
    await loadAllBookings()
    alert('Booking Declined!')
  } catch (err) {
    alert(err.message)
  }
  }

  console.log('App is running, currentPage =', currentPage)


  const availableBookingDates = getFacultyDates(selectedfacultyForBooking)
  const upcomingBookings = bookings.filter(booking => booking.status === 'Confirmed' && bookingStart(booking) > Date.now()).sort((a,b) => bookingStart(a)-bookingStart(b))
  const nextBooking = upcomingBookings[0]
  const pendingCount = bookings.filter(booking => booking.status === 'Pending').length
    const availablefacultyListCount = facultyList.filter(f => 
    getFacultyDates(f).some(date => 
      getTimeSlots(f, date.key).some(time => !hasConflict(bookings, date.key, time))
    )
  ).length
  


  /* NAVIGATION*/

  function handleLogin() {
    setCurrentPage('login')
    window.scrollTo(0, 0)
  }

  function handleSignup() {
    setSignupErrors({})
    setCurrentPage('signup')
    window.scrollTo(0, 0)
  }

  function updateSignup(field, value) {
    setSignupForm(current => ({ ...current, [field]: value }))
    setSignupErrors(current => ({ ...current, [field]: '' }))
  }

  async function handleSignupSubmit(event) {
  event.preventDefault()

  const f = signupForm
  const email = f.email.trim().toLowerCase()
  const errors = {}

  if (f.fullName.trim().length < 2) errors.fullName = 'Enter your full name.'
  if (!f.studentId.trim()) errors.studentId = 'Enter your student ID.'
  if (!/^[a-z0-9._%+-]+@(?:wmsu\.edu\.ph|gmail\.com)$/i.test(email)) {
    errors.email = 'Enter your university email, such as name@wmsu.edu.ph.'
  }
  if (!/^(09|\+639)\d{9}$/.test(f.phone.replace(/[\s-]/g, ''))) {
    errors.phone = 'Enter a valid mobile number, such as 09123456789.'
  }
  if (!f.program) errors.program = 'Select your program.'
  if (!f.yearLevel) errors.yearLevel = 'Select your year level.'
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(f.password)) {
    errors.password = 'Use 8+ characters with uppercase, lowercase and a number.'
  }
  if (f.confirmPassword !== f.password || !f.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.'
  }
  if (!f.agree) errors.agree = 'Please accept the Terms of Service and Privacy Policy.'

  setSignupErrors(errors)
  if (Object.keys(errors).length > 0) return

  try {
    const result = await signup({
      fullName: f.fullName.trim(),
      studentId: f.studentId.trim(),
      email,
      phone: f.phone.trim(),
      program: f.program,
      yearLevel: f.yearLevel,
      password: f.password
    })

    setCurrentStudent(result.student)
    setProfileData({
      fullName: result.student.full_name,
      studentId: result.student.student_id,
      email: result.student.email,
      phone: result.student.phone || 'Not provided',
      course: result.student.program,
      yearLevel: result.student.year_level,
      section: 'Not set',
      department: 'College of Computing Studies'
    })

    setSignupForm(emptySignup)
    handleDashboard()
  } catch (err) {
    setSignupErrors({ email: err.message || 'Signup failed.' })
  }
  }

  function handleHome() {
    setCurrentPage('home')
    window.scrollTo(0, 0)
  }

  function handleDashboard() {
    setCurrentPage('dashboard')
    setActiveDashboardPage('dashboard')
    window.scrollTo(0, 0)
  }

  async function handleLoginSubmit(event) {
  event.preventDefault()

  const normalizedEmail = loginEmail.trim().toLowerCase()

  if (!normalizedEmail || !loginPassword) {
    setLoginError('Please enter email and password.')
    return
  }

  try {
    const result = await login(normalizedEmail, loginPassword)

    setCurrentStudent(result.student)
    setToken(result.token)

    setProfileData({
      fullName: result.student.full_name,
      studentId: result.student.student_id,
      email: result.student.email,
      phone: result.student.phone || 'Not provided',
      course: result.student.program,
      yearLevel: result.student.year_level,
      section: 'Not set',
      department: 'College of Computing Studies'
    })

    const studentBookings = await getStudentBookings(result.student.id)
    setBookings(studentBookings)

    setLoginError('')
    handleDashboard()
  } catch (err) {
    setLoginError(err.message || 'Invalid email or password.')
  }
  }

  function handleLogout() {
    setIsProfileEditing(false)
    setProfileSaved(false)
    setActiveDashboardPage('dashboard')
    setCurrentPage('home')
    setBookings([])
    setBookingNotice('')
    setLoginPassword('')
    setCurrentStudent(null)
    setToken(null)
    window.scrollTo(0, 0)
  }

  function openFacultyAvailability(faculty) {
  setBookingError('')
  setBookingNotice('')
  setselectedfacultyForBooking(faculty)
  const dates = getFacultyDates(faculty)
  setSelectedBookingDate(dates[0]?.key || '')
  setSelectedBookingTime('')
  setBookingSubject('')
  }

  function closeFacultyAvailability() {
    setselectedfacultyForBooking(null)
    setSelectedBookingDate('')
    setSelectedBookingTime('')
    setBookingSubject('')
  }

  async function handleCreateBooking(event) {
    event.preventDefault()
    const subject = bookingSubject.trim()
    if (!selectedfacultyForBooking || !selectedBookingDate || !selectedBookingTime) {
      setBookingError('Choose a faculty member, date, and time.'); return
    }
    if (subject.length < 5 || subject.length > 300) {
      setBookingError('Enter a consultation topic between 5 and 300 characters.'); return
    }
    const bookingDate = getFacultyDates(selectedfacultyForBooking).find(date => date.key === selectedBookingDate)
    if (!bookingDate || !getTimeSlots(selectedfacultyForBooking, selectedBookingDate).includes(selectedBookingTime)) {
      setBookingError('This time is no longer available. Please choose another slot.'); setSelectedBookingTime(''); return
    }
    if (hasConflict(bookings,selectedBookingDate,selectedBookingTime)) {
      setBookingError('You already have a pending or confirmed consultation that overlaps this time.'); return
    }
    try {
  await createBooking({
    studentId: currentStudent.id,
    facultyId: selectedfacultyForBooking.id,
    dateKey: selectedBookingDate,
    timeSlot: selectedBookingTime,
    subject: bookingSubject.trim()
  })

    

  // Refresh the list from the database
  const updated = await getStudentBookings(currentStudent.id)
  setBookings(updated)

  setBookingNotice('Booking created successfully!')
  closeFacultyAvailability()
  } catch (err) {
  setBookingError(err.message || 'Failed to create booking.')
  }
}

  function handleCancelBooking(id) {
    const booking = bookings.find(item => item.id === id)
    if (!booking || !isActive(booking) || bookingStart(booking) <= Date.now()) return
    if (!window.confirm('Cancel this consultation request?')) return
    setBookings(current => current.map(item => item.id === id && isActive(item) && bookingStart(item) > Date.now()
      ? {...item, status: 'Cancelled', cancelledAt: new Date().toISOString()} : item))
    setBookingNotice('Booking cancelled. You may request another available time.')
  }

  function handleLearnMore() {
    const aboutSection = document.getElementById('about')

    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }


  /*DASHBOARD NAVIGATION */

  function handleDashboardNavigation(page) {
    setActiveDashboardPage(page)
  }

  /*LOGIN PAGE */

  if (currentPage === 'login') {
    return (
      <div className="login-page redesigned-login-page">
        {/* LOGIN NAVIGATION */}
        <nav>
          <div className="logo-container" onClick={handleHome} role="button" tabIndex={0}>
            <div className="logo">
              <img src={wmsuLogo} alt="WMSU Logo" />
              <img src={weblogo} alt="ConsultTime Logo" />
            </div>
            <span className="logo-text">ConsultTime</span>
          </div>

          <div className="nav-links">
            <a href="#" onClick={event => { event.preventDefault(); handleHome() }}>Home</a>
            <a href="#how-it-works" onClick={event => { event.preventDefault(); handleHome() }}>How it Works</a>
            <a href="#about" onClick={event => { event.preventDefault(); handleHome() }}>About</a>
          </div>

          <div className="pagebtn" onClick={handleSignup} role="button" tabIndex={0}>
            <span>Sign Up</span>
          </div>
        </nav>

        {/* LOGIN CONTENT */}
        <main className="redesigned-login-layout">
          <section className="login-intro-panel">
            <span className="login-audience-tag">For WMSU students</span>
            <h1>Your next step to academic support.</h1>
            <p className="login-intro-description">
              Connect with your facultyList and make time for the guidance you need.
            </p>

            <img
              className="login-feature-image"
              src={pic1}
              alt="ConsultTime consultation schedule"
            />

            <div className="login-benefit-list">
              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginUsersIcon /></span>
                <div>
                  <strong>Connect with your facultyList</strong>
                  <p>Find the right person for your questions.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginCalendarIcon /></span>
                <div>
                  <strong>Book a convenient time</strong>
                  <p>Choose a consultation that fits your schedule.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginClipboardIcon /></span>
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
          <form className="login-card redesigned-login-card" onSubmit={handleLoginSubmit}>
            <div className="login-card-header">
              <h2>Welcome back!</h2>
              <p>Log in to manage your consultations and connect with your facultyList.</p>
              <button onClick={() => {
                setIsFacultyView(true)
                loadAllBookings()
              }}>
                Faculty Dashboard
              </button>
            </div>

            <label className="login-form-label" htmlFor="login-email">
              University Email <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="Your email @wmsu.edu.ph"
                value={loginEmail}
                onChange={event => {
                  setLoginEmail(event.target.value);
                  setLoginError('');
                }}
                required
              />
            </div>

            <small className="login-field-hint">
              Use your official university email address.
            </small>

            <label className="login-form-label password-label" htmlFor="login-password">
              Password <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-password"
                type={showLoginPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={event => {
                  setLoginPassword(event.target.value);
                  setLoginError('');
                }}
                required
              />
              <button
                className="password-toggle"
                type="button"
                aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowLoginPassword(show => !show)}
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
                onClick={() => alert('Password recovery will be added later.')}
              >
                Forgot password?
              </button>
            </div>

            {loginError && (
              <p className="login-error" role="alert">{loginError}</p>
            )}

            <button
              className="main-login-btn redesigned-main-login-btn"
              type="submit"
            >
              Log In
            </button>

            <div className="register-text redesigned-register-text">
              <span>New to ConsultTime?</span>
              <button
                type="button"
                onClick={handleSignup}
              >
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

  if (currentPage === 'signup') {
    return (
      <div className="login-page redesigned-login-page signup-page">
        <nav>
          <div className="logo-container" onClick={handleHome} role="button" tabIndex={0}>
            <div className="logo">
              <img src={wmsuLogo} alt="WMSU Logo" />
              <img src={weblogo} alt="ConsultTime Logo" />
            </div>
            <span className="logo-text">ConsultTime</span>
          </div>

          <div className="nav-links">
            <a href="#" onClick={event => { event.preventDefault(); handleHome() }}>Home</a>
            <a href="#how-it-works" onClick={event => { event.preventDefault(); handleHome() }}>How it Works</a>
            <a href="#about" onClick={event => { event.preventDefault(); handleHome() }}>About</a>
          </div>

          <div className="pagebtn" onClick={handleLogin} role="button" tabIndex={0}>
            <span>Sign In</span>
          </div>
        </nav>

        <main className="signup-layout">
          <section className="login-intro-panel">
            <span className="login-audience-tag">For WMSU students</span>
            <h1>Your next step to academic support.</h1>
            <p className="login-intro-description">
              Join ConsultTime to connect with your facultyList and make time for the guidance you need.
            </p>

            <img
              className="login-feature-image"
              src={pic1}
              alt="ConsultTime consultation schedule"
            />

            <div className="login-benefit-list">
              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginUsersIcon /></span>
                <div>
                  <strong>Connect with your facultyList</strong>
                  <p>Find the right person for your questions.</p>
                </div>
              </div>
              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginCalendarIcon /></span>
                <div>
                  <strong>Book a convenient time</strong>
                  <p>Choose a consultation that fits your schedule.</p>
                </div>
              </div>
              <div className="login-benefit-item">
                <span className="login-benefit-icon"><LoginClipboardIcon /></span>
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

          <form className="signup-card" onSubmit={handleSignupSubmit} noValidate>
            <div className="signup-card-header">
              <h2>Create your student account</h2>
              <p>Enter your details to get started. All fields are required.</p>
            </div>

            <h3 className="signup-section"><UserOutlineIcon /> Personal Information</h3>
            <div className="signup-grid">
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-fullName">Full Name <span>*</span></label>
                  <div className={`signup-input${signupErrors.fullName ? ' has-error' : ''}`}>
                    <input id="su-fullName" type="text" placeholder="Enter your full name" value={signupForm.fullName} onChange={event => updateSignup('fullName', event.target.value)} />
                  </div>
                  {signupErrors.fullName && <p className="signup-error">{signupErrors.fullName}</p>}
                </div>
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-studentId">Student ID <span>*</span></label>
                  <div className={`signup-input${signupErrors.studentId ? ' has-error' : ''}`}>
                    <input id="su-studentId" type="text" placeholder="Enter your student ID" value={signupForm.studentId} onChange={event => updateSignup('studentId', event.target.value)} />
                  </div>
                  {signupErrors.studentId && <p className="signup-error">{signupErrors.studentId}</p>}
                </div>
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-email">University Email <span>*</span></label>
                  <div className={`signup-input${signupErrors.email ? ' has-error' : ''}`}>
                    <input id="su-email" type="email" placeholder="Your email @wmsu.edu.ph" value={signupForm.email} onChange={event => updateSignup('email', event.target.value)} />
                  </div>
                  {signupErrors.email && <p className="signup-error">{signupErrors.email}</p>}
                </div>
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-phone">Contact Number <span>*</span></label>
                  <div className={`signup-input${signupErrors.phone ? ' has-error' : ''}`}>
                    <input id="su-phone" type="tel" placeholder="Enter your contact number" value={signupForm.phone} onChange={event => updateSignup('phone', event.target.value)} />
                  </div>
                  {signupErrors.phone && <p className="signup-error">{signupErrors.phone}</p>}
                </div>
            </div>
            <p className="signup-hint">Use your official university email address to register.</p>

            <h3 className="signup-section"><GraduationCapIcon /> Academic Information</h3>
            <div className="signup-grid">
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-program">Program <span>*</span></label>
                  <div className={`signup-input signup-select${signupErrors.program ? ' has-error' : ''}`}>
                    <select id="su-program" className={signupForm.program ? '' : 'is-placeholder'} value={signupForm.program} onChange={event => updateSignup('program', event.target.value)}>
                      <option value="" disabled>Select your program</option>
                      <option value="Associate in Computer Technology">Associate in Computer Technology</option>
                      <option value="BS Computer Science">BS Computer Science</option>
                      <option value="BS Information Technology">BS Information Technology</option>
                      <option value="BS Information Systems">BS Information Systems</option>
                      <option value="Bachelor of Secondary Education">Bachelor of Secondary Education</option>
                      <option value="BS Nursing">BS Nursing</option>
                      <option value="BS Civil Engineering">BS Civil Engineering</option>
                      <option value="BS Business Administration">BS Business Administration</option>
                    </select>
                    <ChevronDownIcon />
                  </div>
                  {signupErrors.program && <p className="signup-error">{signupErrors.program}</p>}
                </div>
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-yearLevel">Year Level <span>*</span></label>
                  <div className={`signup-input signup-select${signupErrors.yearLevel ? ' has-error' : ''}`}>
                    <select id="su-yearLevel" className={signupForm.yearLevel ? '' : 'is-placeholder'} value={signupForm.yearLevel} onChange={event => updateSignup('yearLevel', event.target.value)}>
                      <option value="" disabled>Select your year level</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year">5th Year</option>
                    </select>
                    <ChevronDownIcon />
                  </div>
                  {signupErrors.yearLevel && <p className="signup-error">{signupErrors.yearLevel}</p>}
                </div>
            </div>

            <h3 className="signup-section"><LockIcon /> Account Security</h3>
            <div className="signup-grid">
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-password">Password <span>*</span></label>
                  <div className={`signup-input${signupErrors.password ? ' has-error' : ''}`}>
                    <input id="su-password" type={showSignupPassword ? 'text' : 'password'} placeholder="Create a password" value={signupForm.password} onChange={event => updateSignup('password', event.target.value)} />
                    <button className="password-toggle" type="button" aria-label={showSignupPassword ? 'Hide password' : 'Show password'} onClick={() => setShowSignupPassword(v => !v)}>
                      {showSignupPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {signupErrors.password && <p className="signup-error">{signupErrors.password}</p>}
                </div>
                <div className="signup-field">
                  <label className="signup-label" htmlFor="su-confirmPassword">Confirm Password <span>*</span></label>
                  <div className={`signup-input${signupErrors.confirmPassword ? ' has-error' : ''}`}>
                    <input id="su-confirmPassword" type={showSignupConfirm ? 'text' : 'password'} placeholder="Re-enter your password" value={signupForm.confirmPassword} onChange={event => updateSignup('confirmPassword', event.target.value)} />
                    <button className="password-toggle" type="button" aria-label={showSignupConfirm ? 'Hide password' : 'Show password'} onClick={() => setShowSignupConfirm(v => !v)}>
                      {showSignupConfirm ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                  {signupErrors.confirmPassword && <p className="signup-error">{signupErrors.confirmPassword}</p>}
                </div>
            </div>
            <p className="signup-hint after-grid">
              Use at least 8 characters, including uppercase and lowercase letters and a number.
            </p>

            <div className="signup-terms-wrap">
              <label className="signup-terms">
                <input
                  type="checkbox"
                  checked={signupForm.agree}
                  onChange={event => updateSignup('agree', event.target.checked)}
                />
                <span>
                  I agree to the <a className="signup-link" href="#terms" onClick={event => event.preventDefault()}>Terms of Service</a> and <a className="signup-link" href="#privacy" onClick={event => event.preventDefault()}>Privacy Policy</a>.
                </span>
              </label>
              {signupErrors.agree && <p className="signup-error">{signupErrors.agree}</p>}
            </div>

            <button className="signup-submit" type="submit">Create Account</button>

            <p className="signup-alt">
              Already have an account? <button type="button" onClick={handleLogin}>Sign In</button>
            </p>
          </form>
        </main>

        <footer className="login-page-footer">
          <span>ConsultTime · Western Mindanao State University</span>
          <span>Need help? Contact support</span>
        </footer>
      </div>
    )
  }



  /* STUDENT DASHBOARD */

  if (currentPage === 'dashboard') {

    return (
      <div className="dashboard-page">


        {/*TOP HEADER */}

        <header className="dashboard-header">


          {/* LOGO */}

          <div
            className="dashboard-logo"
            onClick={handleHome}
          >

            <div className="dashboard-logo-images">

              <img
                src={wmsuLogo}
                alt="WMSU Logo"
              />

              <img
                src={weblogo}
                alt="ConsultTime Logo"
              />

            </div>

            <span>
              ConsultTime
            </span>

          </div>


          {/* TOP NAVIGATION */}
          

          <div className="dashboard-top-nav">

            <button
              className={
                activeDashboardPage === 'dashboard'
                  ? 'top-nav-btn active'
                  : 'top-nav-btn'
              }
              onClick={() =>
                handleDashboardNavigation('dashboard')
              }
            >
              Home
            </button>


            <button
              className={
                activeDashboardPage === 'facultyList'
                  ? 'top-nav-btn active'
                  : 'top-nav-btn'
              }
              onClick={() =>
                handleDashboardNavigation('facultyList')
              }
            >
              Find Faculty
            </button>


            <button
              className={
                activeDashboardPage === 'bookings'
                  ? 'top-nav-btn active'
                  : 'top-nav-btn'
              }
              onClick={() =>
                handleDashboardNavigation('bookings')
              }
            >
              My Bookings
            </button>


            <button
              className={
                activeDashboardPage === 'profile'
                  ? 'top-nav-btn active'
                  : 'top-nav-btn'
              }
              onClick={() =>
                handleDashboardNavigation('profile')
              }
            >
              Profile
            </button>

          </div>


          {/* USER */}

          <div className="dashboard-user">

            <div className="user-avatar">
              <UserIcon />
            </div>

            <div className="user-information">

              <strong>
                {profileData.fullName}
              </strong>

              <span>
                Student
              </span>

            </div>

            <button
              className="user-arrow"
              type="button"
              aria-label="Open account menu"
              aria-expanded={isUserMenuOpen}
              onClick={() => setIsUserMenuOpen(open => !open)}
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
                  setIsUserMenuOpen(false)
                  handleLogout()
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
            <button className="faculty-dashboard-btn"
              onClick={() => {
                console.log('Faculty Dashboard button clicked')
                setIsFacultyView(true)
                loadAllBookings()
              }}
            >
              Faculty Dashboard
            </button>

            <button
              className={
                activeDashboardPage === 'dashboard'
                  ? 'sidebar-btn active'
                  : 'sidebar-btn'
              }
              onClick={() =>
                handleDashboardNavigation('dashboard')
              }
            >

              <HomeIcon />

              <span>
                Dashboard
              </span>

            </button>


            <button
              className={
                activeDashboardPage === 'facultyList'
                  ? 'sidebar-btn active'
                  : 'sidebar-btn'
              }
              onClick={() =>
                handleDashboardNavigation('facultyList')
              }
            >

              <SearchIcon />

              <span>
                Find Faculty
              </span>

            </button>


            <button
              className={
                activeDashboardPage === 'bookings'
                  ? 'sidebar-btn active'
                  : 'sidebar-btn'
              }
              onClick={() =>
                handleDashboardNavigation('bookings')
              }
            >

              <CalendarIcon />

              <span>
                My Bookings
              </span>

            </button>


            <button
              className={
                activeDashboardPage === 'profile'
                  ? 'sidebar-btn active'
                  : 'sidebar-btn'
              }
              onClick={() =>
                handleDashboardNavigation('profile')
              }
            >

              <UserIcon />

              <span>
                Profile
              </span>

            </button>

          </aside>


          {/*MAIN DASHBOARD CONTENT*/}

          <main className="dashboard-main">


            {/*DASHBOARD HOME */}

            {activeDashboardPage === 'dashboard' && (

              <>

                {/* WELCOME AREA */}

                <div className="dashboard-welcome">

                  <div className="welcome-content">

                    <p className="welcome-small">
                      Hello,
                    </p>

                    <h1>
                      {profileData.fullName}!
                    </h1>

                    <p className="welcome-description">
                      Book a consultation with your Faculty Members
                      <br />
                      and get the academic support you need.
                    </p>


                    {/* SEARCH */}

                    <div className="dashboard-search">

                      <div className="search-input">

                        <SearchIcon />

                        <input
                          type="text"
                          placeholder="Search facultyList by name, subject, or department..."
                          value={facultySearch}
                          onChange={event => setfacultySearch(event.target.value)}
                          onKeyDown={event => { if (event.key === 'Enter') { setSelectedDepartment('All Departments'); handleDashboardNavigation('facultyList') } }}
                        />

                      </div>


                      <button
                        className="dashboard-search-btn"
                        onClick={() => { setSelectedDepartment('All Departments'); handleDashboardNavigation('facultyList') }}
                      >
                        Search
                      </button>

                    </div>

                  </div>


                  {/* DASHBOARD IMAGE */}

                  <div className="dashboard-image">

                    <img
                      src={calendar}
                      alt="Consultation schedule"
                    />

                  </div>

                </div>


                {/* STAT CARDS */}

                <div className="stat-grid">


                  <div
                    className="stat-card"
                    onClick={() =>
                      handleDashboardNavigation('facultyList')
                    }
                  >

                    <div className="stat-icon">
                      <UsersIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        Available facultyList
                      </span>

                      <strong>
                        {availablefacultyListCount}
                      </strong>

                    </div>

                    <ChevronIcon />

                  </div>


                  <div
                    className="stat-card"
                    onClick={() =>
                      handleDashboardNavigation('bookings')
                    }
                  >

                    <div className="stat-icon">
                      <CalendarIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        Upcoming Consultations
                      </span>

                      <strong>
                        {upcomingBookings.length}
                      </strong>

                    </div>

                    <ChevronIcon />

                  </div>


                  <div
                    className="stat-card"
                    onClick={() =>
                      handleDashboardNavigation('bookings')
                    }
                  >

                    <div className="stat-icon">
                      <CalendarIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        My Bookings
                      </span>

                      <strong>
                        {bookings.length}
                      </strong>

                    </div>

                    <ChevronIcon />

                  </div>


                  <div className="stat-card" onClick={() => { setBookingFilter('Pending'); handleDashboardNavigation('bookings') }}>

                    <div className="stat-icon">
                      <ClockIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        Pending Requests
                      </span>

                      <strong>
                        {pendingCount}
                      </strong>

                    </div>

                    <ChevronIcon />

                  </div>

                </div>


                {/* LOWER CONTENT */}

                <div className="dashboard-lower">


                  {/* Find Faculty */}

                  <div className="facultyList-section">

                    <div className="section-heading">

                      <h2>
                        Find a facultyList
                      </h2>

                      <button
                        onClick={() =>
                          handleDashboardNavigation('facultyList')
                        }
                      >
                        View All
                      </button>

                    </div>


                    <div className="facultyList-grid">


                      {/* facultyList 1 */}

                      <div className="facultyList-card">

                        <div className="facultyList-avatar avatar-one">
                          MS
                        </div>

                        <h3>
                          Prof. Novie Jozane
                        </h3>

                        <p className="facultyList-department">
                          Computer Science
                        </p>

                        <div className="facultyList-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(facultyList[0])}
                          </span>

                        </div>

                        <div className="facultyList-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            facultyList Room 204
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Novie Jozane',
                            department: 'Computer Science',
                            room: 'facultyList Room 204'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* facultyList 2 */}

                      <div className="facultyList-card">

                        <div className="facultyList-avatar avatar-two">
                          JR
                        </div>

                        <h3>
                          Prof. Kris
                        </h3>

                        <p className="facultyList-department">
                          Information Technology
                        </p>

                        <div className="facultyList-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(facultyList[1])}
                          </span>

                        </div>

                        <div className="facultyList-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            facultyList Room 101
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Kris',
                            department: 'Information Technology',
                            room: 'facultyList Room 101'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* facultyList 3 */}

                      <div className="facultyList-card">

                        <div className="facultyList-avatar avatar-three">
                          LR
                        </div>

                        <h3>
                          Prof. Ian Lim
                        </h3>

                        <p className="facultyList-department">
                          Mathematics
                        </p>

                        <div className="facultyList-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(facultyList[2])}
                          </span>

                        </div>

                        <div className="facultyList-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            facultyList Room 305
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Ian Lim',
                            department: 'Mathematics',
                            room: 'facultyList Room 305'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* facultyList 4 */}

                      <div className="facultyList-card">

                        <div className="facultyList-avatar avatar-four">
                          CS
                        </div>

                        <h3>
                          Prof. Ellice Vicente
                        </h3>

                        <p className="facultyList-department">
                          Engineering
                        </p>

                        <div className="facultyList-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(facultyList[3])}
                          </span>

                        </div>

                        <div className="facultyList-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            Engineering Building 2B
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Ellice Vicente',
                            department: 'Engineering',
                            room: 'Engineering Building 2B'
                          })}
                        >
                          View Availability
                        </button>

                      </div>

                    </div>

                  </div>


                  {/* RIGHT COLUMN */}

                  <div className="dashboard-right-column">


                    {/* UPCOMING CONSULTATION */}

                    <div className="upcoming-section">

                      <div className="section-heading">

                        <h2>
                          Upcoming Consultation
                        </h2>

                        <button
                          onClick={() =>
                            handleDashboardNavigation('bookings')
                          }
                        >
                          View All
                        </button>

                      </div>


                      {nextBooking ? <div className="consultation-card">
                        <div className="consultation-icon"><CalendarIcon /></div>
                        <div className="consultation-info"><h3>{nextBooking.facultyList}</h3><p>{nextBooking.department}</p><div>{nextBooking.date} · {nextBooking.time}</div><div>{nextBooking.location}</div></div>
                        <span className="confirmed">Confirmed</span>
                      </div> : <p className="availability-demo-note">No upcoming confirmed consultations. Pending requests appear in My Bookings.</p>}

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="quick-actions">

                      <h2>
                        Quick Actions
                      </h2>


                      <div className="quick-grid">


                        <button
                          className="quick-card"
                          onClick={() =>
                            handleDashboardNavigation('facultyList')
                          }
                        >

                          <div className="quick-icon">
                            <SearchIcon />
                          </div>

                          <div>

                            <strong>
                              Find Faculty
                            </strong>

                            <span>
                              Search and filter facultyList
                              <br />
                              members
                            </span>

                          </div>

                          <ChevronIcon />

                        </button>


                        <button
                          className="quick-card"
                          onClick={() =>
                            handleDashboardNavigation('bookings')
                          }
                        >

                          <div className="quick-icon">
                            <CalendarIcon />
                          </div>

                          <div>

                            <strong>
                              My Bookings
                            </strong>

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
                          onClick={() =>
                            handleDashboardNavigation('profile')
                          }
                        >

                          <div className="quick-icon">
                            <UserIcon />
                          </div>

                          <div>

                            <strong>
                              Profile
                            </strong>

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
                            alert('Contact support will be added later.')
                          }
                        >

                          <div className="quick-icon">
                            <BookIcon />
                          </div>

                          <div>

                            <strong>
                              Need Help?
                            </strong>

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


            {/*Find Faculty PAGE*/}

            {activeDashboardPage === 'facultyList' && (

              <div className="find-facultyList-page">

                <div className="facultyList-page-heading">
                  <div>
                    <p className="facultyList-eyebrow">CONSULTATION DIRECTORY</p>
                    <h1>Find Faculty</h1>
                    <p className="facultyList-page-description">
                      Browse Faculty Members and find the right person to help with your academic concerns.
                    </p>
                  </div>

                  <div className="facultyList-heading-icon">
                    <UsersIcon />
                  </div>
                </div>

                <div className="facultyList-search-panel">
                  <div className="facultyList-search-field">
                    <SearchIcon />
                    <input
                      type="text"
                      value={facultySearch}
                      onChange={(e) => setfacultySearch(e.target.value)}
                      placeholder="Search by faculty name, subject, or department..."
                    />
                  </div>

                  <div className="facultyList-filter-field">
                    <label>Department</label>
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                    >
                      <option>All Departments</option>
                      <option>Computer Science</option>
                      <option>Information Technology</option>
                      <option>Mathematics</option>
                      <option>Engineering</option>
                    </select>
                  </div>

                  <button className="facultyList-search-submit">
                    <SearchIcon />
                    Search
                  </button>
                </div>

                <div className="facultyList-results-heading" id="facultyList-results">
                  <div>
                    <h2>Faculty Members</h2>
                    <p>Choose a faculty member to view their consultation availability.</p>
                  </div>
                  <span className="facultyList-result-count">
                    {facultyList.filter((facultyList) => {
                      const query = facultySearch.trim().toLowerCase()
                      const matchesQuery = !query || `${facultyList.name} ${facultyList.department} ${facultyList.subject}`.toLowerCase().includes(query)
                      const matchesDepartment = selectedDepartment === 'All Departments' || facultyList.department === selectedDepartment
                      return matchesQuery && matchesDepartment
                    }).length} results
                  </span>
                </div>

                <div className="facultyList-directory-grid">
                  {facultyList.filter((facultyList) => {
                    const query = facultySearch.trim().toLowerCase()
                    const matchesQuery = !query || `${facultyList.name} ${facultyList.department} ${facultyList.subject}`.toLowerCase().includes(query)
                    const matchesDepartment = selectedDepartment === 'All Departments' || facultyList.department === selectedDepartment
                    return matchesQuery && matchesDepartment
                  }).map((facultyList) => (
                    <article className="directory-facultyList-card" key={facultyList.name}>
                      <div className="directory-card-top">
                        <div className={`facultyList-avatar ${facultyList.style}`}>{facultyList.initials}</div>
                        <span className="facultyList-status"><span></span> Consultation hours</span>
                      </div>

                      <h3>{facultyList.name}</h3>
                      <p className="directory-department">{facultyList.department}</p>
                      <p className="directory-subject">{facultyList.subject}</p>

                      <div className="directory-detail">
                        <CalendarIcon />
                        <div>
                          <strong>{getFacultyDates(facultyList)[0]?.label || 'No published slots'}</strong>
                          <span>{facultyHours(facultyList)}</span>
                        </div>
                      </div>

                      <div className="directory-detail">
                        <BookIcon />
                        <div><span>{facultyList.room}</span></div>
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
                  const query = facultySearch.trim().toLowerCase()
                  const matchesQuery = !query || `${facultyList.name} ${facultyList.department} ${facultyList.subject}`.toLowerCase().includes(query)
                  const matchesDepartment = selectedDepartment === 'All Departments' || facultyList.department === selectedDepartment
                  return matchesQuery && matchesDepartment
                }).length === 0 && (
                  <div className="facultyList-empty-state">
                    <SearchIcon />
                    <h3>No Faculty Members found</h3>
                    <p>Try another name or choose a different department.</p>
                    <button onClick={() => { setfacultySearch(''); setSelectedDepartment('All Departments') }}>
                      Clear filters
                    </button>
                  </div>
                )}

              </div>

            )}


            {selectedfacultyForBooking && (
              <div
                className="availability-modal-backdrop"
                onClick={closeFacultyAvailability}
              >
                <section
                  className="availability-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="availability-modal-title"
                  onClick={event => event.stopPropagation()}
                >
                  <div className="availability-modal-heading">
                    <div>
                      <span className="facultyList-eyebrow">BOOK A CONSULTATION</span>
                      <h2 id="availability-modal-title">{selectedfacultyForBooking.name}</h2>
                      <p>{selectedfacultyForBooking.department} · {selectedfacultyForBooking.room}</p>
                    </div>
                    <button
                      className="availability-modal-close"
                      type="button"
                      aria-label="Close availability"
                      onClick={closeFacultyAvailability}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleCreateBooking}>
                    <fieldset className="availability-date-fieldset">
                      <legend>Choose date to consult</legend>
                      <div className="availability-date-list">
                        {availableBookingDates.map(date => (
                          <button
                            className={`availability-date-option${selectedBookingDate === date.key ? ' selected' : ''}`}
                            key={date.key}
                            type="button"
                            aria-pressed={selectedBookingDate === date.key}
                            onClick={() => {
                              setSelectedBookingDate(date.key)
                              setSelectedBookingTime('')
                            }}
                          >
                            <span>{date.label.split(',')[0]}</span>
                            <strong>{date.label.split(' ').slice(1).join(' ')}</strong>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="availability-time-fieldset">
                      <legend>Choose a 30-minute time slot</legend>
                      <div className="availability-time-list">
                        {getTimeSlots(selectedfacultyForBooking, selectedBookingDate).map(time => {
                          const isBooked = hasConflict(bookings, selectedBookingDate, time)

                          return (
                            <button
                              className={`availability-time-option${selectedBookingTime === time ? ' selected' : ''}`}
                              key={time}
                              type="button"
                              disabled={isBooked}
                              aria-pressed={selectedBookingTime === time}
                              onClick={() => setSelectedBookingTime(time)}
                            >
                              {isBooked ? `${time} · Booked` : time}
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>

                    <label className="availability-subject-field">
                      <span>What would you like to discuss?</span>
                      <textarea
                        value={bookingSubject}
                        onChange={event => setBookingSubject(event.target.value)}
                        placeholder="Enter a subject or brief consultation topic"
                        rows="3"
                        minLength={5}
                        maxLength={300}
                        required
                      />
                    </label>

                    <p className="availability-demo-note">
                      facultyList-specific demo schedules · Asia/Manila. Requests need facultyList approval.
                    </p>

                    {bookingError && <p className="booking-validation-error" role="alert">{bookingError}</p>}
                    {!availableBookingDates.length && <p role="status">No published availability. Please try another facultyList member.</p>}
                    <div className="availability-modal-actions">
                      <button className="availability-cancel-button" type="button" onClick={closeFacultyAvailability}>
                        Cancel
                      </button>
                      <button
                        className="availability-confirm-button"
                        type="submit"
                        disabled={!selectedBookingDate || !selectedBookingTime || !bookingSubject.trim()}
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            )}

            {/* BOOKINGS PAGE */}


            {activeDashboardPage === 'bookings' && (
  <div className="bookings-page" style={{ padding: '30px' }}>
    <h1>My Bookings</h1>
    <p>Keep track of your consultations</p>

    {bookings.length === 0 ? (
      <p style={{ marginTop: '20px' }}>You have no bookings yet.</p>
    ) : (
      <div style={{ marginTop: '20px' }}>
        {bookings.map(booking => (
          <div 
            key={booking.id}
            style={{
              border: '1px solid #e5e7eb',
              padding: '16px',
              marginBottom: '12px',
              borderRadius: '10px',
              background: 'white',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>
              {booking.faculty_name || 'Faculty Member'}
            </h3>
            <p style={{ margin: '4px 0' }}>
              <strong>Date:</strong> {booking.date_key}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Time:</strong> {booking.time_slot}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Topic:</strong> {booking.subject}
            </p>
            <p style={{ margin: '4px 0' }}>
              <strong>Status:</strong>{' '}
              <span style={{
                color: booking.status === 'Pending' ? '#d97706' :
                       booking.status === 'Confirmed' ? '#16a34a' : '#dc2626',
                fontWeight: '600'
              }}>
                {booking.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
)}


            {/* PROFILE PAGE*/}

            {activeDashboardPage === 'profile' && (
              <div className="profile-page">
                <div className="profile-page-heading">
                  <div className="profile-heading-icon"><UserIcon /></div>
                  <div>
                    <span className="profile-eyebrow">STUDENT ACCOUNT</span>
                    <h1>My Profile</h1>
                    <p>View and manage your personal and academic information.</p>
                  </div>
                </div>

                <section className="profile-overview-card">
                  <div className="profile-avatar">{profileData.fullName.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase()}</div>
                  <div className="profile-overview-info">
                    <h2>{profileData.fullName || 'Student Name'}</h2>
                    <p>{profileData.course} <span>•</span> {profileData.yearLevel}</p>
                    <span className="profile-account-badge"><UserIcon /> Student Account</span>
                  </div>
                  <button className="profile-edit-button" onClick={() => { setIsProfileEditing(current => !current); setProfileSaved(false) }}>
                    <UserIcon /> {isProfileEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </section>

                {profileSaved && <div className="profile-success-message">Your profile changes have been saved for this session.</div>}

                <div className="profile-content-grid">
                  <section className="profile-details-card">
                    <div className="profile-section-heading">
                      <div><h2>Personal Information</h2><p>Keep your contact information up to date.</p></div>
                    </div>
                    <div className="profile-fields-grid">
                      <label className="profile-field">
                        <span>Full Name</span>
                        <input
                          type="text"
                          autoComplete="name"
                          value={profileData.fullName}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, fullName: event.target.value }))}
                        />
                      </label>
                      <label className="profile-field">
                        <span>Student ID</span>
                        <input
                          type="text"
                          value={profileData.studentId}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, studentId: event.target.value }))}
                        />
                      </label>
                      <label className="profile-field">
                        <span>Email</span>
                        <input
                          type="email"
                          autoComplete="email"
                          value={profileData.email}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, email: event.target.value }))}
                        />
                      </label>
                      <label className="profile-field">
                        <span>Contact Number</span>
                        <input
                          type="tel"
                          autoComplete="tel"
                          value={profileData.phone}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, phone: event.target.value }))}
                        />
                      </label>
                      <label className="profile-field">
                        <span>Year Level</span>
                        <input
                          type="text"
                          value={profileData.yearLevel}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, yearLevel: event.target.value }))}
                        />
                      </label>
                      <label className="profile-field">
                        <span>Section</span>
                        <input
                          type="text"
                          value={profileData.section}
                          readOnly={!isProfileEditing}
                          onChange={event => setProfileData(current => ({ ...current, section: event.target.value }))}
                        />
                      </label>
                    </div>
                    {isProfileEditing && <div className="profile-form-actions"><button className="profile-discard-button" onClick={() => { setIsProfileEditing(false); setProfileSaved(false) }}>Cancel</button><button className="profile-save-button" onClick={() => { setIsProfileEditing(false); setProfileSaved(true) }}>Save Changes</button></div>}
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
                  <p>Profile details are currently stored in this page preview only.</p>
                  <div className="profile-bottom-actions">
                    <button className="profile-back-button" onClick={() => handleDashboardNavigation('dashboard')}><ChevronIcon /> Back to Dashboard</button>
                    <button className="profile-logout-button" onClick={handleLogout}>Log Out</button>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      
    )
  }

  {currentPage === 'dashboard' && currentStudent && (
  <main className="dashboard-page">
    {/* your existing student dashboard code */}
  </main>
)}

{/* ========== FACULTY DASHBOARD ========== */}
{isFacultyView && (
  <main style={{ padding: '30px', minHeight: '80vh', background: '#f8fafc' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
      <h2 style={{ margin: 0 }}>Faculty Dashboard – Manage Bookings</h2>
      <button
        onClick={() => setIsFacultyView(false)}
        style={{
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer'
        }}
      >
        ← Back to Student View
      </button>
    </div>

    {allBookings.length === 0 ? (
      <p>No bookings yet.</p>
    ) : (
      allBookings.map(booking => (
        <div
          key={booking.id}
          style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <h3 style={{ marginTop: 0 }}>{booking.student_name} ({booking.student_id})</h3>
          <p><strong>Email:</strong> {booking.student_email}</p>
          <p><strong>Faculty:</strong> {booking.faculty_name}</p>
          <p><strong>Date:</strong> {booking.date_key} &nbsp;|&nbsp; <strong>Time:</strong> {booking.time_slot}</p>
          <p><strong>Topic:</strong> {booking.subject}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={{
              fontWeight: 600,
              color: booking.status === 'Pending' ? '#d97706' :
                     booking.status === 'Confirmed' ? '#16a34a' : '#dc2626'
            }}>
              {booking.status}
            </span>
          </p>

          {booking.status === 'Pending' && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={() => handleAccept(booking.id)}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  marginRight: '10px',
                  cursor: 'pointer'
                }}
              >
                Accept
              </button>
              <button
                onClick={() => handleDecline(booking.id)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '8px 18px',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      ))
    )}
  </main>
)}


  /* LANDING PAGE */

  return (
    <>

      <section className="hero">


        {/* NAVIGATION */}

        <nav>

          <div className="logo-container">
            <div className="logo">

              <img
                src={wmsuLogo}
                alt="WMSU Logo"
              />

              <img
                src={weblogo}
                alt="ConsultTime Logo"
              />
            </div>

            <span className="logo-text">
              ConsultTime
            </span>

          </div>

          <div className="nav-links">

            <a href="#">
              Home
            </a>

            <a href="#how-it-works">
              How it Works
            </a>

            <a href="#about">
              About
            </a>

          </div>


          <div
            className="log-container"
            onClick={handleLogin}
          >
            <span>
              Log In
            </span>
          </div>

        </nav>


        {/* HERO */}

        <main className="hero-content">

          <div className="hero-text">

            <h1>

              Schedule Consultations.

              <br />

              <span>
                Connect With Your facultyList.
              </span>

            </h1>

          </div>


          <div className="img-container">

            <img
              src={calendar}
              alt="Calendar"
            />

          </div>

        </main>


        <div className="hero-paragraph">

          <p>
            ConsultTime provides a convenient way for students and facultyList
            to handle academic consultations in one place. Students can
            check facultyList schedules, select a suitable consultation time,
            and book appointments, while Faculty Members can organize their
            availability and keep track of upcoming consultations.
            By keeping schedules and bookings organized, the platform
            makes communication and appointment management smoother and
            more efficient.
          </p>

        </div>


        <div className="login-container">

          <span
            className="login-btn"
            onClick={handleLogin}
          >
            Get Started
          </span>

          <span
            className="learn-btn"
            onClick={handleLearnMore}
          >
            Learn More
          </span>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section
        className="how-it-works"
        id="how-it-works"
      >

        <h1>
          HOW IT WORKS
        </h1>

        <div className="item-container">

          <div className="item">

            <h2>
              1
            </h2>

            <p>
              Sign up for an account and log in
              to the platform.
            </p>

          </div>


          <div className="arrow-item">
            <h2>→</h2>
          </div>


          <div className="item">

            <h2>
              2
            </h2>

            <p>
              Browse available Faculty Members
              and their consultation schedules.
            </p>

          </div>


          <div className="arrow-item">
            <h2>→</h2>
          </div>


          <div className="item">

            <h2>
              3
            </h2>

            <p>
              Book a consultation with your
              chosen facultyList member.
            </p>

          </div>

        </div>

      </section>


      {/* ABOUT */}

      <section
        className="about"
        id="about"
      >

        <div>

          <h1>
            ABOUT
          </h1>

          <p>
            ConsultTime is a platform designed to streamline
            the process of scheduling academic consultations
            between students and Faculty Members.
          </p>

        </div>


        <div className="about-container">

          <div className="about-def">
            <p>
              Helps students and facultyList set and organize
              consultation times.
            </p>
          </div>

          <div className="about-def">
            <p>
              Allows students to quickly find available
              facultyList and suitable consultation schedules.
            </p>
          </div>

          <div className="about-def">
            <p>
              Prevents overlapping appointments and
              helps avoid double bookings.
            </p>
          </div>

          <div className="about-def">
            <p>
              Lets students reserve an available
              consultation slot with a facultyList member.
            </p>
          </div>

          <div className="about-def">
            <p>
              Shows the available dates and times when
              Faculty Members can accommodate consultations.
            </p>
          </div>

        </div>


        <div className="about-container">

          <div className="about-item">
            <h2>
              Scheduling
            </h2>
          </div>

          <div className="about-item">
            <h2>
              Search
            </h2>
          </div>

          <div className="about-item">
            <h2>
              No Conflicts
            </h2>
          </div>

          <div className="about-item">
            <h2>
              Bookings
            </h2>
          </div>

          <div className="about-item">
            <h2>
              facultyList Availability
            </h2>
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <section className="footer">

        <p>
          &copy; 2026 facultyList Consultation.
          All rights reserved.
        </p>

      </section>

    </>
  )
}

export default App
