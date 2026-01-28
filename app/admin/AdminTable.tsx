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
        alert("❌ เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error(error);
      alert("❌ เชื่อมต่อ Server ไม่ได้");
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
            <th className="px-6 py-4 font-semibold">ลูกค้า</th>
            <th className="px-6 py-4 font-semibold">สถานะ</th>
            <th className="px-6 py-4 font-semibold">วันที่</th>
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
/*"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

/* ===============================
   STATUS
   =============================== *,/
const STATUS_LIST = [
  "เราได้รับเสื้อผ้าของคุณแล้ว",
  "เรากำลังซักผ้าของคุณ",
  "ผ้าของคุณอยู่ที่สาขา",
  "กำลังนำส่งถึงมือคุณ",
  "เสร็จสิ้น",
];

type Order = {
  id: number;
  customer_id: string;
  status: string;
};

type Props = {
  refreshKey?: number;
};

export default function AdminTable({ refreshKey }: Props) {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);

  /* ===============================
     fetch orders
     =============================== *./
  const fetchOrders = async () => {
    const res = await fetch("/api/orders", { cache: "no-store" });

    // 🔐 session หมด
    if (res.status === 401) {
      alert("Session หมดอายุ กรุณา login ใหม่");
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }

    if (!res.ok) {
      alert("ไม่สามารถโหลดข้อมูลได้");
      return;
    }

    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]); // 👈 refresh เมื่อมีการเพิ่มงาน

  /* ===============================
     update status
     =============================== *./
  const updateStatus = async (id: number, status: string) => {
    // ✅ แก้ URL ให้ยิงไปที่ /api/orders/[id]
    // ✅ เปลี่ยน Method เป็น PATCH ให้ตรงกับ API
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status, 
        // ไม่ต้องส่ง id, adminId ใน body แล้ว เพราะเราเช็คจาก session และ url ได้
      }),
    });

    // 🔐 session หมด
    if (res.status === 401) {
      alert("Session หมดอายุ กรุณา login ใหม่");
      await signOut({ callbackUrl: "/admin/login" });
      return;
    }

    if (!res.ok) {
      alert("เกิดข้อผิดพลาด ไม่สามารถเปลี่ยนสถานะได้");
      return;
    }

    // โหลดข้อมูลใหม่เพื่อแสดงผลล่าสุด
    fetchOrders();
  };
  /* ===============================
     UI
     =============================== *./
  return (
    <div className="mt-6">
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border text-black p-2">Customer ID</th>
            <th className="border text-black p-2">Status</th>
            <th className="border text-black p-2">Change Status</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="border p-2 text-center">
                {o.customer_id}
              </td>

              <td className="border p-2 text-center">
                <span className="px-3 py-1 rounded bg-green-600 text-white">
                  {o.status}
                </span>
              </td>

              <td className="border p-2 text-center">
                <select
                  value={o.status}
                  onChange={(e) =>
                    updateStatus(o.id, e.target.value)
                  }
                  className="border p-2 rounded bg-black text-white"
                >
                  {STATUS_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}*/
