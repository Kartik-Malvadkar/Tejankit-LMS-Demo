const express = require("express");
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  gradeSubmission,
  aiEvaluateSubmission,
} = require("../controllers/submissionController");
const { protect, authorize } = require("../middleware/auth");

router.get("/mine", protect, authorize("student"), getMySubmissions);
router.get("/assignment/:assignmentId", protect, authorize("mentor", "admin"), getSubmissionsForAssignment);
router.post("/:assignmentId", protect, authorize("student"), submitAssignment);
router.put("/:id/grade", protect, authorize("mentor", "admin"), gradeSubmission);
router.post("/:id/ai-evaluate", protect, authorize("mentor", "admin"), aiEvaluateSubmission);

module.exports = router;
