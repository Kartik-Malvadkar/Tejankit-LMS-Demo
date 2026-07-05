const express = require("express");
const router = express.Router();
const {
  getAssignmentsForInternship,
  getDailyChallenges,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");
const { protect, authorize } = require("../middleware/auth");

router.get("/internship/:internshipId", protect, getAssignmentsForInternship);
router.get("/daily-challenges", getDailyChallenges);
router.post("/", protect, authorize("mentor", "admin"), createAssignment);
router.put("/:id", protect, authorize("mentor", "admin"), updateAssignment);
router.delete("/:id", protect, authorize("mentor", "admin"), deleteAssignment);

module.exports = router;
