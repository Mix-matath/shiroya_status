"use client";

import { signOut, useSession } from "next-auth/react"; // ✅ 1. เพิ่ม useSession
import AdminTable from "./AdminTable";
import AddOrderForm from "./AddOrderForm";
import { useState } from "react";

export default function AdminClient() {
  const { data: session } = useSession(); // ✅ 2. ดึงข้อมูล Session
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOrderAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // ✅ 3. ดึงชื่อผู้ใช้ (ถ้าไม่มีให้แสดง "Admin")
  // หมายเหตุ: ต้องมั่นใจว่าใน auth config ส่งค่า name หรือ username มาใน session แล้ว
  const adminName = session?.user?.name || session?.user?.email || "Admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 font-sans text-slate-800">
      
      {/* 🟢 Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900 leading-tight">Admin Dashboard</h1>
              {/* ✅ 4. แสดงชื่อผู้ใช้ตรงนี้ */}
              <p className="text-xs text-blue-500 font-medium">
                Hi! {adminName} 👋
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 rounded-lg text-sm font-semibold transition-all"
          >
            Log out
          </button>
        </div>
      </nav>

      {/* 🟢 Main Content */}
      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Stats / Welcome Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/20">
              <h3 className="text-blue-100 text-sm font-medium mb-1">Welcome</h3>
              {/* ✅ 5. แสดงชื่อตัวใหญ่ใน Card ด้วย */}
              <p className="text-2xl font-bold truncate">{adminName}</p>
           </div>
        </div>

        {/* Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left: Add Order Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-blue-100/50 border border-white sticky top-28">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">＋</span>
                Add new orders
              </h2>
              {/* ตรวจสอบว่าส่ง prop ชื่อ onOrderAdded ถูกต้องแล้ว */}
              <AddOrderForm onOrderAdded={handleOrderAdded} />
            </div>
          </div>

          {/* Right: Order Table */}
          <div className="lg:col-span-3">
             <div className="bg-white rounded-2xl shadow-xl shadow-blue-100/50 border border-white overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">📋</span>
                    All orders
                  </h2>
                  <button 
                    onClick={() => setRefreshKey(prev => prev + 1)} 
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    ↻ refresh
                  </button>
                </div>
                
                <AdminTable refreshKey={refreshKey} />
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
/*"use client";

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
      {/* ===== ADD ORDER ===== *./}
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

      {/* ===== TABLE ===== *./}
      {/* ถ้า AdminTable รองรับ initialData ก็ส่งต่อได้เลย แต่ถ้ายึดตามเดิมก็ปล่อยไว้ *,/}
      <AdminTable refreshKey={refreshKey} />
    </div>
  );
}*/