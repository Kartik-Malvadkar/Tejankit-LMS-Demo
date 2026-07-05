const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, updateMe, createStaffAccount } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/create-staff", protect, authorize("admin"), createStaffAccount);

module.exports = router;
