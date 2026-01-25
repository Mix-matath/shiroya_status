"use client";

import { useState } from "react";

export default function StatusPage() {
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const checkStatus = async () => {
    setStatus("");
    setError("");

    const res = await fetch("/api/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setStatus(data.status);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        เช็คสถานะเสื้อผ้า
      </h1>

      <input
        type="text"
        placeholder="กรอก Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={checkStatus}
        className="bg-blue-600 text-white w-full py-2 mb-4"
      >
        ตรวจสอบสถานะ
      </button>

      {status && (
        <div className="bg-green-100 p-4 text-center font-semibold">
          สถานะปัจจุบัน: {status}
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 text-center text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}
