const mongoose = require("mongoose");

const exerciseSchema = mongoose.Schema({
  user_id: String,
  username:String,
  description: String,
  duration: Number,
  date: Date,
});

let Exercise = mongoose.model("Exercise", exerciseSchema);
module.exports = Exercise;
