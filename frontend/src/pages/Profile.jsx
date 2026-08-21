import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://nutritrack-g4n6.onrender.com/profile",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setUser(data.user);
      setName(data.user.name);
      alert("Profile updated successfully!");
    } else {
      alert(data.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      const response = await fetch(
        "https://nutritrack-g4n6.onrender.com/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setName(data.user.name ||"");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <h2>Loading profile...</h2>;
  }

  return (
    <div>
      <h1>My Profile</h1>

      <h2>Profile Details</h2>

      <label>Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <p>Email: {user.email}</p>

      <button onClick={handleSaveChanges}>
        SAVE CHANGES
      </button>

      <button onClick={() => navigate("/dashboard")}>
        BACK TO DASHBOARD
      </button>
    </div>
  );
}

export default Profile;