const express = require("express");
const router = express.Router();
const { askDoubtAssistant, generateQuiz } = require("../controllers/aiController");
const { protect, authorize } = require("../middleware/auth");

router.post("/doubt", protect, askDoubtAssistant);
router.post("/quiz/:moduleId", protect, authorize("mentor", "admin"), generateQuiz);

module.exports = router;
