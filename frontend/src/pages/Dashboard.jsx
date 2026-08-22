import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [weeklyMeals,setWeeklyMeals] = useState([]);
  const [foods,setFoods] = useState([]);
  const [foodSearch,setFoodSearch]=useState("");
  const [customFoodName, setCustomFoodName] = useState("");
const [customFoodCalories, setCustomFoodCalories] = useState("");
  const [calorieGoal,setCalorieGoal] = useState(null);
  const [editingMeal,setEditingMeal]=useState(null);
  const [selectedDate,setSelectedDate]=useState(
    new Date().toISOString().split("T")[0]
    );

  

  const totalCalories = meals.reduce((total, meal) => {
  return total + meal.calories;
}, 0);

const remainingCalories =
  calorieGoal !== null
    ? Math.max(calorieGoal - totalCalories, 0)
    : 0;

const calorieProgress =
  calorieGoal && calorieGoal > 0
    ? Math.min((totalCalories / calorieGoal) * 100, 100)
    : 0;
    const weeklyCalories = {};

weeklyMeals.forEach((meal) => {
  const date = new Date(meal.createdAt).toISOString().split("T")[0];

  if (!weeklyCalories[date]) {
    weeklyCalories[date] = 0;
  }

  weeklyCalories[date] += Number(meal.calories);
});
const last7Days =[];
for(let i= 6;i>=0; i--){
  const date = new Date();
  date.setDate(date.getDate() -i);
  const dateString = date.toISOString().split("T")[0];
  last7Days.push({
    date:dateString,
    calories:weeklyCalories[dateString] || 0,
  });
}

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleSaveCalorieGoal = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "https://nutritrack-g4n6.onrender.com/calorie-goal",
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dailyCalorieGoal: calorieGoal,
      }),
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert("Calorie goal saved successfully!");
    setCalorieGoal(data.dailyCalorieGoal);
  } else {
    alert(data.message);
  }
};

  const fetchMeals = async () => {
    const token = localStorage.getItem("token");
    const date = selectedDate;
const response = await fetch(
  `https://nutritrack-g4n6.onrender.com/meals?date=${date}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    const data = await response.json();

    if (response.ok) {
      setMeals(data.meals);
    }
  };
  const fetchFoods = async () =>{
    const response = await fetch("https://nutritrack-g4n6.onrender.com/foods");
    const data = await response.json();
    console.log("Foods:",data);
    if (response.ok){
      setFoods(data);
    }
  };
  const fetchWeeklyMeals = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "https://nutritrack-g4n6.onrender.com/analytics/weekly",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.ok) {
    setWeeklyMeals(data.meals);
  } else {
    console.log(data.message);
  }
};
  const handleAddMeal = async (e) => {
  e.preventDefault();
  if (!foodName || !quantity || Number(quantity) <= 0) {
  alert("Please select a food and enter a valid quantity.");
  return;
}

  const token = localStorage.getItem("token");

  const response = await fetch("https://nutritrack-g4n6.onrender.com/meals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      foodName: foodName,
      quantity: Number(quantity),
      mealType: mealType,
    }),
  });

  const data = await response.json();
  console.log(data);

  if (response.ok) {
    alert("Meal added successfully!");
    setFoodName("");
    setQuantity("");
    fetchMeals();
  } else {
    alert(data.message);
  }
};
const handleAddCustomFood = async (e) => {
  e.preventDefault();

  if (!customFoodName || !customFoodCalories) {
    alert("Please enter food name and calories.");
    return;
  }

  const response = await fetch("https://nutritrack-g4n6.onrender.com/foods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: customFoodName,
      calories: Number(customFoodCalories),
    }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Custom food added successfully!");
    setCustomFoodName("");
    setCustomFoodCalories("");
    fetchFoods();
  } else {
    alert(data.message);
  }
};
const handleEditMeal=(meal)=>{
  setEditingMeal(meal);
};
const handleUpdateMeal = async ()=>{
  const token = localStorage.getItem("token");
  const response = await fetch(
    `https://nutritrack-g4n6.onrender.com/meals/${editingMeal._id}`,
    {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`,
      },
      body:JSON.stringify({
        quantity:editingMeal.quantity,
        mealType:editingMeal.mealType,
      }),
    }
  );
  const data = await response.json();
  console.log(data);

  if(response.ok){
    alert("Meal updated successfully!");
    setEditingMeal(null);
    fetchMeals();
  } else {
    alert(data.message);
  }
};

const handleDeleteMeal = async (mealId) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `https://nutritrack-g4n6.onrender.com/meals/${mealId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.ok) {
    alert("Meal deleted successfully!");
    fetchMeals();
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
      const response = await fetch("https://nutritrack-g4n6.onrender.com/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setCalorieGoal(data.user.dailyCalorieGoal);
      }
    };

    fetchProfile();
    fetchMeals();
    fetchFoods();
    fetchWeeklyMeals();
  }, [navigate]);

  return (
    <div className="dashboard">
      <h1>
  Welcome back, {user?.name || "there"} 👋
</h1>
      <div className="calorie-stats">
  <div className="stat-card">
    <p>Consumed</p>
    <h2>{totalCalories} Kcal</h2>
  </div>


  <div className="stat-card">
    <p>Daily Goal</p>
    <h2>{calorieGoal ?? 0} Kcal</h2>
  </div>

  <div className="stat-card">
    <p>Remaining</p>
    <h2>{remainingCalories} Kcal</h2>
  </div>
</div>
<div className="progress-container">
  <div className="progress-label">
    <span>Daily Progress</span>
    <span>{Math.round(calorieProgress)}%</span>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${calorieProgress}%` }}
    ></div>
  </div>
</div>
      

<div className="profile-card">

  {user ? (
    <>
      <h2>Hello, {user.name}</h2>
      <p>{user.email}</p>
    </>
  ) : (
    <p>Loading profile...</p>
  )}

  <div className="goal-section">
    <label>Daily Calorie Goal:</label>

    <input
      type="number"
      value={calorieGoal ?? ""}
      onChange={(e) => setCalorieGoal(Number(e.target.value))}
    />

    <button onClick={handleSaveCalorieGoal}>
      SAVE GOAL
    </button>
  </div>
  <button onClick={() => navigate("/profile")}>
  MY PROFILE
</button>

  <button onClick={handleLogout}>LOG OUT</button>

</div>
      <div className = "section-card">
      <h2>Add Meal</h2>
      <form onSubmit={handleAddMeal}>
        <input
  type="text"
  placeholder="Search food..."
  value={foodSearch}
  onChange={(e) => setFoodSearch(e.target.value)}
/>
        <select
  value={foodName}
  onChange={(e) => setFoodName(e.target.value)}
>
  <option value="">Select Food</option>

{foods
  .filter((food) =>
    food.name
      .toLowerCase()
      .startsWith(foodSearch.toLowerCase())
  )
  .map((food) => (
    <option key={food._id} value={food.name}>
      {food.name}
    </option>
  ))}
</select>

        <input
          type="number"
          placeholder="Quantity in grams"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
        >
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
        </select>

        <button type="submit">ADD MEAL</button>
      </form>
      </div>
      <div className="section-card">
  <h2>Add Custom Food</h2>

  <form onSubmit={handleAddCustomFood}>
    <input
      type="text"
      placeholder="Food name"
      value={customFoodName}
      onChange={(e) => setCustomFoodName(e.target.value)}
    />

    <input
      type="number"
      placeholder="Calories per 100g"
      value={customFoodCalories}
      onChange={(e) => setCustomFoodCalories(e.target.value)}
    />

    <button type="submit">ADD CUSTOM FOOD</button>
  </form>
</div>
      {editingMeal && (
  <div className="section-card">
    <h2>Edit Meal</h2>

    <input
      type="number"
      value={editingMeal.quantity}
      onChange={(e) =>
        setEditingMeal({
          ...editingMeal,
          quantity: Number(e.target.value),
        })
      }
    />

    <select
      value={editingMeal.mealType}
      onChange={(e) =>
        setEditingMeal({
          ...editingMeal,
          mealType: e.target.value,
        })
      }
    >
      <option>Breakfast</option>
      <option>Lunch</option>
      <option>Dinner</option>
      <option>Snack</option>
    </select>

  <button onClick={handleUpdateMeal}>UPDATE MEAL</button>
  </div>
)}
<div className="section-card">
<h2>Meal History</h2>
<input
  type="date"
  value={selectedDate}
  onChange={(e)=>setSelectedDate(e.target.value)}
  />
  <button onClick={fetchMeals}>VIEW MEALS</button>
  </div>
 <div className="section-card">
  <h2>Last 7 Days</h2>

  <div className="weekly-chart">
    {last7Days.map((day) => (
      <div className="chart-column" key={day.date}>
        <div
          className="chart-bar"
          style={{
            height: `${Math.min(
              (day.calories / (calorieGoal || 2000)) * 180,
              180
            )}px`,
          }}
        >
          <span>{day.calories}</span>
        </div>

        <p>
  {new Date(day.date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
  })}
</p>
      </div>
    ))}
  </div>
</div>
      <h2>Your Meals</h2>

      {meals.length === 0 ? (
        <p>No meals added yet.</p>
      ) : (
        meals.map((meal) => (
<div key={meal._id} className="meal-card">
  <h3>{meal.mealType}</h3>

  <div className="meal-details">
    <p><strong>Food:</strong> {meal.foodName}</p>
    <p><strong>Quantity:</strong> {meal.quantity}g</p>
    <p><strong>Calories:</strong> {meal.calories} Kcal</p>
  </div>

  <div className="meal-actions">
    <button onClick={() => handleEditMeal(meal)}>
      EDIT
    </button>

    <button
      className="delete-btn"
      onClick={() => handleDeleteMeal(meal._id)}
    >
      DELETE
    </button>
  </div>
</div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
