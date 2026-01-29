"use client";

import { useLanguage } from "@/app/LanguageContext"; // ✅ เรียกใช้ Context ภาษา
import Link from "next/link";
import { useEffect } from "react";

type Props = {
  order: {
    status: string;
    customerName: string | null;
    updatedAt: Date;
  };
  customerId: string;
};

export default function TrackingResult({ order, customerId }: Props) {
  const { t, lang, toggleLanguage } = useLanguage();

  // ✅ ฟังก์ชันแปลงภาษา: รับค่าจาก DB -> คืนค่าคำแปล
  const getTranslatedStatus = (status: string) => {
    const s = status ? status.trim() : "";

    // ถ้า DB เป็น "Completed" -> คืนค่า t.status_completed (ซึ่งจะเปลี่ยนตามภาษาที่เลือก)
    if (s === "Pending") return t.status_pending;
    if (s === "Processing") return t.status_processing;
    if (s === "Ironing") return t.status_ironing;
    if (s === "Delivery") return t.status_delivery;
    if (s === "Completed") return t.status_completed;
    if (s === "Cancelled") return t.status_cancelled;

    // เผื่อมีภาษาไทยหลงเหลือ
    if (s === "รอรับผ้า") return t.status_pending;
    if (s === "กำลังซัก") return t.status_processing;
    if (s === "กำลังรีด") return t.status_ironing;
    if (s === "กำลังส่ง") return t.status_delivery;
    if (s === "เสร็จสิ้น") return t.status_completed;
    if (s === "ยกเลิก") return t.status_cancelled;

    return s; // ถ้าไม่ตรงเงื่อนไขเลย ให้โชว์ค่าเดิม
  };

  // คำนวณ Progress Bar
  const getProgress = (status: string) => {
    const s = status ? status.trim() : "";
    const steps = ["Pending", "Processing", "Ironing", "Delivery", "Completed"];
    
    // แปลงให้เป็นอังกฤษก่อนเทียบ
    let checkStatus = s;
    if (s === "รอรับผ้า") checkStatus = "Pending";
    else if (s === "กำลังซัก") checkStatus = "Processing";
    else if (s === "กำลังรีด") checkStatus = "Ironing";
    else if (s === "กำลังส่ง") checkStatus = "Delivery";
    else if (s === "เสร็จสิ้น") checkStatus = "Completed";

    if (checkStatus === "Cancelled" || checkStatus === "ยกเลิก") return 0;
    const index = steps.indexOf(checkStatus);
    return index === -1 ? 0 : ((index + 1) / steps.length) * 100;
  };

  const progress = getProgress(order.status);
  const displayStatus = getTranslatedStatus(order.status); // ✅ ใช้ค่าที่แปลงแล้วแสดงผล

  // เลือกสี
  const getStatusColor = () => {
    const s = order.status.trim();
    if (s === "Cancelled" || s === "ยกเลิก") return "bg-red-500";
    if (s === "Completed" || s === "เสร็จสิ้น") return "bg-green-600";
    return "bg-blue-600";
  };
  
  const getBarColor = () => {
    const s = order.status.trim();
    if (s === "Cancelled" || s === "ยกเลิก") return "bg-red-500";
    if (s === "Completed" || s === "เสร็จสิ้น") return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-6 font-sans relative">
      
      {/* 🌐 ปุ่มเปลี่ยนภาษา */}
      <button 
        onClick={toggleLanguage}
        className="absolute top-6 right-6 px-4 py-2 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full text-sm font-medium text-blue-600 hover:bg-white shadow-sm transition-all flex items-center gap-2 z-10"
      >
        {lang === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
      </button>

      <div className="w-full max-w-lg mb-6 mt-10">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          ← {t.label_back}
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 w-full max-w-lg overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className={`p-8 text-white text-center relative overflow-hidden transition-colors duration-500 ${getStatusColor()}`}>
           {/* ... (Decoration Circles) ... */}
          
          <p className="text-white/90 text-sm font-medium mb-1">{t.status_label}</p>
          <h1 className="text-3xl font-bold tracking-tight mb-4 drop-shadow-md">
            {displayStatus} {/* ✅ แสดงคำที่แปลแล้ว */}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm border border-white/30">
            {t.label_last_update}: {new Date(order.updatedAt).toLocaleDateString(lang === 'th' ? "th-TH" : "en-US")}
          </div>
        </div>

        <div className="p-8">
           {/* ... (ส่วนแสดงผลอื่นๆ ใช้ตัวแปร t.label_... ตามปกติ) ... */}
           
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.label_customer}</p>
              <p className="text-lg font-bold text-slate-800">{order.customerName || "-"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t.label_order_id}</p>
              <p className="text-lg font-mono font-medium text-slate-600">{customerId}</p>
            </div>
          </div>

          <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
             <span>{t.label_progress}</span>
             <span>{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getBarColor()}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6 bg-slate-50 p-4 rounded-xl">
             {t.help_text}
          </p>
        </div>
      </div>
    </div>
  );
}