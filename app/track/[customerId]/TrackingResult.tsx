"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 🌟 เพิ่ม useRouter เพื่อให้เปลี่ยนหน้าได้ลื่นไหล
import { Package, CheckCircle, Clock, Search, Info, History, Sparkles } from "lucide-react";

type OrderItem = {
  id: string;
  itemName: string;
  status: string;
};

type TrackResult = {
  customerId: string;
  customerName: string | null;
  items: OrderItem[];
};

export default function TrackingResult({ customerId }: { customerId: string }) {
  const [data, setData] = useState<TrackResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 🌟 เรียกใช้ router
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId }),
        });

        if (!res.ok) {
          throw new Error("ไม่พบข้อมูลออเดอร์ หรือ หมายเลขคิวไม่ถูกต้อง");
        }

        const result = await res.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [customerId]);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "Pending":
        return { label: "รอซัก", color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: <Clock size={18} className="text-yellow-500" /> };
      case "Processing":
        return { label: "กำลังซัก", color: "text-blue-600 bg-blue-50 border-blue-200", icon: <Clock size={18} className="text-blue-500 animate-spin-slow" /> };
      case "Ironing":
        return { label: "กำลังรีด", color: "text-orange-600 bg-orange-50 border-orange-200", icon: <Clock size={18} className="text-orange-500" /> };
      case "Delivery":
        return { label: "เตรียมจัดส่ง", color: "text-purple-600 bg-purple-50 border-purple-200", icon: <Package size={18} className="text-purple-500" /> };
      case "Completed":
        return { label: "เสร็จสิ้น", color: "text-green-600 bg-green-50 border-green-200", icon: <CheckCircle size={18} className="text-green-500" /> };
      default:
        return { label: status, color: "text-gray-600 bg-gray-50 border-gray-200", icon: <Info size={18} className="text-gray-500" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-xl shadow-blue-100/50 max-w-md mx-auto mt-10">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-blue-600 font-medium animate-pulse">กำลังค้นหาข้อมูล...</p>
      </div>
    );
  }

  // 🌟 กรณีไม่พบข้อมูล จะแสดงปุ่มกลับไปหน้าแรก (แก้ Path แล้ว)
  if (error || !data) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl shadow-red-100/50 border border-red-50 max-w-md mx-auto mt-10">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">ไม่พบข้อมูล</h2>
        <p className="text-red-500 mb-6">{error || "เกิดข้อผิดพลาดบางประการ"}</p>
        <button 
          onClick={() => router.push('/')} 
          className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
        >
          กลับไปค้นหาใหม่
        </button>
      </div>
    );
  }

  const activeItems = data.items.filter(item => item.status !== "Completed");
  const completedItems = data.items.filter(item => item.status === "Completed");
  const totalActiveItems = activeItems.length;
  const progressPercent = totalActiveItems === 0 && completedItems.length > 0 ? 100 : 0; 

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-white overflow-hidden max-w-2xl mx-auto mt-6">
      
      {/* Header ลูกค้า */}
      <div className="bg-gradient-to-r from-[#1C3E6C] to-[#2b548f] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-1">{data.customerId}</h2>
            {data.customerName && (
              <p className="text-blue-100 text-lg flex items-center gap-2">
                👤 คุณ {data.customerName}
              </p>
            )}
          </div>
          
          <div className="text-right">
             <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
               <p className="text-sm text-blue-100 mb-1">สถานะรอบนี้</p>
               <p className="text-xl font-bold text-white">
                 {totalActiveItems === 0 && completedItems.length > 0 ? (
                   <span className="flex items-center gap-1 text-green-300"><CheckCircle size={20}/> ซักเสร็จหมดแล้ว</span>
                 ) : (
                   <span>กำลังดำเนินการ {totalActiveItems} ชิ้น</span>
                 )}
               </p>
             </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-slate-50">
        
        {/* หมวดหมู่ที่ 1: รายการรอบนี้ (กำลังซัก) */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Sparkles className="text-blue-500" />
            รายการเสื้อผ้าของคุณ (รอบปัจจุบัน)
          </h3>
          
          <div className="space-y-4">
            {activeItems.length > 0 ? (
              activeItems.map((item) => {
                const statusDisplay = getStatusDisplay(item.status);
                return (
                  <div key={item.id} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-2xl border transition-all hover:shadow-md bg-white ${statusDisplay.color.replace('bg-', 'hover:bg-')}`}>
                    <div className="flex items-center gap-3 mb-3 md:mb-0">
                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-xl shadow-sm">
                        👕
                      </div>
                      <p className="font-bold text-slate-800 text-lg">{item.itemName}</p>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold border ${statusDisplay.color}`}>
                      {statusDisplay.icon}
                      {statusDisplay.label}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center p-8 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
                ไม่มีรายการค้างซัก (เสื้อผ้าของคุณเสร็จหมดแล้ว!) 🎉
              </div>
            )}
          </div>
        </div>

        {/* หมวดหมู่ที่ 2: ประวัติที่ซักเสร็จแล้ว */}
        {completedItems.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <History size={16} />
              ประวัติเสื้อผ้าที่ซักเสร็จแล้ว
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-80">
              {completedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <span className="text-slate-600 font-medium line-through decoration-slate-300 flex items-center gap-2">
                    <span className="text-xs">✔️</span> {item.itemName}
                  </span>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">เสร็จสิ้น</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🌟 ปุ่มกลับมาหน้าหลัก (แก้ Path แล้ว) */}
        <div className="mt-10 text-center">
           <button 
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white border border-blue-100 rounded-xl text-blue-600 font-semibold hover:bg-blue-50 shadow-sm transition-all"
           >
             ← ตรวจสอบรหัสคิวอื่น
           </button>
        </div>
      </div>
    </div>
  );
}