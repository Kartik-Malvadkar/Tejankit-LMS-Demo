import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const InternshipDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get(`/internships/${id}`).then(({ data }) => setInternship(data));
  }, [id]);

  const handleEnroll = async () => {
    if (!user) return navigate("/login");
    if (user.role !== "student") return setMessage("Only student accounts can enroll.");
    setBusy(true);
    setMessage("");
    try {
      await api.post(`/enrollments/${id}`);
      setMessage("You're enrolled! Head to your dashboard to get started.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not enroll.");
    } finally {
      setBusy(false);
    }
  };

  if (!internship) return <div className="max-w-4xl mx-auto px-6 py-16 text-slate">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="pill bg-canvas border border-line mono">{internship.domain}</span>
      <h1 className="text-3xl font-semibold mt-3">{internship.title}</h1>
      <p className="text-slate mt-3 max-w-2xl">{internship.description}</p>

      <div className="flex flex-wrap gap-6 mt-6 text-sm">
        <div><p className="text-slate">Duration</p><p className="font-medium">{internship.durationWeeks} weeks</p></div>
        <div><p className="text-slate">Mentor</p><p className="font-medium">{internship.mentor?.name}</p></div>
        <div><p className="text-slate">Fee</p><p className="font-medium">{internship.isPaid ? `₹${internship.price}` : "Free"}</p></div>
      </div>

      <button onClick={handleEnroll} disabled={busy} className="btn-primary mt-8">
        {busy ? "Enrolling…" : "Enroll now"}
      </button>
      {message && <p className="text-sm mt-3 text-slate">{message}</p>}
    </div>
  );
};

export default InternshipDetail;
