import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const tabs = ["Content", "Assignments", "Enrollments", "Submissions"];

const MentorInternshipManage = () => {
  const { id } = useParams();
  const [tab, setTab] = useState("Content");
  const [modules, setModules] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [moduleForm, setModuleForm] = useState({ title: "", videoUrl: "", notes: "", order: 1 });
  const [assignmentForm, setAssignmentForm] = useState({ title: "", description: "", maxScore: 100, isDailyChallenge: false });

  const loadAll = async () => {
    const [m, a, e] = await Promise.all([
      api.get(`/modules/internship/${id}`),
      api.get(`/assignments/internship/${id}`),
      api.get(`/enrollments/internship/${id}`),
    ]);
    setModules(m.data);
    setAssignments(a.data);
    setEnrollments(e.data);
  };

  useEffect(() => { loadAll(); }, [id]);

  useEffect(() => {
    if (tab === "Submissions" && assignments.length) {
      Promise.all(assignments.map((a) => api.get(`/submissions/assignment/${a._id}`).then((r) => r.data.map((s) => ({ ...s, assignmentTitle: a.title })))))
        .then((results) => setSubmissions(results.flat()));
    }
  }, [tab, assignments]);

  const addModule = async (e) => {
    e.preventDefault();
    await api.post("/modules", { ...moduleForm, internship: id });
    setModuleForm({ title: "", videoUrl: "", notes: "", order: modules.length + 2 });
    loadAll();
  };

  const addAssignment = async (e) => {
    e.preventDefault();
    await api.post("/assignments", { ...assignmentForm, internship: id });
    setAssignmentForm({ title: "", description: "", maxScore: 100, isDailyChallenge: false });
    loadAll();
  };

  const issueCertificate = async (enrollmentId) => {
    try {
      await api.post(`/enrollments/${enrollmentId}/issue-certificate`);
      alert("Certificate issued.");
    } catch (err) {
      alert(err.response?.data?.message || "Could not issue certificate");
    }
  };

  const gradeSubmission = async (submissionId, score) => {
    await api.put(`/submissions/${submissionId}/grade`, { score: Number(score) });
    setTab("Content");
    setTimeout(() => setTab("Submissions"), 0);
  };

  const aiEvaluate = async (submissionId) => {
    const { data } = await api.post(`/submissions/${submissionId}/ai-evaluate`);
    alert(`AI suggested score: ${data.suggestedScore ?? "n/a"}\n\nFeedback: ${data.suggestedFeedback}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Manage internship</h1>

      <div className="flex gap-2 border-b border-line mb-8">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 ${tab === t ? "border-signal text-ink" : "border-transparent text-slate"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Content" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display font-semibold mb-3">Existing modules</h3>
            <ul className="space-y-2 mb-6">
              {modules.map((m) => <li key={m._id} className="card text-sm">{m.order}. {m.title}</li>)}
            </ul>
          </div>
          <form onSubmit={addModule} className="card space-y-3">
            <h3 className="font-display font-semibold">Add a module</h3>
            <input required placeholder="Title" className="input-field" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} />
            <input placeholder="Video URL (embed link, optional)" className="input-field" value={moduleForm.videoUrl} onChange={(e) => setModuleForm({ ...moduleForm, videoUrl: e.target.value })} />
            <textarea required placeholder="Notes" className="input-field h-28" value={moduleForm.notes} onChange={(e) => setModuleForm({ ...moduleForm, notes: e.target.value })} />
            <input type="number" placeholder="Order" className="input-field" value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: Number(e.target.value) })} />
            <button className="btn-primary text-sm">Add module</button>
          </form>
        </div>
      )}

      {tab === "Assignments" && (
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-display font-semibold mb-3">Existing assignments</h3>
            <ul className="space-y-2">
              {assignments.map((a) => <li key={a._id} className="card text-sm">{a.title} {a.isDailyChallenge && <span className="pill bg-signal/10 text-signal ml-2">daily challenge</span>}</li>)}
            </ul>
          </div>
          <form onSubmit={addAssignment} className="card space-y-3">
            <h3 className="font-display font-semibold">Add an assignment</h3>
            <input required placeholder="Title" className="input-field" value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} />
            <textarea required placeholder="Description / instructions" className="input-field h-24" value={assignmentForm.description} onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })} />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={assignmentForm.isDailyChallenge} onChange={(e) => setAssignmentForm({ ...assignmentForm, isDailyChallenge: e.target.checked })} />
              Feature as a daily challenge
            </label>
            <button className="btn-primary text-sm">Add assignment</button>
          </form>
        </div>
      )}

      {tab === "Enrollments" && (
        <div className="space-y-3">
          {enrollments.map((e) => (
            <div key={e._id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium">{e.student?.name}</p>
                <p className="text-xs text-slate">{e.status} · {e.progressPercent}% complete</p>
              </div>
              {e.status === "completed" && !e.certificateIssued && (
                <button onClick={() => issueCertificate(e._id)} className="btn-secondary text-sm">Issue certificate</button>
              )}
              {e.certificateIssued && <span className="pill bg-moss/10 text-moss">Certified</span>}
            </div>
          ))}
        </div>
      )}

      {tab === "Submissions" && (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s._id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{s.assignmentTitle}</p>
                  <p className="text-xs text-slate">{s.student?.name}</p>
                </div>
                <span className="pill bg-canvas border border-line mono">{s.status}</span>
              </div>
              <p className="text-sm mt-3 whitespace-pre-wrap">{s.textContent}</p>
              <div className="flex items-center gap-2 mt-4">
                <input type="number" placeholder="Score" className="input-field w-24" id={`score-${s._id}`} defaultValue={s.score ?? ""} />
                <button onClick={() => gradeSubmission(s._id, document.getElementById(`score-${s._id}`).value)} className="btn-secondary text-sm">Save grade</button>
                <button onClick={() => aiEvaluate(s._id)} className="btn-secondary text-sm">AI evaluate</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorInternshipManage;
