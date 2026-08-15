import{ useState } from "react";
import {useNavigate} from "react-router-dom"
function Login(){
  const [email,setEmail] = useState("");
  const [password,setPassword]=useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: email,
    password: password,
  }),
});
    const data = await response.json();

console.log(data);

if (response.ok) {
  localStorage.setItem("token", data.token);
  console.log("Token saved!");
  navigate("/dashboard");
}
  };
  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-logo">
          <span className="logo-mark">N</span>
          <span>NUTRITRACK</span>
        </div>

        <p className="eyebrow">WELCOME BACK</p>

        <h1>
          Your data.
          <br />
          Your progress.
        </h1>

        <p>
          Pick up where you left off and keep your nutrition journey moving.
        </p>
      </div>

      <div className="auth-form-container">
        <div className="auth-form">
          <p className="form-label">ACCOUNT ACCESS</p>
          <h2>Log in</h2>

          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />

            <button type="submit">LOG IN</button>
          </form>

          <p className="auth-switch">
            Don't have an account? <span>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;