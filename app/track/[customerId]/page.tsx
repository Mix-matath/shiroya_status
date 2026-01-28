import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

// Helper function: แปลงสถานะเป็นเปอร์เซ็นต์ Progress bar
const getProgress = (status: string) => {
  const steps = [
    "Pending",    // รอรับผ้า
    "Processing", // กำลังซัก
    "Ironing",    // กำลังรีด
    "Delivery",   // กำลังส่ง
    "Completed",  // เสร็จสิ้น
  ];
  // Map status ภาษาไทยหรืออังกฤษให้ตรงกัน (ถ้าใน DB เก็บเป็นอังกฤษ)
  // ปรับ Logic ตาม Value จริงใน DB ของคุณ
  const index = steps.findIndex(s => s === status || 
    (status === "รอรับผ้า" && s === "Pending") ||
    (status === "กำลังซัก" && s === "Processing") ||
    (status === "กำลังรีด" && s === "Ironing") ||
    (status === "กำลังส่ง" && s === "Delivery") ||
    (status === "เสร็จสิ้น" && s === "Completed")
  );
  
  return index === -1 ? 0 : ((index + 1) / steps.length) * 100;
};

const getStatusBadgeColor = (status: string) => {
  if (status === "Completed" || status === "เสร็จสิ้น") return "bg-green-100 text-green-700 border-green-200";
  if (status === "Cancelled" || status === "ยกเลิก") return "bg-red-100 text-red-700 border-red-200";
  return "bg-blue-100 text-blue-700 border-blue-200";
};

export default async function TrackPage({
  params,
}: {
  params: Promise<{ customerId: string }>; // ✅ แก้ Type เป็น Promise
}) {
  const { customerId } = await params; // ✅ await ก่อนใช้งาน

  const order = await prisma.order.findUnique({
    where: { customerId: customerId },
    select: { status: true, customerName: true, updatedAt: true },
  });

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ไม่พบข้อมูล</h1>
          <p className="text-slate-500 mb-6">รหัสออเดอร์ <span className="font-mono text-red-500 bg-red-50 px-2 py-1 rounded">{customerId}</span> ไม่ถูกต้อง</p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← กลับไปค้นหาใหม่
          </Link>
        </div>
      </div>
    );
  }

  const progress = getProgress(order.status);
  const statusColor = getStatusBadgeColor(order.status);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-6 font-sans">
      
      {/* 🔙 Back Button */}
      <div className="w-full max-w-lg mb-6">
        <Link href="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors font-medium">
          ← กลับหน้าหลัก
        </Link>
      </div>

      {/* 📦 Main Status Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 w-full max-w-lg overflow-hidden border border-slate-100">
        
        {/* Header Section */}
        <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full translate-x-10 translate-y-10"></div>
          
          <p className="text-blue-100 text-sm font-medium mb-1">สถานะปัจจุบัน</p>
          <h1 className="text-3xl font-bold tracking-tight mb-4 drop-shadow-md">
            {order.status}
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm border border-white/30">
            อัปเดตล่าสุด: {new Date(order.updatedAt).toLocaleDateString("th-TH")}
          </div>
        </div>

        {/* Info & Progress */}
        <div className="p-8">
          
          {/* Order Details */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ลูกค้า</p>
              <p className="text-lg font-bold text-slate-800">{order.customerName || "ลูกค้าทั่วไป"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Order ID</p>
              <p className="text-lg font-mono font-medium text-slate-600">{customerId}</p>
            </div>
          </div>

          {/* Progress Bar Label */}
          <div className="mb-2 flex justify-between text-sm font-medium text-slate-600">
             <span>ความคืบหน้า</span>
             <span>{Math.round(progress)}%</span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-slate-400 mt-6 bg-slate-50 p-4 rounded-xl">
             หากมีข้อสงสัย โปรดติดต่อพนักงานที่หน้าร้าน
          </p>

        </div>
      </div>
    </div>
  );
}