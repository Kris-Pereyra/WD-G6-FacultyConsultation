import { useState } from 'react'
import './App.css'
/*import BackendTest from './BackendTest';*/

import weblogo from './assets/weblogo.jpg'
import wmsuLogo from './assets/wmsuLogo.png'
import calendar from './assets/calendar.jpg'


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

// Demo schedules only. Replace with faculty-published availability from Express.
const FACULTY = [
  { id: 'novie', name: 'Prof. Novie Jozane', department: 'Computer Science', subject: 'Programming and software development', room: 'Faculty Room 204', initials: 'NJ', style: 'avatar-one', days: [1,3], start: 14*60, end: 16*60 },
  { id: 'kris', name: 'Prof. Kris', department: 'Information Technology', subject: 'Networking and information systems', room: 'Faculty Room 101', initials: 'KR', style: 'avatar-two', days: [2,4], start: 9*60, end: 11*60 },
  { id: 'ian', name: 'Prof. Ian Lim', department: 'Mathematics', subject: 'Mathematics and statistics', room: 'Faculty Room 305', initials: 'IL', style: 'avatar-three', days: [1,5], start: 13*60, end: 15*60 },
  { id: 'ellice', name: 'Prof. Ellice Vicente', department: 'Engineering', subject: 'Engineering fundamentals', room: 'Engineering Building 2B', initials: 'EV', style: 'avatar-four', days: [3,5], start: 10*60, end: 12*60 }
]
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
function bookingStart(booking) { return slotStart(booking.dateKey, booking.time) }
function getTimeSlots(faculty, dateKey) {
  if (!faculty || !dateKey || !faculty.days.includes(new Date(dateKey+'T12:00:00Z').getUTCDay())) return []
  const slots = []
  for (let minute = faculty.start; minute + 30 <= faculty.end; minute += 30) {
    const time = formatMinutes(minute) + ' - ' + formatMinutes(minute + 30)
    if (slotStart(dateKey, time) > Date.now()) slots.push(time)
  }
  return slots
}
function getFacultyDates(faculty, count = 10) {
  if (!faculty) return []
  const dates = []
  const day = new Date(manilaToday()+'T12:00:00Z')
  for (let offset = 0; offset < 60 && dates.length < count; offset++) {
    const key = day.toISOString().slice(0,10)
    if (getTimeSlots(faculty,key).length) dates.push({key,
      label: day.toLocaleDateString('en-US',{timeZone:'UTC',weekday:'short',month:'short',day:'numeric'}),
      fullDate: day.toLocaleDateString('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'})})
    day.setUTCDate(day.getUTCDate()+1)
  }
  return dates
}
function facultyHours(faculty) {
  return faculty.days.map(day => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][day]).join(', ') + ' · ' + formatMinutes(faculty.start) + ' – ' + formatMinutes(faculty.end) + ' (Manila)'
}
function hasConflict(bookings, dateKey, time) {
  const start = slotStart(dateKey,time)
  return bookings.some(booking => isActive(booking) && Math.abs(bookingStart(booking)-start) < 30*60*1000)
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

  const [currentPage, setCurrentPage] = useState('home')
  const [activeDashboardPage, setActiveDashboardPage] = useState('dashboard')
  const [facultySearch, setFacultySearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [bookingFilter, setBookingFilter] = useState('All Bookings')
  const [bookingSearch, setBookingSearch] = useState('')
  const [isProfileEditing, setIsProfileEditing] = useState(false)
  const [profileSaved, setProfileSaved] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [selectedFacultyForBooking, setSelectedFacultyForBooking] = useState(null)
  const [selectedBookingDate, setSelectedBookingDate] = useState('')
  const [selectedBookingTime, setSelectedBookingTime] = useState('')
  const [bookingSubject, setBookingSubject] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
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
  const availableBookingDates = getFacultyDates(selectedFacultyForBooking)
  const upcomingBookings = bookings.filter(booking => booking.status === 'Confirmed' && bookingStart(booking) > Date.now()).sort((a,b) => bookingStart(a)-bookingStart(b))
  const nextBooking = upcomingBookings[0]
  const pendingCount = bookings.filter(booking => booking.status === 'Pending').length
  const availableFacultyCount = FACULTY.filter(faculty => getFacultyDates(faculty).some(date => getTimeSlots(faculty,date.key).some(time => !hasConflict(bookings,date.key,time)))).length



  /* NAVIGATION*/

  function handleLogin() {
    setCurrentPage('login')
    window.scrollTo(0, 0)
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

  function handleLoginSubmit(event) {
    event.preventDefault()

    const normalizedEmail = loginEmail.trim().toLowerCase()
    const gmailPattern = /^[a-z0-9]+(?:\.[a-z0-9]+)*(?:\+[a-z0-9]+(?:\.[a-z0-9]+)*)?@gmail\.com$/

    if (!gmailPattern.test(normalizedEmail)) {
      setLoginError('Enter a valid Gmail address, such as name@gmail.com.')
      return
    }

    if (!loginPassword) {
      setLoginError('Enter your password to continue.')
      return
    }

    setProfileData(current => ({
      ...current,
      email: normalizedEmail,
      fullName: getNameFromEmail(normalizedEmail)
    }))
    setLoginError('')
    handleDashboard()
  }

  function handleLogout() {
    setIsProfileEditing(false)
    setProfileSaved(false)
    setActiveDashboardPage('dashboard')
    setCurrentPage('home')
    setBookings([])
    setBookingNotice('')
    setLoginPassword('')
    window.scrollTo(0, 0)
  }

  function openFacultyAvailability(faculty) {
    const member = FACULTY.find(item => item.name === faculty.name)
    if (!member) return
    setBookingError('')
    setSelectedFacultyForBooking(member)
    setSelectedBookingDate(getFacultyDates(member)[0]?.key || '')
    setSelectedBookingTime('')
    setBookingSubject('')
  }

  function closeFacultyAvailability() {
    setSelectedFacultyForBooking(null)
    setSelectedBookingDate('')
    setSelectedBookingTime('')
    setBookingSubject('')
  }

  function handleCreateBooking(event) {
    event.preventDefault()
    const subject = bookingSubject.trim()
    if (!selectedFacultyForBooking || !selectedBookingDate || !selectedBookingTime) {
      setBookingError('Choose a faculty member, date, and time.'); return
    }
    if (subject.length < 5 || subject.length > 300) {
      setBookingError('Enter a consultation topic between 5 and 300 characters.'); return
    }
    const bookingDate = getFacultyDates(selectedFacultyForBooking).find(date => date.key === selectedBookingDate)
    if (!bookingDate || !getTimeSlots(selectedFacultyForBooking, selectedBookingDate).includes(selectedBookingTime)) {
      setBookingError('This time is no longer available. Please choose another slot.'); setSelectedBookingTime(''); return
    }
    if (hasConflict(bookings,selectedBookingDate,selectedBookingTime)) {
      setBookingError('You already have a pending or confirmed consultation that overlaps this time.'); return
    }
    setBookings(current => [{
      id: crypto.randomUUID(), facultyId: selectedFacultyForBooking.id,
      faculty: selectedFacultyForBooking.name, department: selectedFacultyForBooking.department,
      subject, dateKey: selectedBookingDate, date: bookingDate.fullDate, time: selectedBookingTime,
      location: selectedFacultyForBooking.room, status: 'Pending', createdAt: new Date().toISOString()
    }, ...current])
    closeFacultyAvailability()
    setBookingNotice('Request submitted. It remains Pending until the faculty confirms or declines it.')
    setBookingFilter('All Bookings')
    setBookingSearch('')
    setActiveDashboardPage('bookings')
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

 
  /*LOGIN PAGE */

  if (currentPage === 'login') {
    return (
      <div className="login-page redesigned-login-page">
        {/* LOGIN NAVIGATION */}
        <nav className="login-top-nav">
          <div className="login-nav-brand" onClick={handleHome} role="button" tabIndex={0}>
            <div className="login-logo-images">
              <img src={wmsuLogo} alt="WMSU Logo" />
              <img src={weblogo} alt="ConsultTime Logo" />
            </div>
            <span>ConsultTime</span>
          </div>

          <div className="login-nav-links">
            <button type="button" onClick={handleHome}>Home</button>
            <button type="button" onClick={handleHome}>How It Works</button>
            <button type="button" onClick={handleHome}>About</button>
          </div>

          <button
            className="login-signup-btn"
            type="button"
            onClick={() => alert('Student sign-up will be added later.')}
          >
            Sign Up
          </button>
        </nav>

        {/* LOGIN CONTENT */}
        <main className="redesigned-login-layout">
          <section className="login-intro-panel">
            <span className="login-audience-tag">For WMSU students</span>
            <h1>Your next step to academic support.</h1>
            <p className="login-intro-description">
              Connect with your faculty and make time for the guidance you need.
            </p>

            <img
              className="login-feature-image"
              src={calendar}
              alt="ConsultTime consultation schedule"
            />

            <div className="login-benefit-list">
              <div className="login-benefit-item">
                <span className="login-benefit-icon"><UsersIcon /></span>
                <div>
                  <strong>Connect with your faculty</strong>
                  <p>Find the right person for your questions.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon"><CalendarIcon /></span>
                <div>
                  <strong>Book a convenient time</strong>
                  <p>Choose a consultation that fits your schedule.</p>
                </div>
              </div>

              <div className="login-benefit-item">
                <span className="login-benefit-icon"><BookIcon /></span>
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
              <p>Log in to manage your consultations and connect with your faculty.</p>
            </div>

            <label className="login-form-label" htmlFor="login-email">
              Email <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                placeholder="name@gmail.com"
                value={loginEmail}
                onChange={event => {
                  setLoginEmail(event.target.value);
                  setLoginError('');
                }}
                required
              />
            </div>

            <small className="login-field-hint">
              Use a valid Gmail address for the demo login.
            </small>

            <label className="login-form-label password-label" htmlFor="login-password">
              Password <span>*</span>
            </label>

            <div className="input-group redesigned-input-group">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={event => {
                  setLoginPassword(event.target.value);
                  setLoginError('');
                }}
                required
              />
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
                onClick={() => alert('Student account registration will be added later.')}
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
                activeDashboardPage === 'faculty'
                  ? 'top-nav-btn active'
                  : 'top-nav-btn'
              }
              onClick={() =>
                handleDashboardNavigation('faculty')
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
                activeDashboardPage === 'faculty'
                  ? 'sidebar-btn active'
                  : 'sidebar-btn'
              }
              onClick={() =>
                handleDashboardNavigation('faculty')
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
                          onChange={event => setFacultySearch(event.target.value)}
                          onKeyDown={event => { if (event.key === 'Enter') { setSelectedDepartment('All Departments'); handleDashboardNavigation('faculty') } }}
                        />

                      </div>


                      <button
                        className="dashboard-search-btn"
                        onClick={() => { setSelectedDepartment('All Departments'); handleDashboardNavigation('faculty') }}
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
                      handleDashboardNavigation('faculty')
                    }
                  >

                    <div className="stat-icon">
                      <UsersIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        Available Faculty
                      </span>

                      <strong>
                        {availableFacultyCount}
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


                  {/* FIND FACULTY */}

                  <div className="faculty-section">

                    <div className="section-heading">

                      <h2>
                        Find a Faculty
                      </h2>

                      <button
                        onClick={() =>
                          handleDashboardNavigation('faculty')
                        }
                      >
                        View All
                      </button>

                    </div>


                    <div className="faculty-grid">


                      {/* FACULTY 1 */}

                      <div className="faculty-card">

                        <div className="faculty-avatar avatar-one">
                          MS
                        </div>

                        <h3>
                          Prof. Novie Jozane
                        </h3>

                        <p className="faculty-department">
                          Computer Science
                        </p>

                        <div className="faculty-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(FACULTY[0])}
                          </span>

                        </div>

                        <div className="faculty-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            Faculty Room 204
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Novie Jozane',
                            department: 'Computer Science',
                            room: 'Faculty Room 204'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* FACULTY 2 */}

                      <div className="faculty-card">

                        <div className="faculty-avatar avatar-two">
                          JR
                        </div>

                        <h3>
                          Prof. Kris
                        </h3>

                        <p className="faculty-department">
                          Information Technology
                        </p>

                        <div className="faculty-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(FACULTY[1])}
                          </span>

                        </div>

                        <div className="faculty-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            Faculty Room 101
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Kris',
                            department: 'Information Technology',
                            room: 'Faculty Room 101'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* FACULTY 3 */}

                      <div className="faculty-card">

                        <div className="faculty-avatar avatar-three">
                          LR
                        </div>

                        <h3>
                          Prof. Ian Lim
                        </h3>

                        <p className="faculty-department">
                          Mathematics
                        </p>

                        <div className="faculty-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(FACULTY[2])}
                          </span>

                        </div>

                        <div className="faculty-detail">

                          <span className="location-symbol">
                            ◇
                          </span>

                          <span>
                            Faculty Room 305
                          </span>

                        </div>

                        <button
                          className="availability-btn"
                          onClick={() => openFacultyAvailability({
                            name: 'Prof. Ian Lim',
                            department: 'Mathematics',
                            room: 'Faculty Room 305'
                          })}
                        >
                          View Availability
                        </button>

                      </div>


                      {/* FACULTY 4 */}

                      <div className="faculty-card">

                        <div className="faculty-avatar avatar-four">
                          CS
                        </div>

                        <h3>
                          Prof. Ellice Vicente
                        </h3>

                        <p className="faculty-department">
                          Engineering
                        </p>

                        <div className="faculty-detail">

                          <CalendarIcon />

                          <span>
                            {facultyHours(FACULTY[3])}
                          </span>

                        </div>

                        <div className="faculty-detail">

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
                        <div className="consultation-info"><h3>{nextBooking.faculty}</h3><p>{nextBooking.department}</p><div>{nextBooking.date} · {nextBooking.time}</div><div>{nextBooking.location}</div></div>
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
                            handleDashboardNavigation('faculty')
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
                              Search and filter faculty
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


            {/*FIND FACULTY PAGE*/}

            {activeDashboardPage === 'faculty' && (

              <div className="find-faculty-page">

                <div className="faculty-page-heading">
                  <div>
                    <p className="faculty-eyebrow">CONSULTATION DIRECTORY</p>
                    <h1>Find Faculty</h1>
                    <p className="faculty-page-description">
                      Browse faculty members and find the right person to help with your academic concerns.
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
                      onChange={(event) => setFacultySearch(event.target.value)}
                      placeholder="Search by faculty name, subject, or department..."
                      aria-label="Search faculty"
                    />
                  </div>

                  <div className="faculty-filter-field">
                    <label htmlFor="faculty-department">Department</label>
                    <select
                      id="faculty-department"
                      value={selectedDepartment}
                      onChange={(event) => setSelectedDepartment(event.target.value)}
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
                      const facultyList = document.getElementById('faculty-results')
                      if (facultyList) facultyList.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    <SearchIcon />
                    Search
                  </button>
                </div>

                <div className="faculty-results-heading" id="faculty-results">
                  <div>
                    <h2>Faculty Members</h2>
                    <p>Choose a faculty member to view their consultation availability.</p>
                  </div>
                  <span className="faculty-result-count">
                    {FACULTY.filter((faculty) => {
                      const query = facultySearch.trim().toLowerCase()
                      const matchesQuery = !query || `${faculty.name} ${faculty.department} ${faculty.subject}`.toLowerCase().includes(query)
                      const matchesDepartment = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment
                      return matchesQuery && matchesDepartment
                    }).length} results
                  </span>
                </div>

                <div className="faculty-directory-grid">
                  {FACULTY.filter((faculty) => {
                    const query = facultySearch.trim().toLowerCase()
                    const matchesQuery = !query || `${faculty.name} ${faculty.department} ${faculty.subject}`.toLowerCase().includes(query)
                    const matchesDepartment = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment
                    return matchesQuery && matchesDepartment
                  }).map((faculty) => (
                    <article className="directory-faculty-card" key={faculty.name}>
                      <div className="directory-card-top">
                        <div className={`faculty-avatar ${faculty.style}`}>{faculty.initials}</div>
                        <span className="faculty-status"><span></span> Consultation hours</span>
                      </div>

                      <h3>{faculty.name}</h3>
                      <p className="directory-department">{faculty.department}</p>
                      <p className="directory-subject">{faculty.subject}</p>

                      <div className="directory-detail">
                        <CalendarIcon />
                        <div>
                          <strong>{getFacultyDates(faculty)[0]?.label || 'No published slots'}</strong>
                          <span>{facultyHours(faculty)}</span>
                        </div>
                      </div>

                      <div className="directory-detail">
                        <BookIcon />
                        <div><span>{faculty.room}</span></div>
                      </div>

                      <button
                        className="directory-availability-btn"
                        onClick={() => openFacultyAvailability(faculty)}
                      >
                        View Availability
                        <ChevronIcon />
                      </button>
                    </article>
                  ))}
                </div>

                {FACULTY.filter((faculty) => {
                  const query = facultySearch.trim().toLowerCase()
                  const matchesQuery = !query || `${faculty.name} ${faculty.department} ${faculty.subject}`.toLowerCase().includes(query)
                  const matchesDepartment = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment
                  return matchesQuery && matchesDepartment
                }).length === 0 && (
                  <div className="faculty-empty-state">
                    <SearchIcon />
                    <h3>No faculty members found</h3>
                    <p>Try another name or choose a different department.</p>
                    <button onClick={() => { setFacultySearch(''); setSelectedDepartment('All Departments') }}>
                      Clear filters
                    </button>
                  </div>
                )}

              </div>

            )}


            {selectedFacultyForBooking && (
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
                      <span className="faculty-eyebrow">BOOK A CONSULTATION</span>
                      <h2 id="availability-modal-title">{selectedFacultyForBooking.name}</h2>
                      <p>{selectedFacultyForBooking.department} · {selectedFacultyForBooking.room}</p>
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
                        {getTimeSlots(selectedFacultyForBooking, selectedBookingDate).map(time => {
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
                      Faculty-specific demo schedules · Asia/Manila. Requests need faculty approval.
                    </p>

                    {bookingError && <p className="booking-validation-error" role="alert">{bookingError}</p>}
                    {!availableBookingDates.length && <p role="status">No published availability. Please try another faculty member.</p>}
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
              <div className="bookings-page">
                <div className="bookings-page-heading">
                  <div className="bookings-heading-icon"><CalendarIcon /></div>
                  <div>
                    <span className="bookings-eyebrow">CONSULTATION SCHEDULE</span>
                    <h1>My Bookings</h1>
                    <p>Keep track of your faculty consultations in one place.</p>
                  </div>


                </div>

                {bookingNotice && <p className="booking-notice" role="status">{bookingNotice}</p>}
                <div className="booking-summary-grid">
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon"><CalendarIcon /></div>
                    <div><span>All Bookings</span><strong>{bookings.length}</strong></div>
                  </div>

                  <div className="booking-summary-card">
                    <div className="booking-summary-icon upcoming"><ClockIcon /></div>
                    <div><span>Upcoming</span><strong>{upcomingBookings.length}</strong></div>
                  </div>

                  <div className="booking-summary-card">
                    <div className="booking-summary-icon completed"><BookIcon /></div>
                    <div><span>Completed</span><strong>{bookings.filter(booking => booking.status === 'Completed').length}</strong></div>
                  </div>
                </div>

                <div className="bookings-toolbar">
                  <div className="bookings-search-field">
                    <SearchIcon />
                    <input
                      type="text"
                      placeholder="Search faculty or subject..."
                      value={bookingSearch}
                      onChange={(event) => setBookingSearch(event.target.value)}
                    />
                  </div>
                  <div className="booking-filter-tabs">
                    {['All Bookings', ...BOOKING_STATUSES].map(filter => (
                      <button
                        key={filter}
                        className={bookingFilter === filter ? 'active' : ''}
                        onClick={() => setBookingFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bookings-list-heading">
                  <div><h2>Your consultations</h2><p>Review the details or manage an upcoming booking.</p></div>
                  <button className="bookings-find-button" onClick={() => handleDashboardNavigation('faculty')}>
                    <SearchIcon /> Find Faculty
                  </button>
                </div>

                <div className="booking-cards-list">
                  {bookings.filter(booking => {
                    const matchesFilter = bookingFilter === 'All Bookings' || booking.status === bookingFilter
                    const query = bookingSearch.trim().toLowerCase()
                    const matchesSearch = !query || `${booking.faculty} ${booking.subject} ${booking.department} ${booking.status} ${booking.date} ${booking.time} ${booking.location}`.toLowerCase().includes(query)
                    return matchesFilter && matchesSearch
                  }).map(booking => (
                    <article className="booking-card" key={booking.id}>
                      <div className="booking-date-block">
                        <CalendarIcon />
                        <span>{booking.date.split(',')[0].split(' ')[0].slice(0, 3)}</span>
                        <strong>{booking.date.split(' ')[1].replace(',', '')}</strong>
                        <small>{booking.date.split(' ')[2] || ''}</small>
                      </div>
                      <div className="booking-card-main">
                        <div className="booking-card-title-row">
                          <div><h3>{booking.faculty}</h3><p>{booking.department}</p></div>
                          <span className={`booking-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                        </div>
                        <div className="booking-subject"><BookIcon /><span>{booking.subject}</span></div>
                        <div className="booking-details-row">
                          <span><ClockIcon />{booking.time}</span>
                          <span><UserIcon />{booking.location}</span>
                        </div>
                        {isActive(booking) && bookingStart(booking) > Date.now() && (
                          <div className="booking-card-actions">
                            <button className="booking-cancel-button" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  {bookings.filter(booking => {
                    const matchesFilter = bookingFilter === 'All Bookings' || booking.status === bookingFilter
                    const query = bookingSearch.trim().toLowerCase()
                    const matchesSearch = !query || `${booking.faculty} ${booking.subject} ${booking.department} ${booking.status} ${booking.date} ${booking.time} ${booking.location}`.toLowerCase().includes(query)
                    return matchesFilter && matchesSearch
                  }).length === 0 && (
                    <div className="bookings-empty-state">
                      <CalendarIcon />
                      <h3>No bookings found</h3>
                      <p>There are no consultations matching your search or selected filter.</p>
                      <button onClick={() => { setBookingSearch(''); setBookingFilter('All Bookings') }}>Clear filters</button>
                    </div>
                  )}
                </div>
                <p className="booking-demo-note">Demo only: requests are kept in memory until logout or reload. Faculty decisions, shared availability, and permanent saving require the backend and faculty dashboard.</p>
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

            <a href="#">
              Register
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
                Connect With Your Faculty.
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
            ConsultTime provides a convenient way for students and faculty
            to handle academic consultations in one place. Students can
            check faculty schedules, select a suitable consultation time,
            and book appointments, while faculty members can organize their
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
              Browse available faculty members
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
              chosen faculty member.
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
            between students and faculty members.
          </p>

        </div>


        <div className="about-container">

          <div className="about-def">
            <p>
              Helps students and faculty set and organize
              consultation times.
            </p>
          </div>

          <div className="about-def">
            <p>
              Allows students to quickly find available
              faculty and suitable consultation schedules.
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
              consultation slot with a faculty member.
            </p>
          </div>

          <div className="about-def">
            <p>
              Shows the available dates and times when
              faculty members can accommodate consultations.
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
              Faculty Availability
            </h2>
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <section className="footer">

        <p>
          &copy; 2026 Faculty Consultation.
          All rights reserved.
        </p>

      </section>

    </>
  )
}

export default App