import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";

function LandingPage() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-mark">N</span>
          <span>NUTRITRACK</span>
        </Link>

        <Link to="/login" className="login-button">
          LOG IN
        </Link>
      </nav>

{/* MARQUEE */}
<div className="marquee-wrapper">
  <div className="marquee">
    <span>TRACK YOUR MEALS • KNOW YOUR NUTRITION • REACH YOUR GOALS •</span>
    <span>TRACK YOUR MEALS • KNOW YOUR NUTRITION • REACH YOUR GOALS •</span>
  </div>
</div>

{/* HERO */}
<main className="hero">
        <div className="hero-content">

          <p className="eyebrow">
            YOUR BODY. YOUR DATA. YOUR CONTROL.
          </p>

          <h1>
            Fuel smarter.
            <br />
            <span>Live stronger.</span>
          </h1>

          <p className="hero-text">
            Track your meals, understand your nutrition,
            and take control of every calorie with NutriTrack.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="primary-button">
              START TRACKING
            </Link>

            <a href="#features" className="secondary-button">
              EXPLORE MORE
            </a>
          </div>

          <div className="hero-mini-stats">
            <div>
              <strong>24/7</strong>
              <span>TRACKING</span>
            </div>

            <div>
              <strong>4</strong>
              <span>MACROS</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>YOUR DATA</span>
            </div>
          </div>

        </div>

        {/* NUTRITION PREVIEW CARD */}
        <div className="hero-card">

          <div className="hero-card-top">
            <p className="card-label">TODAY'S FUEL</p>
            <span className="live-dot">● LIVE</span>
          </div>

          <h2>1,320</h2>

          <p className="kcal">
            KCAL CONSUMED
          </p>

          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>

          <div className="card-bottom">
            <span>53% COMPLETE</span>
            <span>1,180 LEFT</span>
          </div>

          <div className="macro-preview">

            <div>
              <span>PROTEIN</span>
              <strong>82g</strong>
            </div>

            <div>
              <span>CARBS</span>
              <strong>145g</strong>
            </div>

            <div>
              <span>FAT</span>
              <strong>42g</strong>
            </div>

          </div>

        </div>
      </main>


      {/* FEATURES */}
      <section className="landing-section" id="features">

        <div className="section-heading">
          <p className="eyebrow">BUILT FOR YOUR GOALS</p>

          <h2>
            Everything you need
            <br />
            to eat smarter.
          </h2>

          <p>
            NutriTrack gives you a simple way to understand
            what you eat and stay consistent with your goals.
          </p>
        </div>


        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-number">01</div>
            <div className="feature-icon">🍽️</div>

            <h3>Track Meals</h3>

            <p>
              Record your breakfast, lunch, dinner and snacks
              with just a few clicks.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-number">02</div>
            <div className="feature-icon">🔥</div>

            <h3>Monitor Calories</h3>

            <p>
              Know how many calories you've consumed and
              how much you have left for the day.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-number">03</div>
            <div className="feature-icon">💪</div>

            <h3>Track Macros</h3>

            <p>
              Keep an eye on protein, carbohydrates and
              fat alongside your calories.
            </p>
          </div>


          <div className="feature-card">
            <div className="feature-number">04</div>
            <div className="feature-icon">📊</div>

            <h3>Understand Progress</h3>

            <p>
              See your recent nutrition patterns and
              make better decisions every day.
            </p>
          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section className="how-section">

        <div className="section-heading">
          <p className="eyebrow">SIMPLE BY DESIGN</p>

          <h2>
            Your nutrition.
            <br />
            Four simple steps.
          </h2>
        </div>


        <div className="steps">

          <div className="step">
            <span>01</span>
            <h3>Create your account</h3>
            <p>
              Sign up and set your personal daily calorie goal.
            </p>
          </div>

          <div className="step">
            <span>02</span>
            <h3>Add your meals</h3>
            <p>
              Choose from your food database and enter your quantity.
            </p>
          </div>

          <div className="step">
            <span>03</span>
            <h3>Track your nutrition</h3>
            <p>
              See calories, protein, carbs and fat automatically.
            </p>
          </div>

          <div className="step">
            <span>04</span>
            <h3>Reach your goals</h3>
            <p>
              Use your progress to build healthier habits.
            </p>
          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="cta-section">

        <p className="eyebrow">READY TO START?</p>

        <h2>
          Take control of
          <br />
          your nutrition.
        </h2>

        <p>
          Your meals. Your progress. Your goals.
        </p>

        <Link to="/signup" className="primary-button">
          CREATE YOUR ACCOUNT
        </Link>

      </section>


      {/* FOOTER */}
      <footer className="landing-footer">

        <div className="footer-brand">
          <Link to="/" className="logo">
            <span className="logo-mark">N</span>
            <span>NUTRITRACK</span>
          </Link>

          <p>
            Your body. Your data. Your control.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/login">LOG IN</Link>
          <Link to="/signup">SIGN UP</Link>
        </div>

        <p className="copyright">
          © 2026 NutriTrack. Built for better habits.
        </p>

      </footer>

    </div>
  );
}
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;