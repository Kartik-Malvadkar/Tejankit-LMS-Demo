import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/internships", { params: { search } });
    setInternships(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-1">Internships</h1>
      <p className="text-slate text-sm mb-6">Browse open tracks across every domain.</p>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-md">
        <input
          className="input-field"
          placeholder="Search by title…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-secondary shrink-0">Search</button>
      </form>

      {loading ? (
        <p className="text-slate text-sm">Loading internships…</p>
      ) : internships.length === 0 ? (
        <p className="text-slate text-sm">No internships match yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {internships.map((i) => (
            <Link to={`/internships/${i._id}`} key={i._id} className="card hover:border-ink transition-colors">
              <span className="pill bg-canvas border border-line mono">{i.domain}</span>
              <h3 className="font-display font-semibold text-lg mt-3">{i.title}</h3>
              <p className="text-sm text-slate mt-1 line-clamp-3">{i.description}</p>
              <div className="flex items-center justify-between mt-4 text-xs text-slate">
                <span>{i.durationWeeks} weeks</span>
                <span>{i.isPaid ? `₹${i.price}` : "Free"}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Internships;
