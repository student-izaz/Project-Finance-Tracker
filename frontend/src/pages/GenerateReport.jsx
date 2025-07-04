import React, { useState } from "react";

export default function GenerateReportButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  const generateReport = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/reports/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Report generated successfully!");
      } else {
        setMessage(`❌ Failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error generating report");
    }

    setLoading(false);
  };

  return (
    <div className="my-6 flex flex-col items-center">
      <button
        onClick={generateReport}
        disabled={loading}
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-xl shadow-md transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "📄 Generate Monthly Report"}
      </button>
      {message && (
        <p className="mt-3 text-center text-sm text-gray-700">{message}</p>
      )}
    </div>
  );
}
