require("dotenv").config();
const dns = require("dns");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

const userSchema = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
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

app.use(express.json());
  const foodSchema = new mongoose.Schema({
    name: {
      type: String,
      required:true
    },
    calories:{
      type:String,
      required:true
    }
  });
  const Food = mongoose.model("Food",foodSchema);
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
    }
  },{
    timestamps:true
  });
    const Meal = mongoose.model("meal",mealSchema)
    app.get("/foods", async (req,res) => {
        const name=req.query.name;
        
      try {
        const food = await Food.findOne({
          name: new RegExp(`^${name}$`,"i")
        });

      if(!food){
        return res.status(404).json({
          message:"food not found"
        });
      }
      res.json(food);
    }catch (error){
      res.status(500).json({
        message:"server error"
      });
    }
});
    app.post("/foods", async (req,res)=> {
      try{
        const newFood = new Food({
          name: req.body.name,
          calories: req.body.calories
        });
        await newFood.save();

        res.status(201).json({
          message:"food added successfully!",
          food: newFood
        });
      } catch (error) {
        console.log("food creation error:",error);
        res.status(500).json({
          message:"server error",
          error:error.message
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
    message: "account created successfully"
  });
});
      app.post("/login", async (req, res) => {
  const loginData = req.body;

  const existingUser = await User.findOne({
    email: loginData.email
  });

  if (!existingUser) {
    return res.status(404).json({
      message: "user not found"
    });
  }

  const isMatch = await bcrypt.compare(
    loginData.password,
    existingUser.password
  );

  if (!isMatch) {
    return res.status(401).json({
      message: "invalid password"
    });
  }

  const token = jwt.sign(
    { email: existingUser.email },
    "mysecretkey",
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "login successful",
    token: token
  });
});


app.get("/profile", authMiddleware, async (req, res) => {
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
          
      const token = jwt.sign(
        {email: existingUser.email},
        "mysecretkey",
        {expiresIn:"1h"}
      );
      return res.status(200).json({
                message:"login successful",
                token: token
                });
              });
  app.post("/meals",authMiddleware,async(req,res)=>{
              try{
                const{foodName,quantity} = req.body;
                console.log("food requested",foodName);
                const food = await Food.findOne({
                  name:foodName
                });
                console.log("food found:",food);
                if(!food) {
                  return res.status(404).json({
                    message:"food not found"
                  });
                }
                const caloriesPer100g = Number(
                  food.calories.replace("g","")
                );
                const totalCalories = (caloriesPer100g * quantity) /100;
                const newMeal = new Meal({
                  userEmail:req.user.email,
                  foodName:food.name,
                  quantity:quantity,
                  calories:totalCalories
                });
                await newMeal.save();
                res.status(201).json({
                  message:"meal added successfully",
                  meal:newMeal
                });
              }catch (error){
        
                console.log("meal creation error:",error);
                res.status(500).json({
                  message:"server error",
                  error:error.message
                });
              }
            });
              app.get("/meals", authMiddleware, async (req, res) => {
  try {
    const userMeals = await Meal.find({
      userEmail: req.user.email
    });

    res.json({
      message: "meals fetched successfully",
      meals: userMeals
    });

  } catch (error) {
    console.log("Meal fetch error:", error);

    res.status(500).json({
      message: "server error",
      error: error.message
    });
  }
});
app.get("/meals/today",authMiddleware,async(req,res)=>{
  try{
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);

    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);

    const meals = await Meal.find({
      userEmail:req.user.email,
      createdAt:{
        $gte: startOfToday,
        $lte: endOfToday
      }
    });
    let totalCalories =0;

    meals.forEach(meal =>{
      totalCalories += meal.calories;
    });
    res.json({
      message:"today's calories fetched successfully",
      totalCalories:totalCalories,
      meals:meals
    });
  } catch(error){
    console.log("daily calories error:",error);
    res.status(500).json({
      message:"server error",
      error:error.message
    });
  }
});
app.get("/dashboard",authMiddleware,async(req,res)=>{
  try{
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const endOfToday = new Date();
    endOfToday.setHours(23,59,59,999);
    
    const meals = await Meal.find({
      userEmail:req.user.email,
      createdAt:{
        $gte:startOfToday,
        $lte:endOfToday
      }
    });
    let totalCalories = 0;
    let totalQuantity = 0;

    meals.forEach(meal =>{
      totalCalories += meal.calories;
      totalQuantity += meal.quantity;

    });
    res.json({
      message:"dashboard data fetched successfully",
      totalCalories: totalCalories,
      mealCount:meals.length,
      totalQuantity:totalQuantity
    });
  } catch (error) {
    console.log("Dashboard error:",error);

    res.status(500).json({
      message:"server error",
      error:error.message
    });
  }
});
  
    
app.listen(5000,() => {
  console.log("server is running on port 5000");
});