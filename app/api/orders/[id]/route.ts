// app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// ใช้ PATCH หรือ PUT ก็ได้ (แนะนำ PATCH สำหรับการแก้บาง field)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. เช็คสิทธิ์ Admin
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params; // รับ ID จาก URL
    const body = await request.json();
    const { status } = body; // รับ Status ใหม่

    // 2. อัปเดตข้อมูลใน DB
    const updatedOrder = await prisma.order.update({
      where: { id: String(id) }, // แปลงเป็น String หรือ Int ตาม schema ของคุณ (ใน Prisma ของคุณ id เป็น String หรือ Int?)
      // *หมายเหตุ: ถ้าใน Schema id เป็น Int ให้แก้เป็น: where: { id: Number(id) }
      data: { status: status },
    });

    // (Optional) บันทึก Log การเปลี่ยนสถานะที่นี่ก็ได้

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}