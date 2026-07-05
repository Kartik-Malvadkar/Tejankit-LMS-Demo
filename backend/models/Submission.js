const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    textContent: { type: String, default: "" },
    fileUrl: { type: String, default: "" },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "evaluated"], default: "pending" },
    score: { type: Number, default: null },
    feedback: { type: String, default: "" },
    evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model("Submission", submissionSchema);
