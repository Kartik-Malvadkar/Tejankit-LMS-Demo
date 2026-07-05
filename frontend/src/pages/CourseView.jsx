import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const CourseView = () => {
  const { internshipId, enrollmentId } = useParams();
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [doubt, setDoubt] = useState("");
  const [doubtAnswer, setDoubtAnswer] = useState("");
  const [askingDoubt, setAskingDoubt] = useState(false);
  const [submissionText, setSubmissionText] = useState("");
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    (async () => {
      const [m, a] = await Promise.all([
        api.get(`/modules/internship/${internshipId}`),
        api.get(`/assignments/internship/${internshipId}`),
      ]);
      setModules(m.data);
      setAssignments(a.data);
      if (m.data.length) setActiveModule(m.data[0]);
    })();
  }, [internshipId]);

  const completeModule = async (moduleId) => {
    await api.post(`/enrollments/${enrollmentId}/complete-module/${moduleId}`);
    setStatusMsg("Module marked as complete. Your progress has been updated.");
  };

  const askDoubt = async () => {
    if (!doubt.trim()) return;
    setAskingDoubt(true);
    setDoubtAnswer("");
    try {
      const { data } = await api.post("/ai/doubt", { question: doubt, moduleId: activeModule?._id });
      setDoubtAnswer(data.answer);
    } catch (err) {
      setDoubtAnswer("Something went wrong reaching the AI assistant. Try again shortly.");
    } finally {
      setAskingDoubt(false);
    }
  };

  const submitAssignment = async (assignmentId) => {
    try {
      await api.post(`/submissions/${assignmentId}`, { textContent: submissionText });
      setStatusMsg("Submission sent to your mentor.");
      setSubmissionText("");
      setActiveAssignment(null);
    } catch (err) {
      setStatusMsg(err.response?.data?.message || "Could not submit.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
      <aside className="space-y-1">
        <p className="text-xs font-medium text-slate uppercase tracking-wide mb-2">Modules</p>
        {modules.map((m) => (
          <button
            key={m._id}
            onClick={() => setActiveModule(m)}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm ${activeModule?._id === m._id ? "bg-ink text-canvas" : "hover:bg-white border border-transparent hover:border-line"}`}
          >
            {m.order}. {m.title}
          </button>
        ))}
        <p className="text-xs font-medium text-slate uppercase tracking-wide mt-6 mb-2">Assignments</p>
        {assignments.map((a) => (
          <button
            key={a._id}
            onClick={() => setActiveAssignment(a)}
            className="block w-full text-left px-3 py-2 rounded-md text-sm hover:bg-white border border-transparent hover:border-line"
          >
            {a.title}
          </button>
        ))}
      </aside>

      <main>
        {statusMsg && <div className="mb-4 text-sm bg-moss/10 text-moss border border-moss/30 rounded-md px-3 py-2">{statusMsg}</div>}

        {activeAssignment ? (
          <div className="card">
            <h2 className="text-xl font-semibold mb-1">{activeAssignment.title}</h2>
            <p className="text-slate text-sm mb-4">{activeAssignment.description}</p>
            <textarea
              className="input-field h-40 mb-3"
              placeholder="Write or paste your submission here…"
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => submitAssignment(activeAssignment._id)} className="btn-primary">Submit assignment</button>
              <button onClick={() => setActiveAssignment(null)} className="btn-secondary">Back to course</button>
            </div>
          </div>
        ) : activeModule ? (
          <div>
            <h2 className="text-xl font-semibold mb-3">{activeModule.title}</h2>
            {activeModule.videoUrl && (
              <div className="aspect-video bg-ink rounded-lg mb-5 overflow-hidden">
                <iframe className="w-full h-full" src={activeModule.videoUrl} title={activeModule.title} allowFullScreen />
              </div>
            )}
            <div className="card mb-5 whitespace-pre-wrap text-sm leading-relaxed">{activeModule.notes}</div>
            <button onClick={() => completeModule(activeModule._id)} className="btn-primary mb-8">Mark module complete</button>

            <div className="card">
              <h3 className="font-display font-semibold mb-2">Ask the AI doubt assistant</h3>
              <textarea
                className="input-field h-24 mb-3"
                placeholder="Stuck on something in this module? Ask here…"
                value={doubt}
                onChange={(e) => setDoubt(e.target.value)}
              />
              <button onClick={askDoubt} disabled={askingDoubt} className="btn-secondary text-sm">
                {askingDoubt ? "Thinking…" : "Ask"}
              </button>
              {doubtAnswer && <p className="text-sm mt-4 border-t border-line pt-4 whitespace-pre-wrap">{doubtAnswer}</p>}
            </div>
          </div>
        ) : (
          <p className="text-slate text-sm">No modules published yet for this internship.</p>
        )}
      </main>
    </div>
  );
};

export default CourseView;
