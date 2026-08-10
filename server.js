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
  const foods = [
    {id:1,name:"chicken",calories:"40g"},
    {id :2,name:"egg",calories:"30g"},
    {id:3,name:"fish",calories:"29g"},
    {id:4,name:"rice",calories:"130g"}
    ];
    app.get("/foods",(req,res) => {
        const name=req.query.name;
        const food=foods.find(item=> item.name.toUpperCase() === name.toUpperCase()
      );
      if(!food){
        return res.status(404).json({
          message:"food not found"
        });
      }
      res.json(food)
});
    app.post("/foods",(req,res) =>{
      foods.push(req.body);
      res.json({
        message:"food added successfully!",
        foods:foods
      });
      });
      app.put("/foods/:id",(req,res)=>{
      const id = Number(req.params.id);
      const updatedFood=req.body;
      const food =foods.find(item=> item.id ===id);
      if (!food){
        return res.status(404).json({
          message:"food not found"
        });
      }
      food.name= updatedFood.name;
      food.calories = updatedFood.calories;
      res.json({
        message:"food updated successfully",
        food
      });
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
      app.post("/login",async (req,res) => {
          const loginData = req.body;
          const existingUser = await User.findOne({
            email:loginData.email
          });
        
          if (!existingUser){
            return res.status(404).json({
              message:"user not found"
          });
        }
            const isMatch = await bcrypt.compare(
              loginData.password,
              existingUser.password
            );
            if(!isMatch){
              return res.status(401).json({
                message:"invalid password"
              });
            }
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
  
    
app.listen(5000,() => {
  console.log("server is running on port 5000");
});