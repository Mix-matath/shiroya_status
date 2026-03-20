import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  // ตรวจสอบว่าล็อกอินอยู่หรือไม่ (ถ้ามี session.user.id ให้ดึงมาใช้ ถ้าไม่มีใช้ email หรือชื่อแทน)
  const adminId = (session?.user as any)?.id || session?.user?.email || "Unknown Admin";

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // 1. ดึงข้อมูลออเดอร์เดิมมาเพื่อดูสถานะเก่าก่อนที่จะเปลี่ยน
    const oldOrder = await prisma.order.findUnique({ where: { id: id } });
    if (!oldOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // 2. ทำ 2 คำสั่งพร้อมกันด้วย $transaction (อัปเดตออเดอร์ + บันทึกลง OrderStatusLog)
    const [updatedOrder] = await prisma.$transaction([
      prisma.order.update({
        where: { id: id },
        data: { status: status },
      }),
      prisma.orderStatusLog.create({
        data: {
          orderId: id,
          oldStatus: oldOrder.status,
          newStatus: status,
          adminId: adminId,
        }
      })
    ]);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as any)?.id || session?.user?.email || "Unknown Admin";

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // ทำ 2 คำสั่งพร้อมกัน (ลบออเดอร์ + บันทึกการกระทำลง AdminLog)
    await prisma.$transaction([
      prisma.order.delete({
        where: { id: id },
      }),
      prisma.adminLog.create({
        data: {
          adminId: adminId,
          action: `Deleted order with ID: ${id}`,
        }
      })
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

/*import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ แก้ Type เป็น Promise
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; // ✅ await ก่อนใช้งาน
    const body = await request.json();
    const { status } = body;

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  // เช็คสิทธิ์ Admin ตรงนี้ถ้าต้องการ
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // ลบข้อมูลจาก Database
    await prisma.order.delete({
      where: { id: id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}*/