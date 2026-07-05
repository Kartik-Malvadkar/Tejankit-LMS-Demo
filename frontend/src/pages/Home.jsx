import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div>
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
      <p className="mono text-signal text-sm mb-4">tejankit-tech / internship-platform</p>
      <h1 className="text-4xl md:text-5xl font-semibold leading-tight max-w-2xl">
        Real internships. Real work. A record that proves it.
      </h1>
      <p className="text-slate mt-5 max-w-xl">
        Enroll, learn from mentor-built courses, submit real tasks, and earn a
        certificate anyone can verify with a scan.
      </p>
      <div className="mt-8 flex gap-3">
        <Link to="/internships" className="btn-primary">Browse internships</Link>
        <Link to="/register" className="btn-secondary">Create an account</Link>
      </div>
    </section>

    <section className="border-t border-line bg-white">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          ["01", "Enroll", "Pick an internship track and get matched with a mentor."],
          ["02", "Build", "Work through course modules, submit real assignments."],
          ["03", "Get graded", "Mentors grade your work, AI assists with quick feedback."],
          ["04", "Get certified", "Earn a certificate with a QR code anyone can verify."],
        ].map(([num, title, body]) => (
          <div key={num}>
            <p className="mono text-xs text-slate mb-2">{num}</p>
            <h3 className="font-display font-semibold mb-1">{title}</h3>
            <p className="text-sm text-slate">{body}</p>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default Home;
