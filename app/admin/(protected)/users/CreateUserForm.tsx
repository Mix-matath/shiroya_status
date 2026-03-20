"use client";

import { useState } from "react";

export default function CreateUserForm() {
  // 1. State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "STAFF",
  });

  // 2. State สำหรับจัดการ UI (Loading และ ข้อความแจ้งเตือน)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // 3. ฟังก์ชันอัปเดตข้อมูลเมื่อมีการพิมพ์
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. ฟังก์ชันจัดการเมื่อกด Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ==========================================
    // 🛑 ส่วนป้องกันค่าว่าง (Validation)
    // ==========================================
    const trimmedUsername = formData.username.trim();
    const trimmedPassword = formData.password.trim();

    if (!trimmedUsername) {
      setMessage({ type: "error", text: "❌ กรุณากรอกชื่อผู้ใช้งาน (ไม่อนุญาตให้เป็นช่องว่าง)" });
      return;
    }

    if (!trimmedPassword) {
      setMessage({ type: "error", text: "❌ กรุณากรอกรหัสผ่าน (ไม่อนุญาตให้เป็นช่องว่าง)" });
      return;
    }

    if (trimmedPassword.length < 6) {
      setMessage({ type: "error", text: "❌ รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" });
      return;
    }

    // ==========================================
    // ✅ ข้อมูลถูกต้อง เตรียมส่งเข้า Database
    // ==========================================
    setLoading(true);
    setMessage(null);

    try {
      // TODO: นำโค้ดต่อ API หรือ Server Actions มาใส่ตรงนี้
      // ตัวอย่าง: จำลองการโหลดส่งข้อมูล 1.5 วินาที
      await new Promise((resolve) => setTimeout(resolve, 1500)); 

      setMessage({ type: "success", text: "✅ เพิ่มผู้ใช้งานใหม่สำเร็จ!" });
      
      // ล้างข้อมูลในฟอร์มหลังจากบันทึกเสร็จ
      setFormData({ username: "", password: "", role: "STAFF" });
    } catch (error) {
      setMessage({ type: "error", text: "❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 text-2xl">
          👨‍💻
        </div>
        <h2 className="text-2xl font-bold text-slate-800">เพิ่มผู้ใช้งานใหม่</h2>
        <p className="text-sm text-slate-500 mt-2">เฉพาะ Super Admin เท่านั้นที่สามารถเพิ่มได้</p>
      </div>

      {/* กล่องแจ้งเตือน */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ชื่อผู้ใช้งาน */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            ชื่อผู้ใช้งาน (Username)
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="เช่น staff_somchai"
          />
        </div>

        {/* รหัสผ่าน */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            รหัสผ่าน (Password)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
            placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร"
          />
        </div>

        {/* ตำแหน่ง/สิทธิ */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
            สิทธิการใช้งาน (Role)
          </label>
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-700 appearance-none cursor-pointer"
            >
              <option value="STAFF">พนักงาน (STAFF) - จัดการออเดอร์ทั่วไป</option>
              <option value="ADMIN">ผู้ดูแล (ADMIN) - จัดการระบบ</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* ปุ่ม Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3.5 rounded-xl text-white font-bold tracking-wide transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังสร้าง...
            </>
          ) : (
            "✨ บันทึกผู้ใช้งานใหม่"
          )}
        </button>
      </form>
    </div>
  );
}