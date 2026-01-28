// app/admin/AdminTable.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
  // 1. แก้ type ให้ตรงกับ Database
  type Order = {
    id: string;
    customerId: string; // 👈 แก้จาก customer_id เป็น customerId
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
      // ใช้ API route ใหม่ที่เราเพิ่งแก้ (app/api/orders/[id]/route.ts)
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
        alert("❌ Error");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Can't connect to server");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow border border-slate-200">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="uppercase tracking-wider border-b-2 border-slate-100 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-6 py-4 font-semibold">Customer ID</th>
            <th className="px-6 py-4 font-semibold">Customer name</th>
            <th className="px-6 py-4 font-semibold">Status</th>
            <th className="px-6 py-4 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-600">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
              {/* 2. แก้ตรงนี้ให้เรียกใช้ customerId */}
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
                  <option value="Cancelled">❌ ยกเลิก</option>
                </select>
              </td>

              <td className="px-6 py-4 text-slate-400">
                {new Date(order.createdAt).toLocaleDateString("th-TH")}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                ไม่พบรายการสั่งซัก
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
