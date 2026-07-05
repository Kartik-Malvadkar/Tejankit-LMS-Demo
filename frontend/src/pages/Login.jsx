import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHome = { student: "/dashboard", mentor: "/mentor", admin: "/admin" };

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await login(form.email, form.password);
      navigate(roleHome[data.role] || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not log in");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-1">Log in</h1>
      <p className="text-slate text-sm mb-8">Continue your internship journey.</p>

      {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <input type="email" required className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">Password</label>
          <input type="password" required className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="text-sm text-slate mt-6">
        New here? <Link to="/register" className="text-ink underline">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
