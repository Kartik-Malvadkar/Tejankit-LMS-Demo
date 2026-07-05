const asyncHandler = require("express-async-handler");
const Internship = require("../models/Internship");
const Enrollment = require("../models/Enrollment");

// @desc List all published internships (public), with optional filters
// @route GET /api/internships
const getInternships = asyncHandler(async (req, res) => {
  const { domain, search } = req.query;
  const filter = { status: "published" };
  if (domain) filter.domain = domain;
  if (search) filter.title = { $regex: search, $options: "i" };

  const internships = await Internship.find(filter).populate("mentor", "name avatarUrl").sort("-createdAt");
  res.json(internships);
});

// @desc Get a single internship by id
// @route GET /api/internships/:id
const getInternshipById = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id).populate("mentor", "name avatarUrl bio");
  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }
  res.json(internship);
});

// @desc Create a new internship (mentor or admin)
// @route POST /api/internships
const createInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.create({
    ...req.body,
    mentor: req.user.role === "mentor" ? req.user._id : req.body.mentor,
  });
  res.status(201).json(internship);
});

// @desc Update an internship (owning mentor or admin)
// @route PUT /api/internships/:id
const updateInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }
  if (req.user.role === "mentor" && String(internship.mentor) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only edit your own internships");
  }
  Object.assign(internship, req.body);
  const updated = await internship.save();
  res.json(updated);
});

// @desc Delete an internship (owning mentor or admin)
// @route DELETE /api/internships/:id
const deleteInternship = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }
  if (req.user.role === "mentor" && String(internship.mentor) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only delete your own internships");
  }
  await internship.deleteOne();
  res.json({ message: "Internship removed" });
});

// @desc List internships owned by the logged-in mentor
// @route GET /api/internships/mentor/mine
const getMyMentorInternships = asyncHandler(async (req, res) => {
  const internships = await Internship.find({ mentor: req.user._id }).sort("-createdAt");
  res.json(internships);
});

// @desc Leaderboard across a given internship (top students by points earned during it)
// @route GET /api/internships/:id/leaderboard
const getLeaderboard = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ internship: req.params.id })
    .populate("student", "name avatarUrl points")
    .sort("-progressPercent");
  const leaderboard = enrollments.map((e) => ({
    student: e.student,
    progressPercent: e.progressPercent,
    status: e.status,
  }));
  res.json(leaderboard);
});

module.exports = {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  getMyMentorInternships,
  getLeaderboard,
};
