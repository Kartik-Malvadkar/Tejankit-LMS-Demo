const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date },
    maxScore: { type: Number, default: 100 },
    isDailyChallenge: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
