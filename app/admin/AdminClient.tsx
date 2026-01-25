"use client";

import { useState } from "react";
import AddOrderForm from "./AddOrderForm";
import AdminTable from "./AdminTable";

export default function AdminClient() {
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
      <AdminTable refreshKey={refreshKey} />
    </div>
  );
}
