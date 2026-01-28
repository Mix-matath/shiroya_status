// app/track/[customerId]/page.tsx
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ customerId: string }>; // ✅ แก้ Type เป็น Promise
}) {
  const { customerId } = await params; // ✅ ต้อง await ก่อนใช้งาน

  const order = await prisma.order.findUnique({
    where: {
      customerId: customerId, // ใช้ตัวแปรที่ await มาแล้ว
    },
    select: {
      status: true,
    },
  });

  if (!order) {
    return <p className="p-10">ไม่พบข้อมูล</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">สถานะเสื้อผ้า</h1>
      <p className="mt-4 text-lg">{order.status}</p>
    </div>
  );
}