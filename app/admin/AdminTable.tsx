"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

/* ===============================
   STATUS
   =============================== */
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
     =============================== */
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
     =============================== */
  const updateStatus = async (id: number, status: string) => {
    const res = await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        status,
        adminId: session?.user?.id,
        adminUsername: session?.user?.username,
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

    fetchOrders();
  };

  /* ===============================
     UI
     =============================== */
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
}
