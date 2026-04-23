"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Info } from "lucide-react";

export default function Home() {
  const [customerId, setCustomerId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId.trim()) {
      setError("กรุณากรอกรหัสคิวของคุณ");
      return;
    }
    
    setError("");
    // ส่งลูกค้าไปยังหน้าตรวจสอบสถานะ (TrackingResult)
    router.push(`/track/${customerId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F3FA] via-white to-[#F0F7FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#77BCE5] opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1C3E6C] opacity-5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#1C3E6C] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#1C3E6C]/20 transform rotate-3 hover:rotate-6 transition-transform">
              <span className="text-4xl font-black text-white">S</span>
            </div>
            <h1 className="text-2xl font-bold text-[#1C3E6C] mb-2">ติดตามสถานะซักอบรีด</h1>
            <p className="text-gray-500">Shiroya Laundry Service</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                รหัสลูกค้า / คิว (Customer ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="เช่น GM-0001"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-0 focus:border-[#77BCE5] outline-none transition-all text-lg font-medium text-gray-800 placeholder-gray-400"
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <Info size={14} /> {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#54A0D8] hover:bg-[#1C3E6C] text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-md shadow-[#54A0D8]/30 flex items-center justify-center gap-2 text-lg"
            >
              <Search size={20} />
              ตรวจสอบสถานะ
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             <p className="text-xs text-gray-400">
               หรือสแกน QR Code ที่ได้รับจากพนักงานเพื่อดูสถานะทันที
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}