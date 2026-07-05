const express = require("express");
const router = express.Router();
const { getModulesForInternship, createModule, updateModule, deleteModule } = require("../controllers/moduleController");
const { protect, authorize } = require("../middleware/auth");

router.get("/internship/:internshipId", getModulesForInternship);
router.post("/", protect, authorize("mentor", "admin"), createModule);
router.put("/:id", protect, authorize("mentor", "admin"), updateModule);
router.delete("/:id", protect, authorize("mentor", "admin"), deleteModule);

module.exports = router;
