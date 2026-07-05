import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internships from "./pages/Internships";
import InternshipDetail from "./pages/InternshipDetail";
import StudentDashboard from "./pages/StudentDashboard";
import CourseView from "./pages/CourseView";
import MentorDashboard from "./pages/MentorDashboard";
import MentorInternshipManage from "./pages/MentorInternshipManage";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyCertificate from "./pages/VerifyCertificate";

function App() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/internships" element={<Internships />} />
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:certificateId" element={<VerifyCertificate />} />

        <Route path="/dashboard" element={
          <ProtectedRoute roles={["student"]}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/course/:internshipId/:enrollmentId" element={
          <ProtectedRoute roles={["student"]}><CourseView /></ProtectedRoute>
        } />

        <Route path="/mentor" element={
          <ProtectedRoute roles={["mentor", "admin"]}><MentorDashboard /></ProtectedRoute>
        } />
        <Route path="/mentor/internships/:id" element={
          <ProtectedRoute roles={["mentor", "admin"]}><MentorInternshipManage /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
