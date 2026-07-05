// Thin wrapper around the Anthropic Messages API, used to power:
//  - the AI doubt assistant
//  - the AI assignment evaluator
//  - auto quiz generation from notes
//
// If ANTHROPIC_API_KEY is not set, each function falls back to a safe,
// clearly-labeled placeholder response instead of throwing, so the rest of
// the platform keeps working while a key is provisioned.

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-6";

const hasApiKey = () => Boolean(process.env.ANTHROPIC_API_KEY);

const callClaude = async (system, userMessage, maxTokens = 1000) => {
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${text}`);
  }

  const data = await response.json();
  return data.content.map((block) => (block.type === "text" ? block.text : "")).join("\n");
};

// --- AI Doubt Assistant -----------------------------------------------
const answerDoubt = async ({ question, courseContext }) => {
  if (!hasApiKey()) {
    return "AI doubt assistant is not configured yet. Ask your mentor, or set ANTHROPIC_API_KEY on the server to enable instant AI answers.";
  }
  const system = `You are a patient, encouraging teaching assistant for an internship platform. Answer the student's doubt clearly and concisely, using the provided course context when relevant. Keep answers under 200 words unless the question needs a worked example.`;
  const userMessage = `Course context:\n${courseContext || "(none provided)"}\n\nStudent's question:\n${question}`;
  return callClaude(system, userMessage, 600);
};

// --- AI Assignment Evaluator --------------------------------------------
const evaluateSubmissionWithAI = async ({ assignmentTitle, assignmentDescription, maxScore, studentAnswer }) => {
  if (!hasApiKey()) {
    return { score: null, feedback: "AI evaluator is not configured yet. Set ANTHROPIC_API_KEY on the server to enable auto-suggested grading." };
  }
  const system = `You are grading student internship assignments. Respond ONLY with strict JSON: {"score": <number 0-${maxScore}>, "feedback": "<2-4 sentences of constructive feedback>"}. No markdown, no preamble.`;
  const userMessage = `Assignment: ${assignmentTitle}\nInstructions: ${assignmentDescription}\nMax score: ${maxScore}\n\nStudent's submission:\n${studentAnswer}`;
  const raw = await callClaude(system, userMessage, 400);
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return { score: parsed.score, feedback: parsed.feedback };
  } catch (err) {
    return { score: null, feedback: raw };
  }
};

// --- Auto Quiz Generation from Notes ------------------------------------
const generateQuizFromNotes = async ({ notes, numQuestions = 5 }) => {
  if (!hasApiKey()) {
    return { questions: [], message: "Quiz generation is not configured yet. Set ANTHROPIC_API_KEY on the server to enable this feature." };
  }
  const system = `Generate a multiple-choice quiz from the given course notes. Respond ONLY with strict JSON in the shape: {"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0}]}. No markdown, no preamble.`;
  const userMessage = `Create ${numQuestions} multiple-choice questions from these notes:\n\n${notes}`;
  const raw = await callClaude(system, userMessage, 1200);
  try {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    return { questions: [], message: "Could not parse AI response, please try again." };
  }
};

module.exports = { answerDoubt, evaluateSubmissionWithAI, generateQuizFromNotes };
