const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/users");
const Exercise = require("./models/exercise");
const bodyparser = require("body-parser");
const auth = require("./Auth/auth");
app.use(auth);
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to the database");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});
app.get("/api/users", async (req, res) => {
  try {
    let allusers = await User.find();
    res.status(200).json(allusers);
  } catch (error) {
    console.error(error);
    res.status(400).json("error getting users");
  }
});
app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    let user_id = req.params._id;
    let user = await User.findOne({ _id: user_id });
    if (!user) {
      console.error("User not found");
      return res.status(404).json({ error: "User not found" });
    }
    let username = user.username
    let exercises = await Exercise.find({ username: username });
    let count = exercises.length;
    res.status(200).json({
      username: username,
      count: count,
      _id: user_id,
      log: exercises,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json("error getting users");
  }
});
app.post("/api/users", async (req, res) => {
  let username = req.body.username;
  let newUser = new User({ username: username });
  await newUser
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(`user not created : ${err}`);
    });
});
app.post("/api/users/:id/exercises", async (req, res) => {
  try {
    let userid = req.params.id;
    let { description, duration, date } = req.body;
    let user = await User.findOne({ _id: userid });
    console.log(user);
    if (!user) {
      console.log("user with id not found");
      res.status(400).json("user not found");
    }
    try {
      description = String(description);
      duration = Number(duration);
      if (!date) {
        date = new Date();
      } else date = new Date(date);
      let newExercise = new Exercise({
        userid: userid,
        description,
        username: user.username,
        description,
        date: date,
      });
      newExercise
        .save()
        .then((data) => {
          res.json(data);
        })
        .catch((err) => {
          console.error(`user exercise was not created : ${err}`);
        });
    } catch (Err) {
      console.error("invalid :" + Err);
    }
  } catch (error) {
    console.error(error);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
