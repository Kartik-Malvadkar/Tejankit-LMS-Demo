import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusColor = {
  active: "bg-signal/10 text-signal border-signal/30",
  completed: "bg-moss/10 text-moss border-moss/30",
  pending: "bg-slate/10 text-slate border-slate/30",
  dropped: "bg-red-50 text-red-600 border-red-200",
};

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [e, c, d] = await Promise.all([
        api.get("/enrollments/mine"),
        api.get("/certificates/mine"),
        api.get("/assignments/daily-challenges"),
      ]);
      setEnrollments(e.data);
      setCertificates(c.data);
      setChallenges(d.data);
      setLoading(false);
    })();
  }, []);

  const markAttendance = async (enrollmentId) => {
    try {
      await api.post(`/enrollments/${enrollmentId}/attendance`);
      setEnrollments((prev) => prev.map((e) => (e._id === enrollmentId ? { ...e } : e)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not mark attendance");
    }
  };

  if (loading) return <div className="max-w-6xl mx-auto px-6 py-16 text-slate">Loading your dashboard…</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-1">My internships</h1>
      <p className="text-slate text-sm mb-8">Track progress, submit work, mark attendance.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {enrollments.length === 0 && (
            <p className="text-slate text-sm">You haven't enrolled in anything yet. <Link to="/internships" className="underline text-ink">Browse internships</Link>.</p>
          )}
          {enrollments.map((e) => (
            <div key={e._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-semibold">{e.internship?.title}</h3>
                  <p className="text-xs text-slate mono">{e.internship?.domain}</p>
                </div>
                <span className={`pill border mono ${statusColor[e.status]}`}>{e.status}</span>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate mb-1">
                  <span>Progress</span>
                  <span>{e.progressPercent}%</span>
                </div>
                <div className="h-2 bg-line rounded-full overflow-hidden">
                  <div className="h-full bg-signal" style={{ width: `${e.progressPercent}%` }} />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Link to={`/course/${e.internship?._id}/${e._id}`} className="btn-secondary text-sm px-4 py-1.5">
                  Continue course
                </Link>
                <button onClick={() => markAttendance(e._id)} className="btn-secondary text-sm px-4 py-1.5">
                  Mark today's attendance
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-display font-semibold mb-3">Daily challenges</h3>
            {challenges.length === 0 ? (
              <p className="text-sm text-slate">No challenges posted today.</p>
            ) : (
              <ul className="space-y-3">
                {challenges.map((c) => (
                  <li key={c._id} className="text-sm border-b border-line pb-2 last:border-0">
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-slate mono">{c.internship?.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card">
            <h3 className="font-display font-semibold mb-3">Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-sm text-slate">Complete an internship to earn your first certificate.</p>
            ) : (
              <ul className="space-y-3">
                {certificates.map((c) => (
                  <li key={c._id} className="text-sm">
                    <p className="font-medium">{c.internship?.title}</p>
                    <p className="text-xs text-slate mono">{c.certificateId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
