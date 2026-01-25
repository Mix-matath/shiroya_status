"use client";

import { useState } from "react";
import Link from "next/link";

export default function CounterPage() {
  const [customerId, setCustomerId] = useState("");

  const submitCustomer = async () => {
    if (!customerId.trim()) {
      alert("กรุณากรอก Customer ID");
      return;
    }

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });

    if (res.ok) {
      alert("บันทึกเรียบร้อย (สถานะ: เราได้รับเสื้อผ้าของคุณแล้ว)");
      setCustomerId("");
    } else {
      alert("Customer ID ซ้ำ หรือข้อมูลไม่ถูกต้อง");
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        รับผ้าเข้าระบบ
      </h1>

      <input
        type="text"
        placeholder="กรอก Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        className="border p-3 w-full mb-4"
      />

      <button
        onClick={submitCustomer}
        className="bg-green-600 text-white w-full py-2 mb-6"
      >
        บันทึกข้อมูล
      </button>

      {/* 🔐 Admin Login */}
      <div className="text-center">
        <Link
          href="/admin/login"
          className="text-sm text-gray-500 hover:text-black underline"
        >
          admin login
        </Link>
      </div>
    </div>
  );
}
