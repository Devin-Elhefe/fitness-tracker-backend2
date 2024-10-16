const express = require("express");
const router = express.Router();
const WorkoutModel = require("../models/workout");
const verifyToken = require('../middleware/verify-token');

// Middleware to verify token
router.use(verifyToken);

// This is the create Route!
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const workoutDocs = await WorkoutModel.find({ user: req.user._id }); // Filter by user ID
    res.status(200).json(workoutDocs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// This is the Create Goal Route!
router.post("/:workoutid/goals", async (req, res) => {
  console.log(req.body, "<-- goal data from form");

  const { goalType, endDate } = req.body;

  if (!goalType || !endDate) {
    return res
      .status(400)
      .json({ error: "Goal type and end date are required." });
  }

  try {
    const workoutDoc = await WorkoutModel.findOne({
      _id: req.params.workoutid,
      user: req.user._id,
    }); // Filter by user ID
    if (!workoutDoc) {
      return res.status(404).json({ message: "Workout not found" });
    }

    workoutDoc.goals.push(req.body);
    await workoutDoc.save();

    res.status(201).json(workoutDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// This is the delete Route!
router.delete("/:workoutid", async (req, res) => {
  try {
    const deletedWorkout = await WorkoutModel.findOneAndDelete({
      _id: req.params.workoutid,
      user: req.user._id,
    }); // Filter by user ID
    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res
      .status(200)
      .json({
        message: "Workout deleted successfully",
        workout: deletedWorkout,
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// This is the show route!
router.get("/:id", async (req, res) => {
  try {
    const workoutDoc = await WorkoutModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    }); // Filter by user ID
    if (!workoutDoc) {
      return res.status(404).json({ message: "Workout not found" });
    }
    res.status(200).json(workoutDoc);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// This is the update route!
router.put("/:id", async (req, res) => {
  try {
    const workoutDoc = await WorkoutModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    }); // Filter by user ID
    if (!workoutDoc) {
      return res.status(404).json({ message: "Workout not found" });
    }

    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update if goal is complete route!
router.put("/:workoutid/goals/:goalid", async (req, res) => {
  try {
    const workoutDoc = await WorkoutModel.findOne({
      _id: req.params.workoutid,
      user: req.user._id,
    }); // Filter by user ID
    if (!workoutDoc) {
      return res.status(404).json({ message: "Workout not found" });
    }

    // Find the goal and update the isComplete status
    const goal = workoutDoc.goals.id(req.params.goalid);
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    goal.isComplete = req.body.isComplete;

    await workoutDoc.save();
    res.status(200).json(workoutDoc);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
