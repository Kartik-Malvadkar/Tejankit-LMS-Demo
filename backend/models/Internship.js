const mongoose = require("mongoose");

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    domain: { type: String, required: true }, // e.g. "Web Development", "Data Science"
    description: { type: String, required: true },
    mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    durationWeeks: { type: Number, required: true, default: 4 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    capacity: { type: Number, default: 0 }, // 0 = unlimited
    isPaid: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    thumbnailUrl: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published", "closed", "archived"], default: "draft" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", internshipSchema);
