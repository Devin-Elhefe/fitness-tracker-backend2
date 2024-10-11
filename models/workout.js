const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
  goalType: {
    type: String,
    required: true,
    enum: [
      "Weight Loss",
      "Muscle Gain",
      "Steps",
      "Building endurance",
      "Flexibility Training",
      "Be healthier",
    ],
  },
  endDate: {
    type: Date,
    required: true,
  },
  isComplete: { type: Boolean },
});

const workoutSchema = mongoose.Schema({
  workoutType: {
    type: String,
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  notes: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  goals: [goalSchema],
});

module.exports = mongoose.model("Workout", workoutSchema);



