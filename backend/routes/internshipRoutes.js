const express = require("express");
const router = express.Router();
const {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyMentorInternships,
  getLeaderboard,
} = require("../controllers/internshipController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getInternships);
router.get("/mentor/mine", protect, authorize("mentor", "admin"), getMyMentorInternships);
router.get("/:id", getInternshipById);
router.get("/:id/leaderboard", getLeaderboard);
router.post("/", protect, authorize("mentor", "admin"), createInternship);
router.put("/:id", protect, authorize("mentor", "admin"), updateInternship);
router.delete("/:id", protect, authorize("mentor", "admin"), deleteInternship);

module.exports = router;
