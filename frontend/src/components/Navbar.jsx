import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHome = { student: "/dashboard", mentor: "/mentor", admin: "/admin" };

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-canvas sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display font-700 text-lg tracking-tight">
          Tejankit<span className="text-signal">.</span>Tech
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate">
          <Link to="/internships" className="hover:text-ink">Internships</Link>
          <Link to="/verify" className="hover:text-ink">Verify certificate</Link>
          {user && <Link to={roleHome[user.role] || "/"} className="hover:text-ink">Dashboard</Link>}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate hidden sm:inline">Hi, {user.name.split(" ")[0]}</span>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="btn-secondary text-sm px-4 py-1.5"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm px-4 py-1.5">Log in</Link>
              <Link to="/register" className="btn-primary text-sm px-4 py-1.5">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
