const asyncHandler = require("express-async-handler");
const Certificate = require("../models/Certificate");

// @desc Public certificate verification by certificate ID (used by the QR code link)
// @route GET /api/certificates/verify/:certificateId
const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.certificateId })
    .populate("student", "name avatarUrl")
    .populate("internship", "title domain durationWeeks");

  if (!certificate) {
    res.status(404);
    throw new Error("No certificate found with this ID");
  }

  res.json({
    valid: true,
    certificateId: certificate.certificateId,
    studentName: certificate.student.name,
    internshipTitle: certificate.internship.title,
    domain: certificate.internship.domain,
    durationWeeks: certificate.internship.durationWeeks,
    issueDate: certificate.issueDate,
  });
});

// @desc Get all certificates for the logged-in student
// @route GET /api/certificates/mine
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ student: req.user._id }).populate("internship", "title domain");
  res.json(certificates);
});

module.exports = { verifyCertificate, getMyCertificates };
