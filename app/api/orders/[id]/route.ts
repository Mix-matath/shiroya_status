import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Prisma } from "@prisma/client"; // 🌟 1. นำเข้า Type ของ Prisma เพิ่มเติม

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { customerName, note, items } = body;

    // 🌟 2. ระบุ Type ให้ tx เป็น Prisma.TransactionClient
    const updatedOrder = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. อัปเดตข้อมูลหัวบิล
      await tx.order.update({
        where: { id },
        data: { customerName, note },
      });

      // 2. ถ้ามีการส่ง items มาด้วย (กรณีแก้ไขรายการเสื้อผ้า)
      if (items && Array.isArray(items)) {
        // ลบรายการเดิมออกก่อนเพื่อเขียนใหม่
        await tx.orderItem.deleteMany({
          where: { orderId: id },
        });

        // สร้างรายการใหม่เข้าไป
        await tx.orderItem.createMany({
          data: items.map((item: any) => ({
            orderId: id,
            itemName: item.itemName,
            status: item.status || "Pending",
          })),
        });
      }

      return tx.order.findUnique({
        where: { id },
        include: { items: true },
      });
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ส่วนของฟังก์ชันลบออเดอร์
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // ระบบจะลบ OrderItem ที่อยู่ข้างในให้โดยอัตโนมัติ (Cascade)
    await prisma.order.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}