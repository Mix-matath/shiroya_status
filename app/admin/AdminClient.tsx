"use client";

import { useState } from "react";
import AddOrderForm from "./AddOrderForm";
import AdminTable from "./AdminTable";

// ✅ เพิ่ม Interface สำหรับ Props
interface AdminClientProps {
  initialOrders?: any[]; // รับค่าไว้ก่อน (ใช้ any หรือ Type ของ Order ถ้ามี)
}

export default function AdminClient({ initialOrders }: AdminClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      {/* ===== ADD ORDER ===== */}
      <div className="border rounded p-4 bg-gray-50">
        <h2 className="font-semibold mb-3">
          ➕ add orders
        </h2>

        <AddOrderForm
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>

      {/* ===== TABLE ===== */}
      {/* ถ้า AdminTable รองรับ initialData ก็ส่งต่อได้เลย แต่ถ้ายึดตามเดิมก็ปล่อยไว้ */}
      <AdminTable refreshKey={refreshKey} />
    </div>
  );
}