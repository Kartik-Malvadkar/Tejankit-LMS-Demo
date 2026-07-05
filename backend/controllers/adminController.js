const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Internship = require("../models/Internship");
const Enrollment = require("../models/Enrollment");
const Submission = require("../models/Submission");

// @desc High-level platform stats for the admin dashboard
// @route GET /api/admin/stats
const getPlatformStats = asyncHandler(async (req, res) => {
  const [totalStudents, totalMentors, totalInternships, activeEnrollments, completedEnrollments, pendingSubmissions] =
    await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "mentor" }),
      Internship.countDocuments(),
      Enrollment.countDocuments({ status: "active" }),
      Enrollment.countDocuments({ status: "completed" }),
      Submission.countDocuments({ status: "pending" }),
    ]);

  res.json({
    totalStudents,
    totalMentors,
    totalInternships,
    activeEnrollments,
    completedEnrollments,
    pendingSubmissions,
  });
});

// @desc List all users, optionally filtered by role
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  const users = await User.find(filter).select("-password").sort("-createdAt");
  res.json(users);
});

// @desc Activate/deactivate a user account
// @route PUT /api/admin/users/:id/toggle-active
const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ _id: user._id, isActive: user.isActive });
});

// @desc List all internships regardless of status (admin oversight)
// @route GET /api/admin/internships
const getAllInternshipsAdmin = asyncHandler(async (req, res) => {
  const internships = await Internship.find().populate("mentor", "name email").sort("-createdAt");
  res.json(internships);
});

module.exports = { getPlatformStats, getAllUsers, toggleUserActive, getAllInternshipsAdmin };
