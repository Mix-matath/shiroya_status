"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Trash2 } from "lucide-react";

export default function AddOrderForm({ onOrderAdded }: { onOrderAdded?: () => void }) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [items, setItems] = useState<string[]>([""]);

  const handleAddItem = () => setItems([...items, ""]);
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };
  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const validItems = items.filter((item) => item.trim() !== "");

    if (validItems.length === 0) {
      setError("กรุณาเพิ่มรายการเสื้อผ้าอย่างน้อย 1 ชิ้น");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          customerId, 
          customerName,
          items: validItems 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      // รีเซ็ตฟอร์ม
      setCustomerId("");
      setCustomerName("");
      setItems([""]);
      
      // 🌟 เรียกใช้ onOrderAdded เพื่อแจ้งให้ Table รีเฟรชข้อมูล!
      if (onOrderAdded) {
        onOrderAdded();
      }

      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
      <h2 className="text-xl font-bold mb-4 text-[#1C3E6C]">สร้างออเดอร์ใหม่</h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสลูกค้า / คิว (Customer ID) *
            </label>
            <input
              type="text"
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder="เช่น GM-0001"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#77BCE5] focus:border-[#77BCE5] outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อลูกค้า (ไม่บังคับ)
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="เช่น คุณสมชาย"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#77BCE5] focus:border-[#77BCE5] outline-none transition-all"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รายการเสื้อผ้า *
          </label>
          
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder={`รายการที่ ${index + 1} (เช่น เสื้อเชิ้ตสีขาว)`}
                  className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#77BCE5] focus:border-[#77BCE5] outline-none transition-all"
                />
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                    title="ลบรายการ"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            className="mt-3 flex items-center text-sm text-[#54A0D8] font-medium hover:text-[#1C3E6C] transition-colors"
          >
            <PlusCircle size={16} className="mr-1" /> เพิ่มรายการเสื้อผ้า
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-medium py-2 px-4 rounded-md mt-6 transition-colors shadow-sm
            ${loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-[#54A0D8] hover:bg-[#1C3E6C]"
            }`}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกออเดอร์"}
        </button>
      </form>
    </div>
  );
}