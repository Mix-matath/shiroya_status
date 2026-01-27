import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* ⭐ บังคับไม่ให้ cache */
export const dynamic = "force-dynamic";

/* =====================================
   POST : ลูกค้าตรวจสอบสถานะงาน
   ===================================== */
export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: "กรุณากรอก Customer ID" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: {
        customerId: customerId.trim(),
      },
      select: {
        customerId: true,
        status: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "ไม่พบ Customer ID นี้" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      customerId: order.customerId,
      status: order.status,
    });
  } catch (error) {
    console.error("POST /api/status error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
