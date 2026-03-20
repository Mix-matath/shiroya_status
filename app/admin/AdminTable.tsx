"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/LanguageContext";
import QRScanner from "./QRScanner";
// ✅ 1. นำเข้าตัวสร้าง QR Code
import { QRCodeCanvas } from "qrcode.react";

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
  const { t, lang, toggleLanguage } = useLanguage();

  type Order = {
    id: string;
    customerId: string;
    customerName: string | null;
    status: string;
    createdAt: string;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  // ✅ 2. State สำหรับเปิด/ปิด Popup QR Code (เก็บค่า customerId ที่ถูกเลือก)
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        router.refresh();
      } else {
        alert("❌ Error updating status");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Can't connect to server");
    }
  };

  const handleDelete = async (orderId: string) => {
    const confirmDelete = window.confirm(t.admin_confirm_delete);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        router.refresh();
      } else {
        alert(t.admin_delete_error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error");
    }
  };

  const statusFlow = ["Pending", "Processing", "Ironing", "Delivery", "Completed"];

  const handleQRScanSuccess = async (scannedValue: string) => {
    const targetOrder = orders.find(
      (o) => o.customerId === scannedValue || o.id === scannedValue
    );

    if (!targetOrder) {
      alert(`❌ ไม่พบข้อมูลออเดอร์รหัส: ${scannedValue} ในระบบ`);
      return;
    }

    const currentStatus = targetOrder.status;
    const currentIndex = statusFlow.indexOf(currentStatus);

    if (currentIndex === statusFlow.length - 1) {
      alert(`✅ ออเดอร์ ${targetOrder.customerId} อยู่ในสถานะ "Completed (เสร็จสิ้น)" แล้ว`);
      return;
    }

    const nextStatus = statusFlow[currentIndex + 1];

    const confirmUpdate = window.confirm(
      `📦 พบออเดอร์: ${targetOrder.customerId} ${targetOrder.customerName ? `(${targetOrder.customerName})` : ''}\n` +
      `📌 สถานะปัจจุบัน: ${currentStatus}\n` +
      `➡️ ต้องการเปลี่ยนเป็น: "${nextStatus}" ใช่หรือไม่?`
    );

    if (!confirmUpdate) return;

    try {
      const res = await fetch(`/api/orders/${targetOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        alert(`✅ เลื่อนสถานะเป็น "${nextStatus}" สำเร็จ!`);
        setOrders((prev) =>
          prev.map((order) =>
            order.id === targetOrder.id ? { ...order, status: nextStatus } : order
          )
        );
        router.refresh();
      } else {
        alert("❌ เกิดข้อผิดพลาดในการอัปเดต");
      }
    } catch (error) {
      console.error(error);
      alert("❌ ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    }
  };

  // ✅ 3. ฟังก์ชันดาวน์โหลดรูป QR Code
  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${selectedQR}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeOrders = orders.filter(o => o.status !== "Completed");
  const completedOrders = orders.filter(o => o.status === "Completed");

  const renderTable = (data: Order[], title: string, isHistory: boolean) => (
    <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-white overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isHistory ? "text-green-700" : "text-blue-900"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isHistory ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
            {isHistory ? "✅" : "📋"}
          </span>
          {title} ({data.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-slate-100 text-slate-500 bg-white">
            <tr>
              <th className="px-6 py-4 font-semibold">{t.admin_header_id}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_name}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_status}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_date}</th>
              <th className="px-6 py-4 font-semibold text-right">{t.admin_header_action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {data.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {order.customerId} 
                </td>
                <td className="px-6 py-4">{order.customerName || "-"}</td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none outline-none ring-1 ring-inset ring-black/5 ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">{t.status_pending}</option>
                    <option value="Processing">{t.status_processing}</option>
                    <option value="Ironing">{t.status_ironing}</option>
                    <option value="Delivery">{t.status_delivery}</option>
                    <option value="Completed">{t.status_completed}</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString(lang === 'th' ? "th-TH" : "en-US")}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {/* ✅ 4. ปุ่มเปิดดู QR Code */}
                    <button
                      onClick={() => setSelectedQR(order.customerId)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full transition-all text-xs font-semibold border border-transparent hover:border-blue-200 flex items-center gap-1"
                    >
                      🔲 QR
                    </button>

                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-all text-xs font-semibold border border-transparent hover:border-red-200 flex items-center gap-1"
                    >
                      🗑️ {t.admin_btn_delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  {t.admin_empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
       <div className="flex justify-end mb-4">
        <button 
            onClick={toggleLanguage}
            className="px-4 py-2 bg-white border border-blue-100 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 shadow-sm transition-all flex items-center gap-2"
        >
            {lang === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย'}
        </button>
      </div>

      <QRScanner onScanSuccess={handleQRScanSuccess} />

      {renderTable(activeOrders, t.admin_active_title, false)}
      {renderTable(completedOrders, t.admin_history_title, true)}

      {/* ✅ 5. หน้าต่าง Popup (Modal สำหรับแสดงและโหลด QR Code */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">QR Code ถุงผ้า</h3>
            <p className="text-slate-500 mb-6 text-sm">รหัสลูกค้า: <span className="font-bold text-slate-800">{selectedQR}</span></p>
            
            <div className="flex justify-center mb-6 bg-white p-4 rounded-xl border-2 border-slate-100 inline-block">
              <QRCodeCanvas 
                id="qr-canvas" 
                value={selectedQR} 
                size={200} 
                level={"H"}
                includeMargin={true}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedQR(null)}
                className="flex-1 px-4 py-2 rounded-xl text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                ปิด
              </button>
              <button
                onClick={downloadQRCode}
                className="flex-1 px-4 py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                💾 เซฟรูปภาพ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/*"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/LanguageContext"; // ✅ 1. เรียกใช้ Hook ภาษา

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
  const { t, lang, toggleLanguage } = useLanguage(); // ✅ 2. ดึงตัวแปรภาษามาใช้

  type Order = {
    id: string;
    customerId: string;
    customerName: string | null;
    status: string;
    createdAt: string;
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        router.refresh();
      } else {
        alert("❌ Error updating status");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Can't connect to server");
    }
  };

  // ✅ ฟังก์ชันลบออเดอร์ (รองรับ 2 ภาษา)
  const handleDelete = async (orderId: string) => {
    // ใช้ t.admin_confirm_delete เพื่อแสดงข้อความตามภาษาที่เลือก
    const confirmDelete = window.confirm(t.admin_confirm_delete);
    
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        router.refresh();
      } else {
        alert(t.admin_delete_error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeOrders = orders.filter(o => o.status !== "Completed");
  const completedOrders = orders.filter(o => o.status === "Completed");

  const renderTable = (data: Order[], title: string, isHistory: boolean) => (
    <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-white overflow-hidden mb-8">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h2 className={`text-lg font-bold flex items-center gap-2 ${isHistory ? "text-green-700" : "text-blue-900"}`}>
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isHistory ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}>
            {isHistory ? "✅" : "📋"}
          </span>
          {title} ({data.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead className="uppercase tracking-wider border-b border-slate-100 text-slate-500 bg-white">
            <tr>
              {/* ✅ ใช้ตัวแปรภาษาที่หัวตาราง */ /*} 
              <th className="px-6 py-4 font-semibold">{t.admin_header_id}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_name}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_status}</th>
              <th className="px-6 py-4 font-semibold">{t.admin_header_date}</th>
              <th className="px-6 py-4 font-semibold text-right">{t.admin_header_action}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {data.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">
                  {order.customerId} 
                </td>
                
                <td className="px-6 py-4">
                  {order.customerName || "-"}
                </td>
                
                <td className="px-6 py-4">
                  {/* ✅ ตัวเลือกใน Dropdown ก็เปลี่ยนภาษาด้วย */ /*}
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none outline-none ring-1 ring-inset ring-black/5 ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">{t.status_pending}</option>
                    <option value="Processing">{t.status_processing}</option>
                    <option value="Ironing">{t.status_ironing}</option>
                    <option value="Delivery">{t.status_delivery}</option>
                    <option value="Completed">{t.status_completed}</option>
                  </select>
                </td>

                <td className="px-6 py-4 text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString(lang === 'th' ? "th-TH" : "en-US")}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-all text-xs font-semibold border border-transparent hover:border-red-200 flex items-center gap-1 ml-auto"
                  >
                    🗑️ {t.admin_btn_delete}
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  {t.admin_empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 relative">
       {/* 🌐 ปุ่มเปลี่ยนภาษาสำหรับ Admin (วางไว้มุมขวาบนของตาราง) *//*} 
       <div className="flex justify-end mb-4">
        <button 
            onClick={toggleLanguage}
            className="px-4 py-2 bg-white border border-blue-100 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 shadow-sm transition-all flex items-center gap-2"
        >
            {lang === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย'}
        </button>
      </div>

      {renderTable(activeOrders, t.admin_active_title, false)}
      {renderTable(completedOrders, t.admin_history_title, true)}
    </div>
  );
}*/