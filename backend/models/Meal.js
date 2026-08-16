const mongoose = require("mongoose")

const mealSchema = new mongoose.Schema({
  userEmail:{
    type:String,
    required: true
  },

  mealType:{
    type:String,
    required: true
  },
  foodName:{
    type:String,
    required:true
  },
  quantity:{
    type:Number,
    required: true
  },
  calories:{
    type:String,
    required:true
  },
  createdAt:{
    type:Date,
    default:Date.now
  }
});
const Meal = mongoose.model("Meal",mealSchema);
model.exports = Meal;