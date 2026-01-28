"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

// ✅ 1. แก้ชื่อ Prop เป็น onOrderAdded
export default function AddOrderForm({ onOrderAdded }: { onOrderAdded: () => void }) {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState(""); // เพิ่มช่องชื่อลูกค้า (Optional)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId.trim()) {
      alert("Please enter slip No");
      return;
    }

    setLoading(true);

    try {
      // ✅ 2. เปลี่ยน key ใน body ให้เป็น customerId (camelCase) ตาม Schema
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId: customerId,
          customerName: customerName // ส่งชื่อลูกค้าไปด้วย (ถ้ามี)
        }),
      });

      if (res.status === 401) {
        alert("Session time out please Sign in again");
        await signOut({ callbackUrl: "/admin/login" });
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Can't add more orders");
        return;
      }

      // Reset Form
      setCustomerId("");
      setCustomerName("");
      
      // ✅ 3. เรียกใช้ function ที่ส่งมาจากแม่
      onOrderAdded();
      
    } catch (error) {
      console.error(error);
      alert("A connection error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Slip No. <span className="text-red-500">*</span>
        </label>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          placeholder="xxxxxx-xxxx"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          customer name (Optional)
        </label>
        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="AA-0000"
          className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-blue-500/20 transition-all transform active:scale-95 flex justify-center items-center gap-2"
      >
        {loading ? (
          <span className="animate-pulse">Adding...</span>
        ) : (
          <>
            <span>Add</span>
          </>
        )}
      </button>
    </form>
  );
}
/*"use client";

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
}*/
