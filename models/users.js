const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    exercise: {type: mongoose.Types.ObjectId, ref:"Exercise"}
});

let User = mongoose.model('user', userSchema)
module.exports = User
