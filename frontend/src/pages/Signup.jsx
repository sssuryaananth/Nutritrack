import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://nutritrack-g4n6.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("Signup response:", data);

      if (response.ok) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Signup failed.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Unable to connect to server.");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <div className="auth-logo">
          <Link to="/" className="auth-logo">
  <span className="logo-mark">N</span>
  <span>NUTRITRACK</span>
</Link>
        </div>

        <p className="eyebrow">START YOUR JOURNEY</p>

        <h1>
          Track smarter.
          <br />
          Live stronger.
        </h1>

        <p>
          Create your NutriTrack account and start understanding
          your meals, calories, and nutrition.
        </p>
      </div>

      <div className="auth-form-container">
        <div className="auth-form">

          <p className="form-label">CREATE ACCOUNT</p>

          <h2>Sign up</h2>

          <form onSubmit={handleSignup}>

            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
              CREATE ACCOUNT
            </button>

          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Log in</Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Signup;