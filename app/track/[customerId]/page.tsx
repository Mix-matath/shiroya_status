import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TrackingResult from "./TrackingResult"; // ✅ เรียกใช้ไฟล์ใหม่ที่เราสร้าง

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;

  // 1. ดึงข้อมูลจาก Database (เหมือนเดิม)
  const order = await prisma.order.findUnique({
    where: { customerId: customerId },
    select: { status: true, customerName: true, updatedAt: true },
  });

  // 2. ถ้าไม่เจอ (เหมือนเดิม)
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-lg text-center max-w-md w-full">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">ไม่พบข้อมูล / Not Found</h1>
          <p className="text-slate-500 mb-6">
            รหัสออเดอร์ <span className="font-mono text-red-500 bg-red-50 px-2 py-1 rounded">{customerId}</span> ไม่ถูกต้อง
          </p>
          <Link href="/" className="text-blue-600 font-semibold hover:underline">
            ← กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  // ✅ 3. ส่งข้อมูล "Raw Data" จาก DB ไปให้ Client Component จัดการแปลภาษาต่อ
  return <TrackingResult order={order} customerId={customerId} />;
}