import { useState } from 'react'
import './App.css'
<<<<<<< HEAD

=======
>>>>>>> 40d0127d445f160112891a618a079be17760b7c7
import weblogo from './assets/weblogo.jpg'
import wmsuLogo from './assets/wmsuLogo.png'
import calendar from './assets/calendar.jpg'

function App() {
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState('home')

  //login page
  function handleLogin() {
    setCurrentPage('login')
    window.scrollTo(0, 0)
  }

  //landing page
  function handleHome() {
    setCurrentPage('home')
    window.scrollTo(0, 0)
  }

  //Learn More
  function handleLearnMore() {
    const aboutSection = document.getElementById('about')

    if (aboutSection) {
      aboutSection.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }

  //LOGIN PAGE
  if (currentPage === 'login') {
    return (
      <div className="login-page">

        {/* Decorative background */}
        <div className="top-red-shape"></div>
        <div className="bottom-red-shape"></div>

        {/* Logo */}
        <div className="login-logo" onClick={handleHome}>
          <div className="login-logo-images">
            <img src={wmsuLogo} alt="WMSU Logo" />
            <img src={weblogo} alt="ConsultTime Logo" />
          </div>

          <span>ConsultTime</span>
        </div>

        <div className="login-layout">

          {/* LEFT SIDE */}
          <div className="login-left">

            <div className="login-heading">
              <h1>
                Schedule Consultations.
                <br />

                <span>Connect With Your</span>
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


          {/* RIGHT SIDE */}
          <div className="login-card">

            <div className="login-card-header">
              <h2>Welcome Back!</h2>

              <p>
                Log in to access your dashboard
                <br />
                and manage your consultations.
              </p>
            </div>


            {/* EMAIL / ID */}
            <div className="input-group">
  <input
    type="text"
    placeholder="Email or Student/Faculty ID"
  />
</div>


            {/* PASSWORD */}
            <div className="input-group">
  <input
    type="password"
    placeholder="Password"
  />
</div>


            {/* REMEMBER + FORGOT */}
            <div className="login-options">

              <label className="remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <button className="forgot-password">
                Forgot password?
              </button>

            </div>


            {/* LOGIN BUTTON */}
            <button
              className="main-login-btn"
              onClick={() => alert('Login functionality will be added later.')}
            >
              <span>Log In</span>
              <span className="arrow">→</span>
            </button>


            {/* OR */}
            <div className="or-divider">
              <span></span>
              <p>OR</p>
              <span></span>
            </div>


            {/* STUDENT / FACULTY */}
            <div className="role-buttons">

  <button
    className="role-btn"
    onClick={() => alert('Student registration will be added later.')}
  >
    I'm a Student
  </button>

  <button
    className="role-btn"
    onClick={() => alert('Faculty registration will be added later.')}
  >
    I'm a Faculty
  </button>

</div>


            {/* REGISTER */}
            <div className="register-text">
              <span>Don't have an account?</span>

              <button
                onClick={() => alert('Registration page will be added later.')}
              >
                Register
              </button>
            </div>

          </div>

        </div>

      </div>
    )
  }
  // LANDING PAGE
  return (
    <>
      <section className="hero">

        <nav>

          <div className="logo-container">

            <div className="logo">
              <img src={wmsuLogo} alt="WMSU Logo" />
              <img src={weblogo} alt="ConsulTime Logo" />
            </div>

            <span className="logo-text">
              ConsultTime
            </span>

          </div>


          <div className="nav-links">

            <a href="#">Home</a>

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


          {/* LOG IN */}
          <div
            className="log-container"
            onClick={handleLogin}
          >
            <span>Log In</span>
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


        {/* DESCRIPTION */}
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


        {/* BUTTONS */}
        <div className="login-container">

          {/* GET STARTED → LOGIN PAGE */}
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

        <h1>HOW IT WORKS</h1>

        <div className="item-container">

          <div className="item">
            <h2>1</h2>

            <p>
              Sign up for an account and log in
              to the platform.
            </p>
          </div>


          <div className="arrow-item">
            <h2>→</h2>
          </div>


          <div className="item">
            <h2>2</h2>

            <p>
              Browse available faculty members
              and their consultation schedules.
            </p>
          </div>


          <div className="arrow-item">
            <h2>→</h2>
          </div>


          <div className="item">
            <h2>3</h2>

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

          <h1>ABOUT</h1>

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
            <h2>Scheduling</h2>
          </div>

          <div className="about-item">
            <h2>Search</h2>
          </div>

          <div className="about-item">
            <h2>No Conflicts</h2>
          </div>

          <div className="about-item">
            <h2>Bookings</h2>
          </div>

          <div className="about-item">
            <h2>Faculty Availability</h2>
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
=======
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  function handleLogin() {
    setIsLoggedIn(true)
  }

  function handleLearnMore() {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isLoggedIn) {
    return (
      <div className="dashboard">
        <h1>Welcome to the Dashboard!</h1>
        <p>You are now logged in.</p>
      </div>
    )
  } else {


    return (
      <>
        <section className="hero">
          <nav>

            <div className="logo-container">
              <div className="logo">
                <img src={wmsuLogo} alt="WMSU Logo" />
                <img src={weblogo} alt="ConsulTime Logo" />
              </div>

              <span className="logo-text">
                ConsulTime
              </span>
            </div>

            <div className="nav-links">
              <a href="#">Home</a>
              <a href="#how-it-works">How it Works</a>
              <a href="#about">About</a>
              <a href="#">Register</a>
            </div>

            <div className="log-container">
              <span onClick={handleLogin}>
                Log In
              </span>
            </div>
          </nav>

          <main className="hero-content">
            <div className="hero-text">
              <h1>Schedule Consultations.<br /><span>Connect With Your Faculty.</span></h1>
            </div>

            <div className="img-container">
              <img src={calendar} alt="Calendar" />
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
            <span className="login-btn" onClick={handleLogin}>Get Started</span>
            <span className="learn-btn" onClick={handleLearnMore}>
              Learn More
            </span>
          </div>


        </section>

        <section className="how-it-works" id="how-it-works">
          <h1>HOW IT WORKS</h1>

          <div className="item-container">
            <div className="item">
              <h2>1</h2>
              <p>Sign up for an account and log in to the platform.</p>
            </div>
            <div>
              <h2>→</h2>
            </div>
            <div className="item">
              <h2>2</h2>
              <p>Browse available faculty members and their consultation schedules.</p>
            </div>
            <div>
              <h2>→</h2>
            </div>
            <div className="item">
              <h2>3</h2>
              <p>Book a consultation with your chosen faculty member.</p>
            </div>
          </div>

        </section>

        <section className="about" id="about">
          <div>
            <h1>ABOUT</h1>
            <p>ConsultTime is a platform designed to streamline
              the process of scheduling academic consultations
              between students and faculty members.
            </p>
          </div>

          <div className="about-container">
            <div className="about-def">
              <p>Helps students and faculty set and organize 
                consultation times.</p>
            </div>
            
            <div className="about-def">
              <p>Allows students to quickly find available 
                faculty and suitable consultation schedules.</p>
            </div>
            
            <div className="about-def">
              <p>Prevents overlapping appointments and 
                helps avoid double bookings.</p>
            </div>
            
            <div className="about-def">
              <p>Lets students reserve an available consultation slot 
                with a faculty member.</p>
            </div>
            
            <div className="about-def">
              <p>Shows the available dates and times when faculty 
                members can accomodate consultations.</p>
            </div>
          </div>

          <div className='about-container'>
            <div className='about-item'>
              <h2>Scheduling</h2>
            </div>

            <div className='about-item'>
              <h2>Search</h2>
            </div>

            <div className='about-item'>
              <h2>No Conflicts</h2>
            </div>

            <div className='about-item'>
              <h2>Bookings</h2>
            </div>

            <div className='about-item'>
              <h2>Faculty Availability</h2>
            </div>
          </div>
        </section>

        <section className="footer">
          <p>&copy; 2026 Faculty Consultation. All rights reserved.</p>
        </section>
      </>
    )
  }
}

export default App
>>>>>>> 40d0127d445f160112891a618a079be17760b7c7
