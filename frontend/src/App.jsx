import "./App.css";
function App(){
  return (
    <div className ="app">\
    <nav className ="logo">
      <div className="logo">
        <span className="logo-mark">N</span>
        <span>NUTRITRACK</span>
      </div>
      <button className="login-button">LOG IN</button>
    </nav>
    <main className="hero">
      <div className="hero-content">
        <p className="eyebrow">your Body. Your Data. Your Control.</p>
        <h1>
          Fuel Smarter.
          <br/>
          Live stronger.
        </h1>
        <p className="hero-text">
          Track Your meals, understand your nutrition,and take control of every calorie.
        </p>
        <div className="hero-buttons">
          <button className="primary-buttons">START TRACKING</button>
          <button className="secondary-button">EXPLORE MORE</button>
        </div>
      </div>
      <div className="hero-card">
        <p className="card-label">TODAYS FUEL</p>
        <h2>1,320</h2>
        <p className="kcal">kcal Consumed</p>
        <div className="progress-track">
          <div className="progress-fill"></div>
        </div>
        <div className="card-bottom">
          <span>53% COMPLETE</span>
          <span>1,1800 LEFT</span>
        </div>
      </div>
    </main>
    </div>
  );
}

export default App;