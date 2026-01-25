"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function AddOrderForm({ onSuccess }: { onSuccess: () => void }) {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!customerId.trim()) {
      alert("กรุณากรอก Customer ID");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId }),
    });

    setLoading(false);

    if (res.status === 401) {
      alert("Session หมดอายุ กรุณา login ใหม่");
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }

    if (!res.ok) {
      alert("ไม่สามารถเพิ่มงานได้");
      return;
    }

    setCustomerId("");
    onSuccess();
  };

  return (
    <div className="mb-4 flex gap-2">
      <input
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        placeholder="Customer ID"
        className="border p-2 rounded w-64"
      />

      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-blue-600 text-white px-4 rounded"
      >
        {loading ? "กำลังเพิ่ม..." : "เพิ่มงาน"}
      </button>
    </div>
  );
}
