"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/LanguageContext"; // ✅ เรียกใช้ Hook ภาษา

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
  const { t, lang } = useLanguage(); // ✅ ดึงตัวแปรภาษามาใช้

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

  // ✅ ฟังก์ชันลบออเดอร์ (ใช้ภาษาจาก Dictionary)
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
                
                <td className="px-6 py-4">
                  {order.customerName || "-"}
                </td>
                
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
    <div className="space-y-8">
      {renderTable(activeOrders, t.admin_active_title, false)}
      {renderTable(completedOrders, t.admin_history_title, true)}
    </div>
  );
}