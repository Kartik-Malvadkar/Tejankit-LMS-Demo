const asyncHandler = require("express-async-handler");
const Module = require("../models/Module");
const Internship = require("../models/Internship");

const assertMentorOwnsInternship = async (internshipId, user) => {
  const internship = await Internship.findById(internshipId);
  if (!internship) {
    const err = new Error("Internship not found");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "mentor" && String(internship.mentor) !== String(user._id)) {
    const err = new Error("You can only manage content for your own internships");
    err.statusCode = 403;
    throw err;
  }
  return internship;
};

// @desc List modules for an internship, ordered
// @route GET /api/modules/internship/:internshipId
const getModulesForInternship = asyncHandler(async (req, res) => {
  const modules = await Module.find({ internship: req.params.internshipId }).sort("order");
  res.json(modules);
});

// @desc Create a module (mentor/admin)
// @route POST /api/modules
const createModule = asyncHandler(async (req, res) => {
  await assertMentorOwnsInternship(req.body.internship, req.user);
  const module = await Module.create(req.body);
  res.status(201).json(module);
});

// @desc Update a module (mentor/admin)
// @route PUT /api/modules/:id
const updateModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);
  if (!module) {
    res.status(404);
    throw new Error("Module not found");
  }
  await assertMentorOwnsInternship(module.internship, req.user);
  Object.assign(module, req.body);
  const updated = await module.save();
  res.json(updated);
});

// @desc Delete a module (mentor/admin)
// @route DELETE /api/modules/:id
const deleteModule = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.id);
  if (!module) {
    res.status(404);
    throw new Error("Module not found");
  }
  await assertMentorOwnsInternship(module.internship, req.user);
  await module.deleteOne();
  res.json({ message: "Module removed" });
});

module.exports = { getModulesForInternship, createModule, updateModule, deleteModule };
