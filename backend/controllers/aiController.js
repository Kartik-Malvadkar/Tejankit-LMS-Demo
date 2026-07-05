const asyncHandler = require("express-async-handler");
const Module = require("../models/Module");
const { answerDoubt, generateQuizFromNotes } = require("../utils/aiClient");

// @desc AI doubt assistant: student asks a question, optionally scoped to a module's notes
// @route POST /api/ai/doubt
const askDoubtAssistant = asyncHandler(async (req, res) => {
  const { question, moduleId } = req.body;
  if (!question) {
    res.status(400);
    throw new Error("Please include a question");
  }

  let courseContext = "";
  if (moduleId) {
    const module = await Module.findById(moduleId);
    if (module) courseContext = `${module.title}\n${module.notes}`;
  }

  const answer = await answerDoubt({ question, courseContext });
  res.json({ answer });
});

// @desc Auto-generate a quiz from a module's notes (mentor/admin)
// @route POST /api/ai/quiz/:moduleId
const generateQuiz = asyncHandler(async (req, res) => {
  const module = await Module.findById(req.params.moduleId);
  if (!module) {
    res.status(404);
    throw new Error("Module not found");
  }
  const quiz = await generateQuizFromNotes({ notes: module.notes, numQuestions: req.body.numQuestions || 5 });
  res.json(quiz);
});

module.exports = { askDoubtAssistant, generateQuiz };
