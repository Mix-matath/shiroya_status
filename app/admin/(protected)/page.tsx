import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AdminClient from "../AdminClient"; // ตรวจสอบ path import ให้ถูก

export default async function AdminProtectedPage() {
  // 1. ตรวจสอบ Session (เหมือนเดิม)
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  // 2. ไม่ต้องดึงข้อมูล orders ที่นี่แล้ว (ให้ AdminClient จัดการเอง)
  
  return (
    <div>
       {/* ❌ ลบ initialOrders={orders} ออก ให้เหลือแค่นี้ 👇 */}
       <AdminClient />
    </div>
  );
}