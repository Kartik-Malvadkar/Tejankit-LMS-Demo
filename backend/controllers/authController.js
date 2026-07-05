const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc Register a new user (students self-register; mentors/admins are created by an admin)
// @route POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, role: "student" });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc Authenticate user and return a token
// @route POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("This account has been deactivated");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
});

// @desc Get logged-in user's profile
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Update logged-in user's profile (bio, skills, portfolio links, avatar)
// @route PUT /api/auth/me
const updateMe = asyncHandler(async (req, res) => {
  const fields = ["name", "avatarUrl", "bio", "skills", "portfolioLinks"];
  const user = await User.findById(req.user._id);

  fields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  const updated = await user.save();
  res.json(updated);
});

// @desc Create a mentor or admin account (admin only)
// @route POST /api/auth/create-staff
const createStaffAccount = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["mentor", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Role must be 'mentor' or 'admin'");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const user = await User.create({ name, email, password, role });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
});

module.exports = { registerUser, loginUser, getMe, updateMe, createStaffAccount };
