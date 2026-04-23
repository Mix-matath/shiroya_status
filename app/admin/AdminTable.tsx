"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/LanguageContext";
import QRScanner from "./QRScanner";
import { QRCodeCanvas } from "qrcode.react";
import { PlusCircle, Trash2, X, CheckCircle2, Search, History, Sparkles } from "lucide-react";

type OrderItem = {
  id: string;
  itemName: string;
  status: string;
};

type Order = {
  id: string;
  customerId: string;
  customerName: string | null;
  items: OrderItem[];
  createdAt: string;
};

export default function AdminTable({ refreshKey }: { refreshKey: number }) {
  const { t, lang, toggleLanguage } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedQR, setSelectedQR] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editCustomerName, setEditCustomerName] = useState("");
  const [editItems, setEditItems] = useState<{itemName: string, status: string}[]>([]);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [scannedOrderId, setScannedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshKey]);

  const filteredOrders = orders.filter((order) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      order.customerId.toLowerCase().includes(searchStr) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchStr))
    );
  });

  const handleItemStatusChange = async (itemId: string, newStatus: string) => {
    setLoadingId(itemId);
    try {
      const res = await fetch(`/api/orders`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, status: newStatus }),
      });

      if (res.ok) {
        await fetchOrders();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingOrder) return;
    const validItems = editItems.filter(i => i.itemName.trim() !== "");
    setIsSavingEdit(true);
    try {
      const res = await fetch(`/api/orders/${editingOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: editCustomerName, items: validItems }),
      });
      if (res.ok) {
        setEditingOrder(null);
        fetchOrders();
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!window.confirm(t.admin_confirm_delete)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleQRScanSuccess = async (scannedValue: string) => {
    const targetOrder = orders.find((o) => o.customerId === scannedValue || o.id === scannedValue);
    if (!targetOrder) {
      alert(`❌ ไม่พบข้อมูลออเดอร์รหัส: ${scannedValue}`);
      return;
    }
    setScannedOrderId(targetOrder.id);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `QR_${selectedQR}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Ironing": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivery": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const activeOrders = filteredOrders.filter(o => o.items.some(i => i.status !== "Completed") || o.items.length === 0);
  const completedOrders = filteredOrders.filter(o => o.items.length > 0 && o.items.every(i => i.status === "Completed"));

  const scannedOrderDetails = scannedOrderId ? orders.find(o => o.id === scannedOrderId) : null;

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
                <td className="px-6 py-4 font-medium text-slate-900 align-top pt-6">{order.customerId}</td>
                <td className="px-6 py-4 align-top pt-6">{order.customerName || "-"}</td>
                <td className="px-6 py-4 min-w-[300px]">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg shadow-sm">
                        <span className="w-1/2 truncate font-medium text-slate-700">• {item.itemName}</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer border outline-none flex-1 text-center ${getStatusColor(item.status)}`}
                        >
                          <option value="Pending">{t.status_pending}</option>
                          <option value="Processing">{t.status_processing}</option>
                          <option value="Ironing">{t.status_ironing}</option>
                          <option value="Delivery">{t.status_delivery}</option>
                          <option value="Completed">{t.status_completed}</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-400 align-top pt-6">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right align-top pt-6">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedQR(order.customerId)} className="text-blue-500 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-semibold border border-transparent">🔲 QR</button>
                    <button onClick={() => { setEditingOrder(order); setEditCustomerName(order.customerName || ""); setEditItems(order.items.map(i => ({ itemName: i.itemName, status: i.status }))); }} className="text-amber-500 hover:bg-amber-50 px-3 py-2 rounded-lg text-xs font-semibold border border-transparent">✏️ แก้ไข</button>
                    <button onClick={() => handleDelete(order.id)} className="text-red-400 hover:bg-red-50 px-3 py-2 rounded-lg text-xs font-semibold border border-transparent">🗑️ {t.admin_btn_delete}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="ค้นหาด้วยรหัส หรือ ชื่อลูกค้า/ชื่อร้าน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button onClick={toggleLanguage} className="px-4 py-2 bg-white border border-blue-100 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 shadow-sm transition-all flex items-center gap-2">
          {lang === 'th' ? '🇬🇧 English' : '🇹🇭 ภาษาไทย'}
        </button>
      </div>

      <QRScanner onScanSuccess={handleQRScanSuccess} />

      {renderTable(activeOrders, t.admin_active_title, false)}
      {renderTable(completedOrders, t.admin_history_title, true)}

      {/* 🌟 Popup จัดการหลังสแกน (แบบที่ 3: แยกหมวดหมู่ปัจจุบัน/ประวัติ) */}
      {scannedOrderDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-blue-600 to-[#1C3E6C] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">✅ ตะกร้าของ {scannedOrderDetails.customerId}</h3>
                <p className="text-blue-100 mt-1 text-sm font-medium">{scannedOrderDetails.customerName || "ลูกค้าทั่วไป"}</p>
              </div>
              <button onClick={() => setScannedOrderId(null)} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full"><X size={20} /></button>
            </div>
            
            <div className="p-6 max-h-[65vh] overflow-y-auto bg-slate-50 space-y-6">
              
              {/* ส่วนที่ 1: รายการที่กำลังทำ (Active Items) */}
              <div>
                <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Sparkles size={14} /> รายการของรอบนี้
                </h4>
                <div className="space-y-2">
                  {scannedOrderDetails.items.filter(i => i.status !== "Completed").length > 0 ? (
                    scannedOrderDetails.items.filter(i => i.status !== "Completed").map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-3 bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                        <span className="font-bold text-slate-800">👕 {item.itemName}</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold border outline-none min-w-[140px] text-center shadow-sm transition-all ${getStatusColor(item.status)}`}
                        >
                          <option value="Pending">{t.status_pending}</option>
                          <option value="Processing">{t.status_processing}</option>
                          <option value="Ironing">{t.status_ironing}</option>
                          <option value="Delivery">{t.status_delivery}</option>
                          <option value="Completed">{t.status_completed}</option>
                        </select>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 italic bg-white p-4 rounded-xl border border-dashed border-slate-300 text-center">ไม่มีรายการที่ต้องดำเนินการ</p>
                  )}
                </div>
              </div>

              {/* ส่วนที่ 2: ประวัติที่เสร็จแล้ว (History Items) */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <History size={14} /> ประวัติเสื้อผ้าที่เสร็จแล้ว
                </h4>
                <div className="space-y-2 opacity-70 hover:opacity-100 transition-opacity">
                  {scannedOrderDetails.items.filter(i => i.status === "Completed").length > 0 ? (
                    scannedOrderDetails.items.filter(i => i.status === "Completed").map(item => (
                      <div key={item.id} className="flex items-center justify-between gap-3 bg-gray-50 p-3 border border-gray-100 rounded-lg">
                        <span className="text-sm text-gray-500 line-through decoration-gray-300">• {item.itemName}</span>
                        <select
                          value={item.status}
                          onChange={(e) => handleItemStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 rounded-md text-xs font-bold border outline-none bg-green-50 text-green-700 border-green-200`}
                        >
                          <option value="Pending">{t.status_pending}</option>
                          <option value="Processing">{t.status_processing}</option>
                          <option value="Ironing">{t.status_ironing}</option>
                          <option value="Delivery">{t.status_delivery}</option>
                          <option value="Completed">{t.status_completed}</option>
                        </select>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-300 text-center py-2 italic">ไม่มีประวัติรายการเก่า</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <button onClick={() => setScannedOrderId(null)} className="w-full py-4 bg-[#54A0D8] hover:bg-[#1C3E6C] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20">
                เสร็จเรียบร้อย
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal QR Code */}
      {selectedQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-2">QR Code ถุงผ้า</h3>
            <p className="text-slate-500 mb-6 text-sm">รหัสลูกค้า: <span className="font-bold text-slate-800">{selectedQR}</span></p>
            <div className="flex justify-center mb-6 bg-white p-4 rounded-xl border-2 border-slate-100 inline-block">
              <QRCodeCanvas id="qr-canvas" value={selectedQR} size={200} level={"H"} includeMargin={true}/>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedQR(null)} className="flex-1 px-4 py-2 rounded-xl text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 transition-colors">ปิด</button>
              <button onClick={downloadQRCode} className="flex-1 px-4 py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">💾 เซฟรูป</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal แก้ไข (Edit Order) */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1C3E6C]">แก้ไขออเดอร์ {editingOrder.customerId}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อลูกค้า/ชื่อร้าน</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editCustomerName} onChange={(e) => setEditCustomerName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">รายการเสื้อผ้า</label>
                <div className="space-y-3">
                  {editItems.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input type="text" className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={item.itemName} onChange={(e) => { const newItems = [...editItems]; newItems[index].itemName = e.target.value; setEditItems(newItems); }} />
                      <button onClick={() => setEditItems(editItems.filter((_, i) => i !== index))} className="p-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setEditItems([...editItems, { itemName: "", status: "Pending" }])} className="text-blue-500 hover:text-blue-700 font-medium text-sm flex items-center gap-1 mt-4 transition-colors"><PlusCircle size={18}/> เพิ่มรายการใหม่</button>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-gray-100 flex gap-3">
              <button onClick={() => setEditingOrder(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium">ยกเลิก</button>
              <button onClick={handleSaveEdit} disabled={isSavingEdit} className={`flex-1 py-2.5 text-white rounded-xl font-bold transition-all ${isSavingEdit ? "bg-gray-400" : "bg-[#54A0D8] hover:bg-[#1C3E6C]"}`}>{isSavingEdit ? "กำลังบันทึก..." : "บันทึก"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}