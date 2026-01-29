"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
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

  // ฟังก์ชันเปลี่ยนสถานะ
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

  // ✅ ฟังก์ชันลบออเดอร์
  const handleDelete = async (orderId: string) => {
    // 1. Popup ถามยืนยัน
    const confirmDelete = window.confirm("⚠️ คุณแน่ใจหรือไม่ที่จะลบออเดอร์นี้?\n(การกระทำนี้ไม่สามารถย้อนกลับได้)");
    
    if (!confirmDelete) return;

    try {
      // 2. ส่งคำสั่งลบไปที่ Server
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // 3. ลบออกจากหน้าจอทันที
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        router.refresh();
      } else {
        alert("❌ ลบไม่สำเร็จ");
      }
    } catch (error) {
      console.error(error);
      alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ");
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

  // ✅ แยกออเดอร์เป็น 2 กลุ่ม
  const activeOrders = orders.filter(o => o.status !== "Completed");
  const completedOrders = orders.filter(o => o.status === "Completed");

  // ฟังก์ชันสร้างตาราง (จะได้ไม่ต้องเขียนโค้ดซ้ำ 2 รอบ)
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
              <th className="px-6 py-4 font-semibold">Customer ID</th>
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
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
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border-none outline-none ring-1 ring-inset ring-black/5 ${getStatusColor(order.status)}`}
                  >
                    <option value="Pending">🕒 รอรับผ้า</option>
                    <option value="Processing">💦 กำลังซัก</option>
                    <option value="Ironing">🔥 กำลังรีด</option>
                    <option value="Delivery">🚚 กำลังส่ง</option>
                    <option value="Completed">✅ เสร็จสิ้น</option>
                    {/* ❌ ลบตัวเลือก "ยกเลิก" ออกแล้ว */}
                  </select>
                </td>

                <td className="px-6 py-4 text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString("th-TH")}
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-full transition-all text-xs font-semibold border border-transparent hover:border-red-200"
                    title="ลบออเดอร์นี้"
                  >
                    🗑️ ลบ
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                  ไม่พบรายการ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ตารางที่ 1: งานที่กำลังทำ (Active) */}
      {renderTable(activeOrders, "งานที่กำลังดำเนินการ", false)}

      {/* ตารางที่ 2: งานที่เสร็จแล้ว (History) */}
      {renderTable(completedOrders, "ประวัติงานที่เสร็จสิ้น", true)}
    </div>
  );
}