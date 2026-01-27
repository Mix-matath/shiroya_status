import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/* =====================================================
   GET : ดึงรายการ Order ทั้งหมด
   ===================================================== */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      select: {
        id: true,
        customerId: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   POST : สร้าง Order ใหม่
   ===================================================== */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customer_id } = await req.json();

    if (!customer_id) {
      return NextResponse.json(
        { error: "customer_id is required" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        customerId: customer_id,
        status: "เราได้รับเสื้อผ้าของคุณแล้ว",
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/* =====================================================
   PUT : อัปเดตสถานะ Order + บันทึก OrderStatusLog
   ===================================================== */
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    /* 1️⃣ ดึง Order เดิม */
    const order = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!order) {
      return NextResponse.json({ error: "ไม่พบ Order" }, { status: 404 });
    }

    const oldStatus = order.status;

    /* 2️⃣ อัปเดตสถานะใหม่ */
    await prisma.order.update({
      where: { id },
      data: { status },
    });

    /* 3️⃣ บันทึก OrderStatusLog */
    await prisma.orderStatusLog.create({
      data: {
        orderId: id,
        oldStatus,
        newStatus: status,
        adminId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/orders error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
