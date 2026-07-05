import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const emptyForm = { title: "", domain: "", description: "", durationWeeks: 4, startDate: "", endDate: "", capacity: 0, isPaid: false, price: 0 };

const MentorDashboard = () => {
  const [internships, setInternships] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await api.get("/internships/mentor/mine");
    setInternships(data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/internships", { ...form, status: "published" });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not create internship");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Mentor dashboard</h1>
          <p className="text-slate text-sm">Manage your internships, content, and submissions.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          {showForm ? "Cancel" : "New internship"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card mb-8 space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <input required className="input-field" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Domain</label>
              <input required className="input-field" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <textarea required className="input-field h-24" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Duration (weeks)</label>
              <input type="number" min={1} className="input-field" value={form.durationWeeks} onChange={(e) => setForm({ ...form, durationWeeks: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Start date</label>
              <input type="date" required className="input-field" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">End date</label>
              <input type="date" required className="input-field" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? "Publishing…" : "Publish internship"}</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {internships.map((i) => (
          <Link key={i._id} to={`/mentor/internships/${i._id}`} className="card hover:border-ink">
            <span className="pill bg-canvas border border-line mono">{i.status}</span>
            <h3 className="font-display font-semibold text-lg mt-3">{i.title}</h3>
            <p className="text-sm text-slate mt-1">{i.durationWeeks} weeks · {i.domain}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MentorDashboard;
