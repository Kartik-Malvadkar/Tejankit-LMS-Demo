const asyncHandler = require("express-async-handler");
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const User = require("../models/User");
const { evaluateSubmissionWithAI } = require("../utils/aiClient");

// @desc Student submits work for an assignment
// @route POST /api/submissions/:assignmentId
const submitAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error("Assignment not found");
  }

  const existing = await Submission.findOne({ assignment: assignment._id, student: req.user._id });
  if (existing) {
    existing.textContent = req.body.textContent || existing.textContent;
    existing.fileUrl = req.body.fileUrl || existing.fileUrl;
    existing.submittedAt = new Date();
    existing.status = "pending";
    const updated = await existing.save();
    return res.json(updated);
  }

  const submission = await Submission.create({
    assignment: assignment._id,
    student: req.user._id,
    textContent: req.body.textContent || "",
    fileUrl: req.body.fileUrl || "",
  });

  res.status(201).json(submission);
});

// @desc Get submissions for an assignment (mentor/admin)
// @route GET /api/submissions/assignment/:assignmentId
const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ assignment: req.params.assignmentId })
    .populate("student", "name email avatarUrl")
    .sort("-submittedAt");
  res.json(submissions);
});

// @desc Get logged-in student's own submissions
// @route GET /api/submissions/mine
const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await Submission.find({ student: req.user._id }).populate("assignment", "title maxScore dueDate");
  res.json(submissions);
});

// @desc Mentor manually grades a submission
// @route PUT /api/submissions/:id/grade
const gradeSubmission = asyncHandler(async (req, res) => {
  const { score, feedback } = req.body;
  const submission = await Submission.findById(req.params.id);
  if (!submission) {
    res.status(404);
    throw new Error("Submission not found");
  }

  submission.score = score;
  submission.feedback = feedback || submission.feedback;
  submission.status = "evaluated";
  submission.evaluatedBy = req.user._id;
  const updated = await submission.save();

  // Small gamification bump for the leaderboard
  await User.findByIdAndUpdate(submission.student, { $inc: { points: Math.round((score || 0) / 10) } });

  res.json(updated);
});

// @desc AI assignment evaluator: auto-suggests a score + feedback (mentor reviews/confirms)
// @route POST /api/submissions/:id/ai-evaluate
const aiEvaluateSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id).populate("assignment");
  if (!submission) {
    res.status(404);
    throw new Error("Submission not found");
  }

  const result = await evaluateSubmissionWithAI({
    assignmentTitle: submission.assignment.title,
    assignmentDescription: submission.assignment.description,
    maxScore: submission.assignment.maxScore,
    studentAnswer: submission.textContent,
  });

  res.json({ suggestedScore: result.score, suggestedFeedback: result.feedback, aiGenerated: true });
});

module.exports = {
  submitAssignment,
  getSubmissionsForAssignment,
  getMySubmissions,
  gradeSubmission,
  aiEvaluateSubmission,
};
