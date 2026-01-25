"use client";

import { useState } from "react";

export default function HomePage() {
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    setError("");
    setStatus(null);

    if (!customerId.trim()) {
      setError("กรุณากรอก Customer ID");
      return;
    }

    const res = await fetch("/api/status", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ customerId }),
  cache: "no-store",
});


    if (!res.ok) {
      setError("ไม่พบข้อมูลลูกค้า");
      return;
    }

    const data = await res.json();
    setStatus(data.status);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-white text-2xl font-bold">
          Check Status
        </h1>

        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="Customer ID"
          className="w-full p-3 rounded bg-black border border-gray-500 text-white"
        />

        <button
          onClick={checkStatus}
          className="w-full bg-blue-600 text-white py-3 rounded"
        >
          Check
        </button>

        {/* ✅ แสดงเฉพาะสถานะปัจจุบัน */}
        {status && (
          <div className="mt-8">
            <p className="text-white mb-2">
              สถานะปัจจุบัน
            </p>

            <div className="bg-green-600 text-white py-4 rounded text-lg font-semibold">
              {status}
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
