const express = require("express");
const router = express.Router();
const { verifyCertificate, getMyCertificates } = require("../controllers/certificateController");
const { protect, authorize } = require("../middleware/auth");

router.get("/verify/:certificateId", verifyCertificate); // public, used by QR code
router.get("/mine", protect, authorize("student"), getMyCertificates);

module.exports = router;
