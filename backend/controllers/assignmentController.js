const asyncHandler = require("express-async-handler");
const Assignment = require("../models/Assignment");
const Internship = require("../models/Internship");

// @desc List assignments for an internship
// @route GET /api/assignments/internship/:internshipId
const getAssignmentsForInternship = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ internship: req.params.internshipId }).sort("dueDate");
  res.json(assignments);
});

// @desc Get today's daily challenges across all published internships
// @route GET /api/assignments/daily-challenges
const getDailyChallenges = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({ isDailyChallenge: true }).populate("internship", "title domain");
  res.json(assignments);
});

// @desc Create an assignment (mentor/admin)
// @route POST /api/assignments
const createAssignment = asyncHandler(async (req, res) => {
  const internship = await Internship.findById(req.body.internship);
  if (!internship) {
    res.status(404);
    throw new Error("Internship not found");
  }
  if (req.user.role === "mentor" && String(internship.mentor) !== String(req.user._id)) {
    res.status(403);
    throw new Error("You can only add assignments to your own internships");
  }
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

// @desc Update an assignment (mentor/admin)
// @route PUT /api/assignments/:id
const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }
  Object.assign(assignment, req.body);
  const updated = await assignment.save();
  res.json(updated);
});

// @desc Delete an assignment (mentor/admin)
// @route DELETE /api/assignments/:id
const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }
  await assignment.deleteOne();
  res.json({ message: "Assignment removed" });
});

module.exports = {
  getAssignmentsForInternship,
  getDailyChallenges,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
