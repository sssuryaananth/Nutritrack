import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft, LogOut } from "lucide-react";

function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

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
          dailyCalorieGoal: Number(dailyCalorieGoal),
        }),
      }
    );

    const data = await response.json();

    console.log("SAVE RESPONSE:", data);

    if (response.ok) {
      setUser(data.user);
      setName(data.user?.name ?? "");
      setDailyCalorieGoal(data.user?.dailyCalorieGoal ?? "");

      alert("Profile updated successfully!");
    } else {
      alert(data.message || "Profile update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
        setName(data.user?.name ?? "");
        setDailyCalorieGoal(data.user?.dailyCalorieGoal ?? "");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <h2>Loading profile...</h2>;
  }

  return (
    <div className="profile-page">

      <div className="profile-card">

        {/* BACK */}
        <button
          className="profile-back"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

        {/* PROFILE HEADER */}
        <div className="profile-header">

          <div className="avatar-wrapper">

            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar avatar-placeholder">
                {name ? name.charAt(0).toUpperCase() : "N"}
              </div>
            )}

            <label className="avatar-edit">
              <Camera size={17} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

          </div>

          <div className="profile-heading">
            <h1>{name || "Your Profile"}</h1>
            <p>{user.email}</p>
          </div>

        </div>

        {/* PROFILE DETAILS */}
        <div className="profile-details">

          <div className="profile-field">
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>

            <input
              type="email"
              value={user.email}
              disabled
            />
          </div>

          <div className="profile-field">
            <label>Daily Calorie Goal</label>

            <input
              type="number"
              value={dailyCalorieGoal}
              onChange={(e) =>
                setDailyCalorieGoal(e.target.value)
              }
              placeholder="Enter daily calorie goal"
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="profile-actions">

          <button
            className="save-profile-button"
            onClick={handleSaveChanges}
          >
            SAVE CHANGES
          </button>

          <button
            className="logout-profile-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            LOG OUT
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;