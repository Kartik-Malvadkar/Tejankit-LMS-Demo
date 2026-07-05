import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    (async () => {
      const [s, u, i] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/internships"),
      ]);
      setStats(s.data);
      setUsers(u.data);
      setInternships(i.data);
    })();
  }, []);

  const toggleActive = async (userId) => {
    await api.put(`/admin/users/${userId}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: !u.isActive } : u)));
  };

  const statCards = stats && [
    ["Students", stats.totalStudents],
    ["Mentors", stats.totalMentors],
    ["Internships", stats.totalInternships],
    ["Active enrollments", stats.activeEnrollments],
    ["Completed", stats.completedEnrollments],
    ["Pending submissions", stats.pendingSubmissions],
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-semibold mb-8">Admin dashboard</h1>

      {statCards && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          {statCards.map(([label, value]) => (
            <div key={label} className="card text-center">
              <p className="text-2xl font-display font-semibold">{value}</p>
              <p className="text-xs text-slate mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-display font-semibold mb-3">Users</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((u) => (
              <div key={u._id} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-slate mono">{u.email} · {u.role}</p>
                </div>
                <button onClick={() => toggleActive(u._id)} className={`pill mono border ${u.isActive ? "bg-moss/10 text-moss border-moss/30" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {u.isActive ? "active" : "disabled"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold mb-3">All internships</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {internships.map((i) => (
              <div key={i._id} className="card">
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-slate mono">{i.status} · mentor: {i.mentor?.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
