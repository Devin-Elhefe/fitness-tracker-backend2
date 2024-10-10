const express = require("express");
const router = express.Router();
const WorkoutModel = require("../models/workout");

// Routes go here!

// This is the create Route!
router.post("/", async function (req, res) {
  console.log(req.body, "<-- contents of the form");
  console.log(req.user, "<-- req.user from the jwt");
  req.body.user = req.user._id;

  try {
    const workoutDoc = await WorkoutModel.create(req.body);
    workoutDoc._doc.user = req.user;
    res.status(201).json(workoutDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


// This is the show Route!
router.get("/", async function (req, res) {
  try {
    const workoutDocs = await WorkoutModel.find({});
    res.status(200).json(workoutDocs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
