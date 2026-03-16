"use client";

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QRScanner({ onScanSuccess }: { onScanSuccess: (text: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);
  // ✅ ต้องมีบรรทัดนี้ครับ ถึงจะใช้ setErrorMessage ได้
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="mb-6 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-700">📷 สแกน QR Code เพื่อเปลี่ยนสถานะ</h3>
        <button
          onClick={() => {
            setIsScanning(!isScanning);
            setErrorMessage(""); // เคลียร์ข้อความแจ้งเตือนเมื่อกดปุ่มใหม่
          }}
          className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors ${
            isScanning ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isScanning ? "ปิดกล้อง" : "เปิดกล้องสแกน"}
        </button>
      </div>

      {/* กล่องข้อความแจ้งเตือนหากเปิดกล้องไม่ได้ */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg flex items-center gap-2">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {isScanning && (
        <div className="w-full max-w-sm mx-auto overflow-hidden rounded-xl border-4 border-blue-100 bg-slate-50 relative">
          <Scanner
            // ✅ ใช้ onScan สำหรับเวอร์ชันใหม่
            onScan={(result) => {
              if (result && result.length > 0) {
                onScanSuccess(result[0].rawValue); // ส่งค่าที่สแกนได้กลับไป
                setIsScanning(false); // สแกนเสร็จให้ปิดกล้อง
              }
            }}
            onError={(error: any) => {
              console.warn("Camera Error:", error?.message);
              
              if (error?.message?.includes("NotAllowedError") || error?.message?.includes("Permission denied")) {
                 setErrorMessage("กรุณาอนุญาตการเข้าถึงกล้องที่ไอคอนแม่กุญแจบน URL");
              } else if (error?.message?.includes("NotFoundError") || error?.message?.includes("Requested device not found")) {
                 setErrorMessage("ไม่พบกล้อง หรือกล้องกำลังถูกใช้งานโดยโปรแกรมอื่น");
              } else {
                 setErrorMessage("เปิดกล้องไม่ได้ (หากใช้มือถือต้องรันผ่าน https:// หรือผ่าน localhost เท่านั้น)");
              }
            }}
          />
        </div>
      )}
    </div>
  );
}