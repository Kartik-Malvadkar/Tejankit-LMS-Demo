import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../api/axios";

const VerifyCertificate = () => {
  const { certificateId: paramId } = useParams();
  const [certificateId, setCertificateId] = useState(paramId || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);

  const runCheck = async (id) => {
    setError("");
    setResult(null);
    try {
      const { data } = await api.get(`/certificates/verify/${id}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setChecked(true);
    }
  };

  useEffect(() => {
    if (paramId) runCheck(paramId);
  }, [paramId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (certificateId.trim()) runCheck(certificateId.trim());
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-semibold mb-1">Verify a certificate</h1>
      <p className="text-slate text-sm mb-8">Enter a certificate ID, or scan the QR code on the certificate.</p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          className="input-field mono"
          placeholder="TJK-2026-XXXXXX"
          value={certificateId}
          onChange={(e) => setCertificateId(e.target.value)}
        />
        <button className="btn-primary shrink-0">Verify</button>
      </form>

      <div className="bg-ink text-canvas rounded-lg p-6 mono text-sm min-h-[160px]">
        {!checked && <p className="text-slate">$ awaiting input…</p>}
        {error && (
          <>
            <p className="text-red-400">$ verify --id {certificateId}</p>
            <p className="mt-2 text-red-400">✗ {error}</p>
          </>
        )}
        {result && (
          <>
            <p className="text-signal">$ verify --id {result.certificateId}</p>
            <p className="mt-2">✓ valid certificate</p>
            <p className="mt-3">student:    {result.studentName}</p>
            <p>internship: {result.internshipTitle}</p>
            <p>domain:     {result.domain}</p>
            <p>duration:   {result.durationWeeks} weeks</p>
            <p>issued:     {new Date(result.issueDate).toDateString()}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyCertificate;
