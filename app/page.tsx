"use client";

import { useState } from "react";

export default function HomePage() {
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // เพิ่ม state loading เพื่อ UX ที่ดีขึ้น

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault(); // ป้องกันการ refresh หน้าเมื่อกด enter
    setError("");
    setStatus(null);

    if (!customerId.trim()) {
      setError("กรุณากรอก Customer ID");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
        cache: "no-store",
      });

      if (!res.ok) {
        setError("ไม่พบข้อมูลลูกค้า หรือ รหัสไม่ถูกต้อง");
        return;
      }

      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-white p-8 md:p-10 transition-all hover:shadow-2xl hover:shadow-blue-200/50">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 text-3xl shadow-inner">
            🧺
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Check Status
          </h1>
          <p className="text-slate-500 text-sm">
            กรอกรหัสลูกค้าเพื่อตรวจสอบสถานะพัสดุ
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={checkStatus} className="space-y-5">
          <div className="relative group">
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="Customer ID (e.g. ORDER-123)"
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-center shadow-sm group-hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">กำลังตรวจสอบ...</span>
            ) : (
              <>
                <span>ตรวจสอบสถานะ</span>
              </>
            )}
          </button>
        </form>

        {/* Result Section */}
        <div className="mt-8 space-y-4">
          {/* กรณีเจอสถานะ */}
          {status && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-green-600 text-sm font-medium mb-1 uppercase tracking-wide">
                  สถานะปัจจุบัน
                </p>
                <div className="text-2xl font-bold text-green-700">
                  {status}
                </div>
              </div>
            </div>
          )}

          {/* กรณี Error */}
          {error && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <p className="text-red-500 text-sm font-medium flex items-center justify-center gap-2">
                  ⚠️ {error}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-300">
            © Shiroya Laundry Service
          </p>
        </div>
      </div>
    </div>
  );
}
/*"use client";

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

        {/* ✅ แสดงเฉพาะสถานะปัจจุบัน *n/}
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
}*/


