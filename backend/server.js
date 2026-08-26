require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const { stringify } = require("querystring");
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log("METHOD:", req.method);
  console.log("URL:", req.url);
  console.log("TYPE:", req.headers["content-type"]);
  console.log("BODY AFTER PARSING:", req.body);

  next();
});

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    default:""
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  dailyCalorieGoal:{
    type:Number,
    default:2000
  }
});

const User = mongoose.model("User", userSchema);

dns.setServers(["8.8.8.8","1.1.1.1"]);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected sucessfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed :",error);

  });


const authMiddleware = (req,res,next) =>{
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).json({
      message:"access denied"
    });
  }
  const token = authHeader.split(" ")[1];
  try{
    const decoded = jwt.verify(token, "mysecretkey");
    req.user = decoded;
    next();
  } catch (error){
    return res.status(401).json({
      message:"invaild or expired token"
    });
  }
};

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  calories: {
    type: Number,
    required: true
  },

  protein: {
    type: Number,
    default: 0
  },

  carbs: {
    type: Number,
    default: 0
  },

  fat: {
    type: Number,
    default: 0
  }
});

const Food = mongoose.model("Food", foodSchema);
  const mealSchema = new mongoose.Schema({
    userEmail:{
      type:String,
      required:true
    },
    foodName:{
      type:String,
      required: true
    },
    quantity:{
      type:Number,
      requited:true
    },
    calories:{
      type:Number,
      required:true
    },
    protein:{
      type:Number,
      default:0
    },
    carbs:{
      type:Number,
      default:0
    },
    fat:{
      type:Number,
      default:0
    },
    mealType:{
      type:String,
      enum:["Breakfast","Lunch","Dinner","Snack"],
      required:true
    }
  },{
    timestamps:true
  });
    const Meal = mongoose.model("meal",mealSchema)
    app.get("/foods", async (req, res) => {
  const name = req.query.name || "";

  try {
    const food = await Food.find({
      name: new RegExp(name, "i")
    });

    res.json(food);

  } catch (error) {
    console.log("food fetch error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.put("/calorie-goal", authMiddleware, async (req, res) => {
  try {
    const { dailyCalorieGoal } = req.body;

    if (!dailyCalorieGoal || Number(dailyCalorieGoal) <= 0) {
      return res.status(400).json({
        message: "Please enter a valid calorie goal"
      });
    }

    const user = await User.findOneAndUpdate(
      { email: req.user.email },
      { dailyCalorieGoal: Number(dailyCalorieGoal) },
      { new: true }
    );

    res.json({
      message: "Calorie goal updated successfully",
      dailyCalorieGoal: user.dailyCalorieGoal
    });
  } catch (error) {
    console.log("Calorie goal update error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
app.post("/foods", async (req, res) => {
  try {
    console.log("🔥 FOOD REQUEST:", req.body);

    const { name, calories, protein, carbs, fat } = req.body;

    const newFood = new Food({
      name: name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat)
    });

    console.log("🔥 FOOD BEFORE SAVE:", newFood);

    const savedFood = await newFood.save();

    console.log("🔥 FOOD SAVED:", savedFood);

    res.status(201).json({
      message: "Food added successfully",
      food: savedFood
    });

  } catch (error) {
    console.log("🔥 FOOD SAVE ERROR:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.put("/foods/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        calories: req.body.calories
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFood) {
      return res.status(404).json({
        message: "food not found"
      });
    }

    res.json({
      message: "food updated successfully",
      food: updatedFood
    });

  } catch (error) {
    console.log("Food update error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});

  app.post("/signup", async (req, res) => {
  const newUser = req.body;

  const existingUser = await User.findOne({
    email: newUser.email
  });

  if (existingUser) {
    return res.status(400).json({
      message: "email already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(newUser.password, 10);

  const user = new User({
    email: newUser.email,
    password: hashedPassword
  });

  await user.save();

  return res.status(201).json({
    message: "Account Created Successfully"
  });
});
      app.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const loginData = req.body;

    console.log("1. Looking for user....");

    const existingUser = await User.findOne({
      email: loginData.email
    });

    console.log(
      "2. User result:",
      existingUser ? "FOUND" : "NOT FOUND"
    );

    if (!existingUser) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    console.log("3. Checking password....");

    const isMatch = await bcrypt.compare(
      loginData.password,
      existingUser.password
    );

    console.log("4. Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: "invalid password"
      });
    }

    const token = jwt.sign(
      { email: existingUser.email },
      "mysecretkey",
      { expiresIn: "7d" }
    );

    console.log("6. Token created successfully");

    return res.status(200).json({
      message: "login successful",
      token: token
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "login server error",
      error: error.message
    });
  }
});

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    res.json({
      message: "profile accessed successfully",
      user: user
    });
  } catch (error) {
    console.log("Profile fetch error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


app.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { name, dailyCalorieGoal } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Name cannot be empty"
      });
    }

    if (!dailyCalorieGoal || Number(dailyCalorieGoal) <= 0) {
      return res.status(400).json({
        message: "Daily calorie goal must be greater than 0"
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      {
        name: name.trim(),
        dailyCalorieGoal: Number(dailyCalorieGoal)
      },
      {
        returnDocument: "after"
      }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.log("Profile update error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
});
app.post("/meals", authMiddleware, async (req, res) => {
  try {
    const { foodName, quantity, mealType } = req.body;

    console.log("Food requested:", foodName);
    console.log("Quantity:", quantity);
    console.log("Meal type:", mealType);

    const food = await Food.findOne({
      name: new RegExp(`^${foodName}$`, "i")
    });

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    const caloriesPer100g = Number(
  String(food.calories).replace("g", "").trim()
);

const proteinPer100g = Number(food.protein || 0);
const carbsPer100g = Number(food.carbs || 0);
const fatPer100g = Number(food.fat || 0);

const newQuantity = Number(quantity);

const calories =
  (caloriesPer100g * newQuantity) / 100;

const protein =
  (proteinPer100g * newQuantity) / 100;

const carbs =
  (carbsPer100g * newQuantity) / 100;

const fat =
  (fatPer100g * newQuantity) / 100;
    if (
  !Number.isFinite(calories) ||
  !Number.isFinite(protein) ||
  !Number.isFinite(carbs) ||
  !Number.isFinite(fat)
) {
  return res.status(400).json({
    message: "Invalid nutrition values for this food"
  });
}
    const newMeal = new Meal({
      userEmail: req.user.email,
      foodName: food.name,
      quantity: Number(quantity),
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)),
      carbs: Number(carbs.toFixed(1)),
      fat: Number(fat.toFixed(1)),
      mealType
    });

    await newMeal.save();

    console.log("Meal saved:", newMeal);

    res.status(201).json({
      message: "Meal added successfully",
      meal: newMeal
    });

  } catch (error) {
    console.log("Meal creation error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
  app.get("/meals",authMiddleware,async(req,res)=>{
    try{
      const {date}=req.query;
      let query ={
        userEmail:req.user.email
      };
      if (date) {
  const startDate = new Date(`${date}T00:00:00.000Z`);
  const endDate = new Date(`${date}T23:59:59.999Z`);

  query.createdAt = {
    $gte: startDate,
    $lte: endDate
  };
}
      const userMeals = await Meal.find(query);
      res.json({
        message:"meals fetched successfully",
        meals:userMeals
      });
    }catch (error){
      console.log("meal fetched error:",error);

      res.status(500).json({
        message:"server error",
        error:error.message
      });
    }
  });
app.delete("/meals/:id", authMiddleware, async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({
      _id: req.params.id,
      userEmail: req.user.email
    });

    if (!meal) {
      return res.status(404).json({
        message: "meal not found"
      });
    }

    res.json({
      message: "meal deleted successfully",
      meal: meal
    });

  } catch (error) {
    console.log("Meal delete error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.put("/meals/:id", authMiddleware, async (req, res) => {
  try {
    const meal = await Meal.findOne({
      _id: req.params.id,
      userEmail: req.user.email
    });

    if (!meal) {
      return res.status(404).json({
        message: "meal not found"
      });
    }

    if (req.body.quantity !== undefined) {
      const food = await Food.findOne({
        name: new RegExp(`^${meal.foodName}$`, "i")
      });

      if (!food) {
        return res.status(404).json({
          message: "food not found"
        });
      }

      const newQuantity = Number(req.body.quantity);

      if (!newQuantity || newQuantity <= 0) {
        return res.status(400).json({
          message: "invalid quantity"
        });
      }

      meal.quantity = newQuantity;

      meal.calories =
        (Number(food.calories) * newQuantity) / 100;

      meal.protein =
        (Number(food.protein || 0) * newQuantity) / 100;

      meal.carbs =
        (Number(food.carbs || 0) * newQuantity) / 100;

      meal.fat =
        (Number(food.fat || 0) * newQuantity) / 100;
    }

    if (req.body.mealType !== undefined) {
      meal.mealType = req.body.mealType;
    }

    await meal.save();

    res.json({
      message: "Meal updated successfully",
      meal: meal
    });

  } catch (error) {
    console.log("meal update error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.get("/meals/today", authMiddleware, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userEmail: req.user.email,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    let totalCalories = 0;

    meals.forEach(meal => {
      totalCalories += meal.calories;
    });

    res.json({
      message: "today's calories fetched successfully",
      totalCalories: totalCalories,
      meals: meals
    });

  } catch (error) {
    console.log("Daily calories error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.get("/analytics/weekly",authMiddleware,async(req,res)=>{
  try{
    const today = new Date();
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate()-6);
    const meals = await Meal.find({
      userEmail:req.user.email,
      createdAt: {
  $gte: sevenDaysAgo,
  $lte: today,
},
    });
    res.json({
      meals,
    });
  }catch (error){
    console.log("weekly analytics error:",error);
    res.status(500).json({
      message:"server error",
    });
  }
});
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      userEmail: req.user.email,
      createdAt: {
        $gte: startOfToday,
        $lte: endOfToday
      }
    });

    const user = await User.findOne({
      email: req.user.email
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found"
      });
    }

    const dailyCalorieGoal = user.dailyCalorieGoal;

    let totalCalories = 0;
    let totalQuantity = 0;

    const mealTypeCalories={
      Breakfast:0,
      Lunch:0,
      Dinner:0,
      Snack:0
    };

    meals.forEach((meal) => {
      totalCalories += meal.calories;
      totalQuantity += meal.quantity;

      if(mealTypeCalories[meal.mealType]!==undefined){
        mealTypeCalories[meal.mealType] += meal.calories;
      }
    });

    const remainingCalories =
      dailyCalorieGoal - totalCalories;

    const progressPercentage =
      (totalCalories / dailyCalorieGoal) * 100;

    res.json({
      message: "dashboard data fetched successfully",
      totalCalories: totalCalories,
      mealCount: meals.length,
      totalQuantity: totalQuantity,
      dailyCalorieGoal: dailyCalorieGoal,
      remainingCalories: remainingCalories,
      progressPercentage: Number(progressPercentage.toFixed(1)),
      mealTypeCalories:mealTypeCalories
    });

  } catch (error) {
    console.log("Dashboard error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.put("/goal",authMiddleware,async(req,res)=>{
  try{
    const{dailyCalorieGoal} = req.body;
    if(!dailyCalorieGoal){
      return res.status(400).json({
        message:"daily calorie goal is required"
      });
    }
    const user = await User.findOneAndUpdate(
      {email:req.user.email},
      {dailyCalorieGoal: dailyCalorieGoal},
      {new:true}
    ).select("-password");
    res.json({
      message:"daily calorie goal updated successfully",
      user:user
    });
  }catch (error){
    console.log("Goal update error:",error);
    res.status(500).json({
      message:"server error",
      error:error.message
    });
  }
});

app.listen(5000,() => {
  console.log("server is running on port 5000");
});