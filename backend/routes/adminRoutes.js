const express = require("express");
const router = express.Router();
const { getPlatformStats, getAllUsers, toggleUserActive, getAllInternshipsAdmin } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));
router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-active", toggleUserActive);
router.get("/internships", getAllInternshipsAdmin);

module.exports = router;
