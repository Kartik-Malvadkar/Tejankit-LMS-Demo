const mongoose = require("mongoose");

// A module is one unit of course content inside an internship: video + notes
const moduleSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    title: { type: String, required: true },
    order: { type: Number, required: true, default: 1 },
    videoUrl: { type: String, default: "" },
    notes: { type: String, default: "" }, // markdown/rich text
    resources: [{ label: String, url: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", moduleSchema);
