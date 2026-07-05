const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true }, // e.g. TJK-2026-XXXXX
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    enrollment: { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment", required: true },
    issueDate: { type: Date, default: Date.now },
    qrCodeDataUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certificate", certificateSchema);
