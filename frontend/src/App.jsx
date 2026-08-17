import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { Routes, Route, Link} from "react-router-dom";
import "./App.css";

function LandingPage() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="logo">
          <span className="logo-mark">N</span>
          <span>NUTRITRACK</span>
        </div>

        <Link to="/login" className="login-button">
          LOG IN
    </Link>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <p className="eyebrow">YOUR BODY. YOUR DATA. YOUR CONTROL.</p>

          <h1>
            Fuel smarter.
            <br />
            Live stronger.
          </h1>

          <p className="hero-text">
            Track your meals, understand your nutrition, and take control
            of every calorie.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="primary-button">
              START TRACKING
          </Link>
            <button className="secondary-button">EXPLORE MORE</button>
          </div>
        </div>

        <div className="hero-card">
          <p className="card-label">TODAY'S FUEL</p>
          <h2>1,320</h2>
          <p className="kcal">KCAL CONSUMED</p>

          <div className="progress-track">
            <div className="progress-fill"></div>
          </div>

          <div className="card-bottom">
            <span>53% COMPLETE</span>
            <span>1,180 LEFT</span>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path = "/Login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;