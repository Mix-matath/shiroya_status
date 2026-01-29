"use client";

import { useState } from "react";
import { useLanguage } from "./LanguageContext"; // ✅ เรียกใช้ Hook ภาษา

export default function HomePage() {
  const { t, toggleLanguage, lang } = useLanguage(); // ✅ ดึงตัวแปรภาษามาใช้
  
  const [customerId, setCustomerId] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ เพิ่มฟังก์ชันแปลงภาษา (เหมือนที่ทำใน TrackingResult)
  const getTranslatedStatus = (s: string | null) => {
    if (!s) return null;
    const cleanStatus = s.trim();

    // แปลงจากค่าใน DB -> คำแปลใน Dictionary
    if (cleanStatus === "Pending") return t.status_pending;
    if (cleanStatus === "Processing") return t.status_processing;
    if (cleanStatus === "Ironing") return t.status_ironing;
    if (cleanStatus === "Delivery") return t.status_delivery;
    if (cleanStatus === "Completed") return t.status_completed;
    if (cleanStatus === "Cancelled") return t.status_cancelled;

    // เผื่อมีภาษาไทยหลงเหลือ
    if (cleanStatus === "รอรับผ้า") return t.status_pending;
    if (cleanStatus === "กำลังซัก") return t.status_processing;
    if (cleanStatus === "กำลังรีด") return t.status_ironing;
    if (cleanStatus === "กำลังส่ง") return t.status_delivery;
    if (cleanStatus === "เสร็จสิ้น") return t.status_completed;
    if (cleanStatus === "ยกเลิก") return t.status_cancelled;

    return cleanStatus;
  };

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setStatus(null);

    if (!customerId.trim()) {
      setError(t.error_empty);
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
        setError(t.error_not_found);
        return;
      }

      const data = await res.json();
      setStatus(data.status); // เก็บค่า Raw Data ไว้ (Completed)
    } catch (err) {
      setError(t.error_connect);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center p-4 font-sans relative">
      
      {/* 🌐 ปุ่มเปลี่ยนภาษา */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-sm font-medium text-blue-600 hover:bg-white shadow-sm transition-all flex items-center gap-2"
      >
        {lang === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
      </button>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-white p-8 md:p-10 transition-all hover:shadow-2xl hover:shadow-blue-200/50">
        
        {/* Header Section */}
        <div className="text-center space-y-2 mb-8">
          <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 text-3xl shadow-inner">
            🧺
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {t.title}
          </h1>
          <p className="text-slate-500 text-sm">
            {t.subtitle}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={checkStatus} className="space-y-5">
          <div className="relative group">
            <input
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder={t.placeholder}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-center shadow-sm group-hover:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-4 rounded-xl font-semibold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">{t.button_loading}</span>
            ) : (
              <span>{t.button_check}</span>
            )}
          </button>
        </form>

        {/* Result Section */}
        <div className="mt-8 space-y-4">
          {status && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center shadow-sm">
                <p className="text-green-600 text-sm font-medium mb-1 uppercase tracking-wide">
                  {t.status_label}
                </p>
                <div className="text-2xl font-bold text-green-700">
                  {/* ✅ เรียกใช้ฟังก์ชันแปลงภาษาตรงนี้ */}
                  {getTranslatedStatus(status)}
                </div>
              </div>
            </div>
          )}

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
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}