import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [meals, setMeals] = useState([]);
  const [foods,setFoods] = useState([]);
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

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleSaveCalorieGoal = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    "http://localhost:5000/calorie-goal",
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
  `http://localhost:5000/meals?date=${date}`,
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
    const response = await fetch("http://localhost:5000/foods");
    const data = await response.json();
    console.log("Foods:",data);
    if (response.ok){
      setFoods(data);
    }
  };

  const handleAddMeal = async (e) => {
  e.preventDefault();
  if (!foodName || !quantity || Number(quantity) <= 0) {
  alert("Please select a food and enter a valid quantity.");
  return;
}

  const token = localStorage.getItem("token");

  const response = await fetch("http://localhost:5000/meals", {
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
const handleEditMeal=(meal)=>{
  setEditingMeal(meal);
};
const handleUpdateMeal = async ()=>{
  const token = localStorage.getItem("token");
  const response = await fetch(
    `http://localhost:5000/meals/${editingMeal._id}`,
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
    `http://localhost:5000/meals/${mealId}`,
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
      const response = await fetch("http://localhost:5000/profile", {
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
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Nutritrack</h1>
      <h2>Today's Calories: {totalCalories}/{calorieGoal} Kcal</h2>
      <p>Remaining:{remainingCalories} Kcal</p>
      <label>Daily Calorie Goal: </label>

<input
  type="number"
  value={calorieGoal ?? ""}
  onChange={(e) => setCalorieGoal(Number(e.target.value))}
/>

<button onClick={handleSaveCalorieGoal}>
  SAVE GOAL
</button>
      <button onClick={handleLogout}>LOG OUT</button>

      {user ? (
        <>
          <h2>Hello, {user.name}</h2>
          <p>{user.email}</p>
        </>
      ) : (
        <p>Loading profile...</p>
      )}

      <h2>Add Meal</h2>

      <form onSubmit={handleAddMeal}>
        <select
  value={foodName}
  onChange={(e) => setFoodName(e.target.value)}
>
  <option value="">Select Food</option>

  {foods.map((food) => (
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
      {editingMeal && (
  <>
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
  </>
)}
<h2>Meal History</h2>
<input
  type="date"
  value={selectedDate}
  onChange={(e)=>setSelectedDate(e.target.value)}
  />
  <button onClick={fetchMeals}>VIEW MEALS</button>
      <h2>Your Meals</h2>

      {meals.length === 0 ? (
        <p>No meals added yet.</p>
      ) : (
        meals.map((meal) => (
          <div key={meal._id}>
            <h3>{meal.mealType}</h3>
            <p>Food: {meal.foodName}</p>
            <p>Quantity: {meal.quantity}g</p>
            <p>Calories: {meal.calories}</p>
            <button onClick={()=> handleEditMeal(meal)}>
              EDIT
            </button>
            <button onClick={() => handleDeleteMeal(meal._id)}>
  DELETE
</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
