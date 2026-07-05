const express = require("express");
const router = express.Router();
const {
  enrollInInternship,
  getMyEnrollments,
  getEnrollmentsForInternship,
  completeModule,
  markAttendance,
  issueCertificate,
} = require("../controllers/enrollmentController");
const { protect, authorize } = require("../middleware/auth");

router.get("/mine", protect, authorize("student"), getMyEnrollments);
router.get("/internship/:internshipId", protect, authorize("mentor", "admin"), getEnrollmentsForInternship);
router.post("/:internshipId", protect, authorize("student"), enrollInInternship);
router.post("/:id/complete-module/:moduleId", protect, authorize("student"), completeModule);
router.post("/:id/attendance", protect, authorize("student"), markAttendance);
router.post("/:id/issue-certificate", protect, authorize("mentor", "admin"), issueCertificate);

module.exports = router;
