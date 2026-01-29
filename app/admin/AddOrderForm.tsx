"use client";

import { useState } from "react";
import { useLanguage } from "@/app/LanguageContext"; // ✅ เรียกใช้ Hook

// เปลี่ยนชื่อ Prop กลับเป็น onSuccess เพื่อให้เข้ากับไฟล์ page.tsx
export default function AddOrderForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useLanguage(); // ✅ ดึงตัวแปรภาษามาใช้

  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, customerName }),
      });

      if (res.ok) {
        setCustomerId("");
        setCustomerName("");
        onSuccess();
        alert(t.admin_add_success); // ✅ ใช้คำแปล
      } else {
        alert(t.admin_add_error); // ✅ ใช้คำแปล
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        ✨ {t.admin_add_title}
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-1/3">
          <input
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder={t.admin_add_placeholder_id}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
            required
          />
        </div>
        
        <div className="w-full md:w-1/3">
          <input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder={t.admin_add_placeholder_name}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all disabled:bg-slate-300 whitespace-nowrap"
        >
          {loading ? t.admin_btn_adding : t.admin_btn_add}
        </button>
      </form>
    </div>
  );
}