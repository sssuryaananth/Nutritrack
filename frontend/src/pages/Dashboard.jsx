import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token =localStorage.getItem("token");
    if(!token){
      navigate("/login");
      return;
    }
    const fetchProfile = async () => {

      const response = await fetch("http://localhost:5000/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setUser(data.user);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Nutritrack</h1>
      <button onClick={handleLogout}>LOG OUT</button>

      {user ? (
        <>
          <h2>Hello, {user.name}</h2>
          <p>{user.email}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Dashboard;