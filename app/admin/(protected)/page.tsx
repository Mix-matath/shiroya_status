import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

// ✅ แก้ไข (ถูก): ถอยออกไป 1 ชั้นเพื่อเรียกไฟล์ที่อยู่ข้างนอก (protected)
import AdminClient from "../AdminClient"; 

export default async function AdminPage() {
  /* 🔐 SERVER GUARD */
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  /* ดึงข้อมูลจาก DB */
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10 space-y-6">
      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-2xl font-bold">
          📦 จัดการสถานะงาน
        </h1>

        <p className="text-gray-600 mt-1">
          👋 สวัสดี {session.user?.username}
        </p>
      </div>

      {/* ✅ CLIENT ZONE: ส่ง orders เข้าไป */}
      <AdminClient initialOrders={orders} />
    </div>
  );
}