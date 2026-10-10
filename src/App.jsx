import { useState } from 'react'
import './App.css'

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


/* APP*/

function App() {

  const [currentPage, setCurrentPage] = useState('home')
  const [activeDashboardPage, setActiveDashboardPage] = useState('dashboard')
  const [facultySearch, setFacultySearch] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments')
  const [bookingFilter, setBookingFilter] = useState('All Bookings')
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookings, setBookings] = useState([
    { id: 1, faculty: 'Dr. Novie Jozane', department: 'Computer Science', subject: 'Web Development', date: 'October 14, 2026', time: '10:00 AM - 10:30 AM', location: 'CCS Faculty Room', status: 'Upcoming' },
    { id: 2, faculty: 'Prof. Kris Pereyra', department: 'Information Technology', subject: 'Programming Fundamentals', date: 'October 16, 2026', time: '1:00 PM - 1:30 PM', location: 'Online Consultation', status: 'Upcoming' },
    { id: 3, faculty: 'Engr. Ian Lim', department: 'Computer Science', subject: 'Database Systems', date: 'September 28, 2026', time: '9:00 AM - 9:30 AM', location: 'CCS Room 204', status: 'Completed' }
  ])


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
      <div className="login-page">

        <div className="top-red-shape"></div>
        <div className="bottom-red-shape"></div>


        {/* LOGIN LOGO */}

        <div
          className="login-logo"
          onClick={handleHome}
        >

          <div className="login-logo-images">

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


        {/* LOGIN CONTENT */}

        <div className="login-layout">


          {/* LEFT SIDE */}

          <div className="login-left">

            <div className="login-heading">

              <h1>

                Schedule Consultations.

                <br />

                <span>
                  Connect With Your
                </span>

                <br />

                Faculty.

              </h1>

              <p>
                Log in to your account and book academic
                <br />
                consultations with your faculty members.
              </p>

            </div>

          </div>


          {/* LOGIN CARD */}

          <div className="login-card">

            <div className="login-card-header">

              <h2>
                Welcome Back!
              </h2>

              <p>
                Log in to access your dashboard
                <br />
                and manage your consultations.
              </p>

            </div>


            <div className="input-group">

              <input
                type="text"
                placeholder="Email or Student/Faculty ID"
              />

            </div>


            <div className="input-group">

              <input
                type="password"
                placeholder="Password"
              />

            </div>


            <div className="login-options">

              <label className="remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>


              <button
                className="forgot-password"
                type="button"
              >
                Forgot password?
              </button>

            </div>


            {/* LOGIN GOES TO DASHBOARD */}

            <button
              className="main-login-btn"
              type="button"
              onClick={handleDashboard}
            >

              <span>
                Log In
              </span>

              <span className="arrow">
                →
              </span>

            </button>


            <div className="or-divider">

              <span></span>

              <p>
                OR
              </p>

              <span></span>

            </div>


            <div className="role-buttons">

              <button
                className="role-btn"
                type="button"
              >
                I'm a Student
              </button>


              <button
                className="role-btn"
                type="button"
              >
                I'm a Faculty
              </button>

            </div>


            <div className="register-text">

              <span>
                Don't have an account?
              </span>

              <button
                type="button"
              >
                Register
              </button>

            </div>

          </div>

        </div>

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
                Waj Wannah Sanchez
              </strong>

              <span>
                Student
              </span>

            </div>

            <span className="user-arrow">
              ▼
            </span>

          </div>

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
                      Waj Wannah Sanchez!
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
                        />

                      </div>


                      <button
                        className="dashboard-search-btn"
                        onClick={() =>
                          handleDashboardNavigation('faculty')
                        }
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
                        24
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
                        1
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
                        3
                      </strong>

                    </div>

                    <ChevronIcon />

                  </div>


                  <div className="stat-card">

                    <div className="stat-icon">
                      <ClockIcon />
                    </div>

                    <div className="stat-content">

                      <span>
                        Pending Requests
                      </span>

                      <strong>
                        1
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
                            Available today
                            <br />
                            2:00 PM – 4:00 PM
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

                        <button className="availability-btn">
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
                            Available tomorrow
                            <br />
                            9:00 AM – 11:00 AM
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

                        <button className="availability-btn">
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
                            Available today
                            <br />
                            1:00 PM – 3:00 PM
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

                        <button className="availability-btn">
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
                            Available tomorrow
                            <br />
                            10:00 AM – 12:00 PM
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

                        <button className="availability-btn">
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


                      <div className="consultation-card">

                        <div className="consultation-icon">
                          <CalendarIcon />
                        </div>

                        <div className="consultation-info">

                          <h3>
                            Prof. JokJok
                          </h3>

                          <p>
                            Computer Science
                          </p>

                          <div>
                            October 6, 2026 · 2:00 PM – 2:30 PM
                          </div>

                          <div>
                            Faculty Room 204
                          </div>

                        </div>

                        <span className="confirmed">
                          Confirmed
                        </span>

                        <ChevronIcon />

                      </div>

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
                    {[
                      { name: 'Prof. Novie Jozane', department: 'Computer Science', subject: 'Programming and software development', availability: 'Available today', time: '2:00 PM – 4:00 PM', room: 'Faculty Room 204', initials: 'NJ', style: 'avatar-one' },
                      { name: 'Prof. Kris', department: 'Information Technology', subject: 'Networking and information systems', availability: 'Available tomorrow', time: '9:00 AM – 11:00 AM', room: 'Faculty Room 101', initials: 'KR', style: 'avatar-two' },
                      { name: 'Prof. Ian Lim', department: 'Mathematics', subject: 'Mathematics and statistics', availability: 'Available today', time: '1:00 PM – 3:00 PM', room: 'Faculty Room 305', initials: 'IL', style: 'avatar-three' },
                      { name: 'Prof. Ellice Vicente', department: 'Engineering', subject: 'Engineering fundamentals', availability: 'Available tomorrow', time: '10:00 AM – 12:00 PM', room: 'Engineering Building 2B', initials: 'EV', style: 'avatar-four' }
                    ].filter((faculty) => {
                      const query = facultySearch.trim().toLowerCase()
                      const matchesQuery = !query || `${faculty.name} ${faculty.department} ${faculty.subject}`.toLowerCase().includes(query)
                      const matchesDepartment = selectedDepartment === 'All Departments' || faculty.department === selectedDepartment
                      return matchesQuery && matchesDepartment
                    }).length} results
                  </span>
                </div>

                <div className="faculty-directory-grid">
                  {[
                    { name: 'Prof. Novie Jozane', department: 'Computer Science', subject: 'Programming and software development', availability: 'Available today', time: '2:00 PM – 4:00 PM', room: 'Faculty Room 204', initials: 'NJ', style: 'avatar-one' },
                    { name: 'Prof. Kris', department: 'Information Technology', subject: 'Networking and information systems', availability: 'Available tomorrow', time: '9:00 AM – 11:00 AM', room: 'Faculty Room 101', initials: 'KR', style: 'avatar-two' },
                    { name: 'Prof. Ian Lim', department: 'Mathematics', subject: 'Mathematics and statistics', availability: 'Available today', time: '1:00 PM – 3:00 PM', room: 'Faculty Room 305', initials: 'IL', style: 'avatar-three' },
                    { name: 'Prof. Ellice Vicente', department: 'Engineering', subject: 'Engineering fundamentals', availability: 'Available tomorrow', time: '10:00 AM – 12:00 PM', room: 'Engineering Building 2B', initials: 'EV', style: 'avatar-four' }
                  ].filter((faculty) => {
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
                          <strong>{faculty.availability}</strong>
                          <span>{faculty.time}</span>
                        </div>
                      </div>

                      <div className="directory-detail">
                        <BookIcon />
                        <div><span>{faculty.room}</span></div>
                      </div>

                      <button
                        className="directory-availability-btn"
                        onClick={() => alert(`Availability for ${faculty.name} will be shown here.`)}
                      >
                        View Availability
                        <ChevronIcon />
                      </button>
                    </article>
                  ))}
                </div>

                {[
                  { name: 'Prof. Novie Jozane', department: 'Computer Science', subject: 'Programming and software development' },
                  { name: 'Prof. Kris', department: 'Information Technology', subject: 'Networking and information systems' },
                  { name: 'Prof. Ian Lim', department: 'Mathematics', subject: 'Mathematics and statistics' },
                  { name: 'Prof. Ellice Vicente', department: 'Engineering', subject: 'Engineering fundamentals' }
                ].filter((faculty) => {
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

                <div className="booking-summary-grid">
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon"><CalendarIcon /></div>
                    <div><span>All Bookings</span><strong>{bookings.length}</strong></div>
                  </div>
                  <div className="booking-summary-card">
                    <div className="booking-summary-icon upcoming"><ClockIcon /></div>
                    <div><span>Upcoming</span><strong>{bookings.filter(booking => booking.status === 'Upcoming').length}</strong></div>
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
                    {['All Bookings', 'Upcoming', 'Completed', 'Cancelled'].map(filter => (
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
                    const matchesSearch = !query || `${booking.faculty} ${booking.subject} ${booking.department}`.toLowerCase().includes(query)
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
                        {booking.status === 'Upcoming' && (
                          <div className="booking-card-actions">
                            <button className="booking-cancel-button" onClick={() => setBookings(current => current.map(item => item.id === booking.id ? { ...item, status: 'Cancelled' } : item))}>Cancel Booking</button>
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                  {bookings.filter(booking => {
                    const matchesFilter = bookingFilter === 'All Bookings' || booking.status === bookingFilter
                    const query = bookingSearch.trim().toLowerCase()
                    const matchesSearch = !query || `${booking.faculty} ${booking.subject} ${booking.department}`.toLowerCase().includes(query)
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
                <p className="booking-demo-note">Sample booking information for interface preview. Changes are only saved while this page remains open.</p>
              </div>
            )}


            {/* PROFILE PAGE*/}

            {activeDashboardPage === 'profile' && (

              <div className="dashboard-placeholder">

                <h1>
                  Profile
                </h1>

                <p>
                  Manage your student account information.
                </p>

                <button
                  onClick={() =>
                    handleDashboardNavigation('dashboard')
                  }
                >
                  Back to Dashboard
                </button>

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