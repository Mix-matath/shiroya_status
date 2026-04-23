import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =====================================================
   GET : ดึงรายการ Order ทั้งหมด พร้อมเสื้อผ้าข้างใน
   ===================================================== */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* =====================================================
   POST : สร้าง Order ใหม่ หรือ **เพิ่มรายการในออเดอร์เดิม**
   ===================================================== */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId, customerName, items } = await req.json();

    if (!customerId) {
      return NextResponse.json({ error: "customer_id is required" }, { status: 400 });
    }

    // จัดเตรียมข้อมูลเสื้อผ้า (กรองช่องว่างทิ้ง และตั้งสถานะเป็น Pending)
    const validItems = items && items.length > 0 
      ? items
          .filter((name: string) => name.trim() !== "")
          .map((name: string) => ({ itemName: name, status: "Pending" }))
      : [];

    // 🌟 ใช้เทคนิค upsert: มีอยู่แล้ว = อัปเดตเพิ่มของ, ยังไม่มี = สร้างใหม่
    const order = await prisma.order.upsert({
      where: {
        customerId: customerId,
      },
      update: {
        // หากลูกค้าเดิมมาใช้บริการ และพนักงานพิมพ์ชื่อใหม่ ก็ให้อัปเดตชื่อด้วย
        ...(customerName ? { customerName: customerName } : {}),
        
        // ✨ สร้างเสื้อผ้าชิ้นใหม่ แล้วนำไปเชื่อมกับบิลเดิมโดยอัตโนมัติ
        items: {
          create: validItems,
        },
      },
      create: {
        customerId: customerId,
        customerName: customerName,
        items: {
          create: validItems,
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* =====================================================
   PUT : อัปเดตสถานะ "เสื้อผ้าแต่ละชิ้น" (OrderItem)
   ===================================================== */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { itemId, status } = await req.json();

    if (!itemId || !status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId },
      select: { status: true },
    });

    if (!orderItem) {
      return NextResponse.json({ error: "ไม่พบข้อมูลชิ้นงาน" }, { status: 404 });
    }

    const oldStatus = orderItem.status;

    await prisma.orderItem.update({
      where: { id: itemId },
      data: { status },
    });

    await prisma.orderStatusLog.create({
      data: {
        orderItemId: itemId,
        oldStatus,
        newStatus: status,
        adminId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}