"use client"; // ต้องเป็น Client Component เพื่อใช้ Context ภาษา

import { useState } from "react";
import { signOut } from "next-auth/react"; // ถ้าใช้ NextAuth
import AddOrderForm from "../AddOrderForm";
import AdminTable from "../AdminTable";
import { useLanguage } from "@/app/LanguageContext"; // ✅ เรียกใช้

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { t, lang, toggleLanguage } = useLanguage(); // ✅

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header ส่วนบนสุด: โลโก้ + ปุ่มเปลี่ยนภาษา + ปุ่ม Logout */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              🛡️ {t.admin_dashboard_title} {/* ✅ */}
            </h1>
            <p className="text-slate-500 text-sm">Shiroya Laundry Service</p>
          </div>

          <div className="flex items-center gap-3">
             {/* 🌐 ปุ่มเปลี่ยนภาษา */}
            <button 
                onClick={toggleLanguage}
                className="px-4 py-2 bg-white border border-blue-100 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 shadow-sm transition-all"
            >
                {lang === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
            </button>

            {/* ปุ่ม Logout */}
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-white border border-red-100 rounded-full text-sm font-medium text-red-500 hover:bg-red-50 shadow-sm transition-all"
            >
              🚪 {t.admin_logout} {/* ✅ */}
            </button>
          </div>
        </div>

        {/* ฟอร์มเพิ่มออเดอร์ */}
        <AddOrderForm onSuccess={handleRefresh} />

        {/* ตารางแสดงออเดอร์ */}
        <AdminTable refreshKey={refreshKey} />
        
      </div>
    </div>
  );
}