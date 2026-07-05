const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    status: { type: String, enum: ["pending", "active", "completed", "dropped"], default: "pending" },
    progressPercent: { type: Number, default: 0 },
    completedModules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
    attendance: [
      {
        date: { type: Date, default: Date.now },
        present: { type: Boolean, default: true },
      },
    ],
    certificateIssued: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ["not_required", "pending", "paid"], default: "not_required" },
  },
  { timestamps: true }
);

enrollmentSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
