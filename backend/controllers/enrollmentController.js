const asyncHandler = require("express-async-handler");
const Enrollment = require("../models/Enrollment");
const Internship = require("../models/Internship");
const Module = require("../models/Module");
const { generateCertificateId, generateQrCode } = require("../utils/certificateGenerator");
const Certificate = require("../models/Certificate");

// @desc Student enrolls in an internship
// @route POST /api/enrollments/:internshipId
const enrollInInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.internshipId);
  if (!internship || internship.status !== "published") {
    res.status(404);
    throw new Error("Internship not available for enrollment");
  }

  const existing = await Enrollment.findOne({ student: req.user._id, internship: internship._id });
  if (existing) {
    res.status(400);
    throw new Error("You are already enrolled in this internship");
  }

  if (internship.capacity > 0) {
    const count = await Enrollment.countDocuments({ internship: internship._id, status: { $ne: "dropped" } });
    if (count >= internship.capacity) {
      res.status(400);
      throw new Error("This internship has reached its capacity");
    }
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    internship: internship._id,
    status: "active",
    paymentStatus: internship.isPaid ? "pending" : "not_required",
  });

  res.status(201).json(enrollment);
});

// @desc Get logged-in student's enrollments
// @route GET /api/enrollments/mine
const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate("internship")
    .sort("-createdAt");
  res.json(enrollments);
});

// @desc Get all enrollments for an internship (mentor/admin)
// @route GET /api/enrollments/internship/:internshipId
const getEnrollmentsForInternship = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ internship: req.params.internshipId })
    .populate("student", "name email avatarUrl")
    .sort("-createdAt");
  res.json(enrollments);
});

// @desc Mark a module as completed for the logged-in student, update progress
// @route POST /api/enrollments/:id/complete-module/:moduleId
const completeModule = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment || String(enrollment.student) !== String(req.user._id)) {
    res.status(404);
    throw new Error("Enrollment not found");
  }

  if (!enrollment.completedModules.includes(req.params.moduleId)) {
    enrollment.completedModules.push(req.params.moduleId);
  }

  const totalModules = await Module.countDocuments({ internship: enrollment.internship });
  enrollment.progressPercent = totalModules > 0
    ? Math.round((enrollment.completedModules.length / totalModules) * 100)
    : 0;

  if (enrollment.progressPercent >= 100) {
    enrollment.status = "completed";
  }

  await enrollment.save();
  res.json(enrollment);
});

// @desc Record attendance for today (student check-in)
// @route POST /api/enrollments/:id/attendance
const markAttendance = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment || String(enrollment.student) !== String(req.user._id)) {
    res.status(404);
    throw new Error("Enrollment not found");
  }

  const today = new Date().toDateString();
  const alreadyMarked = enrollment.attendance.some((a) => new Date(a.date).toDateString() === today);
  if (alreadyMarked) {
    res.status(400);
    throw new Error("Attendance already marked for today");
  }

  enrollment.attendance.push({ date: new Date(), present: true });
  await enrollment.save();
  res.json({ message: "Attendance marked", attendance: enrollment.attendance });
});

// @desc Issue a certificate for a completed enrollment (mentor/admin, or auto-triggered)
// @route POST /api/enrollments/:id/issue-certificate
const issueCertificate = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate("internship");
  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }
  if (enrollment.status !== "completed") {
    res.status(400);
    throw new Error("Enrollment must be completed before issuing a certificate");
  }
  if (enrollment.certificateIssued) {
    res.status(400);
    throw new Error("Certificate has already been issued for this enrollment");
  }

  const certificateId = generateCertificateId();
  const { verifyUrl, qrCodeDataUrl } = await generateQrCode(certificateId, process.env.CLIENT_URL || "http://localhost:5173");

  const certificate = await Certificate.create({
    certificateId,
    student: enrollment.student,
    internship: enrollment.internship._id,
    enrollment: enrollment._id,
    qrCodeDataUrl,
  });

  enrollment.certificateIssued = true;
  await enrollment.save();

  res.status(201).json({ certificate, verifyUrl });
});

module.exports = {
  enrollInInternship,
  getMyEnrollments,
  getEnrollmentsForInternship,
  completeModule,
  markAttendance,
  issueCertificate,
};
